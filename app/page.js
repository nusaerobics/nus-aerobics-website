"use client";

import Head from "next/head";
import Layout, { siteTitle } from "./layout";
import utilStyles from "../styles/utils.module.css";
import { useEffect, useState } from "react";

export default function Home({}) {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch("/api/users");
      const data = await res.json();
      setUsers(data);
    };
    fetchUsers();
  }, []);

  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              {user.name} - {user.email}
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  );
}
