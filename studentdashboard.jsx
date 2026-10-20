import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./studentdashboard.css";

function StudentDashboard() {
const [registeredEvents, setRegisteredEvents] = useState([]);

useEffect(() => {
const loadRegisteredEvents = () => {
const savedRegistrations = JSON.parse(
localStorage.getItem("campusRegistrations") || "[]"
);

  // Get events registered by the current demo student
  const myRegistrations = savedRegistrations.filter(
    (registration) =>
      registration.student === "Demo Student"
  );

  setRegisteredEvents(myRegistrations);
};

loadRegisteredEvents();

window.addEventListener(
  "campusRegistrationsUpdated",
  loadRegisteredEvents
);

window.addEventListener("focus", loadRegisteredEvents);

return () => {
  window.removeEventListener(
    "campusRegistrationsUpdated",
    loadRegisteredEvents
  );

  window.removeEventListener("focus", loadRegisteredEvents);
};

}, []);

const today = new Date();
today.setHours(0, 0, 0, 0);

const upcomingEvents = registeredEvents.filter((registration) => {
if (!registration.date) return false;

const eventDate = new Date(registration.date);
return !Number.isNaN(eventDate.getTime()) && eventDate >= today;

});

return (
<div className="student-dashboard">
<aside className="student-sidebar">
<h2>🎓 CampusConnect</h2>
<p>STUDENT PORTAL</p>

    <Link to="/dashboard">My Dashboard</Link>
    <Link to="/events">Browse Events</Link>
    <Link to="/notifications">Notifications 🔔</Link>
    <Link to="/feedback">Feedback 💬</Link>
    <Link to="/login">Logout</Link>
  </aside>

  <main className="student-main">
    <header className="student-header">
      <div>
        <h1>My Events</h1>
        <p>Welcome to your student dashboard!</p>
      </div>
      <div className="student-avatar">S</div>
    </header>

    <section className="student-welcome">
      <h2>Your Campus Journey Starts Here!</h2>
      <p>
        Discover events, connect with fellow students,
        and make the most of your campus experience.
      </p>
      <Link to="/events" className="student-browse-button">
        Browse Events
      </Link>
    </section>

    <section className="student-stats">
      <div className="student-card">
        <span>📅</span>
        <h3>Registered Events</h3>
        <p>{registeredEvents.length}</p>
      </div>

      <div className="student-card">
        <span>⏰</span>
        <h3>Upcoming Events</h3>
        <p>{upcomingEvents.length}</p>
      </div>
    </section>

    <section className="student-panel">
      <h2>My Registered Events</h2>

      {registeredEvents.length === 0 ? (
        <div className="student-empty">
          <span>🗓️</span>
          <h3>No registered events yet</h3>
          <p>
            Once you register for an event, it will appear here.
          </p>
          <Link to="/events" className="student-browse-button">
            Explore Events
          </Link>
        </div>
      ) : (
        <div className="student-registered-list">
          {registeredEvents.map((registration) => (
            <div
              className="student-card"
              key={registration.id}
            >
              <h3>{registration.event}</h3>
              <p>📅 Date: {registration.date || "Not specified"}</p>
              <p>
                Status: {registration.status || "Registered"}
              </p>
              <Link to="/events" className="student-browse-button">
                Browse More Events
              </Link>
            </div>
          ))}
        </div>
      )}
    </section>
  </main>
</div>

);
}

export default StudentDashboard;