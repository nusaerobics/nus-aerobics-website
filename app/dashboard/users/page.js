// TODO: Only accessible from admin access - check if logged in user has admin status
"use client";

import { useEffect, useState } from "react";

import { getBookingsByUser, getUsers } from "../../services/DataService";
import AdminUserViewPage from "../../components/users/AdminUserViewPage";
import AdminUserLandingPage from "../../components/users/AdminUserLandingPage";

export default function Page() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState({});
  const [isViewUser, setIsViewUser] = useState(false);
  const [userBookings, setUserBookings] = useState([]);

  const openView = (rowData) => {
    setSelectedUser(rowData);
    const fetchUserBookings = async () => {
      const userBookingsData = await getBookingsByUser(rowData.id);
      setUserBookings(userBookingsData);
    };
    fetchUserBookings();
    setIsViewUser(true);
  };
  const closeView = () => {
    setSelectedUser({});
    setUserBookings([]);
    setIsViewUser(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      const usersData = await getUsers();
      setUsers(usersData);
    };
    fetchData();
  }, []);

  return (
    <>
      {isViewUser ? (
        <AdminUserViewPage
          selectedUser={selectedUser}
          closeView={closeView}
          userBookings={userBookings}
        />
      ) : (
        <AdminUserLandingPage users={users} openView={openView} />
      )}
    </>
  );
}
