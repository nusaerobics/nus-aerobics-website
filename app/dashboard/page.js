"use client";

import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import { PageTitle, SectionTitle } from "../components/Titles";
import ClassCard from "../components/dashboard/ClassCard";
import { transactions, upcomingClasses } from "../components/Data";
import { useMemo } from "react";

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

  // TODO: Method which calls backend to retrieve all upcoming class bookings
  return (
    <div className="h-full flex flex-col gap-y-5">
      {/* TODO: This page should be under app/page.js probably */}
      <PageTitle title="Dashboard" />
      <div className="h-full flex flex-row gap-x-5">
        <div className="h-full w-2/3 flex flex-col rounded-[20px] border border-[#393E4610] p-5 bg-white gap-y-2.5">
          <SectionTitle title="Upcoming classes" />
          {upcomingClasses.map((upcomingClass) => {
            return (
              <ClassCard
                key={upcomingClass.name}
                name={upcomingClass.name}
                date={upcomingClass.date}
              />
            );
          })}
        </div>
        <div className="h-full w-1/3 flex flex-col gap-y-5">
          <div className="h-1/4 flex flex-col justify-center rounded-[20px] border border-[#393E4610] p-5 bg-white">
            <p className="font-poppins font-bold text-[#1F4776] text-5xl">10</p>
            <p className="font-poppins text-[#1F4776] text-2xl">
              credits remaining
            </p>
          </div>
          <div className="h-3/4 flex flex-col rounded-[20px] border border-[#393E4610] p-5 bg-white">
            <SectionTitle title="Recent transactions" />
            <Table removeWrapper classNames={tableClassNames}>
              <TableHeader>
                <TableColumn>Description</TableColumn>
                <TableColumn>Amount</TableColumn>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => {
                  return (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        {transaction.description.split(" ")[0]}
                      </TableCell>
                      <TableCell>{transaction.amount}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
