"use client";

import { useEffect, useMemo, useState } from "react";
import { formatInTimeZone } from "date-fns-tz";
import { Chip, Spinner } from "@heroui/react";
import { Input } from "@heroui/input";
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@heroui/table";
import { MdRefresh, MdOutlineAutorenew, MdWarningAmber } from "react-icons/md";
import { PageTitle, SectionTitle } from "../utils/Titles";
import { inputClassNames, tableClassNames } from "../utils/ClassNames";

function displayDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : formatInTimeZone(date, "Asia/Singapore", "d/MM/y HH:mm");
}

function CancellationTable({ rows, refundable }) {
  return (
    <div className="flex-1 min-w-0 rounded-[20px] border border-a-black/10 bg-white p-5">
      <div className="flex items-center justify-between mb-2.5">
        <SectionTitle title={refundable ? "Eligible for refund" : "Not eligible for refund"} />
        <Chip size="sm" variant="flat" color={refundable ? "success" : "warning"}>{rows.length}</Chip>
      </div>
      <div className="overflow-x-auto">
        <Table removeWrapper aria-label={refundable ? "Refundable cancellations" : "Non-refundable cancellations"} classNames={tableClassNames}>
          <TableHeader>
            <TableColumn>User</TableColumn>
            <TableColumn>Class</TableColumn>
            <TableColumn>Class date</TableColumn>
            <TableColumn>Cancelled at</TableColumn>
            <TableColumn>Type</TableColumn>
          </TableHeader>
          <TableBody emptyContent="No cancellations recorded">
            {rows.map((cancellation) => (
              <TableRow key={cancellation.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{cancellation.user?.name ?? "Unknown user"}</span>
                    <span className="text-a-black/50">{cancellation.user?.email ?? "—"}</span>
                  </div>
                </TableCell>
                <TableCell>{cancellation.class?.name ?? "Deleted class"}</TableCell>
                <TableCell>{displayDate(cancellation.class?.date)}</TableCell>
                <TableCell>{displayDate(cancellation.cancelledAt)}</TableCell>
                <TableCell>{cancellation.isForced ? "Admin" : "User"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default function UnbookingMonitorPage() {
  const [cancellations, setCancellations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const fetchCancellations = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/cancellations", { cache: "no-store" });
      if (!response.ok) throw new Error("Unable to load cancellation history.");
      setCancellations(await response.json());
    } catch (fetchError) {
      setError(fetchError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCancellations(); }, []);

  const filteredCancellations = useMemo(() => {
    const search = searchInput.trim().toLowerCase();
    if (!search) return cancellations;
    return cancellations.filter((cancellation) => {
      const searchableText = [
        cancellation.user?.name,
        cancellation.user?.email,
        cancellation.class?.name,
      ].filter(Boolean).join(" ").toLowerCase();
      return searchableText.includes(search);
    });
  }, [cancellations, searchInput]);
  const refundable = useMemo(() => filteredCancellations.filter((cancellation) => cancellation.eligibleForRefund), [filteredCancellations]);
  const nonRefundable = useMemo(() => filteredCancellations.filter((cancellation) => !cancellation.eligibleForRefund), [filteredCancellations]);

  return (
    <div className="w-full h-full flex flex-col gap-y-5 p-5 md:p-10 pt-20 overflow-y-scroll">
      <div className="flex items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5">
          <MdOutlineAutorenew size={30} color="#1F4776" />
          <PageTitle title="Unbooking monitor" />
        </div>
        <button onClick={fetchCancellations} disabled={loading} className="h-[36px] rounded-[30px] px-[16px] bg-a-navy text-white text-sm cursor-pointer flex items-center gap-1 disabled:opacity-50">
          <MdRefresh size={18} /> Refresh
        </button>
      </div>

      <div className="flex flex-wrap gap-2.5">
        <Chip color="primary" variant="flat">Showing: {filteredCancellations.length} / {cancellations.length}</Chip>
        <Chip color="success" variant="flat">Refundable: {refundable.length}</Chip>
        <Chip color="warning" variant="flat">Not refundable: {nonRefundable.length}</Chip>
      </div>

      <div className="w-full md:w-1/3">
        <Input
          aria-label="Search cancellation history"
          placeholder="Search name, email, or class"
          value={searchInput}
          onValueChange={setSearchInput}
          variant="bordered"
          size="sm"
          classNames={inputClassNames}
        />
      </div>

      {error && <div className="rounded-[12px] bg-red-100 text-red-700 p-3 flex items-center gap-2"><MdWarningAmber />{error}</div>}
      {loading ? (
        <div className="flex justify-center py-20"><Spinner label="Loading cancellation history..." color="primary" /></div>
      ) : (
        <div className="flex flex-col xl:flex-row gap-5 items-start">
          <CancellationTable rows={refundable} refundable />
          <CancellationTable rows={nonRefundable} refundable={false} />
        </div>
      )}
    </div>
  );
}
