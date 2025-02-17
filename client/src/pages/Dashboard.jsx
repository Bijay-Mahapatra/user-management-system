import React, { useState, useEffect } from "react";
import AddUserModal from "../components/AddUserModal";
import UpdateUser from "../components/UpdateUser";
import DeleteUser from "../components/DeleteUser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPowerOff } from "@fortawesome/free-solid-svg-icons";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage] = useState(6); // Number of entries per page

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/allusers", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        const data = await response.json();
        if (response.status === 401) {
          window.location.href = "/"; // Redirect to login page if unauthorized
          return;
        }
        setUsers(data);
        console.log(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    getUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.dob.includes(searchTerm)
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortOption === "name") {
      return a.name.localeCompare(b.name);
    } else if (sortOption === "dob") {
      return (
        new Date(a.dob.split("/").reverse().join("-")) -
        new Date(b.dob.split("/").reverse().join("-"))
      );
    }
    return 0;
  });

  // Pagination logic
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = sortedUsers.slice(indexOfFirstEntry, indexOfLastEntry);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        {/* Dropdown on the Left */}
        <div className="flex items-center gap-2">
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
          >
            <option value=" ">Default</option>
            <option value="name">Sort by Name</option>
            <option value="dob">Sort by DOB</option>
          </select>
        </div>
        {/* Search Bar Centered */}
        <div className="flex-grow flex justify-center">
          <input
            type="text"
            placeholder="Search by name or date..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200 w-96"
          />
        </div>
        {/* Add User and Logout Buttons on the Right */}
        <div className="flex items-center gap-2">
          {/* Add User Button - Changed from blue to green */}
          <AddUserModal className="bg-green-500 hover:bg-green-600" />
          {/* Shutdown Icon as Anchor Tag */}
          <a
            href="/"
            className="px-3 py-1 bg-red-500 text-white rounded-lg shadow-sm hover:bg-red-600 transition duration-200 inline-block text-center"
          >
            <FontAwesomeIcon icon={faPowerOff} className="text-xl" />
          </a>
        </div>
      </div>
      <div className="relative overflow-x-auto shadow-lg rounded-lg">
        <table className="w-full text-sm text-left text-gray-700 border-collapse border border-gray-200">
          <thead className="text-xs uppercase bg-gray-50 text-gray-700">
            <tr>
              <th className="px-4 py-2 border-b border-gray-200">ID</th>
              <th className="px-4 py-2 border-b border-gray-200">Profile Picture</th>
              <th className="px-4 py-2 border-b border-gray-200 text-center">Name</th>
              <th className="px-4 py-2 border-b border-gray-200 text-center">DOB</th>
              <th className="px-4 py-2 border-b border-gray-200 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentEntries.map((user, index) => (
              <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-100 transition duration-200">
                <td className="px-4 py-2">{indexOfFirstEntry + index + 1}</td>
                <td className="px-4 py-2 flex justify-start">
                  <img
                    src={user.profile_picture}
                    alt="Profile"
                    className="w-22 h-22 object-cover rounded-full shadow-md border-2 border-white"
                  />
                </td>
                <td className="px-4 py-2 text-center font-medium">{user.name}</td>
                <td className="px-4 py-2 text-center">{user.dob}</td>
                <td className="px-4 py-2 text-center">
                  <div className="flex flex-row items-center justify-center gap-2">
                    {/* Update User Button - Changed from blue to green */}
                    <UpdateUser data={user} className="bg-green-500 hover:bg-green-600" />
                    <DeleteUser data={user} className="bg-red-500 hover:bg-red-600" />
                  </div>
                </td>
              </tr>
            ))}
            {currentEntries.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500 border-t border-gray-200">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination Controls */}
      <div className="flex justify-center items-center mt-4">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 mx-1 border border-gray-300 rounded-lg shadow-sm bg-green-500 text-white hover:bg-green-600 disabled:opacity-50"
        >
          Previous
        </button>
        {Array.from({ length: Math.ceil(sortedUsers.length / entriesPerPage) }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => paginate(index + 1)}
            className={`px-3 py-1 mx-1 border border-gray-300 rounded-lg shadow-sm ${
              currentPage === index + 1 ? "bg-green-500 text-white" : "bg-green-100 hover:bg-green-200"
            }`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === Math.ceil(sortedUsers.length / entriesPerPage)}
          className="px-3 py-1 mx-1 border border-gray-300 rounded-lg shadow-sm bg-green-500 text-white hover:bg-green-600 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Dashboard;