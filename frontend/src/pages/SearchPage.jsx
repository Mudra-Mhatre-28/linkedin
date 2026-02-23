import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { axiosInstance } from "../lib/axios";

const SearchPage = () => {
  const [users, setUsers] = useState([]);
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const keyword = queryParams.get("keyword");

useEffect(() => {
  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get(
        `/users/search?keyword=${keyword}`
      );
      setUsers(res.data);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  if (keyword) fetchUsers();
}, [keyword]);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">
        Search Results for "{keyword}"
      </h2>

      {users.length === 0 && <p>No users found.</p>}

      {users.map((user) => (
        <div key={user._id} className="bg-white p-4 mb-3 rounded shadow">
          <h3 className="font-bold">
  {user.firstName} {user.lastName}
</h3>
          <p>{user.headline}</p>
          <p>City: {user.city}</p>
          <p>Experience: {user.experience} years</p>
          <p>Skills: {user.skills?.join(", ")}</p>
          <p>Projects: {user.projects}</p>
        </div>
      ))}
    </div>
  );
};

export default SearchPage;