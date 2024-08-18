"use client";

import { useEffect, useMemo, useState } from "react";

import { useRouter } from "next/navigation";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/dropdown";
import { Input } from "@nextui-org/input";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
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
import { Pagination } from "@nextui-org/react";
import { MdMoreVert } from "react-icons/md";
import {
  inputClassNames,
  modalClassNames,
  tableClassNames,
} from "../utils/ClassNames";
import { PageTitle, SectionTitle } from "../utils/Titles";
import Toast from "../Toast";

export default function UsersPage() {
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState({});
  const [showToast, setShowToast] = useState(false); // TODO: Add in setInterval to only show Toast for X seconds
  const [toast, setToast] = useState({});
  const [credits, setCredits] = useState(0);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch("/api/users");
      if (!res.ok) {
        throw new Error(`Unable to get users: ${res.status}`);
      }
      const data = await res.json();
      setUsers(data);
    };
    fetchUsers();
  }, []);

  const rowsPerPage = 10;
  const userPages = useMemo(() => {
    if (searchInput != "") {
      const usersSearch = users.filter((user) => {
        const userName = user.name.toLowerCase();
        const searchValue = searchInput.toLowerCase();
        return userName.includes(searchValue);
      });
      return Math.ceil(usersSearch.length / rowsPerPage);
    }
    return Math.ceil(users.length / rowsPerPage);
  }, [users, searchInput]);

  const userItems = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    if (searchInput != "") {
      const usersSearch = users.filter((user) => {
        const userName = user.name.toLowerCase();
        const userEmail = user.email.toLowerCase();
        const searchValue = searchInput.toLowerCase();
        return (
          userName.includes(searchValue) || userEmail.includes(searchValue)
        );
      });
      return usersSearch.slice(start, end);
    }
    return users.slice(start, end);
  }, [page, users, searchInput]);

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

  const selectRow = (rowData) => {
    setSelectedUser(rowData);
  };
  const handleDropdown = (key) => {
    switch (key) {
      case "view":
        return router.push(`users/${selectedUser.id}`);
      case "credit":
        return onOpen();
      case "delete":
        return deleteUser(selectedUser);
    }
  };

  async function creditUser() {
    try {
      const newBalance = parseInt(selectedUser.balance) + parseInt(credits);
      const res = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedUser.id, balance: newBalance }),
      });
      if (!res.ok) {
        setToast({
          isSuccess: false,
          header: "Unable to credit user",
          message: `Unable to credit ${selectedUser.name}'s account. Try again later.`,
        });
        setShowToast(true);
        throw new Error(`Unable to credit user ${selectedUser.id}`);
      }
      // Update users
      const updatedUsers = users.map((originalUser) => {
        if (originalUser.id == selectedUser.id) {
          return { ...originalUser, balance: newBalance };
        }
        return originalUser;
      });
      setUsers(updatedUsers);

      onOpenChange();
      setToast({
        isSuccess: true,
        header: "Credited user",
        message: `Successfully credited ${selectedUser.name}'s account.`,
      });
      setShowToast(true);
    } catch (error) {
      setResult({
        isSuccess: false,
        header: "Unable to credit user",
        message: `An error occurred while credit ${selectedUser.name}'s account. Try again later.`,
      });
      setModalType("result");
      console.log(error);
    }
  }

  async function deleteUser(selectedUser) {
    try {
      const originalTransactions = await fetch(
        `/api/transactions?userId=${selectedUser.id}`
      );
      if (!originalTransactions.ok) {
        throw new Error(
          `Unable to get original transactions for user ${selectedUser.id}`
        );
      }
      const originalBookings = await fetch(
        `/api/bookings?userId=${selectedUser.id}`
      );
      if (!originalBookings.ok) {
        throw new Error(
          `Unable to get original bookings for user ${selectedUser.id}`
        );
      }

      const res1 = await fetch("/api/transactions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: selectedUser.id }),
      });
      if (!res1.ok) {
        // TODO: Restore transactions for user
        throw new Error(
          `Unable to delete transactions for user ${selectedUser.id}`
        );
      }

      const res2 = await fetch("/api/bookings", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: selectedUser.id }),
      });
      if (!res2.ok) {
        // TODO: Restore transactions and bookings for user
        throw new Error(`Unable to delete bookings for ${selectedUser.id}`);
      }

      const res3 = await fetch("/api/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedUser.id }),
      });
      if (!res3.ok) {
        // TODO: Restore transactions and bookings for user
        throw new Error(`Unable to delete user ${selectedUser.id}`);
      }

      const updatedUsers = users.filter((originalUser) => {
        return originalUser.id != selectedUser.id;
      });
      setUsers(updatedUsers);
      setToast({
        isSuccess: true,
        header: "Deleted user",
        message: `Successfully deleted ${selectedUser.name}'s account.`,
      });
      setShowToast(true);
    } catch (error) {
      setToast({
        isSuccess: false,
        header: "Unable to delete user",
        message: `Unable to delete ${selectedUser.name}'s account. Try again later.`,
      });
      setShowToast(true);
      console.log(error);
    }
  }

  return (
    <>
      <div className="w-full h-full flex flex-col gap-y-5 p-5 md:p-10  pt-20 overflow-y-scroll">
        <PageTitle title="Users" />
        <div className="flex flex-col rounded-[20px] border border-a-black/10 p-5 bg-white gap-y-2.5">
          <div className="md:self-end md:w-1/4">
            <Input
              placeholder="Search"
              value={searchInput}
              onValueChange={setSearchInput}
              variant="bordered"
              size="xs"
              classNames={inputClassNames}
            />
          </div>
          <div className="overflow-x-scroll">
            <Table removeWrapper classNames={tableClassNames}>
              <TableHeader>
                <TableColumn>Name</TableColumn>
                <TableColumn>Status</TableColumn>
                <TableColumn>Email</TableColumn>
                <TableColumn>Wallet</TableColumn>
                <TableColumn></TableColumn>
              </TableHeader>
              <TableBody>
                {userItems.map((user) => {
                  return (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.permission}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.balance}</TableCell>
                      <TableCell>
                        <Dropdown>
                          <DropdownTrigger>
                            <button
                              className="cursor-pointer"
                              onClick={() => selectRow(user)}
                            >
                              <MdMoreVert size={24} />
                            </button>
                          </DropdownTrigger>
                          <DropdownMenu onAction={(key) => handleDropdown(key)}>
                            <DropdownItem key="view">View user</DropdownItem>
                            <DropdownItem key="credit">
                              Credit account
                            </DropdownItem>
                            <DropdownItem key="delete">
                              Delete user
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          <div className="flex flex-row justify-center">
            <Pagination
              showControls
              isCompact
              color="primary"
              size="sm"
              loop={true}
              page={page}
              total={userPages}
              onChange={(page) => setPage(page)}
            />
          </div>
        </div>
      </div>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="md"
        backdrop="opaque"
        classNames={modalClassNames}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <div className="flex flex-row items-center gap-x-2.5">
                  <SectionTitle title="Credit user" />
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-y-[5px]">
                  <p className="text-a-black/50 text-sm">
                    Enter number of credits *
                  </p>
                  <div className="md:w-1/3">
                    <Input
                      type="number"
                      value={credits}
                      onValueChange={setCredits}
                      isRequired
                      variant="bordered"
                      size="xs"
                      classNames={inputClassNames}
                    />
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <button
                  onClick={creditUser}
                  className="rounded-[30px] px-[20px] py-[10px] bg-a-navy text-white cursor-pointer"
                >
                  Credit user
                </button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      {showToast ? (
        <div onClick={toggleShowToast}>
          <Toast
            isSuccess={toast.isSuccess}
            header={toast.header}
            message={toast.message}
          />
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
