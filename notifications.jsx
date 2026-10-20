import { useState, useEffect } from "react";
import "./Notifications.css";

const defaultNotifications = [
  {
    id: 1,
    title: "New Campus Event",
    message:
      "A new campus event has been announced. Visit the Events page to explore upcoming activities.",
    category: "Events",
    date: new Date().toISOString(),
    read: false,
    icon: "🎉",
  },
  {
    id: 2,
    title: "Event Registration Reminder",
    message:
      "Remember to register for events you would like to attend. Some events may have limited seats.",
    category: "Reminders",
    date: new Date(Date.now() - 3600000).toISOString(),
    read: false,
    icon: "⏰",
  },
  {
    id: 3,
    title: "Welcome to CampusConnect",
    message:
      "Welcome to your campus community! Stay updated with announcements, events, and student activities.",
    category: "General",
    date: new Date(Date.now() - 86400000).toISOString(),
    read: true,
    icon: "🎓",
  },
];

const STORAGE_KEY = "campusConnectNotifications";

function getSavedNotifications() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved !== null) {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : defaultNotifications;
    }
  } catch (error) {
    console.error("Unable to load notifications:", error);
  }

  return defaultNotifications;
}

function Notifications() {
  const [notifications, setNotifications] = useState(
    getSavedNotifications
  );
  const [activeFilter, setActiveFilter] = useState("All");
  const [message, setMessage] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(notifications)
      );
    } catch (error) {
      console.error("Unable to save notifications:", error);
      setMessage("Unable to save changes in this browser.");
    }
  }, [notifications]);

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  const filteredNotifications = notifications.filter(
    (notification) => {
      if (activeFilter === "Unread") {
        return !notification.read;
      }

      if (activeFilter === "Read") {
        return notification.read;
      }

      return true;
    }
  );

  const markAsRead = (id) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );

    setMessage("Notification marked as read.");
  };

  const markAllAsRead = () => {
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        read: true,
      }))
    );

    setMessage("All notifications marked as read.");
  };

  const deleteNotification = (id) => {
    setNotifications((current) =>
      current.filter((notification) => notification.id !== id)
    );

    setMessage("Notification removed.");
  };

  const clearAllNotifications = () => {
    if (notifications.length === 0) {
      setMessage("There are no notifications to clear.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to clear all notifications?"
    );

    if (confirmed) {
      setNotifications([]);
      setMessage("All notifications have been cleared.");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return "Date unavailable";
    }

    return date.toLocaleString([], {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <main className="notifications-page">
      <section className="notifications-container">
        <header className="notifications-header">
          <div className="notifications-heading">
            <span className="notifications-heading-icon">🔔</span>

            <div>
              <h1>Notifications</h1>
              <p>
                Stay informed about campus events and important updates.
              </p>
            </div>
          </div>

          <div className="notifications-summary">
            <span className="notification-count">
              {unreadCount}
            </span>
            <span>
              {unreadCount === 1
                ? "unread notification"
                : "unread notifications"}
            </span>
          </div>
        </header>

        <div className="notifications-toolbar">
          <div
            className="notification-filters"
            role="group"
            aria-label="Filter notifications"
          >
            {["All", "Unread", "Read"].map((filter) => (
              <button
                key={filter}
                type="button"
                className={`notification-filter ${
                  activeFilter === filter ? "active" : ""
                }`}
                onClick={() => {
                  setActiveFilter(filter);
                  setMessage("");
                }}
                aria-pressed={activeFilter === filter}
              >
                {filter}
                {filter === "Unread" && unreadCount > 0 && (
                  <span className="filter-count">
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="notification-actions">
            <button
              type="button"
              className="mark-all-button"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
            >
              ✓ Mark all as read
            </button>

            <button
              type="button"
              className="clear-notifications-button"
              onClick={clearAllNotifications}
              disabled={notifications.length === 0}
            >
              Clear all
            </button>
          </div>
        </div>

        {message && (
          <p className="notifications-status" role="status">
            {message}
          </p>
        )}

        <section
          className="notification-list"
          aria-label="Your notifications"
        >
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <article
                key={notification.id}
                className={`notification-card ${
                  notification.read ? "is-read" : "is-unread"
                }`}
              >
                <div className="notification-icon">
                  {notification.icon || "🔔"}
                </div>

                <div className="notification-content">
                  <div className="notification-title-row">
                    <h2>{notification.title}</h2>

                    {!notification.read && (
                      <span className="unread-badge">New</span>
                    )}
                  </div>

                  <p className="notification-message">
                    {notification.message}
                  </p>

                  <div className="notification-meta">
                    <span className="notification-category">
                      {notification.category}
                    </span>

                    <time dateTime={notification.date}>
                      {formatDate(notification.date)}
                    </time>
                  </div>

                  <div className="notification-card-actions">
                    {!notification.read && (
                      <button
                        type="button"
                        className="notification-read-button"
                        onClick={() => markAsRead(notification.id)}
                      >
                        Mark as read
                      </button>
                    )}

                    <button
                      type="button"
                      className="notification-delete-button"
                      onClick={() =>
                        deleteNotification(notification.id)
                      }
                      aria-label={`Remove ${notification.title}`}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="notifications-empty">
              <div className="empty-notification-icon">📭</div>

              <h2>
                {activeFilter === "Unread"
                  ? "You're all caught up!"
                  : activeFilter === "Read"
                  ? "No read notifications"
                  : "No notifications yet"}
              </h2>

              <p>
                {activeFilter === "Unread"
                  ? "You have no unread notifications at the moment."
                  : activeFilter === "Read"
                  ? "Notifications you have read will appear here."
                  : "Campus announcements and updates will appear here."}
              </p>
            </div>
          )}
        </section>

        <footer className="notifications-footer">
          <span>🎓</span>
          CampusConnect · Keeping your campus connected
        </footer>
      </section>
    </main>
  );
}

export default Notifications;