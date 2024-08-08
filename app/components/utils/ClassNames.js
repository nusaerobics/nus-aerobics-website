export const chipClassNames = {
  open: {
    base: ["bg-a-green/10"],
    content: ["text-xs md:text-sm text-a-green"],
  },
  full: {
    base: ["bg-a-red/10"],
    content: ["text-xs md:text-sm text-a-red"],
  },
  closed: {
    base: ["bg-a-black/10"],
    content: ["text-xs md:text-sm text-a-black"],
  },
  booked: {
    base: ["bg-a-navy/10"],
    content: ["text-xs md:text-sm text-a-navy"],
  },
};

export const chipTypes = {
  open: {
    message: "Open",
  },
  full: {
    message: "Full",
  },
  closed: {
    message: "Closed",
  },
  booked: {
    message: "Booked",
  },
};

export const inputClassNames = {
  label: [
    "text-xs md:text-sm text-a-black/50 group-data-[filled-within=true]:text-a-black/50",
  ],
  input: "bg-transparent text-xs md:text-sm text-a-black",
  innerWrapper: ["bg-transparent", "hover:bg-transparent"],
  inputWrapper: [
    "bg-transparent",
    "rounded-[30px]",
    "border-[1px]",
    "border-a-black/10",
    "hover:border-a-black/10",
    "group-data-[focus=true]:border-a-black/10",
    "group-data-[hover=true]:border-a-black/10",
  ],
};

export const modalClassNames = {
  body: "text-a-black",
  backdrop: "bg-a-black/50",
};

export const switchClassNames = {
  label: ["text-a-black text-sm"],
};

export const tableClassNames = {
  th: ["bg-white", "font-normal", "text-a-black/50", "text-xs md:text-sm", "border-b"],
  td: [
    "font-normal",
    "trunate",
    "text-a-black",
    "text-xs md:text-sm",
    // changing the rows border radius
    // first
    "group-data-[first=true]:first:before:rounded-none",
    "group-data-[first=true]:last:before:rounded-none",
    // middle
    "group-data-[middle=true]:before:rounded-none",
    // last
    "group-data-[last=true]:first:before:rounded-none",
    "group-data-[last=true]:last:before:rounded-none",
  ],
};

export const tabsClassNames = {
  tabList: "gap-5 w-full relative rounded-none mx-2.5 p-0",
  cursor: "w-full bg-a-black", // Horizontal indicator line
  tab: "max-w-fit px-2.5 h-12",
  tabContent: ["group-data-[selected=true]:text-a-black"], // Content of a tab
};
