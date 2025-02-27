import { Loader, Plus } from "lucide-react"; // Import the Plus icon
import React, { useRef } from "react";

function UserAddForm() {
  const [value, setValue] = React.useState({
    username: "",
    dob: "",
    password: "",
    profilePicture: null,
  });
  const [processing, setProcessing] = React.useState(false);
  const [message, setMessage] = React.useState("");

  const handleChange = (e) => {
    if (e.target.type === "file") {
      setValue({ ...value, profilePicture: e.target.files[0] });
    } else {
      setValue({ ...value, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (value.username.trim() === "") {
      setMessage("Name cannot be empty");
      return;
    }
    if (value.password.trim() === "") {
      setMessage("Password cannot be empty");
      return;
    }

    const formData = new FormData();
    formData.append("username", value.username);
    formData.append("dob", value.dob);
    formData.append("password", value.password);
    if (value.profilePicture) {
      formData.append("profilePicture", value.profilePicture);
    }

    try {
      setProcessing(true);
      const response = await fetch("http://localhost:8000/api/add-user", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      setProcessing(false);

      if (!response.ok) {
        const data = await response.json();
        setMessage(data.error || "User registration failed");
        return;
      }

      window.location.reload(); // Consider replacing this with state update logic
    } catch (error) {
      setMessage(`An error occurred, please try again later.`);
      console.error(error);
    }
  };

  return (
    <>
      <form className="space-y-3" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="username"
            className="block text-sm/6 font-medium text-gray-900"
          >
            Name
          </label>
          <div className="mt-2">
            <input
              type="text" // Fixed from "string" to "text"
              name="username"
              id="username"
              onChange={handleChange}
              value={value.username}
              autoComplete="name"
              required
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="dob"
            className="block text-sm/6 font-medium text-gray-900"
          >
            Date of Birth
          </label>
          <div className="mt-2">
            <input
              type="date"
              name="dob"
              id="dob"
              onChange={handleChange}
              value={value.dob}
              autoComplete="bday-day"
              required
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Password
            </label>
          </div>
          <div className="mt-2">
            <input
              type="password"
              name="password"
              id="password"
              onChange={handleChange}
              value={value.password}
              autoComplete="current-password"
              required
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="profilePicture"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Profile Image
            </label>
          </div>
          <div className="mt-2">
            <input
              type="file"
              name="profilePicture"
              id="profilePicture"
              onChange={handleChange}
              required
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            />
          </div>
        </div>
        <div>
          <button
            type="submit"
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {processing ? <Loader className="animate-spin" /> : "Add User"}
          </button>
        </div>
        {message && <p className="text-red-500 text-center">{message}</p>}
      </form>
    </>
  );
}

const AddUserModal = () => {
  const dialogRef = useRef(null);
  const openDialog = () => dialogRef.current.showModal();
  const closeDialog = () => dialogRef.current.close();

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Updated Add User Button */}
      <button
        onClick={openDialog}
        className="flex items-center gap-2 px-3 py-1 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition-colors"
        aria-label="Add User"
      >
        <Plus size={20} />
        <span>Add User</span>
      </button>
      <dialog
        ref={dialogRef}
        className="fixed left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%] p-6 border rounded-md min-w-[350px] bg-white"
      >
        <div className="w-full flex flex-row justify-between items-center">
          {/* Centered and Bold Text */}
          <div className="flex-grow flex justify-center items-center font-bold text-lg">
            Add a new user
          </div>
          {/* Close Button */}
          <button
            onClick={closeDialog}
            className="p-1 bg-red-500 w-5 h-5 text-white rounded flex justify-center items-center"
          >
            x
          </button>
        </div>
        <br />
        <UserAddForm />
      </dialog>
    </div>
  );
};

export default AddUserModal;