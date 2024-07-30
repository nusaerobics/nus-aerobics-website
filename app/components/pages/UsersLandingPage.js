"use client";

import { useState } from "react";
import { PageTitle } from "../utils/Titles";
import { inputClassNames, tableClassNames } from "../utils/ClassNames";
import { MdOpenInNew } from "react-icons/md";
import { Input } from "@nextui-org/input";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";

export default function UsersLandingPage({ users, openView }) {
  const [searchInput, setSearchInput] = useState("");

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
            <TableColumn></TableColumn>
            <TableColumn>Status</TableColumn>
            <TableColumn>Email</TableColumn>
            <TableColumn>Wallet</TableColumn>
          </TableHeader>
          <TableBody>
            {users.map((user) => {
              return (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>
                    <button className="cursor-pointer" onClick={() => openView(user)}>
                      <MdOpenInNew />
                    </button>
                  </TableCell>
                  <TableCell>{user.permission}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.balance}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
