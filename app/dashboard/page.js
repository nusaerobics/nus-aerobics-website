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
import { tableClassNames } from "../components/ClassNames";
import { useState } from "react";

export default function Page() {
  const [isAdmin, setIsAdmin] = useState(false);
  // TODO: Method which calls backend to retrieve all upcoming class bookings
  return (
    <>
      {isAdmin ? (
        <div className="h-full flex flex-col gap-y-5">
          {/* TODO: This page should be under app/page.js probably */}
          <PageTitle title="Dashboard" />
          <div className="h-full flex flex-row gap-x-5">
            <div className="h-full w-2/3 flex flex-col p-5 gap-y-2.5 bg-white rounded-[20px] border border-a-black/10">
              <SectionTitle title="Today's classes" />
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
              <div className="h-1/4 flex flex-col justify-center p-5 bg-white rounded-[20px] border border-a-black/10">
                <div className="flex flex-row gap-x-1">
                  <p className="font-poppins font-bold text-a-navy text-5xl">
                    1500
                  </p>
                  <p className="font-bold text-a-navy text-2xl">/ 3000</p>
                </div>
                <p className="font-poppins text-a-navy text-2xl">
                  credits sold
                </p>
              </div>
              <div className="h-1/4 flex flex-col justify-center p-5 bg-white rounded-[20px] border border-a-black/10">
                <p className="font-poppins font-bold text-a-navy text-5xl">
                  10
                </p>
                <p className="font-poppins text-a-navy text-2xl">
                  credits unused
                </p>
              </div>
              <div className="h-1/4 flex flex-col justify-center p-5 bg-white rounded-[20px] border border-a-black/10">
                <div className="flex flex-row gap-x-1">
                  <p className="font-poppins font-bold text-a-navy text-5xl">
                    1000
                  </p>
                  <p className="font-bold text-a-navy text-2xl">/ 2850</p>
                </div>
                <p className="font-poppins text-a-navy text-2xl">
                  slots booked
                </p>
              </div>
              <div className="h-1/4 flex flex-col justify-center p-5 bg-white rounded-[20px] border border-a-black/10">
                <p className="font-poppins font-bold text-a-navy text-5xl">
                  100
                </p>
                <p className="font-poppins text-a-navy text-2xl">
                  active members
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-full flex flex-col gap-y-5">
          {/* TODO: This page should be under app/page.js probably */}
          <PageTitle title="Dashboard" />
          <div className="h-full flex flex-row gap-x-5">
            <div className="h-full w-2/3 flex flex-col p-5 gap-y-2.5 bg-white rounded-[20px] border border-a-black/10">
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
              <div className="h-1/4 flex flex-col justify-center p-5 bg-white rounded-[20px] border border-a-black/10">
                <p className="font-poppins font-bold text-a-navy text-5xl">
                  10
                </p>
                <p className="font-poppins text-a-navy text-2xl">
                  credits remaining
                </p>
              </div>
              <div className="h-3/4 flex flex-col p-5 bg-white rounded-[20px] border border-a-black/10">
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
      )}
    </>
  );
}
