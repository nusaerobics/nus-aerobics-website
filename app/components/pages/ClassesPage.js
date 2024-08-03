"use client";

import PropTypes from "prop-types";
import { useEffect, useState } from "react";

import AdminClassCreatePage from "./AdminClassCreatePage";
import AdminClassLandingPage from "./AdminClassLandingPage";
import UserClassLandingPage from "./UserClassLandingPage";

export default function ClassesPage({ user }) {
  const [isAdmin, setIsAdmin] = useState(false);
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

  return (
    <>
      {isAdmin ? (
        <div className="w-full h-full flex flex-col gap-y-5 p-10 pt-20 overflow-y-scroll">
          {isCreateClass ? (
            <AdminClassCreatePage closeCreate={closeCreate} />
          ) : (
            <AdminClassLandingPage openCreate={openCreate} />
          )}
        </div>
      ) : (
        <UserClassLandingPage
          userId={user.id}
        />
      )}
    </>
  );
}

ClassesPage.propTypes = {
  user: PropTypes.object,
};
