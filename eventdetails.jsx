import { useParams, Link } from "react-router-dom";
import { useState } from "react";

const events = [
  {
    id: 1,
    title: "Hackathon 2026",
    description: "24-hour coding competition",
    venue: "Main Auditorium",
    event_date: "2026-11-10 09:00:00",
    capacity: 100,
    created_by: 1,
  },
  {
    id: 2,
    title: "Career Fair",
    description: "Meet recruiters and alumni",
    venue: "Sports Hall",
    event_date: "2026-11-20 10:00:00",
    capacity: 300,
    created_by: 1,
  },
  {
    id: 3,
    title: "Cultural Day",
    description: "Music, food and performances",
    venue: "Campus Grounds",
    event_date: "2026-12-05 12:00:00",
    capacity: 500,
    created_by: 1,
  },
  {
    id: 4,
    title: "Cyber Security Workshop",
    description: "Hands-on ethical hacking",
    venue: "Lab 3",
    event_date: "2026-11-15 14:00:00",
    capacity: 40,
    created_by: 1,
  },
];

function EventDetails() {
  const { id } = useParams();
  const event = events.find((item) => item.id === Number(id));
  const [registered, setRegistered] = useState(false);

  if (!event) {
    return (
      <main style={styles.container}>
        <h1>Event Not Found</h1>
        <p>Sorry, we couldn't find that event.</p>
        <Link to="/events">Back to Events</Link>
      </main>
    );
  }

  const formattedDate = new Date(
    event.event_date.replace(" ", "T")
  ).toLocaleString("en-IN", {
    dateStyle: "full",
    timeStyle: "short",
  });

  return (
    <main style={styles.container}>
      <Link to="/events" style={styles.backLink}>
        ← Back to Events
      </Link>

      <section style={styles.card}>
        <div style={styles.banner}>
          <span style={styles.badge}>Campus Event</span>
          <h1 style={styles.title}>{event.title}</h1>
          <p style={styles.subtitle}>{event.description}</p>
        </div>

        <div style={styles.content}>
          <h2>Event Information</h2>

          <div style={styles.detail}>
            <strong>Date and Time</strong>
            <p>{formattedDate}</p>
          </div>

          <div style={styles.detail}>
            <strong>Venue</strong>
            <p>{event.venue}</p>
          </div>

          <div style={styles.detail}>
            <strong>Event Capacity</strong>
            <p>{event.capacity} attendees</p>
          </div>

          <div style={styles.detail}>
            <strong>Description</strong>
            <p>{event.description}</p>
          </div>

          <button
            type="button"
            onClick={() => setRegistered((previous) => !previous)}
            style={{
              ...styles.button,
              backgroundColor: registered ? "#475569" : "#2563eb",
            }}
          >
            {registered ? "Cancel Demo Registration" : "Register for Event"}
          </button>

          <p style={styles.note}>
            {registered
              ? "Demo registration selected. This has not been saved to a database."
              : "Explore the event details and register your interest."}
          </p>
        </div>
      </section>
    </main>
  );
}

const styles = {
  container: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "30px 20px",
    fontFamily: "Arial, sans-serif",
    color: "#1e293b",
  },
  backLink: {
    display: "inline-block",
    marginBottom: "20px",
    color: "#2563eb",
    textDecoration: "none",
    fontWeight: "bold",
  },
  card: {
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    overflow: "hidden",
    backgroundColor: "#ffffff",
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
  },
  banner: {
    background: "linear-gradient(135deg, #1e3a8a, #2563eb)",
    color: "#ffffff",
    padding: "35px 25px",
  },
  badge: {
    display: "inline-block",
    padding: "6px 12px",
    borderRadius: "20px",
    backgroundColor: "rgba(255,255,255,0.2)",
    fontSize: "13px",
  },
  title: {
    fontSize: "clamp(26px, 5vw, 38px)",
    margin: "18px 0 10px",
    overflowWrap: "anywhere",
  },
  subtitle: {
    fontSize: "17px",
    lineHeight: 1.6,
    marginBottom: 0,
  },
  content: {
    padding: "25px",
  },
  detail: {
    padding: "15px 0",
    borderBottom: "1px solid #e2e8f0",
    lineHeight: 1.6,
    overflowWrap: "anywhere",
  },
  button: {
    width: "100%",
    marginTop: "24px",
    padding: "14px 18px",
    border: "none",
    borderRadius: "8px",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  note: {
    color: "#64748b",
    fontSize: "13px",
    lineHeight: 1.5,
  },
};

export default EventDetails;
