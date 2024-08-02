"use client";

import PropTypes from "prop-types";
import { useEffect, useState } from "react";

import AdminClassCreatePage from "./AdminClassCreatePage";
import AdminClassLandingPage from "./AdminClassLandingPage";
import UserClassLandingPage from "./UserClassLandingPage";

export default function ClassesPage({ user }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [classes, setClasses] = useState([]); // (User, Admin) All Classes
  const [bookings, setBookings] = useState([]); // (User) All Bookings of a given User
  const [isCreateClass, setIsCreateClass] = useState(false);

  const openCreate = () => {
    setIsCreateClass(true);
  };
  const closeCreate = () => {
    // TODO: Handle saving the data warning
    setIsCreateClass(false);
  };

  useEffect(() => {
    const permission = user.permission;
    setIsAdmin(permission == "admin");
  });
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

    if (!isAdmin) {
      // (User) All Bookings of a given User
      const fetchBookings = async () => {
        try {
          const res = await fetch(`/api/bookings?userId=${user.id}`);
          if (!res.ok) {
            throw new Error(
              `Unable to get bookings for user ${user.id}: ${res.status}`
            );
          }
          const data = await res.json();
          setBookings(data);
        } catch (error) {
          console.log(error);
        }
      };
      fetchBookings();
    }
  }, []);

  return (
    <>
      {isAdmin ? (
        <div className="w-full h-full flex flex-col gap-y-5 p-10 pt-20 overflow-y-scroll">
          {isCreateClass ? (
            <AdminClassCreatePage closeCreate={closeCreate} />
          ) : (
            <AdminClassLandingPage
              // classes={classes}
              openCreate={openCreate}
            />
          )}
        </div>
      ) : (
        <UserClassLandingPage
          userId={user.id}
          classes={classes}
          bookings={bookings}
        />
      )}
    </>
  );
}

ClassesPage.propTypes = {
  user: PropTypes.object,
};
