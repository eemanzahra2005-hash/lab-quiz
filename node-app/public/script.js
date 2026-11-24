// Lab Quiz 01 - Q1: Event Registration Manager (Frontend logic)

const API_URL = "/attendees";

// Local copy of the attendees list
let attendees = [];

// DOM elements
const form = document.getElementById("attendeeForm");
const list = document.getElementById("attendeeList");
const emptyMsg = document.getElementById("emptyMsg");
const totalRevenueEl = document.getElementById("totalRevenue");
const serverError = document.getElementById("serverError");

// Load attendees from the server (GET) on page load
async function loadAttendees() {
  try {
    const res = await fetch(API_URL);
    attendees = await res.json();
    renderAttendees();
  } catch (err) {
    serverError.textContent = "Could not load attendees.";
  }
}

// Calculate total revenue with reduce(), destructuring and the spread operator
function updateTotalRevenue() {
  const copy = [...attendees]; // copy the array with spread
  const total = copy.reduce((sum, { ticketPrice }) => sum + ticketPrice, 0);
  totalRevenueEl.textContent = total;
}

// Build one Bootstrap card for an attendee using createElement
function createAttendeeCard(attendee) {
  const col = document.createElement("div");
  col.className = "col-12 col-sm-6 col-xl-4";

  const card = document.createElement("div");
  card.className = "card attendee-card shadow-sm h-100";

  const body = document.createElement("div");
  body.className = "card-body d-flex flex-column";

  const title = document.createElement("h5");
  title.className = "card-title";
  title.textContent = attendee.name;

  const eventText = document.createElement("p");
  eventText.className = "card-text mb-1";
  eventText.textContent = "Event: " + attendee.event;

  const typeBadge = document.createElement("span");
  typeBadge.className = "badge bg-info text-dark align-self-start mb-2";
  typeBadge.textContent = attendee.ticketType;

  const price = document.createElement("p");
  price.className = "card-text fw-bold";
  price.textContent = "Rs. " + attendee.ticketPrice;

  // Delete button removes the attendee (DELETE)
  const deleteBtn = document.createElement("button");
  deleteBtn.className = "btn btn-danger btn-sm mt-auto";
  deleteBtn.textContent = "Delete";
  deleteBtn.addEventListener("click", () => deleteAttendee(attendee.id));

  body.append(title, eventText, typeBadge, price, deleteBtn);
  card.appendChild(body);
  col.appendChild(card);
  return col;
}

// Render all attendees and refresh the total
function renderAttendees() {
  list.innerHTML = "";
  attendees.forEach((a) => list.appendChild(createAttendeeCard(a)));
  emptyMsg.style.display = attendees.length === 0 ? "block" : "none";
  updateTotalRevenue();
}

// Basic validation: no empty fields, price must be positive
function validateForm(data) {
  let valid = true;
  const fields = ["name", "event", "ticketType", "ticketPrice"];

  // Clear old messages
  fields.forEach((f) => (document.getElementById(f + "Error").textContent = ""));

  fields.forEach((f) => {
    if (data[f] === "") {
      document.getElementById(f + "Error").textContent = "This field is required.";
      valid = false;
    }
  });

  if (data.ticketPrice !== "" && Number(data.ticketPrice) <= 0) {
    document.getElementById("ticketPriceError").textContent = "Price must be a positive number.";
    valid = false;
  }

  return valid;
}

// Add a new attendee (POST) when the form is submitted
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  serverError.textContent = "";

  const data = {
    name: document.getElementById("name").value.trim(),
    event: document.getElementById("event").value.trim(),
    ticketType: document.getElementById("ticketType").value,
    ticketPrice: document.getElementById("ticketPrice").value.trim(),
  };

  if (!validateForm(data)) return;

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, ticketPrice: Number(data.ticketPrice) }),
    });
    const result = await res.json();

    if (!res.ok) {
      serverError.textContent = result.error;
      return;
    }

    attendees.push(result);
    renderAttendees();
    form.reset();
  } catch (err) {
    serverError.textContent = "Could not add attendee.";
  }
});

// Delete an attendee by id (DELETE) and update the DOM
async function deleteAttendee(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) {
      serverError.textContent = "Attendee not found.";
      return;
    }
    attendees = attendees.filter((a) => a.id !== id);
    renderAttendees();
  } catch (err) {
    serverError.textContent = "Could not delete attendee.";
  }
}

// Run on page load
loadAttendees();
