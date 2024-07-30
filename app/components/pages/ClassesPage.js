"use client";

import { useEffect, useState } from "react";
import AdminClassViewPage from "./AdminClassViewPage";
import AdminClassCreatePage from "./AdminClassCreatePage";
import AdminClassLandingPage from "./AdminClassLandingPage";
import UserClassLandingPage from "./UserClassLandingPage";

export default function ClassesPage({ user }) {
  useEffect(() => {
    const permission = user.permission;
    setIsAdmin(permission == "admin");
  });
  const [isAdmin, setIsAdmin] = useState(false);

  const [classes, setClasses] = useState([]); // (User, Admin) All Classes
  const [userBookings, setUserBookings] = useState([]); // (User) All Bookings of a given User
  const [classBookings, setClassBookings] = useState([]); // (Admin) All Bookings for a given Class
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
      const fetchUserBookings = async () => {
        try {
          const res = await fetch(`/api/bookings?userId=${user.id}`);
          if (!res.ok) {
            throw new Error(
              `Unable to get bookings for user ${user.id}: ${res.status}`
            );
          }
          const data = await res.json();
          setUserBookings(data);
        } catch (error) {
          console.log(error);
        }
      };
      fetchUserBookings();
    }
  }, []);

  const [selectedClass, setSelectedClass] = useState({});
  const [isViewClass, setIsViewClass] = useState(false);
  const [isCreateClass, setIsCreateClass] = useState(false);

  const openView = (rowData) => {
    setSelectedClass(rowData);
    const fetchClassBookings = async () => {
      const res = await fetch(`/api/bookings?classId=${rowData.id}`, {
        cache: "force-cache",
      });
      if (!res.ok) {
        throw new Error(
          `Unable to get bookings for class ${rowData.id}: ${res.status}`
        );
      }
      const data = await res.json();
      setClassBookings(data);
    };
    fetchClassBookings();
    setIsViewClass(true);
  };
  const closeView = () => {
    setIsViewClass(false);
    setSelectedClass({});
  };

  const openCreate = () => {
    setIsCreateClass(true);
  };
  const closeCreate = () => {
    // TODO: Handle saving the data warning
    setIsCreateClass(false);
  };

  return (
    <>
      {isAdmin ? (
        <div className="w-full h-full flex flex-col gap-y-5">
          {isViewClass || isCreateClass ? (
            <>
              {isViewClass ? (
                <AdminClassViewPage
                  closeView={closeView}
                  selectedClass={selectedClass}
                  classBookings={classBookings}
                />
              ) : (
                <AdminClassCreatePage closeCreate={closeCreate} />
              )}
            </>
          ) : (
            <AdminClassLandingPage
              classes={classes}
              openCreate={openCreate}
              openView={openView}
            />
          )}
        </div>
      ) : (
        <UserClassLandingPage
          userId={user.id}
          classes={classes}
          userBookings={userBookings}
        />
      )}
    </>
  );
}
