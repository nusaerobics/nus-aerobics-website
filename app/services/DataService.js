"use server";

// Start of Class related functions
export const getClasses = async () => {
  // NOTE: Can't use cache for POST method
  const res = await fetch("/api/classes", { cache: "force-cache" });
  if (!res.ok) {
    throw new Error(`Unable to get all classes: ${res.status}`);
  }
  const data = await res.json();
  return data;
};

export const getClassById = async (id) => {
  const res = await fetch(`/api/classes?id=${id}`);
  if (!res.ok) {
    throw new Error(`Unable to get class ${id}: ${res.status}`);
  }
  const data = await res.json();
  console.log(data);
  return data;
};

export const createClass = async (body) => {
  const res = await fetch("/api/classes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`Unable to create new class: ${res.status}`);
  }
  const data = await res.json();
  return data;
};
// End of Class related functions

// Start of User related functions
export const getUsers = async () => {
  const res = await fetch("/api/users", { cache: "force-cache" });
  const data = await res.json();
  return data;
};

export const getUserById = async (id) => {
  const res = await fetch(`/api/users?id=${id}`);
  if (!res.ok) {
    throw new Error(`Unable to get user ${id}: ${res.status}`);
  }
  const data = await res.json();
  console.log(data);
  return data;
};

export const createUser = async (newUser) => {
  const res = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newUser),
  });

  if (!res.ok) {
    throw new Error(`Unable to create new user: ${res.status}`);
  }
  const data = await res.json();
  return data;
};
// End of User related functions

// Start of Transaction related functions
export const getTransactions = async () => {
  const res = await fetch("/api/transactions", { cache: "force-cache" });
  if (!res.ok) {
    throw new Error(`Unable to get transactions: ${res.status}`);
  }
  const data = await res.json();
  console.log(data);
  return data;
};
// End of Transaction related functions

// Start of Booking related functions
export const getBookings = async () => {
  const res = await fetch("/api/bookings", { cache: "force-cache" });
  if (!res.ok) {
    throw new Error(`Unable to get bookings: ${res.status}`);
  }
  const data = await res.json();
  console.log(data);
  return data;
}

export const getBookingsByClass = async (classId) => {
  const res = await fetch(`/api/bookings?class_id=${classId}`);  // Removed force-cache
  if (!res.ok) {
    throw new Error(`Unable to get bookings by class ${classId}: ${res.status}`);
  }
  const data = await res.json();
  console.log(data);
  return data;
}

export const getBookingsByUser = async (userId) => {
  const res = await fetch(`/api/bookings?user_id=${userId}`);  // Removed force-cache
  if (!res.ok) {
    throw new Error(`Unable to get bookings by user ${userId}: ${res.status}`);
  }
  const data = await res.json();
  console.log(data);
  return data;
}

// End of Booking related functions