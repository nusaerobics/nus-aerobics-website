"use client";

import {
  MdCalendarMonth,
  MdChevronLeft,
  MdChevronRight,
  MdList,
  MdOpenInBrowser,
  MdOpenInFull,
  MdOpenInNew,
} from "react-icons/md";
// import NavBar from "../components/navbar.component";
import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Icon,
} from "@chakra-ui/react";

export default function Page() {
  return (
    <div className="h-screen w-screen flex flex-row">
      {/* <NavBar /> */}
      <div className="h-screen w-3/4 flex flex-col p-10 bg-[#FCF0F250] gap-y-5">
        <p>Classes</p>
        <div className="h-full w-full rounded-[20px] border border-[#393E4610] bg-white gap-y-2.5">
          <Tabs>
            <TabList>
              <Tab>
                <div className="flex flex-row gap-x-2.5 items-center">
                  <Icon as={MdCalendarMonth} />
                  <p>Class schedule</p>
                </div>
              </Tab>
              <Tab>
                <div className="flex flex-row gap-x-2.5 items-center">
                  <Icon as={MdList} />
                  <p>Booked classes</p>
                </div>
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <div className="flex flex-row justify-center items-center gap-x-2.5">
                  <Icon as={MdChevronLeft} />
                  <p>Week 1</p>
                  <Icon as={MdChevronRight} />
                </div>

                <div className="flex flex-row">
                  <p className="w-1/5">Mon 14/02</p>
                  <p className="w-1/5">Tue 15/02</p>
                  <p className="w-1/5">Wed 16/02</p>
                  <p className="w-1/5">Thu 17/02</p>
                  <p className="w-1/5">Fri 18/02</p>
                </div>

                <div className="h-full flex flex-col gap-y-5">
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
              </TabPanel>
              <TabPanel>
                <p>Class list</p>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
