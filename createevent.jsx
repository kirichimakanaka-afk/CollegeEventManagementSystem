import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./createevent.css";

function CreateEvent() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    category: "Workshop",
    date: "",
    venue: "",
    description: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const existingEvents = JSON.parse(
      localStorage.getItem("campusEvents") || "[]"
    );

    const newEvent = {
      ...form,
      id: Date.now().toString(),
    };

    localStorage.setItem(
      "campusEvents",
      JSON.stringify([...existingEvents, newEvent])
    );

    setMessage("Event created successfully!");

    setTimeout(() => {
      navigate("/admin");
    }, 1000);
  };

  return (
    <div className="create-event-page">
      <div className="create-event-header">
        <div>
          <h1>Create New Event</h1>
          <p>Add a campus event to CampusConnect.</p>
        </div>
        <Link to="/admin" className="back-admin-link">
          Back to Dashboard
        </Link>
      </div>

      <form className="create-event-form" onSubmit={handleSubmit}>
        <label htmlFor="title">Event Name</label>
        <input
          id="title"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="e.g. Technology Workshop"
          required
        />

        <label htmlFor="category">Event Category</label>
        <select
          id="category"
          name="category"
          value={form.category}
          onChange={handleChange}
          required
        >
          <option>Workshop</option>
          <option>Academic</option>
          <option>Career</option>
          <option>Cultural</option>
          <option>Sports</option>
          <option>Other</option>
        </select>

        <label htmlFor="date">Event Date</label>
        <input
          id="date"
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          required
        />

        <label htmlFor="venue">Venue</label>
        <input
          id="venue"
          name="venue"
          value={form.venue}
          onChange={handleChange}
          placeholder="Enter event venue"
          required
        />

        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Describe the event..."
          rows={5}
          required
        />

        {message && (
          <p className="create-event-success" role="status">
            {message}
          </p>
        )}

        <button type="submit" className="create-event-submit">
          Create Event
        </button>
      </form>
    </div>
  );
}

export default CreateEvent;