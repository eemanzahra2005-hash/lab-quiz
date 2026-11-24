// Lab Quiz 01 - Q2: Hospital Appointment System (Frontend logic)

// API key sent with every appointment request (must match API_KEY in .env)
const API_KEY = "lab-quiz-key";

// DOM elements
const form = document.getElementById("appointmentForm");
const doctorSelect = document.getElementById("doctorId");
const tableBody = document.getElementById("appointmentList");
const emptyMsg = document.getElementById("emptyMsg");
const serverError = document.getElementById("serverError");

// Load doctors into the dropdown (GET /doctors)
async function loadDoctors() {
  try {
    const res = await fetch("/doctors");
    const doctors = await res.json();

    doctors.forEach((doctor) => {
      const option = document.createElement("option");
      option.value = doctor.id;
      option.textContent = `${doctor.name} (${doctor.specialization})`;
      doctorSelect.appendChild(option);
    });
  } catch (err) {
    serverError.textContent = "Could not load doctors.";
  }
}

// Load all appointments (GET /appointments)
async function loadAppointments() {
  try {
    const res = await fetch("/appointments", {
      headers: { "x-api-key": API_KEY },
    });
    const appointments = await res.json();

    if (!res.ok) {
      serverError.textContent = appointments.message;
      return;
    }

    tableBody.innerHTML = "";
    appointments.forEach((a) => tableBody.appendChild(createRow(a)));
    updateEmptyMessage();
  } catch (err) {
    serverError.textContent = "Could not load appointments.";
  }
}

// Build one table row with createElement
function createRow(appointment) {
  const row = document.createElement("tr");

  const values = [
    appointment.id,
    appointment.patientName,
    appointment.date,
    appointment.reason || "-",
    appointment.doctor ? appointment.doctor.name : "-",
  ];
  values.forEach((value) => {
    const cell = document.createElement("td");
    cell.textContent = value;
    row.appendChild(cell);
  });

  // Status badge
  const statusCell = document.createElement("td");
  const badge = document.createElement("span");
  badge.className = "badge bg-success";
  badge.textContent = appointment.status;
  statusCell.appendChild(badge);
  row.appendChild(statusCell);

  // Delete button (DELETE /appointments/:id)
  const actionCell = document.createElement("td");
  const deleteBtn = document.createElement("button");
  deleteBtn.className = "btn btn-danger btn-sm";
  deleteBtn.textContent = "Delete";
  deleteBtn.addEventListener("click", () => deleteAppointment(appointment.id, row));
  actionCell.appendChild(deleteBtn);
  row.appendChild(actionCell);

  return row;
}

// Show "No appointments yet." when the table is empty
function updateEmptyMessage() {
  emptyMsg.style.display = tableBody.children.length === 0 ? "block" : "none";
}

// Validation: no empty name, valid date, doctor selected
function validateForm(data) {
  let valid = true;
  ["patientName", "date", "doctorId"].forEach(
    (f) => (document.getElementById(f + "Error").textContent = "")
  );

  if (data.patientName === "") {
    document.getElementById("patientNameError").textContent = "Patient name must not be empty.";
    valid = false;
  }

  if (data.date === "" || isNaN(Date.parse(data.date))) {
    document.getElementById("dateError").textContent = "Please enter a valid date.";
    valid = false;
  }

  if (data.doctorId === "") {
    document.getElementById("doctorIdError").textContent = "Please select a doctor.";
    valid = false;
  }

  return valid;
}

// Book an appointment (POST /appointments) when the form is submitted
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  serverError.textContent = "";

  const data = {
    patientName: document.getElementById("patientName").value.trim(),
    date: document.getElementById("date").value,
    reason: document.getElementById("reason").value.trim(),
    doctorId: doctorSelect.value,
  };

  if (!validateForm(data)) return;

  // Build the request body (reason is optional, doctorId must be a number)
  const body = {
    patientName: data.patientName,
    date: data.date,
    doctorId: Number(data.doctorId),
  };
  if (data.reason !== "") body.reason = data.reason;

  try {
    const res = await fetch("/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": API_KEY },
      body: JSON.stringify(body),
    });
    const result = await res.json();

    if (!res.ok) {
      // Nest sends validation errors as an array of messages
      serverError.textContent = [].concat(result.message).join(", ");
      return;
    }

    tableBody.appendChild(createRow(result));
    updateEmptyMessage();
    form.reset();
  } catch (err) {
    serverError.textContent = "Could not book the appointment.";
  }
});

// Delete an appointment and remove its row from the table
async function deleteAppointment(id, row) {
  try {
    const res = await fetch(`/appointments/${id}`, {
      method: "DELETE",
      headers: { "x-api-key": API_KEY },
    });
    if (!res.ok) {
      const result = await res.json();
      serverError.textContent = result.message;
      return;
    }
    row.remove();
    updateEmptyMessage();
  } catch (err) {
    serverError.textContent = "Could not delete the appointment.";
  }
}

// Run on page load
loadDoctors();
loadAppointments();
