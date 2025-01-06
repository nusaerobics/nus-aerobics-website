"use client";

import { format } from "date-fns";
import PropTypes from "prop-types";
import { useCallback, useEffect, useMemo, useState } from "react";
import { MdOpenInNew, MdOutlineFilterAlt } from "react-icons/md";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import { useDisclosure } from "@nextui-org/modal";
import { Chip, Input, Pagination } from "@nextui-org/react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";

import {
  chipClassNames,
  chipTypes,
  inputClassNames,
  tableClassNames,
} from "../utils/ClassNames";
import { PageTitle } from "../utils/Titles";
import ScheduleModal from "../classes/modals/ScheduleModal";
import Toast from "../Toast";

export default function UserClassLandingPage({ userId }) {
  const scheduleModal = useDisclosure();

  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [classQuery, setClassQuery] = useState("");
  const [sortDescriptor, setSortDescriptor] = useState(
    {
      column: "date",
      direction: "ascending",
    }
  );
  const [filters, setFilters] = useState(new Set(["open"]));
  const [toast, setToast] = useState({});
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await fetch(`/api/classes?userId=${ userId }`);
        if (!res.ok) {
          throw new Error(`Unable to get classes: ${ res.status }`);
        }
        const classes = await res.json();
        setClasses(classes);
      } catch (error) {
        setToast({
          isSuccess: false,
          header: "Unable to get classes",
          message: `Unable to get classes. Try again later.`,
        });
        setShowToast(true);
        console.log(error);
      }
    };
    fetchClasses();
  }, [scheduleModal.isOpen]);
  useEffect(() => {
    let timer;
    if (showToast) {
      timer = setTimeout(() => {
        setShowToast(false);
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [showToast]);

  function handleScheduleSelect(rowData) {
    setSelectedClass(rowData);
    scheduleModal.onOpen();
  }

  const toggleShowToast = () => {
    setShowToast(!showToast);
  };
  const onClassQueryChange = useCallback((value) => {
    setClassQuery(value);
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
        const searchName = classQuery.toLowerCase();
        return className.includes(searchName);
      })
      .filter((c) => {
        if (filters.has("open")) {
          const isFull = c.bookedCapacity == c.maxCapacity;
          const classStatus = c.status.toLowerCase();
          return !isFull && classStatus == "open";
        }
        return true;
      })
    return Math.ceil(filteredClasses.length / rowsPerPage);
  }, [sortedClasses, classQuery, filters]);
  const classItems = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    const filteredClasses = sortedClasses
      .filter((c) => {
        const className = c.name.toLowerCase();
        const searchName = classQuery.toLowerCase();
        return className.includes(searchName);
      })
      .filter((c) => {
        if (filters.has("open")) {
          const isFull = c.bookedCapacity == c.maxCapacity;
          const classStatus = c.status.toLowerCase();
          return !isFull && classStatus == "open";
        }
        return true;
      })
    return filteredClasses.slice(start, end);
  }, [page, sortedClasses, classQuery, filters]);

  return (
    <>
      <div className="w-full h-full flex flex-col gap-y-5 p-5 md:p-10 pt-20 overflow-y-scroll">
        <PageTitle title="Classes"/>
        <div className="w-full rounded-[20px] border border-a-black/10 bg-white gap-y-2.5">

          <div className="md:h-full md:w-full flex flex-col p-2.5 gap-y-5">
            <div className="flex flex-row justify-end items-center gap-x-2.5">
              <Dropdown>
                <DropdownTrigger>
                  <button className="cursor-pointer text-lg">
                    <MdOutlineFilterAlt color="#393E46"/>
                  </button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Filter classes"
                  variant="flat"
                  closeOnSelect={ false }
                  selectionMode="multiple"
                  selectedKeys={ filters }
                  onSelectionChange={ setFilters }
                >
                  <DropdownSection title="Filter classes">
                    <DropdownItem key="open">Open for booking</DropdownItem>
                  </DropdownSection>
                </DropdownMenu>
              </Dropdown>
              <div className="self-end md:w-1/4">
                <Input
                  placeholder="Search"
                  value={ classQuery }
                  onValueChange={ onClassQueryChange }
                  variant="bordered"
                  size="xs"
                  classNames={ inputClassNames }
                />
              </div>
            </div>
            <div className="overflow-x-scroll">
              <Table
                removeWrapper
                classNames={ tableClassNames }
                sortDescriptor={ sortDescriptor }
                onSortChange={ setSortDescriptor }
              >
                <TableHeader>
                  <TableColumn>Class</TableColumn>
                  <TableColumn></TableColumn>
                  <TableColumn>Status</TableColumn>
                  <TableColumn key="date" allowsSorting>
                    Date
                  </TableColumn>
                </TableHeader>
                <TableBody>
                  { classItems.map((c) => {
                    return (
                      <TableRow key={ c.id }>
                        <TableCell>{ c.name }</TableCell>
                        <TableCell>
                          <button
                            className="cursor-pointer text-base md:text-lg"
                            onClick={ () => handleScheduleSelect(c) }
                          >
                            <MdOpenInNew color="#393E46"/>
                          </button>
                        </TableCell>
                        <TableCell>
                          <Chip classNames={ chipClassNames[c.status] }>
                            { chipTypes[c.status].message }
                          </Chip>
                        </TableCell>
                        <TableCell>
                          { format(c.date, "d/MM/y HH:mm (EEE)") }
                        </TableCell>
                      </TableRow>
                    );
                  }) }
                </TableBody>
              </Table>
            </div>
            <div className="flex flex-row justify-center">
              <Pagination
                showControls
                isCompact
                color="primary"
                size="sm"
                loop={ true }
                page={ page }
                total={ classPages }
                onChange={ (page) => setPage(page) }
              />
            </div>
          </div>
          <ScheduleModal
            selectedClass={ selectedClass }
            userId={ userId }
            isOpen={ scheduleModal.isOpen }
            onOpen={ scheduleModal.onOpen }
            onOpenChange={ scheduleModal.onOpenChange }
          />

        </div>
      </div>
      { showToast && (
        <div onClick={ toggleShowToast }>
          <Toast
            isSuccess={ toast.isSuccess }
            header={ toast.header }
            message={ toast.message }
          />
        </div>) }
    </>
  );
}

UserClassLandingPage.propTypes = {
  userId: PropTypes.number,
};
