import { fromZonedTime, toZonedTime } from "date-fns-tz";
import PropTypes from "prop-types";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { PageTitle } from "../utils/Titles";
import {
  chipClassNames,
  chipTypes,
  inputClassNames,
  tableClassNames,
} from "../utils/ClassNames";
import { format } from "date-fns";
import { MdMoreVert, MdOutlineFilterAlt } from "react-icons/md";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
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
import Toast from "../Toast";

export default function AdminClassLandingPage({ openCreate }) {
  const router = useRouter();

  const [classes, setClasses] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [selectedClass, setSelectedClass] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [toast, setToast] = useState({});
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "date",
    direction: "ascending",
  });
  const [filters, setFilters] = useState(new Set(["open", "upcoming"]));

  useEffect(() => {
    const fetchClasses = async () => {
      const res = await fetch("/api/classes");
      if (!res.ok) {
        throw new Error(`Unable to get classes: ${res.status}`);
      }
      const data = await res.json();
      setClasses(data);
    };
    fetchClasses();
  }, []);

  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const onSearchInputChange = useCallback((value) => {
    setSearchInput(value);
    setPage(1);
  });

  const sortedClasses = useMemo(() => {
    return [...classes].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const compare = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction == "descending" ? -compare : compare;
    });
  }, [sortDescriptor, classes]);

  const classPages = useMemo(() => {
    const filteredClasses = sortedClasses
      .filter((c) => {
        const className = c.name.toLowerCase();
        const searchValue = searchInput.toLowerCase();
        return className.includes(searchValue);
      })
      .filter((c) => {
        if (filters.has("open")) {
          const isFull = c.bookedCapacity == c.maxCapacity;
          const classStatus = c.status.toLowerCase();
          return !isFull && classStatus == "open";
        }
        return true;
      })
      .filter((c) => {
        if (filters.has("upcoming")) {
          const utcClassDate = fromZonedTime(c.date, "Asia/Singapore");
          const sgClassDate = toZonedTime(utcClassDate, "Asia/Singapore");
          const sgCurrentDate = toZonedTime(new Date(), "Asia/Singapore");

          return sgClassDate > sgCurrentDate;
        }
        return true;
      });
    return Math.ceil(filteredClasses.length / rowsPerPage);
  }, [sortedClasses, searchInput, filters]);

  const classItems = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    const filteredClasses = sortedClasses
      .filter((c) => {
        const className = c.name.toLowerCase();
        const searchValue = searchInput.toLowerCase();
        return className.includes(searchValue);
      })
      .filter((c) => {
        if (filters.has("open")) {
          const isFull = c.bookedCapacity == c.maxCapacity;
          const classStatus = c.status.toLowerCase();
          return !isFull && classStatus == "open";
        }
        return true;
      })
      .filter((c) => {
        if (filters.has("upcoming")) {
          const utcClassDate = fromZonedTime(c.date, "Asia/Singapore");
          const sgClassDate = toZonedTime(utcClassDate, "Asia/Singapore");
          const sgCurrentDate = toZonedTime(new Date(), "Asia/Singapore");

          return sgClassDate > sgCurrentDate;
        }
        return true;
      });
    return filteredClasses.slice(start, end);
  }, [page, sortedClasses, searchInput, filters]);

  const toggleShowToast = () => {
    setShowToast(!showToast);
  };
  const selectRow = (rowData) => {
    console.log("selectedClass:", rowData);
    setSelectedClass(rowData);
  };
  const handleDropdown = (key) => {
    switch (key) {
      case "view":
        return router.push(`classes/${selectedClass.id}`);
      case "delete":
        return deleteClass(selectedClass);
    }
  };

  async function deleteClass(selectedClass) {
    try {
      const originalBookings = await fetch(
        `/api/bookings?classId=${selectedClass.id}`
      );
      if (!originalBookings.ok) {
        throw new Error(
          `Unable to get original bookings for class ${selectedClass.id}`
        );
      }

      const res1 = await fetch("/api/bookings", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ classId: selectedClass.id }),
      });
      if (!res1.ok) {
        // TODO: Restore bookings for class
        throw new Error(
          `Unable to delete bookings for class ${selectedClass.id}`
        );
      }

      const updatedClasses = classes.filter((originalClass) => {
        return originalClass.id != selectedClass.id;
      });
      setClasses(updatedClasses);
      setToast({
        isSuccess: true,
        header: "Deleted class",
        message: `Successfully deleted ${selectedClass.name}.`,
      });
      setShowToast(true);
    } catch (error) {
      setResult({
        isSuccess: false,
        header: "Unable to delete class",
        message: `An error occurred while deleting ${selectedClass.name}. Try again later.`,
      });
      setModalType("result");
      console.log(error);
    }
  }

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
        <div className="flex flex-row justify-end items-center gap-x-2.5">
          <Dropdown>
            <DropdownTrigger>
              <button className="cursor-pointer">
                <MdOutlineFilterAlt color="#393E46" size={24} />
              </button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Filter classes"
              variant="flat"
              closeOnSelect={false}
              selectionMode="multiple"
              selectedKeys={filters}
              onSelectionChange={setFilters}
            >
              <DropdownSection title="Filter classes">
                <DropdownItem key="open">Open for booking</DropdownItem>
                <DropdownItem key="upcoming">Upcoming</DropdownItem>
              </DropdownSection>
            </DropdownMenu>
          </Dropdown>
          <div className="self-end w-1/4">
            <Input
              placeholder="Search"
              value={searchInput}
              onValueChange={onSearchInputChange}
              variant="bordered"
              size="xs"
              classNames={inputClassNames}
            />
          </div>
        </div>
        <Table
          removeWrapper
          classNames={tableClassNames}
          sortDescriptor={sortDescriptor}
          onSortChange={setSortDescriptor}
        >
          <TableHeader>
            <TableColumn>Class</TableColumn>
            <TableColumn>Status</TableColumn>
            <TableColumn>Booked capacity</TableColumn>
            <TableColumn key="date" allowsSorting>
              Date
            </TableColumn>
            <TableColumn></TableColumn>
          </TableHeader>
          <TableBody>
            {classItems.map((c) => {
              return (
                <TableRow key={c.id}>
                  <TableCell>{c.name}</TableCell>
                  <TableCell>
                    <Chip classNames={chipClassNames[c.status]}>
                      {chipTypes[c.status].message}
                    </Chip>
                  </TableCell>
                  <TableCell>{`${c.bookedCapacity}/${c.maxCapacity}`}</TableCell>
                  <TableCell>{format(c.date, "d/MM/y HH:mm (EEE)")}</TableCell>
                  <TableCell>
                    <Dropdown>
                      <DropdownTrigger>
                        <button
                          className="cursor-pointer"
                          onClick={() => selectRow(c)}
                        >
                          <MdMoreVert size={24} />
                        </button>
                      </DropdownTrigger>
                      <DropdownMenu onAction={(key) => handleDropdown(key)}>
                        <DropdownItem key="view">View class</DropdownItem>
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
      {showToast ? (
        <div onClick={toggleShowToast}>
          <Toast
            isSuccess={toast.isSuccess}
            header={toast.header}
            message={toast.message}
          />
        </div>
      ) : (
        <></>
      )}
    </>
  );
}

AdminClassLandingPage.propTypes = {
  openCreate: PropTypes.func,
};
