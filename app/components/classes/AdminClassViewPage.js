import PropTypes from "prop-types";

import { Chip } from "@nextui-org/react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import { useState } from "react";
import { MdChevronLeft } from "react-icons/md";

import AdminClassDetails from "./AdminClassDetails";
import AdminClassForm from "./AdminClassForm";
import { chipClassNames, chipTypes, tableClassNames } from "../ClassNames";
import { PageTitle, SectionTitle } from "../Titles";

export default function AdminClassViewPage({
  selectedClass,
  closeView,
  classBookings,
}) {
  const [isEdit, setIsEdit] = useState(false);
  const toggleIsEdit = () => {
    setTitle("Edit class");
    setEditButton(isEdit ? "Edit class" : "Save changes");
    setIsEdit(!isEdit);
  };
  const [editButton, setEditButton] = useState("Edit class");

  const [isManage, setIsManage] = useState(false);
  const toggleIsManage = () => {
    setTitle("Manage class");
    setManageButton(isManage ? "Manage class" : "Save changes");
    setIsManage(!isManage);
  };
  const [manageButton, setManageButton] = useState("Manage class");

  const [title, setTitle] = useState(selectedClass.name);

  const revert = () => {
    setTitle(selectedClass.name);
    setEditButton("Edit class");
    setManageButton("Manage class");
    setIsEdit(false);
    setIsManage(false);
  };

  function unbookUser() {}

  function saveEdit() {
    // TODO: Implement UPDATE Class entry
    return;
  }

  function saveManage() {
    // TODO: Implement UPDATE User entries
    return;
  }

  return (
    <>
      <div className="flex flex-row items-center gap-x-2.5">
        {/* TODO: If isEdit or isManage, go back to Classes. Else, go to not isEdit and not isManage */}
        <button onClick={isEdit || isManage ? revert : closeView}>
          <MdChevronLeft color="#1F4776" size={42} />
        </button>
        <PageTitle title={title} />
        {!isEdit && !isManage ? (
          <Chip classNames={chipClassNames[selectedClass.status]}>
            {chipTypes[selectedClass.status].message}
          </Chip>
        ) : (
          <></>
        )}
      </div>

      {!isManage ? (
        <div className="h-full w-full flex flex-col gap-y-5 p-5 rounded-[20px] border border-a-black/10 bg-white">
          {isEdit ? (
            <AdminClassForm
              isCreate={false}
              inputName={selectedClass.name}
              inputTime={selectedClass.date}
              inputCredit={1}
              inputDescription={selectedClass.description}
              inputIsOpenBooking={selectedClass.status != "close"}
              inputIsAllowCancel={true}
            />
          ) : (
            <>
              <AdminClassDetails
                selectedClass={selectedClass}
                toggleIsEdit={toggleIsEdit}
              />
            </>
          )}
        </div>
      ) : (
        <></>
      )}

      {!isEdit ? (
        <div className="h-full w-full flex flex-col p-5 rounded-[20px] border border-a-black/10 bg-white gap-y-2.5">
          <div className="flex flex-row justify-between">
            <SectionTitle title="Participants" />
            <button
              onClick={isManage ? saveManage : toggleIsManage}
              className="h-[36px] rounded-[30px] px-[20px] bg-[#1F4776] text-white text-sm" // PREVIOUSLY: py-[10px]
            >
              {manageButton}
            </button>
          </div>
          {/* TODO: Implement Table for Manage Class */}
          <Table removeWrapper classNames={tableClassNames}>
            <TableHeader>
              <TableColumn>Name</TableColumn>
              <TableColumn>Email</TableColumn>
              <TableColumn>Attendance</TableColumn>
              <TableColumn>{isManage ? "" : "Booking date"}</TableColumn>
            </TableHeader>
            <TableBody>
              {classBookings.map((classBooking) => {
                return (
                  <TableRow>
                    <TableCell>{classBooking.user_id}</TableCell>
                    <TableCell>{classBooking.user_id}</TableCell>
                    <TableCell>{classBooking.attendance}</TableCell>
                    <TableCell>{classBooking.booking_date}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}

AdminClassViewPage.propTypes = {
  selectedClass: PropTypes.object,
  closeView: PropTypes.func,
  classBookings: PropTypes.array,
};
