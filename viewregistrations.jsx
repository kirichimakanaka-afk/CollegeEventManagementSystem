import React, { useState, useEffect } from "react";
import "./adminmanagement.css";
import { Link } from "react-router-dom";

function ViewRegistrations() {
  const [search, setSearch] = useState("");
  const [registrations, setRegistrations] = useState([]);

  useEffect(() => {
    function loadRegistrations() {
      try {
        const saved = JSON.parse(
          localStorage.getItem("campusRegistrations") || "[]"
        );

        setRegistrations(Array.isArray(saved) ? saved : []);
      } catch {
        setRegistrations([]);
      }
    }

    loadRegistrations();

    window.addEventListener("focus", loadRegistrations);
    window.addEventListener("storage", loadRegistrations);
    window.addEventListener("campusRegistrationsUpdated", loadRegistrations);

    return () => {
      window.removeEventListener("focus", loadRegistrations);
      window.removeEventListener("storage", loadRegistrations);
      window.removeEventListener(
        "campusRegistrationsUpdated",
        loadRegistrations
      );
    };
  }, []);

  const filteredRegistrations = registrations.filter((item) =>
    `${item.student} ${item.email || ""} ${item.event} ${item.status}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="admin-management-page">
      <header className="management-header">
        <div>
          <h1>Event Registrations</h1>
          <p>View student registrations for campus events.</p>
        </div>

        <Link to="/admin" className="management-back">
          Back to Dashboard
        </Link>
      </header>

      <section className="management-summary">
        <h2>Total registrations: {registrations.length}</h2>

        <input
          type="search"
          placeholder="Search student, event or status..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </section>

      <div className="management-table-wrapper">
        <table className="management-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Email</th>
              <th>Event</th>
              <th>Event Date</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredRegistrations.map((item) => (
              <tr key={item.id}>
                <td>{item.student || "Unknown Student"}</td>
                <td>{item.email || "Not provided"}</td>
                <td>{item.event || "Unknown Event"}</td>
                <td>
                  {item.date
                    ? new Date(item.date).toLocaleString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Not specified"}
                </td>
                <td>
                  <span
                    className={
                      item.status === "Confirmed"
                        ? "registration-confirmed"
                        : "registration-pending"
                    }
                  >
                    {item.status || "Pending"}
                  </span>
                </td>
              </tr>
            ))}

            {filteredRegistrations.length === 0 && (
              <tr>
                <td colSpan="5">
                  {search
                    ? "No registrations match your search."
                    : "No registrations yet. Student registrations will appear here."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="management-note">
        Registration records are currently stored in this browser's local
        storage. This is a frontend demo, not a shared database.
      </p>
    </div>
  );
}

export default ViewRegistrations;