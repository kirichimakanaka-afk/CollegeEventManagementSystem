import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./adminmanagement.css";

const initialStudents = [
  {
    id: "CC001",
    name: "Alex Johnson",
    email: "alex@example.com",
    course: "Computer Applications",
  },
  {
    id: "CC002",
    name: "Priya Sharma",
    email: "priya@example.com",
    course: "Information Technology",
  },
  {
    id: "CC003",
    name: "Daniel Smith",
    email: "daniel@example.com",
    course: "Computer Science",
  },
];

function ManageStudents() {
  const [students, setStudents] = useState(() => {
    try {
      const saved = localStorage.getItem("campusStudents");
      return saved ? JSON.parse(saved) : initialStudents;
    } catch {
      return initialStudents;
    }
  });

  const [search, setSearch] = useState("");

  const removeStudent = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to remove this student?"
    );

    if (!confirmed) return;

    const updated = students.filter((student) => student.id !== id);

    setStudents(updated);
    localStorage.setItem("campusStudents", JSON.stringify(updated));
  };

  const filteredStudents = students.filter((student) =>
    `${student.name} ${student.email} ${student.id} ${student.course}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="admin-management-page">
      <header className="management-header">
        <div>
          <h1>Manage Students</h1>
          <p>View, search, and manage student records.</p>
        </div>

        <Link to="/admin" className="management-back">
          ← Admin Dashboard
        </Link>
      </header>

      <section className="management-summary">
        <h2>Total Students: {students.length}</h2>
        <input
          type="search"
          placeholder="Search by name, email, ID, or course..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search students"
        />
      </section>

      <section className="management-table-wrapper">
        <table className="management-table">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Course</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{student.course}</td>
                <td>
                  <button
                    className="management-delete"
                    onClick={() => removeStudent(student.id)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}

            {filteredStudents.length === 0 && (
              <tr>
                <td colSpan="5">No students found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      <p className="management-note">
        These are demonstration records. Removed records are saved
        in this browser only.
      </p>
    </div>
  );
}

export default ManageStudents;