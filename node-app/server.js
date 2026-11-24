// Submitted by: Eeman Zahra | Roll No: ___ | BSCS-V-C
// Lab Quiz 01 - Q1: Event Registration Manager (Backend)

const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, "data", "attendees.json");

// Middleware: parse JSON request bodies
app.use(express.json());

// Middleware: serve the frontend from the public folder
app.use(express.static(path.join(__dirname, "public")));

// Helper: read attendees from the JSON file
function readAttendees() {
  const data = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(data);
}

// Helper: write attendees to the JSON file
function writeAttendees(attendees) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(attendees, null, 2));
}

// GET /attendees - return all attendees
app.get("/attendees", (req, res) => {
  const attendees = readAttendees();
  res.status(200).json(attendees);
});

// POST /attendees - validate and add a new attendee
app.post("/attendees", (req, res) => {
  const { name, event, ticketType, ticketPrice } = req.body || {};

  // Validation: text fields must not be empty
  if (!name || !String(name).trim() || !event || !String(event).trim() || !ticketType || !String(ticketType).trim()) {
    return res.status(400).json({ error: "name, event and ticketType must not be empty" });
  }

  // Validation: ticketPrice must be a positive number
  const price = Number(ticketPrice);
  if (ticketPrice === "" || ticketPrice === null || isNaN(price) || price <= 0) {
    return res.status(400).json({ error: "ticketPrice must be a positive number" });
  }

  const attendees = readAttendees();

  // New id = max id + 1 (or 1 if the list is empty)
  const newId = attendees.length > 0 ? Math.max(...attendees.map((a) => a.id)) + 1 : 1;

  const newAttendee = {
    id: newId,
    name: String(name).trim(),
    event: String(event).trim(),
    ticketType: String(ticketType).trim(),
    ticketPrice: price,
  };

  attendees.push(newAttendee);
  writeAttendees(attendees);
  res.status(201).json(newAttendee);
});

// DELETE /attendees/:id - remove an attendee by id
app.delete("/attendees/:id", (req, res) => {
  const id = Number(req.params.id);
  const attendees = readAttendees();
  const index = attendees.findIndex((a) => a.id === id);

  // Not found -> 404
  if (index === -1) {
    return res.status(404).json({ error: "Attendee not found" });
  }

  const [deleted] = attendees.splice(index, 1);
  writeAttendees(attendees);
  res.status(200).json(deleted);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
