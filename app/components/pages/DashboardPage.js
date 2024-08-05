"use client";

import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import ClassCard from "../dashboard/ClassCard";
import { tableClassNames } from "../utils/ClassNames";
import { PageTitle, SectionTitle } from "../utils/Titles";

import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { fromZonedTime, toZonedTime } from "date-fns-tz";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import Toast from "../Toast";

export default function DashboardPage({ session }) {
  const router = useRouter();

  const [isAdmin, setIsAdmin] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0); // NTH TODO: Need to fix this so that it can be more seamless in rendering after refund/book/deposits occur
  const [bookings, setBookings] = useState([]);
  const [classes, setClasses] = useState([]);
  const [deposits, setDeposits] = useState(0); // Total number of Transaction amounts which are deposits
  const [creditsUnused, setCreditsUnused] = useState(0);
  const [members, setMembers] = useState(0); // Total number of Users
  const [slotsBooked, setSlotsBooked] = useState(0); // Total number of Bookings
  const [showToast, setShowToast] = useState(false);
  const [toast, setToast] = useState({});

  const toggleShowToast = () => {
    setShowToast(!showToast);
  };

  useEffect(() => {
    // NOTE: Doing this so that the balance can be updated
    const permission = session.permission;
    setIsAdmin(permission == "admin");

    const fetchBalance = async () => {
      try {
        const res = await fetch(`/api/users?id=${session.userId}`);
        if (!res.ok) {
          throw new Error(
            `Unable to get user ${session.userId}: ${res.status}`
          );
        }
        const data = await res.json();
        setBalance(data.balance);
      } catch (error) {
        setToast({
          isSuccess: false,
          header: "Unable to get user",
          message: `Unable to get user ${session.userId}. Try again later.`,
        });
        setShowToast(true);
        console.log(error);
      }
    };
    fetchBalance();
  }, []);

  useEffect(() => {
    if (session.permission == "admin") {
      const fetchClasses = async () => {
        try {
          const res = await fetch("/api/classes?isToday=true");
          if (!res.ok) {
            throw new Error(`Unable to get classes: ${res.status}`);
          }
          const data = await res.json();
          setClasses(data);
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

      const countDeposits = async () => {
        try {
          const res = await fetch("/api/transactions?isCount=true");
          if (!res.ok) {
            throw new Error("Unable to count deposits.");
          }
          const data = await res.json();
          setDeposits(data);
        } catch (error) {
          setToast({
            isSuccess: false,
            header: "Unable to count deposits",
            message: `Unable to count deposits. Try again later.`,
          });
          setShowToast(true);
          console.log(error);
        }
      };
      countDeposits();

      const countMembers = async () => {
        try {
          const res = await fetch("/api/users?isCountUsers=true");
          if (!res.ok) {
            throw new Error("Unable to count members.");
          }
          const data = await res.json();
          setMembers(data);
        } catch (error) {
          setToast({
            isSuccess: false,
            header: "Unable to count members",
            message: `Unable to count members. Try again later.`,
          });
          setShowToast(true);
          console.log(error);
        }
      };
      countMembers();

      const countCreditsUnused = async () => {
        try {
          const res = await fetch("/api/users?isCountCredits=true");
          if (!res.ok) {
            throw new Error("Unable to count users' credits.");
          }
          const data = await res.json();
          setCreditsUnused(data);
        } catch (error) {
          setToast({
            isSuccess: false,
            header: "Unable to count users' credits",
            message: `Unable to count users' credits. Try again later.`,
          });
          setShowToast(true);
          console.log(error);
        }
      };
      countCreditsUnused();

      const countSlotsBooked = async () => {
        try {
          const res = await fetch("api/bookings?isCount=true");
          if (!res.ok) {
            throw new Error("Unable to count bookings.");
          }
          const data = await res.json();
          setSlotsBooked(data);
        } catch (error) {
          setToast({
            isSuccess: false,
            header: "Unable to count bookings",
            message: `Unable to count bookings. Try again later.`,
          });
          setShowToast(true);
          console.log(error);
        }
      };
      countSlotsBooked();
    } else {
      const fetchTransactions = async () => {
        try {
          const res = await fetch(`/api/transactions?userId=${session.userId}`);
          if (!res.ok) {
            throw new Error(
              `Unable to get transactions for user ${session.userId}: ${res.status}`
            );
          }
          const data = await res.json();
          const recentTransactions = data.slice(-5);
          setTransactions(recentTransactions);
        } catch (error) {
          setToast({
            isSuccess: false,
            header: "Unable to get transactions for user",
            message: `Unable to get transactions for user ${session.userId}. Try again later.`,
          });
          setShowToast(true);
          console.log(error);
        }
      };
      fetchTransactions();

      const fetchBookings = async () => {
        try {
          const res = await fetch(`/api/bookings?userId=${session.userId}`);
          if (!res.ok) {
            throw new Error(
              `Unable to get bookings for user ${session.userId}: ${res.status}`
            );
          }
          const data = await res.json();
          console.log(data);

          const upcomingBookings = data
            .filter((booking) => {
              const utcClassDate = fromZonedTime(
                booking.class.date,
                "Asia/Singapore"
              );
              const sgClassDate = toZonedTime(utcClassDate, "Asia/Singapore");
              const sgCurrentDate = toZonedTime(new Date(), "Asia/Singapore");
              return sgClassDate >= sgCurrentDate;
            })
            .slice(0, 3);
          setBookings(upcomingBookings);
        } catch (error) {
          setToast({
            isSuccess: false,
            header: "Unable to get bookings",
            message: `Unable to get bookings for user ${session.userId}. Try again later.`,
          });
          setShowToast(true);
          console.log(error);
        }
      };
      fetchBookings();
    }
  }, []);

  const handleClick = (rowData) => {
    router.push(`/dashboard/classes/${rowData.id}`);
  };

  return (
    <>
      {isAdmin ? (
        <div className="w-full h-full flex flex-col gap-y-5 p-10 pt-20 overflow-y-scroll">
          {/* TODO: This page should be under app/page.js probably */}
          <PageTitle title="Dashboard" />
          <div className="h-full flex flex-row gap-x-5">
            <div className="h-full w-2/3 flex flex-col p-5 gap-y-2.5 bg-white rounded-[20px] border border-a-black/10">
              <SectionTitle title="Today's classes" />
              {classes.length == 0 ? (
                <p>No classes today</p>
              ) : (
                <>
                  {classes.map((c) => {
                    return (
                      <div
                        key={c.id}
                        className="flex flex-col gap-y-2.5 p-2.5 rounded-[20px] border-l-[4px] border-l-a-navy bg-a-navy/10"
                      >
                        <div className="flex flex-col">
                          <p className="font-bold text-base">{c.name}</p>
                          <p>{format(c.date, "d/MM/y HH:mm (EEE)")}</p>
                        </div>
                        <div className="flex justify-end">
                          <button
                            onClick={() => handleClick(c)}
                            className="rounded-[30px] px-[20px] py-[10px] bg-a-navy text-white cursor-pointer"
                          >
                            View details
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
            <div className="h-full w-1/3 flex flex-col gap-y-5">
              <div className="h-1/4 flex flex-col justify-center p-5 bg-white rounded-[20px] border border-a-black/10">
                <div className="flex flex-row items-end gap-x-1">
                  <p className="font-poppins font-bold text-a-navy text-3xl">
                    {deposits}
                  </p>
                  <p className="font-bold text-a-navy text-xl">/ 3000</p>
                </div>
                <p className="font-poppins text-a-navy text-xl">deposits</p>
              </div>
              <div className="h-1/4 flex flex-col justify-center p-5 bg-white rounded-[20px] border border-a-black/10">
                <p className="font-poppins font-bold text-a-navy text-3xl">
                  {creditsUnused}
                </p>
                <p className="font-poppins text-a-navy text-xl">
                  credits unused
                </p>
              </div>
              <div className="h-1/4 flex flex-col justify-center p-5 bg-white rounded-[20px] border border-a-black/10">
                <div className="flex flex-row items-end gap-x-1">
                  <p className="font-poppins font-bold text-a-navy text-3xl">
                    {slotsBooked}
                  </p>
                  <p className="font-bold text-a-navy text-xl">/ 2850</p>
                </div>
                <p className="font-poppins text-a-navy text-xl">slots booked</p>
              </div>
              <div className="h-1/4 flex flex-col justify-center p-5 bg-white rounded-[20px] border border-a-black/10">
                <p className="font-poppins font-bold text-a-navy text-3xl">
                  {members}
                </p>
                <p className="font-poppins text-a-navy text-xl">members</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-full flex flex-col gap-y-5 p-10 pt-20 overflow-y-scroll">
          <PageTitle title="Dashboard" />
          <div className="h-full flex flex-row gap-x-5">
            <div className="h-full w-2/3 flex flex-col p-5 gap-y-2.5 bg-white rounded-[20px] border border-a-black/10">
              <SectionTitle title="Upcoming classes" />
              {bookings.map((booking) => {
                return <ClassCard key={booking.id} booking={booking} />;
              })}
            </div>
            <div className="h-full w-1/3 flex flex-col gap-y-5">
              <div className="h-1/4 flex flex-col justify-center p-5 bg-white rounded-[20px] border border-a-black/10">
                <p className="font-poppins font-bold text-a-navy text-5xl">
                  {balance}
                </p>
                <p className="font-poppins text-a-navy text-2xl">
                  credits remaining
                </p>
              </div>
              <div className="h-3/4 flex flex-col p-5 bg-white rounded-[20px] border border-a-black/10">
                <SectionTitle title="Recent transactions" />
                <Table removeWrapper classNames={tableClassNames}>
                  <TableHeader>
                    <TableColumn>Description</TableColumn>
                    <TableColumn>Amount</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => {
                      return (
                        <TableRow key={transaction.id}>
                          <TableCell>{transaction.description}</TableCell>
                          <TableCell>{transaction.amount}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      )}
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

DashboardPage.propTypes = {
  session: PropTypes.object,
};
