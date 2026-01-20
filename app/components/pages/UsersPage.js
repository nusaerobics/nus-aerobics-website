"use client";

import { useEffect, useMemo, useState } from "react";

import { useRouter } from "next/navigation";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Input } from "@heroui/input";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Pagination, Spinner } from "@heroui/react";
import { MdMoreVert } from "react-icons/md";
import {
  inputClassNames,
  modalClassNames,
  tableClassNames,
} from "../utils/ClassNames";
import { PageTitle, SectionTitle } from "../utils/Titles";
import Toast from "../Toast";

export default function UsersPage() {
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [toast, setToast] = useState({});
  const [credits, setCredits] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [csv, setCsv] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch("/api/users");
      if (!res.ok) {
        throw new Error(`Unable to get users: ${ res.status }`);
      }
      const data = await res.json();
      setUsers(data);
    };
    fetchUsers();
  }, []);

  const rowsPerPage = 10;
  const userPages = useMemo(() => {
    if (searchInput != "") {
      const usersSearch = users.filter((user) => {
        const userName = user.name.toLowerCase();
        const searchValue = searchInput.toLowerCase();
        return userName.includes(searchValue);
      });
      return Math.ceil(usersSearch.length / rowsPerPage);
    }
    return Math.ceil(users.length / rowsPerPage);
  }, [users, searchInput]);
  const userItems = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    if (searchInput != "") {
      const usersSearch = users.filter((user) => {
        const userName = user.name.toLowerCase();
        const userEmail = user.email.toLowerCase();
        const searchValue = searchInput.toLowerCase();
        return (
          userName.includes(searchValue) || userEmail.includes(searchValue)
        );
      });
      return usersSearch.slice(start, end);
    }
    return users.slice(start, end);
  }, [page, users, searchInput]);

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

  const [modalType, setModalType] = useState("individual");  // individual = credit acc, multiple = credit accs
  const selectRow = (rowData) => {
    setSelectedUser(rowData);
  };
  const handleDropdown = (key) => {
    switch (key) {
      case "view":
        return router.push(`users/${ selectedUser.id }`);
      case "credit":
        setModalType("individual");
        return onOpen();
      case "delete":
        return deleteUser(selectedUser);
    }
  };

  const handleCreditUsers = () => {
    setModalType("multiple");
    return onOpen();
  }
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const rows = text.split("\n").map((row) => row.split(','));
      setCsv(rows);
    }
    reader.readAsText(file);
  }

  async function creditUser() {
    setModalType("loading");
    try {
      const newBalance = parseInt(selectedUser.balance) + parseInt(credits);
      const res = await fetch(`/api/users/${ selectedUser.id }`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: credits }),
      });

      if (!res.ok) {
        setToast({
          isSuccess: false,
          header: "Unable to credit user",
          message: `Unable to credit ${ selectedUser.name }'s account. Try again later.`,
        });
        setShowToast(true);
        throw new Error(`Unable to credit user ${ selectedUser.id }`);
      }

      // Update users
      const updatedUsers = users.map((originalUser) => {
        if (originalUser.id == selectedUser.id) {
          return { ...originalUser, balance: newBalance };
        }
        return originalUser;
      });
      setUsers(updatedUsers);

      setToast({
        isSuccess: true,
        header: "Credited user",
        message: `Successfully credited ${ selectedUser.name }'s account.`,
      });
      setShowToast(true);
    } catch (error) {
      setToast({
        isSuccess: false,
        header: "Unable to credit user",
        message: `An error occurred while credit ${ selectedUser.name }'s account. Try again later.`, // error.message
      });
      setToast("result");
      console.log(error);
    }
  }

  async function creditUsers() {
    await setModalType("loading");
    const credited = [];
    const uncredited = [];

    for (let i = 1; i < csv.length; i++) {
      const row = csv[i];
      const submissionId = row[0];
      const status = row[25];
      if (status === "Approved") {
        try {
          const name = row[4];
          const email = row[3];
          const totalCredits = parseInt(row[21]) + (parseInt(row[22]) * 5) + (parseInt(row[23]) * 10);

          const res = await fetch("/api/submissions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              submissionId: submissionId,
              name: name,
              email: email.toLowerCase(),
              totalCredits: totalCredits,
            })
          })

          if (!res.ok) {
            const response = await res.json();
            uncredited.push({ id: submissionId, result: `${ response.error }` });
          } else {
            credited.push({ id: submissionId });
          }
        } catch (error) {
          console.log(error);
        }
      } else {
        uncredited.push({ id: submissionId, result: "Pending approval." });
      }
    }

    await setCreditedSubmissions(credited);
    await setUncreditedSubmissions(uncredited);

    setModalType("save");
  }

  const [creditedSubmissions, setCreditedSubmissions] = useState([]);
  const [uncreditedSubmissions, setUncreditedSubmissions] = useState([]);


  function downloadResults() {
    const link = document.createElement("a");
    let list = `Credited submissions (${ creditedSubmissions.length }):\n`;
    creditedSubmissions.forEach((submission) => list += `${ submission.id }\n`);

    list += `Uncredited submissions (${ uncreditedSubmissions.length }):\n`;
    uncreditedSubmissions.forEach((submission) => list += `${ submission.id } ${ submission.result } \n`);

    const creditedFile = new Blob([list], { type: 'text/plain' });
    link.href = URL.createObjectURL(creditedFile);
    link.download = `credited.txt`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  async function deleteUser(selectedUser) {
    try {
      const res = await fetch(`/api/users/${ selectedUser.id }`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        const response = await res.json();
        throw new Error(`${ response.error }`);
      }

      const updatedUsers = users.filter((originalUser) => {
        return originalUser.id != selectedUser.id;
      });
      setUsers(updatedUsers);
      setToast({
        isSuccess: true,
        header: "Deleted user",
        message: `Successfully deleted ${ selectedUser.name }'s account.`,
      });
      setShowToast(true);
    } catch (error) {
      setToast({
        isSuccess: false,
        header: "Unable to delete user",
        message: `Unable to delete ${ selectedUser.name }'s account. Try again later.`,
      });
      setShowToast(true);
      console.log(error);
    }
  }

  return (
    <>
      <div className="w-full h-full flex flex-col gap-y-5 p-5 md:p-10  pt-20 overflow-y-scroll">
        <div className="flex flex-row items-center justify-between">
          <PageTitle title="Users"/>
          <button
            onClick={ handleCreditUsers }
            className="h-[36px] rounded-[30px] px-[20px] bg-a-navy text-white text-sm cursor-pointer"
          >
            Credit users
          </button>
        </div>

        <div className="flex flex-col rounded-[20px] border border-a-black/10 p-5 bg-white gap-y-2.5">
          <div className="md:self-end md:w-1/4">
            <Input
              placeholder="Search"
              value={ searchInput }
              onValueChange={ setSearchInput }
              variant="bordered"
              size="xs"
              classNames={ inputClassNames }
            />
          </div>
          <div className="overflow-x-scroll">
            <Table removeWrapper classNames={ tableClassNames }>
              <TableHeader>
                <TableColumn>Name</TableColumn>
                <TableColumn>Status</TableColumn>
                <TableColumn>Email</TableColumn>
                <TableColumn>Wallet</TableColumn>
                <TableColumn></TableColumn>
              </TableHeader>
              <TableBody>
                { userItems.map((user) => {
                  return (
                    <TableRow key={ user.id }>
                      <TableCell>{ user.name }</TableCell>
                      <TableCell>{ user.permission }</TableCell>
                      <TableCell>{ user.email }</TableCell>
                      <TableCell>{ user.balance }</TableCell>
                      <TableCell>
                        <Dropdown>
                          <DropdownTrigger>
                            <button
                              className="cursor-pointer"
                              onClick={ () => selectRow(user) }
                            >
                              <MdMoreVert size={ 24 }/>
                            </button>
                          </DropdownTrigger>
                          <DropdownMenu onAction={ (key) => handleDropdown(key) }>
                            <DropdownItem key="view">View user</DropdownItem>
                            <DropdownItem key="credit">
                              Credit user
                            </DropdownItem>
                            <DropdownItem key="delete">
                              Delete user
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </TableCell>
                    </TableRow>
                  );
                }) }
              </TableBody>
            </Table>
          </div>
          <div className="flex flex-row justify-center">
            { userPages > 1 && (
              <Pagination
                showControls
                isCompact
                color="primary"
                size="sm"
                loop={ true }
                page={ page }
                total={ userPages }
                onChange={ (page) => setPage(page) }
              />) }
          </div>
        </div>
      </div>
      <Modal
        isOpen={ isOpen }
        onOpenChange={ onOpenChange }
        size="md"
        backdrop="opaque"
        classNames={ modalClassNames }
      >
        { modalType === "multiple" &&
          (<ModalContent>
            { (onClose) => (
              <>
                <ModalHeader>
                  <div className="flex flex-row items-center gap-x-2.5">
                    <SectionTitle title="Credit users"/>
                  </div>
                </ModalHeader>
                <ModalBody>
                  <div className="flex flex-col gap-y-[5px]">
                    <p className="text-a-black/50 text-sm">
                      Upload CSV file *
                    </p>
                    <div className="md:w-1/3">
                      <input
                        type="file"
                        onChange={ handleFileUpload }
                        accept=".csv"/>
                    </div>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <button
                    onClick={ creditUsers }
                    className="rounded-[30px] px-[20px] py-[10px] bg-a-navy text-white cursor-pointer"
                  >
                    Credit
                  </button>
                </ModalFooter>
              </>
            ) }
          </ModalContent>) }
        { modalType === "individual" && (
          <ModalContent>
            { (onClose) => (
              <>
                <ModalHeader>
                  <div className="flex flex-row items-center gap-x-2.5">
                    <SectionTitle title="Credit user"/>
                  </div>
                </ModalHeader>
                <ModalBody>
                  <div className="flex flex-col gap-y-[5px]">
                    <p className="text-a-black/50 text-sm">
                      Enter number of credits *
                    </p>
                    <div className="md:w-1/3">
                      <Input
                        type="number"
                        value={ credits }
                        onValueChange={ setCredits }
                        isRequired
                        variant="bordered"
                        size="xs"
                        classNames={ inputClassNames }
                      />
                    </div>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <button
                    onClick={ creditUser }
                    className="rounded-[30px] px-[20px] py-[10px] bg-a-navy text-white cursor-pointer"
                  >
                    Credit
                  </button>
                </ModalFooter>
              </>
            ) }
          </ModalContent>) }
        { modalType === "loading" && (
          <ModalContent>
            { (onClose) => (
              <>
                <ModalBody>
                  <div className="flex flex-col items-center justify-center gap-y-5 p-20">
                    <Spinner color="primary" size="lg"/>
                    <p className="text-a-black text-sm md:text-base">Crediting user(s)...</p>
                  </div>
                </ModalBody>
              </>)
            }
          </ModalContent>
        ) }
        { (modalType === "save") && (
          <ModalContent>
            { (onClose) => (
              <>
                <ModalBody>
                  <div className="flex flex-col items-center justify-center gap-y-2.5 p-5 md:p-10">

                    <button
                      onClick={ downloadResults }
                      className="h-[36px] rounded-[30px] px-[20px] bg-a-navy text-white text-sm cursor-pointer"
                    >
                      Download results
                    </button>
                  </div>
                </ModalBody>
              </>) }
          </ModalContent>
        ) }
      </Modal>
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
