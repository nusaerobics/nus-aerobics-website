import Head from "next/head";
import Layout, { siteTitle } from "../components/layout";
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
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis a justo
          a urna commodo euismod nec sed mauris. In ac laoreet urna. Morbi ac
          arcu nec eros consequat tincidunt a quis enim.
        </p>
        <p>
          (This is a sample website - you’ll be building a site like this in{" "}
          <a href="https://nextjs.org/learn">our Next.js tutorial</a>.)
        </p>
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog</h2>
        <ul className={utilStyles.list}>
          {/* {allPostsData.map(({ id, date, title }) => (
            <li className={utilStyles.listItem} key={id}>
              <Link href={`/posts/${id}`}>{title}</Link>
              <br />
              <small className={utilStyles.lightText}>
                <Date dateString={date} />
              </small>
            </li>
          ))} */}
        </ul>
      </section>
    </Layout>
  );
}

// NOTE: Might have to get user data from getServerSide
// export async function getStaticProps() {
//   // (async () => {
//   //   try {
//   //     // await User.create({
//   //     //   name: "Nara Smith",
//   //     //   email: "narasmith@email.com",
//   //     //   password: "testpassword",
//   //     // });
//   //     const allUsers = await User.findAll();
//   //     console.log("All users: ", allUsers);
//   //   } catch (error) {
//   //     console.error("Error adding dummy data:", error);
//   //   }
//   // })();

//   // const allPostsData = getSortedPostsData();
//   // return {
//   //   props: {
//   //     allPostsData,
//   //   },
//   // };
// }
