import { PageTitle, SectionTitle } from "../utils/Titles";
import { inputClassNames, tableClassNames } from "../utils/ClassNames";
import { useState } from "react";
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
import { format } from "date-fns";

export default function UsersViewPage({
  selectedUser,
  closeView,
  userBookings,
}) {
  const [balance, setBalance] = useState(selectedUser.balance);
  const [permission, setPermission] = useState(
    new Set([selectedUser.permission])
  );
  const permissions = [
    { key: "admin", label: "Admin" },
    { key: "normal", label: "Normal" },
  ];

  const [isEdit, setIsEdit] = useState(false);
  const toggleIsEdit = () => {
    setIsEdit(!isEdit);
  };

  async function saveEdit() {
    try {
      // 1. Update user's account balance
      const updatedUser = { id: selectedUser.id, balance: balance };
      const res1 = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });
      if (!res1.ok) {
        throw new Error(`Unable to update user ${selectedUser.id}`);
      }
      
      // 2. Create new transaction of deposit
      const newTransaction = {
        userId: selectedUser.id,
        amount: balance,
        type: "deposit",
        description: `Deposited ${balance} credit(s)`,
      };
      const res2 = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTransaction),
      });
      if (!res2.ok) {
        throw new Error("Unable to create transaction");
      }
      toggleIsEdit();
      // TODO: Refresh users list in UsersPage
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="h-full flex flex-col gap-y-5 p-10 pt-20 overflow-y-scroll">
      <div className="flex flex-row items-center gap-x-5">
        <button className="cursor-pointer" onClick={closeView}>
          <MdChevronLeft color="#1F4776" size={42} />
        </button>
        <PageTitle title="View user" />
      </div>
      <div className="h-full flex flex-col rounded-[20px] border border-a-black/10 p-5 bg-white gap-y-2.5">
        <div className="flex flex-row justify-between">
          <SectionTitle title="User details" />
          <div className="flex flex-row gap-x-2.5">
            {isEdit ? (
              <button
                onClick={toggleIsEdit}
                className="h-[36px] rounded-[30px] px-[20px] bg-a-navy/10 text-a-navy text-sm cursor-pointer" // PREVIOUSLY: py-[10px]
              >
                Cancel
              </button>
            ) : (
              <></>
            )}
            <button
              onClick={isEdit ? saveEdit : toggleIsEdit}
              className="h-[36px] rounded-[30px] px-[20px] bg-a-navy text-white text-sm cursor-pointer" // PREVIOUSLY: py-[10px]
            >
              {isEdit ? "Save changes" : "Edit user"}
            </button>
          </div>
        </div>
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
              value={balance}
              onValueChange={setBalance}
              isDisabled={!isEdit}
              variant="bordered"
              size="xs"
              classNames={inputClassNames}
            />
          </div>
          <div className="flex flex-col gap-y-2.5 w-[265px]">
            <p className="text-a-black/50 text-sm">Status</p>
            <Select
              isDisabled={!isEdit}
              // TODO: Fix the default value because it's not registering as it did in /page.js
              selectedKeys={permission}
              onSelectionChange={setPermission}
              defaultSelectedKeys={[selectedUser.permission]}
            >
              {permissions.map((permission) => {
                <SelectItem key={permission.key}>
                  {permission.label}
                </SelectItem>;
              })}
            </Select>
          </div>
        </div>
      </div>
      <div className="h-full flex flex-col rounded-[20px] border border-a-black/10 p-5 bg-white gap-y-2.5">
        <SectionTitle title="Bookings" />
        <Table removeWrapper classNames={tableClassNames}>
          {/* TODO: Unbook user from class through here - opens up modal, unbook (force i.e. no need to check cancellation) */}
          <TableHeader>
            <TableColumn>Class</TableColumn>
            <TableColumn>Attendance</TableColumn>
            <TableColumn>Class date</TableColumn>
            <TableColumn>Booking date</TableColumn>
          </TableHeader>
          <TableBody>
            {userBookings.map((userBooking) => {
              return (
                <TableRow>
                  <TableCell>{userBooking.class.name}</TableCell>
                  <TableCell>{userBooking.attendance}</TableCell>
                  <TableCell>
                    {format(userBooking.class.date, "d/MM/y HH:mm")}
                  </TableCell>
                  <TableCell>
                    {format(userBooking.createdAt, "d/MM/y HH:mm")}
                  </TableCell>
                </TableRow>
              );
            })}
            ;
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
