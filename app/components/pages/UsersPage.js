"use client";

import { useEffect, useState } from "react";
import UsersViewPage from "./UsersViewPage"
import UsersLandingPage from "./UsersLandingPage";

export default function UsersPage({ user }) {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState({});
  const [isViewUser, setIsViewUser] = useState(false);
  const [userBookings, setUserBookings] = useState([]);

  const openView = (rowData) => {
    setSelectedUser(rowData);
    const fetchUserBookings = async () => {
      const res = await fetch(`/api/bookings?userId=${rowData.id}`, {
        cache: "force-cache",
      });
      if (!res.ok) {
        throw new Error(
          `Unable to get bookings for user ${rowData.id}: ${res.status}`
        );
      }
      const data = await res.json();
      setUserBookings(data);
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
    const fetchUsers = async () => {
      const res = await fetch("/api/users", { cache: "force-cache" });
      if (!res.ok) {
        throw new Error(`Unable to get users: ${res.status}`);
      }
      const data = await res.json();
      setUsers(data);
    };
    fetchUsers();
  }, []);

  return (
    <>
      {isViewUser ? (
        <UsersViewPage
          selectedUser={selectedUser}
          closeView={closeView}
          userBookings={userBookings}
        />
      ) : (
        <UsersLandingPage users={users} openView={openView} />
      )}
    </>
  );
}
