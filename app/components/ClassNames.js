export const chipClassNames = {
  open: {
    base: ["bg-a-green/10"],
    content: ["text-a-green"],
  },
  full: {
    base: ["bg-a-red/10"],
    content: ["text-a-red"],
  },
  closed: {
    base: ["bg-a-black/10"],
    content: ["text-a-black"],
  },
  booked: {
    base: ["bg-a-navy/10"],
    content: ["text-a-navy"],
  },
};

export const chipTypes = {
  open: {
    message: "Open for booking",
  },
  full: {
    message: "Fully booked",
  },
  closed: {
    message: "Closed for booking",
  },
  booked: {
    message: "Booked",
  },
};

// TODO: Style the placeholder
export const inputClassNames = {
  label: ["text-a-black/50", "group-data-[filled-within=true]:text-a-black/50"],
  input: "bg-transparent text-sm text-a-black",
  innerWrapper: ["bg-transparent", "hover:bg-transparent"],
  inputWrapper: [
    "bg-transparent",
    "rounded-[80px]",
    "border-[1px]",
    "border-a-black/10",
    "hover:border-a-black/10",
    "group-data-[focus=true]:border-a-black/10",
    "group-data-[hover=true]:border-a-black/10",
  ],
};

export const modalClassNames = {
  body: "font-poppins text-a-black", // TODO: Fix because not changing to Poppins font
  backdrop: "bg-a-black/50",
};

export const tableClassNames = {
  th: ["bg-white", "font-normal", "text-a-black/50", "text-sm", "border-b"],
  td: [
    "font-normal",
    "text-a-black",
    "text-sm",
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
