import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function EnrolledStudentDetail() {
  const { user } = useContext(AuthContext);
  const courses = user?.enrolledCourses || [];

  return (
    <section>
      <h3>Your Enrolled Courses</h3>
      {courses.length === 0 ? <p>No courses enrolled yet.</p> : (
        <ul>
          {courses.map(c => <li key={c.id}>{c.title}</li>)}
        </ul>
      )}
    </section>
  );
}
