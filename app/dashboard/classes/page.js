"use client";

import { useEffect, useState } from "react";
import {
  getBookingsByClass,
  getBookingsByUser,
  getClasses,
} from "../../services/DataService";
import AdminClassViewPage from "../../components/classes/AdminClassViewPage";
import AdminClassCreatePage from "../../components/classes/AdminClassCreatePage";
import AdminClassLandingPage from "../../components/classes/AdminClassLandingPage";
import UserClassLandingPage from "../../components/classes/UserClassLandingPage";

export default function Page() {
  const [classes, setClasses] = useState([]); // All Classes from DB
  const [selectedClass, setSelectedClass] = useState({});

  const [isAdmin, setIsAdmin] = useState(false);
  const [isViewClass, setIsViewClass] = useState(false);
  const [isCreateClass, setIsCreateClass] = useState(false);

  const openView = (rowData) => {
    setSelectedClass(rowData);
    const fetchClassBookings = async () => {
      const classBookingsData = await getBookingsByClass(rowData.id);
      setClassBookings(classBookingsData);
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

  const [userBookings, setUserBookings] = useState([]); // (User) All Bookings from DB of a given User
  const [classBookings, setClassBookings] = useState([]); // (Admin) All Bookings for a given Class
  useEffect(() => {
    const fetchData = async () => {
      const classesData = await getClasses();
      setClasses(classesData);
    };
    fetchData();

    // const fetchUserBookings = async () => {  // TODO: Get the bookings for User signed in
    //   const userBookingsData = await getBookingsByUser(user.id);
    //   setUserBookings(userBookingsData);
    // };
    // fetchUserBookings();
  }, []);

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
        <UserClassLandingPage classes={classes} />
      )}
    </>
  );
}
