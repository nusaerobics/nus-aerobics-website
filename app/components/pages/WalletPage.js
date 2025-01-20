"use client";

import { format } from "date-fns";
import PropTypes from "prop-types";
import { useCallback, useEffect, useMemo, useState } from "react";

import { MdOutlineFilterAlt } from "react-icons/md";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import { Input, Pagination } from "@nextui-org/react";
import { PageTitle, SectionTitle } from "../utils/Titles";
import {
  inputClassNames,
  tableClassNames,
} from "../utils/ClassNames";
import Toast from "../Toast";

export default function WalletPage({ session }) {
  const [balance, setBalance] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "createdAt",
    direction: "ascending",
  });
  const [filters, setFilters] = useState(new Set([]));
  const [creditsSpent, setCreditsSpent] = useState(0); // Sum of bookings which are by userID
  const [showToast, setShowToast] = useState(false);
  const [toast, setToast] = useState({});

  const toggleShowToast = () => {
    setShowToast(!showToast);
  };

  useEffect(() => {
    let timer;
    if (showToast) {
      timer = setTimeout(() => {
        setShowToast(false);
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [showToast]);

  useEffect(() => {
    const permission = session.permission;
    setIsAdmin(permission == "admin");

    if (permission == "admin") {
      const fetchTransactions = async () => {
        const res = await fetch("/api/transactions");
        if (!res.ok) {
          throw new Error(`Unable to get transactions: ${ res.status }`);
        }
        const data = await res.json();
        setTransactions(data);
      };
      fetchTransactions();
    } else {
      const fetchTransactions = async () => {
        const res = await fetch(`/api/transactions?userId=${ session.userId }`);
        if (!res.ok) {
          throw new Error(
            `Unable to get transactions for user ${ session.userId }: ${ res.status }`
          );
        }
        const data = await res.json();
        setTransactions(data);
      };
      fetchTransactions();

      const countCreditsSpent = async () => {
        try {
          const res = await fetch(
            `/api/bookings?isCountByUser=${ session.userId }`
          );
          if (!res.ok) {
            throw new Error(
              `Unable to count credits spent for user ${ session.userId }.`
            );
          }
          const data = await res.json();
          setCreditsSpent(data);
        } catch (error) {
          setToast({
            isSuccess: false,
            header: "Unable to count credits spent",
            message: `Unable to count credits spent for user ${ session.userId }. Try again later.`,
          });
          setShowToast(true);
          console.log(error);
        }
      };
      countCreditsSpent();

      const fetchBalance = async () => {
        try {
          const res = await fetch(`/api/users/${ session.userId }`);
          if (!res.ok) {
            throw new Error(
              `Unable to get user ${ session.userId }: ${ res.status }`
            );
          }
          const data = await res.json();
          setBalance(data.balance);
        } catch (error) {
          setToast({
            isSuccess: false,
            header: "Unable to get user",
            message: `Unable to get user ${ session.userId }. Try again later.`,
          });
          setShowToast(true);
          console.log(error);
        }
      };
      fetchBalance();
    }
  }, []);

  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const onSearchInputChange = useCallback((value) => {
    setSearchInput(value);
    setPage(1);
  });

  const sortedTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const compare = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction == "descending" ? -compare : compare;
    });
  }, [sortDescriptor, transactions]);

  const transactionPages = useMemo(() => {
    if (searchInput != "") {
      const transactionsSearch = sortedTransactions
        .filter((transaction) => {
          const transactionUser = transaction.user.name.toLowerCase();
          const searchValue = searchInput.toLowerCase();
          return transactionUser.includes(searchValue);
        })
        .filter((transaction) => {
          if (filters.size > 0) {
            const transactionType = transaction.type;
            return filters.has(transactionType);
          }
        });
      setPage(1);
      return Math.ceil(transactionsSearch.length / rowsPerPage);
    }
    const filteredTransactions = sortedTransactions.filter((transaction) => {
      if (filters.size > 0) {
        const transactionType = transaction.type;
        return filters.has(transactionType);
      }
      return true;
    });
    setPage(1);
    return Math.ceil(filteredTransactions.length / rowsPerPage);
  }, [sortedTransactions, searchInput, filters]);

  const transactionItems = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    if (searchInput != "") {
      const filteredTransactions = sortedTransactions
        .filter((transaction) => {
          const transactionUser = transaction.user.name.toLowerCase();
          const searchValue = searchInput.toLowerCase();
          return transactionUser.includes(searchValue);
        })
        .filter((transaction) => {
          if (filters.size > 0) {
            const transactionType = transaction.type;
            return filters.has(transactionType);
          }
        });
      return filteredTransactions.slice(start, end);
    }

    const filteredTransactions = sortedTransactions.filter((transaction) => {
      if (filters.size > 0) {
        const transactionType = transaction.type;
        return filters.has(transactionType);
      }
      return true;
    });
    return filteredTransactions.slice(start, end);
  }, [page, sortedTransactions, searchInput, filters]);

  return (
    <>
      { isAdmin ? (
        <div className="w-full h-full flex flex-col gap-y-5 p-5 md:p-10 pt-20 overflow-y-scroll">
          <div className="flex flex-row items-center justify-between">
            <PageTitle title="Wallet"/>
          </div>
          <div
            className="md:h-full md:w-full flex flex-col rounded-[20px] border border-a-black/10 p-5 bg-white gap-y-2.5">
            <div className="flex flex-row md:justify-end items-center gap-x-2.5">
              <Dropdown>
                <DropdownTrigger>
                  <button className="cursor-pointer">
                    <MdOutlineFilterAlt color="#393E46" size={ 24 }/>
                  </button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Filter transactions"
                  variant="flat"
                  closeOnSelect={ false }
                  selectionMode="multiple"
                  selectedKeys={ filters }
                  onSelectionChange={ setFilters }
                >
                  <DropdownSection title="Filter classes">
                    <DropdownItem key="refund">Refund</DropdownItem>
                    <DropdownItem key="deposit">Deposit</DropdownItem>
                    <DropdownItem key="book">Booking</DropdownItem>
                  </DropdownSection>
                </DropdownMenu>
              </Dropdown>
              <div className="md:w-1/4">
                <Input
                  placeholder="Search"
                  value={ searchInput }
                  onValueChange={ onSearchInputChange }
                  variant="bordered"
                  size="xs"
                  classNames={ inputClassNames }
                />
              </div>
            </div>
            <div className="overflow-x-scroll">
              <Table
                removeWrapper
                classNames={ tableClassNames }
                sortDescriptor={ sortDescriptor }
                onSortChange={ setSortDescriptor }
              >
                <TableHeader>
                  <TableColumn key="createdAt" allowsSorting>
                    Date
                  </TableColumn>
                  <TableColumn>Amount</TableColumn>
                  <TableColumn>User</TableColumn>
                  <TableColumn>Description</TableColumn>
                </TableHeader>
                <TableBody>
                  { transactionItems.map((transaction) => {
                    return (
                      <TableRow key={ transaction.id }>
                        <TableCell>
                          { format(transaction.createdAt, "d/MM/y HH:mm") }
                        </TableCell>
                        <TableCell>{ transaction.amount }</TableCell>
                        <TableCell>{ transaction.user.name }</TableCell>
                        <TableCell>{ transaction.description }</TableCell>
                      </TableRow>
                    );
                  }) }
                </TableBody>
              </Table>
            </div>
            <div className="flex flex-row justify-center">
              { transactionPages > 1 && (
                <Pagination
                  showControls
                  isCompact
                  color="primary"
                  size="sm"
                  loop={ true }
                  page={ page }
                  total={ transactionPages }
                  onChange={ (page) => setPage(page) }
                />) }
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex flex-col gap-y-5 p-5 md:p-10 pt-20 overflow-y-scroll">
          <PageTitle title="Wallet"/>
          <div className="h-1/4 flex flex-row gap-x-5">
            <div className="w-1/2 rounded-[20px] border border-a-black/10 p-5 bg-white">
              <p className="font-poppins font-bold text-a-navy text-2xl md:text-3xl">
                { balance }
              </p>
              <p className="font-poppins text-a-black text-sm md:text-lg">
                credits remaining
              </p>
            </div>
            <div className="w-1/2 rounded-[20px] border border-a-black/10 p-5 bg-white">
              <p className="font-poppins font-bold text-a-navy text-2xl md:text-3xl">
                { creditsSpent }
              </p>
              <p className="font-poppins text-a-black text-sm md:text-lg">
                credits spent
              </p>
            </div>
          </div>
          <div className="w-full flex flex-col rounded-[20px] border border-a-black/10 p-5 bg-white gap-y-2.5">
            <SectionTitle title="All transactions"/>
            <Table
              removeWrapper
              classNames={ tableClassNames }
              sortDescriptor={ sortDescriptor }
              onSortChange={ setSortDescriptor }
            >
              <TableHeader>
                <TableColumn key="createdAt" allowsSorting>
                  Date
                </TableColumn>
                <TableColumn>Amount</TableColumn>
                <TableColumn>Description</TableColumn>
              </TableHeader>
              <TableBody>
                { transactionItems.map((transaction) => {
                  return (
                    <TableRow key={ transaction.id }>
                      <TableCell>
                        { format(transaction.createdAt, "d/MM/y HH:mm") }
                      </TableCell>
                      <TableCell>{ transaction.amount }</TableCell>
                      <TableCell>{ transaction.description }</TableCell>
                    </TableRow>
                  );
                }) }
              </TableBody>
            </Table>
            <div className="flex flex-row justify-center">
              <Pagination
                showControls
                isCompact
                color="primary"
                size="sm"
                loop={ true }
                page={ page }
                total={ transactionPages }
                onChange={ (page) => setPage(page) }
              />
            </div>
          </div>
        </div>
      ) }
      { showToast ? (
        <div onClick={ toggleShowToast }>
          <Toast
            isSuccess={ toast.isSuccess }
            header={ toast.header }
            message={ toast.message }
          />
        </div>
      ) : (
        <></>
      ) }
    </>
  );
}

WalletPage.propTypes = {
  session: PropTypes.object,
};
