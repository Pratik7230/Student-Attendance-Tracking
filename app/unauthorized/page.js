"use client";

import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export default function UnAuthorized() {
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [decodedUser, setDecodedUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/user");
        if (!res.ok) throw new Error("Failed to fetch user data");

        const data = await res.json();
        console.log("Fetched User Data:", data); // Debugging log

        setUser(data.user);
        setLoading(false);

        // Extract roles from API response
        const extractedRoles = Array.isArray(data.roles)
          ? data.roles.map(role => role.role || role)
          : [];
        setRoles(extractedRoles);

        // Decode JWT if available
        if (data.user?.token) {
          const decoded = jwtDecode(data.user.token);
          setDecodedUser(decoded);
          console.log("Decoded User:", decoded); // Debugging log
        } else {
          console.warn("No token found in user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  if (loading) {
    return <div className="p-10 text-center"><p>Loading...</p></div>;
  }

  return (
    <div className="p-10 text-center">
      <h2 className="text-2xl font-bold text-red-600">Access Denied</h2>
      <p className="text-gray-600">You do not have permission to view this page.</p>

      {user && (
        <div className="mt-4 p-4 border rounded-lg">
          <h3 className="text-lg font-semibold">User Details</h3>
          <p><strong>Name:</strong> {decodedUser?.given_name} {decodedUser?.family_name}</p>
          <p><strong>Email:</strong> {decodedUser?.email || user.email}</p>
          <p><strong>Roles:</strong> {roles.length > 0 ? roles.join(", ") : "No roles assigned"}</p>
          <p><strong>Decoded Role ID:</strong> {decodedUser?.role_id || "N/A"}</p>
        </div>
      )}
    </div>
  );
}
