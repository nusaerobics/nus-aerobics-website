"use client";

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import PageTitle from "../components/PageTitle";
import SectionTitle from "../components/SectionTitle";

import ClassCard from "../components/dashboard/ClassCard";
import { transactions, upcomingClasses } from "../components/Data";

export default function Page() {
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
            <TableContainer className="text-[#393E46] text-base">
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Description</Th>
                    <Th isNumeric>Amount</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {transactions.map((transaction) => {
                    return (
                      <Tr key={transaction.description}>
                        <Td>{transaction.description.split(" ")[0]}</Td>
                        <Td isNumeric>{transaction.amount}</Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
