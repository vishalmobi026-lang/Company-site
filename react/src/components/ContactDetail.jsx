import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

export default function ContactDetail() {
  const { user, isAuthenticated } = useContext(AuthContext);
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    // If user is authenticated, read from user.contacts
    if (isAuthenticated) {
      setContacts(user?.contacts || []);
      return;
    }

    // Guest flow: read from localStorage guest_contacts
    const guest = JSON.parse(localStorage.getItem("guest_contacts") || "[]");
    setContacts(guest);
  }, [user, isAuthenticated]);

  return (
    <section className="bg-white rounded-lg shadow p-4 mb-4">
      <h3 className="text-lg font-semibold mb-2">Your Contacts</h3>
      {contacts.length === 0 ? (
        <p className="text-sm text-gray-500">No contacts saved.</p>
      ) : (
        <ul className="space-y-2">
          {contacts.map((c) => (
            <li key={c.id} className="text-sm">
              <div className="font-medium">{c.name}</div>
              <div className="text-xs text-gray-500">{c.email} • {c.phone}</div>
              {c.subject && <div className="text-xs text-gray-400">Subject: {c.subject}</div>}
              {c.message && <div className="text-xs text-gray-400">Message: {c.message}</div>}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
