import PropTypes from "prop-types"
import { PageTitle } from "../Titles";
import { chipClassNames, chipTypes, inputClassNames, tableClassNames } from "../ClassNames";
import { format } from "date-fns";
import { MdEdit } from "react-icons/md";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import { Chip, Input } from "@nextui-org/react";
import { useState } from "react";

export default function AdminClassLandingPage({ classes, openCreate, openView }) {
  const [searchInput, setSearchInput] = useState("");

  return (
    <>
      <div className="flex flex-row items-center justify-between">
        <PageTitle title="Classes" />
        <button
          onClick={openCreate}
          className="h-[36px] rounded-[30px] px-[20px] bg-[#1F4776] text-white text-sm" // PREVIOUSLY: py-[10px]
        >
          Create
        </button>
      </div>
      <div className="h-full w-full flex flex-col p-5 rounded-[20px] border border-a-black/10 bg-white gap-y-2.5">
        {/* TODO: Move to right of section rather than start */}
        <Input
          placeholder="Search"
          value={searchInput}
          onValueChange={setSearchInput}
          variant="bordered"
          size="xs"
          classNames={inputClassNames}
        />
        <Table removeWrapper classNames={tableClassNames}>
          <TableHeader>
            <TableColumn>Class</TableColumn>
            <TableColumn></TableColumn>
            <TableColumn allowsSorting>Status</TableColumn>
            <TableColumn allowsSorting>Date</TableColumn>
          </TableHeader>
          <TableBody>
            {classes.map((c) => {
              return (
                <TableRow key={c.id}>
                  <TableCell>{c.name}</TableCell>
                  <TableCell>
                    <button onClick={() => openView(c)}>
                      <MdEdit size={24} />
                    </button>
                  </TableCell>
                  <TableCell>
                    <Chip classNames={chipClassNames[c.status]}>
                      {chipTypes[c.status].message}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    {format(c.date, "d/MM/y HH:mm")}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

AdminClassLandingPage.propTypes = {
  classes: PropTypes.array,
  openCreate: PropTypes.func, 
  openView: PropTypes.func,
};
