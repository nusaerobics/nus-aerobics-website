import PropTypes from "prop-types";

import { PageTitle } from "../utils/Titles";
import {
  chipClassNames,
  chipTypes,
  inputClassNames,
  tableClassNames,
} from "../utils/ClassNames";
import { format } from "date-fns";
import { MdMoreVert } from "react-icons/md";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/dropdown";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import { Chip, Input, Pagination } from "@nextui-org/react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminClassLandingPage({
  classes,
  openCreate
}) {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");

  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const classPages = Math.ceil(classes.length / rowsPerPage);
  const classItems = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return classes.slice(start, end);
  }, [page, classes]);

  const [selectedClass, setSelectedClass] = useState({});
  const handleClick = (rowData) => {
    console.log("selectedClass:", rowData);
    setSelectedClass(rowData);
  };

  const handleDropdown = (key) => {
    switch (key) {
      case "view":
        console.log("view");
        return router.push(`classes/${selectedClass.id}`)
      case "duplicate":
        // TODO: Implement duplciate class selected
        console.log("duplicate");
        return;
      case "delete":
        console.log("delete");
        // TODO: Implement delete class selected
        return;
    }
  };

  return (
    <>
      <div className="flex flex-row items-center justify-between">
        <PageTitle title="Classes" />
        <button
          onClick={openCreate}
          className="h-[36px] rounded-[30px] px-[20px] bg-a-navy text-white text-sm cursor-pointer"
        >
          Create
        </button>
      </div>
      {/* STARRED: This is how to do the pagination with overflow for 10 rows */}
      <div className="w-full flex flex-col p-5 rounded-[20px] border border-a-black/10 bg-white gap-y-2.5">
        <div className="self-end w-1/4">
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
            <TableColumn>Class</TableColumn>
            <TableColumn>Status</TableColumn>
            <TableColumn>Booked capacity</TableColumn>
            <TableColumn allowsSorting>Date</TableColumn>
            <TableColumn></TableColumn>
          </TableHeader>
          <TableBody>
            {classItems.map((item) => {
              return (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>
                    <Chip classNames={chipClassNames[item.status]}>
                      {chipTypes[item.status].message}
                    </Chip>
                  </TableCell>
                  <TableCell>{`${item.bookedCapacity}/${item.maxCapacity}`}</TableCell>
                  <TableCell>{format(item.date, "d/MM/y HH:mm")}</TableCell>
                  <TableCell>
                    <Dropdown>
                      <DropdownTrigger>
                        <button
                          className="cursor-pointer"
                          onClick={() => handleClick(item)}
                        >
                          <MdMoreVert size={24} />
                        </button>
                      </DropdownTrigger>
                      <DropdownMenu onAction={(key) => handleDropdown(key)}>
                        <DropdownItem key="view">View class</DropdownItem>
                        <DropdownItem key="duplicate">
                          Duplicate class
                        </DropdownItem>
                        <DropdownItem key="delete">Delete class</DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <div className="flex flex-row justify-center">
          <Pagination
            showControls
            isCompact
            color="primary"
            size="sm"
            loop={true}
            page={page}
            total={classPages}
            onChange={(page) => setPage(page)}
          />
        </div>
      </div>
    </>
  );
}

AdminClassLandingPage.propTypes = {
  classes: PropTypes.array,
  openCreate: PropTypes.func,
};
