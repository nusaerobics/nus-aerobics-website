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

export default function Page() {
  // TODO: Method which calls backend to retrieve all upcoming class bookings
  return (
    <div className="flex flex-col gap-y-5">
      <p>Dashboard</p>
      <div className="h-full flex flex-row gap-x-5">
        <div className="h-full w-2/3 flex flex-col rounded-[20px] border border-[#393E4610] p-5 bg-white gap-y-2.5">
          <p>Upcoming classes</p>
          <div className="rounded-[20px] border-l-[4px] border-l-[#1F4776] bg-[#1F477610] p-2.5">
            <p>Class name</p>
            <p>Day, DD Month YYYY HH:MM</p>
            <p>NUS UTown Gym</p>
          </div>
          <div className="rounded-[20px] border-l-[4px] border-l-[#1F4776] bg-[#1F477610] p-2.5">
            <p>Class name</p>
            <p>Day, DD Month YYYY HH:MM</p>
            <p>NUS UTown Gym</p>
          </div>
        </div>
        <div className="h-full w-1/3 flex flex-col gap-y-5">
          <div className="h-1/4 flex flex-col rounded-[20px] border border-[#393E4610] p-5 bg-white">
            <p>10</p>
            <p>credits remaining</p>
          </div>
          <div className="h-3/4 flex flex-col rounded-[20px] border border-[#393E4610] p-5 bg-white">
            <p>Recent transactions</p>
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Description</Th>
                    <Th isNumeric>Amount</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td>Deposit</Td>
                    <Td isNumeric>10</Td>
                  </Tr>
                  <Tr>
                    <Td>Booked class</Td>
                    <Td isNumeric>-1</Td>
                  </Tr>
                  <Tr>
                    <Td>Refund</Td>
                    <Td isNumeric>1</Td>
                  </Tr>
                </Tbody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
