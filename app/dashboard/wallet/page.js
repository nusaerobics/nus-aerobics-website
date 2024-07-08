"use client";

import { MdSearch } from "react-icons/md";
import {
  Icon,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";

export default function Page() {
  return (
    <div className="flex flex-colgap-y-5">
      <p>Wallet</p>
      <div className="h-1/4 flex flex-row gap-x-5">
        <div className="w-1/2 rounded-[20px] border border-[#393E4610] p-5 bg-white">
          <p>10 credits remaining</p>
        </div>
        <div className="w-1/2 rounded-[20px] border border-[#393E4610] p-5 bg-white">
          <p>8 credits spent</p>
        </div>
      </div>
      <div className="h-3/4 flex flex-col rounded-[20px] border border-[#393E4610] p-5 bg-white gap-y-2.5">
        <div className="flex flex-row justify-between">
          <p className="w-3/4">All transactions</p>
          <div className="w-1/4">
            <InputGroup>
              <InputRightElement>
                <Icon as={MdSearch} />
              </InputRightElement>
              <Input placeholder="Search" />
            </InputGroup>
          </div>
        </div>
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Date</Th>
                <Th isNumeric>Amount</Th>
                <Th>User</Th>
                <Th>Description</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>14/02/2024 10:00</Td>
                <Td isNumeric>10</Td>
                <Td>narasmith</Td>
                <Td>Booked ‘Vinyasa Yoga’ (16/02/2024 17:00)</Td>
              </Tr>
              <Tr>
                <Td>14/02/2024 10:00</Td>
                <Td isNumeric>10</Td>
                <Td>narasmith</Td>
                <Td>Booked ‘Vinyasa Yoga’ (16/02/2024 17:00)</Td>
              </Tr>
              <Tr>
                <Td>14/02/2024 10:00</Td>
                <Td isNumeric>10</Td>
                <Td>narasmith</Td>
                <Td>Booked ‘Vinyasa Yoga’ (16/02/2024 17:00)</Td>
              </Tr>
              <Tr>
                <Td>14/02/2024 10:00</Td>
                <Td isNumeric>10</Td>
                <Td>narasmith</Td>
                <Td>Booked ‘Vinyasa Yoga’ (16/02/2024 17:00)</Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};
