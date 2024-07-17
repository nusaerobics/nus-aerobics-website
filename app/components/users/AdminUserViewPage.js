import { PageTitle, SectionTitle } from "../../components/Titles";
import { inputClassNames, tableClassNames } from "../../components/ClassNames";
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

export default function AdminUserViewPage({
  selectedUser,
  closeView,
  userBookings,
}) {
  const [permission, setPermission] = useState(new Set([]));
  const [isEdit, setIsEdit] = useState(false);
  const toggleIsEdit = () => {
    setIsEdit(!isEdit);
  };

  function saveEdit() {
    // TODO: Handle saving changes made to user
    return;
  }

  return (
    <div className="h-full flex flex-col gap-y-5">
      <div className="flex flex-row items-center gap-x-5">
        <button onClick={closeView}>
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
                className="h-[36px] rounded-[30px] px-[20px] bg-a-navy/10 text-a-navy text-sm" // PREVIOUSLY: py-[10px]
              >
                Cancel
              </button>
            ) : (
              <></>
            )}
            <button
              onClick={isEdit ? saveEdit : toggleIsEdit}
              className="h-[36px] rounded-[30px] px-[20px] bg-a-navy text-white text-sm" // PREVIOUSLY: py-[10px]
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
              value={selectedUser.balance}
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
              selectedKeys={permission}
              onSelectionChange={setPermission}
              // TODO: Fix the default value because it's not registering as it did in /page.js
              defaultSelectedKeys={[`${selectedUser.permission}`]}
            >
              <SelectItem key="admin">Admin</SelectItem>
              <SelectItem key="normal">User</SelectItem>
            </Select>
          </div>
        </div>
      </div>
      <div className="h-full flex flex-col rounded-[20px] border border-a-black/10 p-5 bg-white gap-y-2.5">
        <SectionTitle title="Bookings" />
        <Table removeWrapper classNames={tableClassNames}>
          <TableHeader>
            <TableColumn>Class</TableColumn>
            <TableColumn>Class date</TableColumn>
            <TableColumn>Booking date</TableColumn>
          </TableHeader>
          <TableBody>
            {userBookings.map((userBooking) => {
              return (
                <TableRow>
                  <TableCell>{userBooking.class_id}</TableCell>
                  <TableCell>{userBooking.class_id}</TableCell>
                  <TableCell>{userBooking.booking_date}</TableCell>
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
