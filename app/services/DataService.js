// Start of Class related functions
export const getClasses = async () => {
  const res = await fetch("/api/classes");
  const data = await res.json();
  return data;
}

export const createClass = async (body) => {
  const res = await fetch("/api/classes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    throw new Error(`Unable to create new class: ${res.status}`);
  }
  const data = await res.json();
  return data;
}
// End of Class related functions

// Start of User related functions
export const getUsers = async () => {
  const res = await fetch("/api/users");
  const data = await res.json();
  return data;
}

export const createUser = async (body) => {
  const res = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    throw new Error(`Unable to create new user: ${res.status}`);
  }
  const data = await res.json();
  return data;
}
// End of User related functions