import { Loader, Pencil } from "lucide-react"; // Import the Pencil icon
import PropTypes from "prop-types";
import React, { useRef } from "react";

UpdateUser.propTypes = {
  data: PropTypes.func.isRequired,
};
UserUpdateForm.propTypes = {
  data: PropTypes.func.isRequired,
};

function UserUpdateForm({ data }) {
  const id = data.id;
  const [value, setValue] = React.useState({
    username: data.name,
    dob: data.dob,
    profilePicture: null,
  });
  const [processing, setProcessing] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const handleChange = (e) => {
    console.log(e.target.type);
    if (e.target.type === "file") {
      console.log("first");
      setValue({ ...value, profilePicture: e.target.files[0] });
    } else {
      setValue({ ...value, [e.target.name]: e.target.value });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (value.username === "") {
      setMessage("Name cannot be empty");
      return;
    }
    if (value.password === "") {
      setMessage("Password cannot be empty");
      return;
    }
    const formData = new FormData();
    formData.append("id", id);
    formData.append("name", value.username);
    formData.append("dob", value.dob);
    if (value.profilePicture !== null) {
      formData.append("profilePicture", value.profilePicture);
    }
    console.log(formData);
    try {
      setMessage("");
      setProcessing(true);
      const response = await fetch("http://localhost:8000/api/update-user", {
        method: "PUT",
        body: formData,
        credentials: "include",
      });
      setProcessing(false);
      if (response.status !== 200) {
        const data = await response.json();
        setMessage(data.error || "User updation failed");
        return;
      } else {
        window.location.reload();
        return;
      }
    } catch (error) {
      setMessage(`An error occurred, please try again later. ${error}`);
    }
  };
  return (
    <>
      <form className="space-y-3">
        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="username"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Name
            </label>
          </div>
          <div className="mt-2">
            <input
              type="string"
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
          <div className="flex items-center justify-between">
            <label
              htmlFor="dob"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Date of Birth
            </label>
          </div>

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
        </div>
        <div>
          <button
            type="submit"
            onClick={handleSubmit}
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {processing ? <Loader className="animate-spin" /> : "Update User"}
          </button>
        </div>
        {message && <p className="text-red-500 text-center">{message}</p>}
      </form>
    </>
  );
}

function UpdateUser({ data }) {
  const dialogRef = useRef(null);
  const openDialog = () => dialogRef.current.showModal();
  const closeDialog = () => dialogRef.current.close();
  return (
    <div className="flex flex-col items-center gap-4">
      {/* Updated Update User Button */}
      <button
        onClick={openDialog}
        className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-md hover:bg-blue-600 transition-colors"
        aria-label="Update User"
      >
        <Pencil size={20} />
      </button>
      <dialog
        ref={dialogRef}
        className="fixed left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%] p-6 border rounded-md min-w-[350px] bg-white"
      >
        <div className="w-full flex flex-row justify-between items-center">
          {/* Centered and Bold Text */}
          <div className="flex-grow flex justify-center items-center font-bold text-lg">
            Update the user
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
        <UserUpdateForm data={data} />
      </dialog>
    </div>
  );
}

export default UpdateUser;
