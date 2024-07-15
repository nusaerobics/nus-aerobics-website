// NOTE: Only accessible from admin access - check if logged in user has admin status
"use client";

import { PageTitle } from "../../components/Titles";
import { inputClassNames, tableClassNames } from "../../components/ClassNames";
import { useEffect, useState } from "react";
import { getUsers } from "../../services/DataService";
import { MdChevronLeft } from "react-icons/md";
import { Select, SelectItem } from "@nextui-org/select";
import { Input } from "@nextui-org/input";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";

export default function Page() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState({});
  const [searchInput, setSearchInput] = useState("");
  const [isViewUser, setIsViewUser] = useState(false);

  // TODO: Set initial value to selectedUser.status?
  const [newStatus, setNewStatus] = useState(new Set([]));

  // TODO: Is it { user } or just user
  const openUser = ({ user }) => {
    setSelectedUser(user);
    setIsViewUser(true);
  };
  const closeUser = () => {
    setSelectedUser({});
    setIsViewUser(false);
  };

  // TODO: How to make the data not recompute/reload between changing tabs? i.e. loads once on first load
  useEffect(() => {
    const fetchData = async () => {
      const usersData = await getUsers();
      setUsers(usersData);
    };
    fetchData();
  }, []);

  return (
    <>
      {isViewUser ? (
        <div className="h-full flex flex-col gap-y-5">
          <div className="flex flex-row gap-x-5">
            <button onClick={closeUser}>
              <MdChevronLeft />
            </button>
            <PageTitle title="View user" />
          </div>
          <div className="h-full flex flex-col rounded-[20px] border border-a-black/10 p-5 bg-white gap-y-2.5">
            <div className="flex flex-row gap-x-5">
              <div className="flex flex-col gap-y-2.5 w-[265px]">
                <p className="text-a-black/50 text-sm">Full name</p>
                <Input
                  value={selectedUser.name}
                  isDisabled
                  variant="bordered"
                  size="xs"
                  classNames={inputClassNames}
                />
              </div>
              <div className="flex flex-col gap-y-2.5 w-[265px]">
                <p className="text-a-black/50 text-sm">Email</p>
                <Input
                  value={selectedUser.email}
                  isDisabled
                  variant="bordered"
                  size="xs"
                  classNames={inputClassNames}
                />
              </div>
            </div>
            <div className="flex flex-row gap-x-5">
              <div className="flex flex-col gap-y-2.5 w-[265px]">
                <p className="text-a-black/50 text-sm">Balance</p>
                <Input
                  type="number"
                  value={selectedUser.balance}
                  variant="bordered"
                  size="xs"
                  classNames={inputClassNames}
                />
              </div>
              <div className="flex flex-col gap-y-2.5 w-[265px]">
                <p className="text-a-black/50 text-sm">Status</p>
                {/* TODO: Add in logic which changes what the choice means */}
                <Select
                  selectedKeys={newStatus}
                  onSelectionChange={setNewStatus}
                >
                  <SelectItem>Admin</SelectItem>
                  <SelectItem>User</SelectItem>
                </Select>
              </div>
            </div>
            {/* TODO: This table is exactly the same as a User's POV Booked classes - abstract out later */}
            {/* <Table removeWrapper classNames={tableClassNames}>
              <TableHeader>
                <TableColumn>Class</TableColumn>
                <TableColumn>Status</TableColumn>
                <TableColumn>Class date</TableColumn>
                <TableColumn>Booking date</TableColumn>
              </TableHeader>
              <TableBody>
                {users.map((user) => {
                  return (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>
                        <button onClick={() => openUser(user)}>
                          <MdOpenInNew />
                        </button>
                      </TableCell>
                      <TableCell>{user.status}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.balance}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table> */}
          </div>
        </div>
      ) : (
        <div className="h-full flex flex-col gap-y-5">
          <PageTitle title="users" />
          <div className="h-full flex flex-col rounded-[20px] border border-a-black/10 p-5 bg-white gap-y-2.5">
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
            <Table removeWrapper classNames={tableClassNames}>
              <TableHeader>
                <TableColumn>Name</TableColumn>
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
                        <button onClick={() => openUser(user)}>
                          <MdOpenInNew />
                        </button>
                      </TableCell>
                      <TableCell>{user.status}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.balance}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </>
  );
}
