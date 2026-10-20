import React from "react";
import "./admindashboard.css";
import { Link } from "react-router-dom";

function AdminDashboard() {
const stats = [
{ icon: "👨‍🎓", title: "Total Students", value: "250" },
{ icon: "📅", title: "Total Events", value: "12" },
{ icon: "📝", title: "Registrations", value: "180" },
{ icon: "⏳", title: "Pending Requests", value: "8" },
];

return (
<div className="admin-dashboard">
<aside className="admin-sidebar">
<h2>🎓 CampusConnect</h2>
<p className="admin-label">ADMIN PANEL</p>

    <Link to="/admin">📊 Dashboard</Link>
    <Link to="/admin/create-event">➕ Create Event</Link>
    <Link to="/events">📅 Browse Events</Link>
    <Link to="/admin/students">👨‍🎓 Manage Students</Link>
    <Link to="/admin/registrations">📝 View Registrations</Link>
    <Link to="/notifications">🔔 Notifications</Link>
    <Link to="/feedback">💬 Feedback</Link>
    <Link to="/login">🚪 Logout</Link>
  </aside>

  <main className="admin-main">
    <header className="admin-header">
      <div>
        <h1>Admin Dashboard</h1>
        <p>Welcome back, Administrator!</p>
      </div>
      <span className="admin-avatar">A</span>
    </header>

    <section className="admin-stats">
      {stats.map((stat) => (
        <div className="admin-card" key={stat.title}>
          <span>{stat.icon}</span>
          <h3>{stat.title}</h3>
          <p>{stat.value}</p>
        </div>
      ))}
    </section>

    <section className="admin-panel">
      <h2>Quick Actions</h2>

      <div className="admin-actions">
        <Link
          to="/admin/create-event"
          className="admin-create-event-link"
        >
          + Create Event
        </Link>

        <Link
          to="/admin/students"
          className="admin-action-link"
        >
          Manage Students
        </Link>

        <Link
          to="/admin/registrations"
          className="admin-action-link"
        >
          View Registrations
        </Link>
      </div>
    </section>

    <section className="admin-panel">
      <h2>Recent Activity</h2>
      <p>
        Use the navigation menu or Quick Actions to create events,
        manage students, and view registrations.
      </p>
    </section>
  </main>
</div>

);
}

export default AdminDashboard;