"use client";

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
import { transactions } from "../../components/Data";
import { inputClassNames, tableClassNames } from "../../components/ClassNames";
import { useState } from "react";

export default function Page() {
  const [searchInput, setSearchInput] = useState("");
  
  return (
    <div className="h-full flex flex-col gap-y-5">
      <PageTitle title="Wallet" />
      <div className="h-1/4 flex flex-row gap-x-5">
        <div className="w-1/2 rounded-[20px] border border-a-black/10 p-5 bg-white">
          {/* TODO: For a given User, get the User's balance */}
          <p className="font-poppins font-bold text-a-navy text-3xl">10</p>
          <p className="font-poppins text-[#393E46] text-lg">
            credits remaining
          </p>
        </div>
        <div className="w-1/2 rounded-[20px] border border-a-black/10 p-5 bg-white">
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
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>{transaction.amount}</TableCell>
                  <TableCell>{transaction.user}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
