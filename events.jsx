import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./events.css";

const defaultEvents = [
  {
    id: 1,
    title: "Hackathon 2026",
    category: "Technology",
    description: "24-hour coding competition",
    venue: "Main Auditorium",
    event_date: "2026-11-10T09:00:00",
    capacity: 100,
  },
  {
    id: 2,
    title: "Career Fair",
    category: "Career",
    description: "Meet recruiters and alumni",
    venue: "Sports Hall",
    event_date: "2026-11-20T10:00:00",
    capacity: 300,
  },
  {
    id: 3,
    title: "Cultural Day",
    category: "Culture",
    description: "Music, food and performances",
    venue: "Campus Grounds",
    event_date: "2026-12-05T12:00:00",
    capacity: 500,
  },
  {
    id: 4,
    title: "Cyber Security Workshop",
    category: "Workshop",
    description: "Hands-on ethical hacking",
    venue: "Lab 3",
    event_date: "2026-11-15T14:00:00",
    capacity: 40,
  },
];

function readCreatedEvents() {
  try {
    const saved = JSON.parse(
      localStorage.getItem("campusEvents") || "[]"
    );

    if (!Array.isArray(saved)) return [];

    return saved.map((event) => ({
      ...event,
      event_date: event.event_date || event.date || "",
      capacity: Number(event.capacity) || 100,
      category: event.category || "Other",
    }));
  } catch {
    return [];
  }
}

function readRegistrations() {
  try {
    const saved = JSON.parse(
      localStorage.getItem("campusRegistrations") || "[]"
    );

    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

export default function Events() {
  const [search, setSearch] = useState("");
  const [createdEvents, setCreatedEvents] = useState(readCreatedEvents);

  const [registered, setRegistered] = useState(() =>
    readRegistrations()
      .filter(
        (registration) =>
          registration.student === "Demo Student"
      )
      .map((registration) => String(registration.eventId))
  );

  useEffect(() => {
    function refreshData() {
      setCreatedEvents(readCreatedEvents());

      setRegistered(
        readRegistrations()
          .filter(
            (registration) =>
              registration.student === "Demo Student"
          )
          .map((registration) => String(registration.eventId))
      );
    }

    window.addEventListener("focus", refreshData);
    window.addEventListener("storage", refreshData);
    window.addEventListener("campusRegistrationsUpdated", refreshData);

    return () => {
      window.removeEventListener("focus", refreshData);
      window.removeEventListener("storage", refreshData);
      window.removeEventListener(
        "campusRegistrationsUpdated",
        refreshData
      );
    };
  }, []);

  const allEvents = [...defaultEvents, ...createdEvents];

  const filteredEvents = allEvents.filter((event) =>
    `${event.title} ${event.description} ${event.venue} ${event.category}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  function handleRegistration(eventId) {
    const selectedEvent = allEvents.find(
      (event) => String(event.id) === String(eventId)
    );

    if (!selectedEvent) return;

    const savedRegistrations = readRegistrations();

    const existingRegistration = savedRegistrations.find(
      (registration) =>
        registration.student === "Demo Student" &&
        String(registration.eventId) === String(eventId)
    );

    let updatedRegistrations;

    if (existingRegistration) {
      // Cancel the existing demo registration.
      updatedRegistrations = savedRegistrations.filter(
        (registration) => registration.id !== existingRegistration.id
      );
    } else {
      // Save a new registration.
      const newRegistration = {
        id: `${Date.now()}-${eventId}`,
        eventId: String(eventId),
        student: "Demo Student",
        email: "student@campusconnect.demo",
        event: selectedEvent.title,
        date: selectedEvent.event_date || selectedEvent.date || "",
        status: "Confirmed",
      };

      updatedRegistrations = [
        ...savedRegistrations,
        newRegistration,
      ];
    }

    localStorage.setItem(
      "campusRegistrations",
      JSON.stringify(updatedRegistrations)
    );

    setRegistered(
      updatedRegistrations
        .filter(
          (registration) =>
            registration.student === "Demo Student"
        )
        .map((registration) => String(registration.eventId))
    );

    window.dispatchEvent(
      new Event("campusRegistrationsUpdated")
    );
  }

  function formatDate(dateString) {
    if (!dateString) return "Date to be announced";

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return "Date to be announced";
    }

    return date.toLocaleString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function getEmoji(category, title) {
    const text = `${category} ${title}`.toLowerCase();

    if (text.includes("technology") || text.includes("hackathon")) {
      return "💻";
    }
    if (text.includes("career")) return "🤝";
    if (text.includes("culture")) return "🎭";
    if (text.includes("security")) return "🔐";
    if (text.includes("sport")) return "🏆";
    return "📅";
  }

  return (
    <main className="events-page">
      <section className="events-hero">
        <span className="events-tag">WHAT'S HAPPENING</span>
        <h1>Upcoming Events</h1>
        <p>
          Discover campus activities, connect with fellow students,
          and find an event that matches your interests.
        </p>
      </section>

      <section className="events-section">
        <div className="events-heading">
          <div>
            <h2>Explore Events</h2>
            <p>Search and discover what's happening on campus.</p>
          </div>

          <div className="events-count">
            <strong>{filteredEvents.length}</strong>
            <span>Events found</span>
          </div>
        </div>

        <input
          className="events-search"
          type="search"
          placeholder="Search by event name, description or venue..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search events"
        />

        <div className="events-grid">
          {filteredEvents.map((event) => {
            const isRegistered = registered.includes(
              String(event.id)
            );

            return (
              <article className="events-card" key={event.id}>
                <div className={`events-banner event-${event.id}`}>
                  <span>
                    EVENT {String(event.id).padStart(2, "0")}
                  </span>
                  <span className="events-emoji">
                    {getEmoji(event.category, event.title)}
                  </span>
                </div>

                <div className="events-card-content">
                  <span className="events-category">
                    {event.category}
                  </span>

                  <h3>{event.title}</h3>
                  <p className="events-description">
                    {event.description}
                  </p>

                  <div className="events-info">
                    <p>📅 {formatDate(event.event_date)}</p>
                    <p>📍 {event.venue}</p>
                    <p>👥 Capacity: {event.capacity} people</p>
                  </div>

                  <button
                    className={
                      isRegistered
                        ? "events-register registered"
                        : "events-register"
                    }
                    onClick={() => handleRegistration(event.id)}
                  >
                    {isRegistered
                      ? "✓ Registered"
                      : "Register Now →"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {filteredEvents.length === 0 && (
          <div className="events-empty">
            <h3>No events found</h3>
            <p>Try searching with another keyword.</p>
          </div>
        )}

        <div className="events-summary">
          <div>
            <strong>{allEvents.length}</strong>
            <span>Listed Events</span>
          </div>

          <div>
            <strong>
              {allEvents.reduce(
                (total, event) => total + event.capacity,
                0
              )}
            </strong>
            <span>Total Event Capacity</span>
          </div>

          <div>
            <strong>{registered.length}</strong>
            <span>My Registrations</span>
          </div>
        </div>

        <p style={{ textAlign: "center", marginTop: "20px" }}>
          Are you an administrator?{" "}
          <Link to="/admin">Open Admin Dashboard</Link>
        </p>
      </section>
    </main>
  );
}