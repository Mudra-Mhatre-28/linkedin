import { useState, useEffect } from "react";
import { axiosInstance } from "../lib/axios";

const SearchPage = () => {

  const [query, setQuery] = useState("");
  const [city, setCity] = useState("");
  const [skill, setSkill] = useState("");
  const [project, setProject] = useState("");

  const [suggestions, setSuggestions] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recent, setRecent] = useState([]);

  // Load recent searches
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("recentSearches")) || [];
    setRecent(saved);
  }, []);

  // Suggestions while typing
  useEffect(() => {

    const delay = setTimeout(async () => {

      if (!query) {
        setSuggestions([]);
        return;
      }

      try {

        const res = await axiosInstance.get("/search/suggestions", {
          params: { q: query }
        });

        setSuggestions(res.data);

      } catch (error) {
        console.error(error);
      }

    }, 300);

    return () => clearTimeout(delay);

  }, [query]);

  // Save recent searches
  const saveRecent = (user) => {

    const updated = [user, ...recent.filter(u => u._id !== user._id)].slice(0,5);

    setRecent(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));

  };

  // Highlight matched text
  const highlight = (text) => {

    if (!query) return text;

    const parts = text.split(new RegExp(`(${query})`, "gi"));

    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase()
        ? <span key={index} className="bg-yellow-200">{part}</span>
        : part
    );

  };

  // Keyboard navigation
  const handleKeyDown = (e) => {

    if (e.key === "ArrowDown") {
      setSelectedIndex(prev => Math.min(prev + 1, suggestions.length - 1));
    }

    if (e.key === "ArrowUp") {
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    }

    if (e.key === "Enter" && suggestions[selectedIndex]) {

      const user = suggestions[selectedIndex];

      saveRecent(user);

      window.location.href = `/profile/${user.username}`;

    }

  };

  // Search with filters
  const handleSearch = async () => {

    try {

      const res = await axiosInstance.get("/search", {
        params: {
          q: query,
          city,
          skill,
          project
        }
      });

      setUsers(res.data.users);

    } catch (error) {
      console.error(error);
    }

  };

  return (

    <div className="max-w-6xl mx-auto mt-6 flex gap-6">

      {/* Sidebar Filters */}
      <div className="w-1/4 bg-white p-4 rounded-lg shadow h-fit">

        <h2 className="font-semibold text-lg mb-4">Filters</h2>

        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e)=>setCity(e.target.value)}
          className="w-full p-2 border rounded mb-3"
        />

        <input
          type="text"
          placeholder="Skill"
          value={skill}
          onChange={(e)=>setSkill(e.target.value)}
          className="w-full p-2 border rounded mb-3"
        />

        <input
          type="text"
          placeholder="Project"
          value={project}
          onChange={(e)=>setProject(e.target.value)}
          className="w-full p-2 border rounded mb-3"
        />

        <button
          onClick={handleSearch}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Apply Filters
        </button>

      </div>


      {/* Search Area */}
      <div className="flex-1">

        <input
          type="text"
          placeholder="Search people..."
          className="w-full p-3 border rounded-lg"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        {/* Recent Searches */}
        {query === "" && recent.length > 0 && (

          <div className="bg-white shadow rounded-lg mt-2">

            <p className="px-3 py-2 text-xs text-gray-400">
              Recent Searches
            </p>

            {recent.map((user) => (

              <div
                key={user._id}
                className="flex items-center gap-3 p-3 hover:bg-gray-100"
              >

                <img
                  src={user.profilePicture || "https://i.pravatar.cc/100"}
                  className="w-8 h-8 rounded-full"
                />

                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.headline}</p>
                </div>

              </div>

            ))}

          </div>

        )}

        {/* Suggestions */}
        {suggestions.length > 0 && (

          <div className="bg-white shadow rounded-lg mt-2">

            {suggestions.map((user, index) => (

              <div
                key={user._id}
                className={`flex items-center gap-3 p-3 cursor-pointer
                ${index === selectedIndex ? "bg-gray-200" : "hover:bg-gray-100"}`}
                onClick={() => {
                  saveRecent(user);
                  window.location.href = `/profile/${user.username}`;
                }}
              >

                <img
                  src={user.profilePicture || "https://i.pravatar.cc/100"}
                  className="w-8 h-8 rounded-full"
                />

                <div>
                  <p className="font-medium">
                    {highlight(user.name)}
                  </p>

                  <p className="text-xs text-gray-500">
                    {highlight(user.headline || "")}
                  </p>
                </div>

              </div>

            ))}

          </div>

        )}

        {/* Search Results */}
        {users.length > 0 && (

          <div className="mt-6 grid gap-4">

            {users.map((user)=>(
              <div
                key={user._id}
                className="flex items-center justify-between p-4 bg-white shadow rounded-lg"
              >

                <div className="flex items-center gap-4">

                  <img
                    src={user.profilePicture || "https://i.pravatar.cc/100"}
                    className="w-12 h-12 rounded-full"
                  />

                  <div>
                    <h3 className="font-semibold">{user.name}</h3>
                    <p className="text-sm text-gray-500">{user.headline}</p>
                    <p className="text-xs text-gray-400">{user.location}</p>
                  </div>

                </div>

                <button className="px-4 py-2 bg-blue-600 text-white rounded">
                  Connect
                </button>

              </div>
            ))}

          </div>

        )}

      </div>

    </div>
  );

};

export default SearchPage;