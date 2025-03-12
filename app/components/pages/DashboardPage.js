"use client";

import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@heroui/table";
import ClassCard from "../dashboard/ClassCard";
import { tableClassNames } from "../utils/ClassNames";
import { PageTitle, SectionTitle } from "../utils/Titles";
import Toast from "../Toast";

export default function DashboardPage({ session }) {
  const router = useRouter();

  const [isAdmin, setIsAdmin] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0); // NTH TODO: Need to fix this so that it can be more seamless in rendering after refund/book/deposits occur
  const [bookings, setBookings] = useState([]);
  const [classes, setClasses] = useState([]);
  const [deposits, setDeposits] = useState(0);
  const [creditsUnused, setCreditsUnused] = useState(0);
  const [members, setMembers] = useState(0);
  const [slotsBooked, setSlotsBooked] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [toast, setToast] = useState({});

  const toggleShowToast = () => {
    setShowToast(!showToast);
  };

  useEffect(() => {
    let timer;
    if (showToast) {
      timer = setTimeout(() => {
        setShowToast(false);
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [showToast]);

  useEffect(() => {
    const permission = session.permission;
    setIsAdmin(permission == "admin");
  });

  useEffect(() => {
    if (session.permission == "admin") {
      const fetchClasses = async () => {
        try {
          const res = await fetch("/api/classes?isToday=true");
          if (!res.ok) {
            throw new Error(`Unable to get classes: ${ res.status }`);
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
      const fetchBalance = async () => {
        try {
          const res = await fetch(`/api/users/${ session.userId }`);
          if (!res.ok) {
            throw new Error(
              `Unable to get user ${ session.userId }: ${ res.status }`
            );
          }
          const data = await res.json();
          setBalance(data.balance);
        } catch (error) {
          console.log(error);
        }
      };
      fetchBalance();

      const fetchTransactions = async () => {
        try {
          const res = await fetch(`/api/transactions?userId=${ session.userId }`);
          if (!res.ok) {
            throw new Error(
              `Unable to get transactions for user ${ session.userId }: ${ res.status }`
            );
          }
          const data = await res.json();
          const recentTransactions = data.slice(-5);
          setTransactions(recentTransactions);
        } catch (error) {
          setToast({
            isSuccess: false,
            header: "Unable to get transactions for user",
            message: `Unable to get transactions for user ${ session.userId }. Try again later.`,
          });
          setShowToast(true);
          console.log(error);
        }
      };
      fetchTransactions();

      const fetchBookings = async () => {
        try {
          const res = await fetch(`/api/bookings?userId=${ session.userId }`);
          if (!res.ok) {
            throw new Error(
              `Unable to get bookings for user ${ session.userId }: ${ res.status }`
            );
          }
          const data = await res.json();
          console.log(data);

          const upcomingBookings = data
            .filter((booking) => {
              const classDate = toZonedTime(booking.class.date, "Asia/Singapore");
              const currentDate = toZonedTime(new Date(), "Asia/Singapore");
              return classDate > currentDate;
            })
            .slice(0, 3);
          setBookings(upcomingBookings);
        } catch (error) {
          setToast({
            isSuccess: false,
            header: "Unable to get bookings",
            message: `Unable to get bookings for user ${ session.userId }. Try again later.`,
          });
          setShowToast(true);
          console.log(error);
        }
      };
      fetchBookings();
    }
  }, []);

  const handleClick = (rowData) => {
    router.push(`/dashboard/classes/${ rowData.id }`);
  };

  return (
    <>
      { isAdmin ? (
        <div className="w-full h-full flex flex-col gap-y-5 p-5 md:p-10  pt-20 overflow-y-scroll">
          <PageTitle title="Dashboard"/>
          <div className="h-full flex md:flex-row sm:flex-col gap-x-5 sm:gap-y-5">
            <div
              className="w-full md:w-2/3 flex flex-col p-5 gap-y-2.5 bg-white rounded-[20px] border border-a-black/10">
              <SectionTitle title="Today's classes"/>
              { classes.length == 0 ? (
                <p>No classes today</p>
              ) : (
                <>
                  { classes.map((c) => {
                    return (
                      <div
                        key={ c.id }
                        className="flex flex-col gap-y-2.5 p-2.5 rounded-[20px] border-l-[4px] border-l-a-navy bg-a-navy/10"
                      >
                        <div className="flex flex-col">
                          <p className="font-bold text-base">{ c.name }</p>
                          <p>{ format(c.date, "d/MM/y HH:mm (EEE)") }</p>
                        </div>
                        <div className="flex justify-end">
                          <button
                            onClick={ () => handleClick(c) }
                            className="rounded-[30px] px-[20px] py-[10px] bg-a-navy text-white cursor-pointer"
                          >
                            View details
                          </button>
                        </div>
                      </div>
                    );
                  }) }
                </>
              ) }
            </div>
            <div className="w-full md:w-1/3 flex flex-col gap-y-5">
              <div
                className="md:h-1/4 flex flex-col justify-center p-5 bg-white rounded-[20px] border border-a-black/10">
                <div className="flex flex-row items-end gap-x-1">
                  <p className="font-poppins font-bold text-a-navy md:text-3xl sm:text-2xl">
                    { deposits }
                  </p>
                  <p className="font-bold text-a-navy md:text-xl sm:text-lg">
                    / 3000
                  </p>
                </div>
                <p className="font-poppins text-a-navy md:text-xl sm:text-base">
                  deposits
                </p>
              </div>
              <div
                className="md:h-1/4 flex flex-col justify-center p-5 bg-white rounded-[20px] border border-a-black/10">
                <p className="font-poppins font-bold text-a-navy md:text-3xl sm:text-2xl">
                  { creditsUnused }
                </p>
                <p className="font-poppins text-a-navy md:text-xl sm:text-lg">
                  credits unused
                </p>
              </div>
              <div
                className="md:h-1/4 flex flex-col justify-center p-5 bg-white rounded-[20px] border border-a-black/10">
                <div className="flex flex-row items-end gap-x-1">
                  <p className="font-poppins font-bold text-a-navy md:text-3xl sm:text-2xl">
                    { slotsBooked }
                  </p>
                  <p className="font-bold text-a-navy md:text-xl sm:text-lg">
                    / 2584
                  </p>
                </div>
                <p className="font-poppins text-a-navy md:text-xl sm:text-lg">
                  slots booked
                </p>
              </div>
              <div
                className="md:h-1/4 flex flex-col justify-center p-5 bg-white rounded-[20px] border border-a-black/10">
                <p className="font-poppins font-bold text-a-navy md:text-3xl sm:text-2xl">
                  { members }
                </p>
                <p className="font-poppins text-a-navy md:text-xl sm:text-lg">
                  members
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex flex-col gap-y-5 p-5 md:p-10  pt-20 overflow-y-scroll">
          <PageTitle title="Dashboard"/>
          <div className="h-full flex md:flex-row sm:flex-col gap-x-5 sm:gap-y-5">
            <div
              className="w-full md:w-2/3 flex flex-col p-5 gap-y-2.5 bg-white rounded-[20px] border border-a-black/10">
              <SectionTitle title="Upcoming bookings"/>
              { bookings.length == 0 ? (
                <p>No upcoming bookings</p>
              ) : (
                <>
                  { bookings.map((booking) => {
                    return <ClassCard key={ booking.id } booking={ booking }/>;
                  }) }
                </>
              ) }
            </div>
            <div className="w-full md:w-1/3 flex flex-col gap-y-5">
              <div
                className="md:h-1/4 flex flex-col justify-center p-5 bg-white rounded-[20px] border border-a-black/10">
                <p className="font-poppins font-bold text-a-navy md:text-5xl text-3xl">
                  { balance }
                </p>
                <p className="font-poppins text-a-navy md:text-2xl text-base">
                  credits remaining
                </p>
              </div>
              <div className="md:h-3/4 flex flex-col p-5 bg-white rounded-[20px] border border-a-black/10">
                <SectionTitle title="Recent transactions"/>
                <Table removeWrapper classNames={ tableClassNames }>
                  <TableHeader>
                    <TableColumn>Description</TableColumn>
                    <TableColumn>Amount</TableColumn>
                  </TableHeader>
                  <TableBody>
                    { transactions.map((transaction) => {
                      return (
                        <TableRow key={ transaction.id }>
                          <TableCell>{ transaction.description }</TableCell>
                          <TableCell>{ transaction.amount }</TableCell>
                        </TableRow>
                      );
                    }) }
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      ) }
      { showToast ? (
        <div onClick={ toggleShowToast }>
          <Toast
            isSuccess={ toast.isSuccess }
            header={ toast.header }
            message={ toast.message }
          />
        </div>
      ) : (
        <></>
      ) }
    </>
  );
}

DashboardPage.propTypes = {
  session: PropTypes.object,
};
