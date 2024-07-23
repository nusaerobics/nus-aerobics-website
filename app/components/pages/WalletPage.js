"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@nextui-org/modal";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import { Input } from "@nextui-org/react";
import { PageTitle, SectionTitle } from "../../components/Titles";
import {
  inputClassNames,
  modalClassNames,
  tableClassNames,
} from "../../components/ClassNames";
import { useEffect, useState } from "react";
import { format } from "date-fns";

export default function WalletPage({ user }) {
  // TODO: Make sure across all pages, this runs first
  useEffect(() => {
    const permission = user.permission;
    setIsAdmin(permission == "admin");

    if (isAdmin) {
      const fetchTransactions = async () => {
        const res = await fetch("/api/transactions", { cache: "force-cache" }); // TODO: Use cache or not?
        if (!res.ok) {
          throw new Error(`Unable to get transactions: ${res.status}`);
        }
        const data = await res.json();
        setTransactions(data);
      };
      fetchTransactions();
    } else {
      const fetchTransactions = async () => {
        const res = await fetch(`/api/transactions?userId=${user.id}`);
        if (!res.ok) {
          throw new Error(
            `Unable to get transactions for user ${user.id}: ${res.status}`
          );
        }
        const data = await res.json();
        setTransactions(data);
      };
      fetchTransactions();
    }
  }, []);
  const [isAdmin, setIsAdmin] = useState(false);

  const [searchInput, setSearchInput] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [file, setFile] = useState();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  function creditAccounts() {
    // TODO: Implement crediting accounts logic
    return;
  }

  // TODO: Abstract out Admin and User version
  return (
    <>
      {isAdmin ? (
        <div className="h-full flex flex-col gap-y-5">
          <div className="flex flex-row items-center justify-between">
            <PageTitle title="Wallet" />
            <button
              onClick={onOpen}
              className="h-[36px] rounded-[30px] px-[20px] bg-[#1F4776] text-white text-sm cursor-pointer" // PREVIOUSLY: py-[10px]
            >
              Credit accounts
            </button>
          </div>

          <div className="h-full flex flex-col rounded-[20px] border border-a-black/10 p-5 bg-white gap-y-2.5">
            <div className="flex flex-row justify-between items-center">
              <SectionTitle title="All transactions" />
              <div className="w-1/4">
                <Input
                  placeholder="Search"
                  value={searchInput}
                  onValueChange={setSearchInput}
                  variant="bordered"
                  size="xs"
                  classNames={inputClassNames}
                />
              </div>
            </div>
            <Table removeWrapper classNames={tableClassNames}>
              <TableHeader>
                <TableColumn>Date</TableColumn>
                <TableColumn>Amount</TableColumn>
                <TableColumn>User</TableColumn>
                <TableColumn>Description</TableColumn>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => {
                  // TODO: It's not working on getting it in time - Need to join the tables in useEffect()?
                  // getClassById(transaction.class_id).then((data) => {
                  //   const className = data.name;
                  //   fullDescription = `Booked '${className}' (${formatDate(
                  //     transaction.date
                  //   )})`;
                  // });
                  return (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        {format(transaction.createdAt, "d/MM/y HH:mm")}
                      </TableCell>
                      <TableCell>{transaction.amount}</TableCell>
                      <TableCell>{transaction.userId}</TableCell>
                      <TableCell>{transaction.description}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            size="md"
            backdrop="opaque"
            classNames={modalClassNames}
          >
            <ModalContent>
              {(
                onClose // TODO: What's the onClose?
              ) => (
                <>
                  <ModalHeader>
                    <div className="flex flex-row items-center gap-x-2.5">
                      <SectionTitle title="Credit accounts" />
                    </div>
                  </ModalHeader>
                  <ModalBody>
                    <div className="md:w-1/3 flex flex-col gap-y-[5px]">
                      <p className="text-a-black/50 text-sm">CSV file *</p>
                      <Input
                        value={file}
                        onValueChange={setFile}
                        isRequired
                        variant="bordered"
                        size="xs"
                        classNames={inputClassNames}
                      />
                      {/* TODO: Add in upload icon and handle logic */}
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={creditAccounts}
                        className="rounded-[30px] px-[20px] py-[10px] bg-[#1F4776] text-white cursor-pointer"
                      >
                        Credit
                      </button>
                    </div>
                  </ModalBody>
                </>
              )}
            </ModalContent>
          </Modal>
        </div>
      ) : (
        // Start of user Wallet page
        <div className="h-full flex flex-col gap-y-5">
          <PageTitle title="Wallet" />
          <div className="h-1/4 flex flex-row gap-x-5">
            <div className="w-1/2 rounded-[20px] border border-a-black/10 p-5 bg-white">
              <p className="font-poppins font-bold text-a-navy text-3xl">
                {user.balance}
              </p>
              <p className="font-poppins text-[#393E46] text-lg">
                credits remaining
              </p>
            </div>
            <div className="w-1/2 rounded-[20px] border border-a-black/10 p-5 bg-white">
              {/* TODO: Implement logic to count how many credits spent */}
              <p className="font-poppins font-bold text-a-navy text-3xl">8</p>
              <p className="font-poppins text-a-black text-lg">credits spent</p>
            </div>
          </div>
          <div className="h-full flex flex-col rounded-[20px] border border-a-black/10 p-5 bg-white gap-y-2.5">
            <div className="flex flex-row">
              <div className="w-3/4">
                <SectionTitle title="All transactions" />
              </div>
              <div className="w-1/4">
                <Input
                  placeholder="Search"
                  value={searchInput}
                  onValueChange={setSearchInput}
                  variant="bordered"
                  size="xs"
                  classNames={inputClassNames}
                />
              </div>
            </div>
            <Table removeWrapper classNames={tableClassNames}>
              <TableHeader>
                <TableColumn>Date</TableColumn>
                <TableColumn>Amount</TableColumn>
                <TableColumn>User</TableColumn>
                <TableColumn>Description</TableColumn>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => {
                  return (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        {format(transaction.createdAt, "d/MM/yyy HH:mm")}
                      </TableCell>
                      <TableCell>{transaction.amount}</TableCell>
                      <TableCell>{transaction.userId}</TableCell>
                      <TableCell>{transaction.description}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
        // End of user Wallet page
      )}
    </>
  );
}
