/**
 * Form for creating or editing a Class' details, handles creating the new entry or updating existing entry
 * @returns
 */
import PropTypes from "prop-types";

import { Input, DateInput, Switch, Textarea } from "@nextui-org/react";
import { inputClassNames, switchClassNames } from "../ClassNames";
import { useState } from "react";
import { SectionTitle } from "../Titles";

export default function AdminClassForm({
  isCreate, // True or False, to determine whether to POST or UPDATE Class
  inputName,
  inputTime,
  inputCredit,
  inputDescription,
  inputIsOpenBooking,
  inputIsAllowCancel,
}) {
  const [name, setName] = useState(inputName);
  const [time, setTime] = useState();
  const [credit, setCredit] = useState(inputCredit);
  const [description, setDescription] = useState(inputDescription);
  const [isOpenBooking, setIsOpenBooking] = useState(inputIsOpenBooking);
  const [isAllowCancel, setIsAllowCancel] = useState(inputIsAllowCancel);

  function createClass() {
    return;
  }
  function saveEdit() {
    return;
  }

  return (
    <>
      <div className="flex flex-row justify-between">
        <SectionTitle title="Class details" />
        <button
          onClick={isCreate ? createClass : saveEdit}
          className="h-[36px] rounded-[30px] px-[20px] bg-a-navy text-white text-sm" // PREVIOUSLY: py-[10px]
        >
          {isCreate ? "Create class" : "Save changes"}
        </button>
      </div>
      <div className="flex flex-col md:flex-row gap-2.5">
        <div className="md:w-1/3 flex flex-col gap-y-[5px]">
          <p className="text-a-black/50 text-sm">Class name *</p>
          <Input
            value={name}
            onValueChange={setName}
            isRequired
            variant="bordered"
            size="xs"
            classNames={inputClassNames}
          />
        </div>
        <div className="md:w-1/3 flex flex-col gap-y-[5px]">
          <p className="text-a-black/50 text-sm">Time</p>
          {/* TODO: Add Time, not just Date */}
          <DateInput
            value={time}
            onValueChange={setTime}
            isRequired
            classNames={inputClassNames}
          />
        </div>
        <div className="md:w-1/3 flex flex-col gap-y-[5px]">
          {/* TODO: Get rid of this because shouldn't be able to change # credits? All automatically 1 credit */}
          <p className="text-a-black/50 text-sm">Credit *</p>
          <Input
            value={credit}
            onValueChange={setCredit}
            isRequired
            variant="bordered"
            size="xs"
            classNames={inputClassNames}
          />
        </div>
      </div>
      <div className="flex flex-col">
        <Switch
          isSelected={isOpenBooking}
          onValueChange={setIsOpenBooking}
          size="sm"
          className="mb-2.5"
          classNames={switchClassNames}
        >
          Open for booking
        </Switch>
        {/* TODO: Handle cancellation options */}
        <Switch
          isSelected={isAllowCancel}
          onValueChange={setIsAllowCancel}
          size="sm"
          classNames={switchClassNames}
        >
          Allow cancellations
        </Switch>
      </div>
      <div className="flex flex-col gap-y-[5px]">
        <p className="text-a-black/50 text-sm">Description</p>
        <Textarea
          value={description}
          onValueChange={setDescription}
          variant="bordered"
          classNames={{
            label: [
              "text-a-black/50",
              "group-data-[filled-within=true]:text-a-black/50",
            ],
            input: "bg-transparent text-sm text-a-black h-[200px]",
            innerWrapper: [
              "h-[200px]",
              "bg-transparent",
              "hover:bg-transparent",
            ],
            inputWrapper: [
              "bg-transparent",
              "h-[200px]",
              "rounded-[30px]",
              "border-[1px]",
              "border-a-black/10",
              "hover:border-a-black/10",
              "group-data-[focus=true]:border-a-black/10",
              "group-data-[hover=true]:border-a-black/10",
            ],
          }}
        />
      </div>
    </>
  );
}

AdminClassForm.propTypes = {
  inputName: PropTypes.string,
  inputTime: PropTypes.any,
  inputCredit: PropTypes.number,
  inputDescription: PropTypes.string,
  inputIsOpenBooking: PropTypes.bool,
  inputIsAllowCancel: PropTypes.bool,
};
