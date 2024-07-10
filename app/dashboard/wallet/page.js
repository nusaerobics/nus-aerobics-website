"use client";

import { MdSearch } from "react-icons/md";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import { Input } from "@nextui-org/react";
import { useMemo } from "react";
import { PageTitle, SectionTitle } from "../../components/Titles";
import { transactions } from "../../components/Data";

export default function Page() {
  const tableClassNames = useMemo(
    () => ({
      // wrapper: ["max-h-[382px]", "max-w-3xl"],
      // TODO: Make the font not bold
      th: ["bg-white", "text-[#393E4650]", "text-base", "border-b"],
      td: [
        // changing the rows border radius
        // first
        "group-data-[first=true]:first:before:rounded-none",
        "group-data-[first=true]:last:before:rounded-none",
        // middle
        "group-data-[middle=true]:before:rounded-none",
        // last
        "group-data-[last=true]:first:before:rounded-none",
        "group-data-[last=true]:last:before:rounded-none",
      ],
    }),
    []
  );

  return (
    <div className="h-full flex flex-col gap-y-5">
      <PageTitle title="Wallet" />
      <div className="h-1/4 flex flex-row gap-x-5">
        <div className="w-1/2 rounded-[20px] border border-[#393E4610] p-5 bg-white">
          <p className="font-poppins font-bold text-[#1F4776] text-3xl">10</p>
          <p className="font-poppins text-[#393E46] text-lg">
            credits remaining
          </p>
        </div>
        <div className="w-1/2 rounded-[20px] border border-[#393E4610] p-5 bg-white">
          <p className="font-poppins font-bold text-[#1F4776] text-3xl">8</p>
          <p className="font-poppins text-[#393E46] text-lg">credits spent</p>
        </div>
      </div>
      <div className="h-full flex flex-col rounded-[20px] border border-[#393E4610] p-5 bg-white gap-y-2.5">
        <div className="flex flex-row">
          <div className="w-3/4">
            <SectionTitle title="All transactions" />
          </div>
          <div className="w-1/4">
            <Input
              placeholder="Search"
              radius="full"
              classNames={{
                input: ["text-[#393E46]", "placeholder:text-[#393E4650]"],
              }}
              startContent={<MdSearch className="text-[#393E4650]" />}
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
