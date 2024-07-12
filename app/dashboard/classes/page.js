"use client";

import {
  MdCalendarMonth,
  MdChevronLeft,
  MdChevronRight,
  MdList,
  MdOpenInNew,
} from "react-icons/md";
import { Tabs, Tab } from "@nextui-org/react";
import { PageTitle } from "../../components/Titles";
import { useState } from "react";

export default function Page() {
  const [selected, setSelected] = useState("schedule");
  
  return (
    <div className="w-full h-full flex flex-col gap-y-5">
      <PageTitle title="Classes" />
      <div className="h-full w-full rounded-[20px] border border-a-black/10 bg-white gap-y-2.5">
        {/* NOTE: Might be complicated to make calendar view of calsses */}
        <Tabs
          variant={"underlined"}
          selectedKey={selected}
          onSelectionChange={setSelected}
          classNames={{
            tabList: "gap-5 w-full relative rounded-none mx-5 p-0",
            cursor: "w-full bg-a-black", // Horizontal indicator line
            tab: "max-w-fit px-2.5 h-12",
            tabContent: ["group-data-[selected=true]:text-a-black"], // Content of a tab
          }}
        >
          <Tab
            key="schedule"
            title={
              <div className="flex flex-row items-center gap-x-2">
                <MdCalendarMonth />
                <p className="text-lg">Class schedule</p>
              </div>
            }
          >
            <div>
              <p>Class schedule</p>
            </div>
          </Tab>
          <Tab
            key="booked"
            title={
              <div className="flex flex-row items-center gap-x-2">
                <MdList />
                <p className="text-lg">Booked classes</p>
              </div>
            }
          >
            <div>
              <p>Booked classes</p>
            </div>
          </Tab>
        </Tabs>
        {/* <Tabs>
          <TabList>
            <Tab>
              <div className="flex flex-row gap-x-2.5 items-center">
                <MdCalendarMonth />
                <p className="text-[#393E46]" style={{ cursor: "auto" }}>
                  Class schedule
                </p>
              </div>
            </Tab>
            <Tab>
              <div className="flex flex-row gap-x-2.5 items-center">
                <MdList />
                <p className="ftext-[#393E46]" style={{ cursor: "auto" }}>
                  Booked classes
                </p>
              </div>
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <div className="h-full flex flex-col gap-y-2.5">
                <div className="flex flex-row justify-center items-center gap-x-2.5 text-[#393E46]">
                  <button>
                    <Icon as={MdChevronLeft} boxSize={6} color="" />
                  </button>
                  <p className="font-bold text-2xl">Week 1</p>
                  <button>
                    <Icon as={MdChevronRight} boxSize={6} color="" />
                  </button>
                </div>
                <div className="flex flex-row">
                  <div className="w-1/5 flex flex-row justify-start items-end gap-x-1">
                    <p className="font-bold text-[#393E4650] text-2xl">Mon</p>
                    <p className="text-[#393E4650] text-lg">14/02</p>
                  </div>
                  <div className="w-1/5 flex flex-row justify-start items-end gap-x-1">
                    <p className="font-bold text-[#393E4650] text-2xl">Tue</p>
                    <p className="text-[#393E4650] text-lg">15/02</p>
                  </div>
                  <div className="w-1/5 flex flex-row justify-start items-end gap-x-1">
                    <p className="font-bold text-[#393E4650] text-2xl">Wed</p>
                    <p className="text-[#393E4650] text-lg">16/02</p>
                  </div>
                  <div className="w-1/5 flex flex-row justify-start items-end gap-x-1">
                    <p className="font-bold text-[#393E4650] text-2xl">Thu</p>
                    <p className="text-[#393E4650] text-lg">17/02</p>
                  </div>
                  <div className="w-1/5 flex flex-row justify-start items-end gap-x-1">
                    <p className="font-bold text-[#393E4650] text-2xl">Fri</p>
                    <p className="text-[#393E4650] text-lg">18/02</p>
                  </div>
                </div>
                <div className="flex flex-col gap-y-5">
                  <div className="h-1/3 flex flex-row gap-x-2.5">
                    <div className="w-1/5 flex flex-col bg-[#2A9E2F10] rounded-[20px] border-[#2A9E2F] border-l-[4px] p-2.5">
                      <div className="flex flex-row justify-end">
                        <Icon as={MdOpenInNew} />
                      </div>
                      <p className="text-[#2A9E2F]">Class 1</p>
                      <p>Open for booking</p>
                    </div>
                    <div className="w-1/5 flex flex-col bg-[#2A9E2F10] rounded-[20px] border-[#2A9E2F] border-l-[4px] p-2.5">
                      <div className="flex flex-row justify-end">
                        <Icon as={MdOpenInNew} />
                      </div>
                      <p className="text-[#2A9E2F]">Class 1</p>
                      <p>Open for booking</p>
                    </div>
                    <div className="w-1/5 flex flex-col bg-[#2A9E2F10] rounded-[20px] border-[#2A9E2F] border-l-[4px] p-2.5">
                      <div className="flex flex-row justify-end">
                        <Icon as={MdOpenInNew} />
                      </div>
                      <p className="text-[#2A9E2F]">Class 1</p>
                      <p>Open for booking</p>
                    </div>
                    <div className="w-1/5 flex flex-col bg-[#2A9E2F10] rounded-[20px] border-[#2A9E2F] border-l-[4px] p-2.5">
                      <div className="flex flex-row justify-end">
                        <Icon as={MdOpenInNew} />
                      </div>
                      <p className="text-[#2A9E2F]">Class 1</p>
                      <p>Open for booking</p>
                    </div>
                    <div className="w-1/5 flex flex-col bg-[#2A9E2F10] rounded-[20px] border-[#2A9E2F] border-l-[4px] p-2.5">
                      <div className="flex flex-row justify-end">
                        <Icon as={MdOpenInNew} />
                      </div>
                      <p className="text-[#2A9E2F]">Class 1</p>
                      <p>Open for booking</p>
                    </div>
                  </div>
                  <div className="h-1/3 flex flex-row gap-x-2.5">
                    <div className="w-1/5 flex flex-col bg-[#2A9E2F10] rounded-[20px] border-[#2A9E2F] border-l-[4px] p-2.5">
                      <div className="flex flex-row justify-end">
                        <Icon as={MdOpenInNew} />
                      </div>
                      <p className="text-[#2A9E2F]">Class 1</p>
                      <p>Open for booking</p>
                    </div>
                    <div className="w-1/5 flex flex-col bg-[#2A9E2F10] rounded-[20px] border-[#2A9E2F] border-l-[4px] p-2.5">
                      <div className="flex flex-row justify-end">
                        <Icon as={MdOpenInNew} />
                      </div>
                      <p className="text-[#2A9E2F]">Class 1</p>
                      <p>Open for booking</p>
                    </div>
                    <div className="w-1/5 flex flex-col bg-[#2A9E2F10] rounded-[20px] border-[#2A9E2F] border-l-[4px] p-2.5">
                      <div className="flex flex-row justify-end">
                        <Icon as={MdOpenInNew} />
                      </div>
                      <p className="text-[#2A9E2F]">Class 1</p>
                      <p>Open for booking</p>
                    </div>
                    <div className="w-1/5 flex flex-col bg-[#2A9E2F10] rounded-[20px] border-[#2A9E2F] border-l-[4px] p-2.5">
                      <div className="flex flex-row justify-end">
                        <Icon as={MdOpenInNew} />
                      </div>
                      <p className="text-[#2A9E2F]">Class 1</p>
                      <p>Open for booking</p>
                    </div>
                    <div className="w-1/5 flex flex-col bg-[#2A9E2F10] rounded-[20px] border-[#2A9E2F] border-l-[4px] p-2.5">
                      <div className="flex flex-row justify-end">
                        <Icon as={MdOpenInNew} />
                      </div>
                      <p className="text-[#2A9E2F]">Class 1</p>
                      <p>Open for booking</p>
                    </div>
                  </div>
                  <div className="h-1/3 flex flex-row gap-x-2.5">
                    <div className="w-1/5 flex flex-col bg-[#2A9E2F10] rounded-[20px] border-[#2A9E2F] border-l-[4px] p-2.5">
                      <div className="flex flex-row justify-end">
                        <Icon as={MdOpenInNew} />
                      </div>
                      <p className="text-[#2A9E2F]">Class 1</p>
                      <p>Open for booking</p>
                    </div>
                    <div className="w-1/5 flex flex-col bg-[#2A9E2F10] rounded-[20px] border-[#2A9E2F] border-l-[4px] p-2.5">
                      <div className="flex flex-row justify-end">
                        <Icon as={MdOpenInNew} />
                      </div>
                      <p className="text-[#2A9E2F]">Class 1</p>
                      <p>Open for booking</p>
                    </div>
                    <div className="w-1/5 flex flex-col bg-[#2A9E2F10] rounded-[20px] border-[#2A9E2F] border-l-[4px] p-2.5">
                      <div className="flex flex-row justify-end">
                        <Icon as={MdOpenInNew} />
                      </div>
                      <p className="text-[#2A9E2F]">Class 1</p>
                      <p>Open for booking</p>
                    </div>
                    <div className="w-1/5 flex flex-col bg-[#2A9E2F10] rounded-[20px] border-[#2A9E2F] border-l-[4px] p-2.5">
                      <div className="flex flex-row justify-end">
                        <Icon as={MdOpenInNew} />
                      </div>
                      <p className="text-[#2A9E2F]">Class 1</p>
                      <p>Open for booking</p>
                    </div>
                    <div className="w-1/5 flex flex-col bg-[#2A9E2F10] rounded-[20px] border-[#2A9E2F] border-l-[4px] p-2.5">
                      <div className="flex flex-row justify-end">
                        <Icon as={MdOpenInNew} />
                      </div>
                      <p className="text-[#2A9E2F]">Class 1</p>
                      <p>Open for booking</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabPanel>
            <TabPanel>
              <p>Class list</p>
            </TabPanel>
          </TabPanels>
        </Tabs> */}
      </div>
    </div>
  );
}
