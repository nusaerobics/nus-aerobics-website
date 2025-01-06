"use client";

import { PageTitle } from "../utils/Titles";
import { useEffect, useState } from "react";

export default function ReservationsPage({ userId }) {
  const [tab, setTab] = useState("schedule");
  const [bookings, setBookings] = useState([]);
  const [waitlists, setWaitlists] = useState([]);

  const [toast, setToast] = useState({});
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch(`/api/bookings?userId=${ userId }`);
        if (!res.ok) {
          throw new Error(
            `Unable to get booked classes for user ${ userId }: ${ res.status }`
          );
        }
        const bookings = await res.json();
        setBookings(bookings);
      } catch (error) {
        setToast({
          isSuccess: false,
          header: "Unable to get bookings",
          message: `Unable to get bookings for user ${ userId }. Try again later.`,
        });
        setShowToast(true);
        console.log(error);
      }
    };
    fetchBookings();

    const fetchWaitlists = async () => {
      try {
        const res = await fetch(`/api/waitlists?userId=${ userId }`);
        if (!res.ok) {
          throw new Error(`Unable to get waitlisted classes for user ${ userId } : ${ res.status }`);
        }
        const waitlists = await res.json();
        setWaitlists(waitlists);
      } catch (error) {
        setToast({
          isSuccess: false,
          header: "Unable to get waitlisted classes",
          message: `Unable to get waitlisted classes. Try again later.`,
        });
        setShowToast(true);
        console.log(error);
      }
    };
    fetchWaitlists();
  }, []);

  return (
    <>
      <div className="w-full h-full flex flex-col gap-y-5 p-5 md:p-10 pt-20 overflow-y-scroll">
        <PageTitle title="Reservations"/>
        <div className="w-full rounded-[20px] border border-a-black/10 bg-white gap-y-2.5">
        </div>
      </div>

    </>
  );
}
