import { MdEdit } from "react-icons/md";
import NavBar from "../components/navbar.component";
import { Button, Checkbox, Icon, Input } from "@chakra-ui/react";

const Profile = () => {
  return (
    <div className="h-screen w-screen flex flex-row">
      <NavBar />
      <div className="h-screen w-3/4 flex flex-col p-10 bg-[#FCF0F250] gap-y-5">
        <p>Settings</p>
        <div className="h-1/2 flex flex-col rounded-[20px] border border-[#393E4610] p-5 bg-white gap-y-2.5">
          <div className="flex flex-row items-center gap-x-2.5">
            <p>User details</p>
            <Icon as={MdEdit} />
          </div>
          <div className="w-[265px]">
            <p>Full name</p>
            <Input placeholder="Nara Smith" isReadOnly />
          </div>
          <div className="w-[265px]">
            <p>Username</p>
            <Input placeholder="narasmith" isReadOnly />
          </div>
          <p>Email address</p>
          <div className="flex flex-row gap-x-2.5">
            <div className="w-[265px]">
              <Input placeholder="narasmith@email.com" isReadOnly />
            </div>
            <Checkbox defaultChecked>
              <p> Get email notifications for upcoming classes</p>
            </Checkbox>
          </div>
        </div>
        <div className="h-1/2 flex flex-col rounded-[20px] border border-[#393E4610] p-5 bg-white gap-y-2.5">
          <p>Change password</p>
          <div className="w-[265px]">
            <p>Current password</p>
            <Input isRequired />
          </div>
          <div className="flex flex-row gap-x-2.5">
            <div className="w-[265px]">
              <p>New password</p>
              <Input isRequired />
            </div>
            <div className="w-[265px]">
              <p>Confirm password</p>
              <Input isRequired />
            </div>
          </div>
          <div className="flex flex-row justify-end gap-x-2.5">
            <Button>
              <p>Cancel</p>
            </Button>
            <Button>
              <p>Save changes</p>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
