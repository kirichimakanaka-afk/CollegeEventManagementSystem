import { useState } from "react";
import "./Feedback.css";

function Feedback() {
  const [eventName, setEventName] = useState("");
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!eventName || rating === 0 || !comments.trim()) {
      setMessage("Please complete all fields before submitting.");
      return;
    }

    const feedback = {
      eventName,
      rating,
      comments,
      submittedAt: new Date().toISOString(),
    };

    // Temporary storage until the backend is connected
    const savedFeedback = JSON.parse(
      localStorage.getItem("campusConnectFeedback") || "[]"
    );

    savedFeedback.push(feedback);
    localStorage.setItem(
      "campusConnectFeedback",
      JSON.stringify(savedFeedback)
    );

    setMessage("Thank you! Your feedback has been submitted.");
    setEventName("");
    setRating(0);
    setComments("");
  };

  return (
    <div className="feedback-page">
      <div className="feedback-card">
        <h1>Event Feedback</h1>
        <p className="feedback-subtitle">
          Share your experience and help us improve CampusConnect.
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="eventName">Select Event</label>
          <select
            id="eventName"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            required
          >
            <option value="">Choose an event</option>
            <option value="Tech Fest">Tech Fest</option>
            <option value="Cultural Day">Cultural Day</option>
            <option value="Sports Day">Sports Day</option>
            <option value="Workshop">Workshop</option>
          </select>

          <label>Rate Your Experience</label>
          <div className="feedback-stars" role="group" aria-label="Rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={star <= rating ? "star active" : "star"}
                onClick={() => setRating(star)}
                aria-label={`${star} star${star > 1 ? "s" : ""}`}
                aria-pressed={rating === star}
              >
                ★
              </button>
            ))}
          </div>
          <p className="rating-label">
            {rating === 0
              ? "Select a rating"
              : `${rating} out of 5 stars`}
          </p>

          <label htmlFor="comments">Comments and Suggestions</label>
          <textarea
            id="comments"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Tell us what you liked or what we can improve..."
            rows="5"
            required
          />

          <button className="feedback-submit" type="submit">
            Submit Feedback
          </button>

          {message && (
            <p className="feedback-message" role="status">
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default Feedback;