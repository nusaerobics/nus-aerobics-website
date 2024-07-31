"use client";

import { useMemo, useState } from "react";
import { PageTitle } from "../utils/Titles";
import { inputClassNames, tableClassNames } from "../utils/ClassNames";
import { MdMoreVert } from "react-icons/md";
import { Input } from "@nextui-org/input";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/dropdown";
import { Pagination } from "@nextui-org/react";

export default function UsersLandingPage({ users, openView }) {
  const [searchInput, setSearchInput] = useState("");

  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const userPages = Math.ceil(users.length / rowsPerPage);
  const userItems = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return users.slice(start, end);
  }, [page, users]);

  const [selectedUser, setSelectedUser] = useState({});
  const handleClick = (rowData) => {
    console.log("selectedUser:", rowData);
    setSelectedUser(rowData);
  };

  const handleDropdown = (key) => {
    switch (key) {
      case "view":
        return openView(selectedUser);
      case "credit":
        // // TODO: Implement credit user selected in a modal
        console.log("credit");
        return;
        return;
      case "delete":
        console.log("delete");
        // TODO: Implement delete user selected
        return;
    }
  };

  return (
    <div className="h-full flex flex-col gap-y-5 p-10 pt-20 overflow-y-scroll">
      <PageTitle title="Users" />
      <div className="h-full flex flex-col rounded-[20px] border border-a-black/10 p-5 bg-white gap-y-2.5">
        <div className="self-end w-1/4">
          <Input
            placeholder="Search"
            value={searchInput}
            onValueChange={setSearchInput}
            variant="bordered"
            size="xs"
            classNames={inputClassNames}
          />
        </div>
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
                          onClick={() => handleClick(user)}
                        >
                          <MdMoreVert size={24} />
                        </button>
                      </DropdownTrigger>
                      <DropdownMenu onAction={(key) => handleDropdown(key)}>
                        <DropdownItem key="view">View user</DropdownItem>
                        <DropdownItem key="credit">Credit account</DropdownItem>
                        <DropdownItem key="delete">Delete user</DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
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
  );
}
