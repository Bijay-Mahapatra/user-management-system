import React from "react";
import { Loader } from "lucide-react";
import PropTypes from "prop-types";

function LoginForm({ setToggleLoginOrSignup }) {
  const [value, setValue] = React.useState({
    email: "",
    password: "",
  });
  const [processing, setProcessing] = React.useState(false);
  const [message, setMessage] = React.useState("");

  const handleChange = (e) => {
    setValue({ ...value, [e.target.name]: e.target.value });
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidEmail(value.email)) {
      setMessage("Invalid email address");
      return;
    }
    if (value.password === "") {
      setMessage("Password cannot be empty");
      return;
    }
    try {
      setProcessing(true);
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(value),
        credentials: "include",
      });
      setProcessing(false);
      if (response.status !== 200) {
        setMessage("Invalid username or password");
        return;
      } else {
        window.location.replace("/dashboard");
      }
    } catch (error) {
      setMessage(`An error occurred, please try again later. ${error}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email Address
        </label>
        <input
          type="email"
          name="email"
          id="email"
          value={value.email}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Enter your email"
        />
      </div>
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <input
          type="password"
          name="password"
          id="password"
          value={value.password}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Enter your password"
        />
      </div>
      <button
        type="submit"
        disabled={processing}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 hover:cursor-pointer"
      >
        {processing ? (
          <Loader className="animate-spin h-5 w-5 mr-2" />
        ) : (
          "Sign In"
        )}
      </button>
      {message && <p className="text-sm text-red-500 mt-2">{message}</p>}
    </form>
  );
}

function SignupForm({ setToggleLoginOrSignup }) {
  const [value, setValue] = React.useState({
    name: "",
    email: "",
    password: "",
  });
  const [processing, setProcessing] = React.useState(false);
  const [message, setMessage] = React.useState("");

  const handleChange = (e) => {
    setValue({ ...value, [e.target.name]: e.target.value });
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (value.name === "") {
      setMessage("Name cannot be empty");
      return;
    }
    if (!isValidEmail(value.email)) {
      setMessage("Invalid email address");
      return;
    }
    if (value.password === "") {
      setMessage("Password cannot be empty");
      return;
    }
    try {
      setProcessing(true);
      const response = await fetch("http://localhost:8000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(value),
        credentials: "include",
      });
      setProcessing(false);
      if (response.status !== 201) {
        const data = await response.json();
        setMessage(data.error || "User registration failed");
        return;
      } else {
        setToggleLoginOrSignup(true);
      }
    } catch (error) {
      setMessage(`An error occurred, please try again later. ${error}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          value={value.name}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Enter your name"
        />
      </div>
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email Address
        </label>
        <input
          type="email"
          name="email"
          id="email"
          value={value.email}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Enter your email"
        />
      </div>
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <input
          type="password"
          name="password"
          id="password"
          value={value.password}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Enter your password"
        />
      </div>
      <button
        type="submit"
        disabled={processing}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 hover:cursor-pointer"
      >
        {processing ? (
          <Loader className="animate-spin h-5 w-5 mr-2" />
        ) : (
          "Sign Up"
        )}
      </button>
      {message && <p className="text-sm text-red-500 mt-2">{message}</p>}
    </form>
  );
}

SignupForm.propTypes = {
  setToggleLoginOrSignup: PropTypes.func.isRequired,
};

const AuthenticationForm = () => {
  const [toggleLoginOrSignup, setToggleLoginOrSignup] = React.useState(true);

  return (
    <div
      style={{
        backgroundColor: "#DAD2FF",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      className="backdrop-blur-sm"
    >
      <div className="max-w-md w-full space-y-8 bg-white bg-opacity-70 p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center" >
          {toggleLoginOrSignup ? "Sign In" : "Sign Up"}
        </h2>
        {toggleLoginOrSignup ? (
          <LoginForm setToggleLoginOrSignup={setToggleLoginOrSignup} />
        ) : (
          <SignupForm setToggleLoginOrSignup={setToggleLoginOrSignup} />
        )}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            {toggleLoginOrSignup
              ? "Don't have an account?"
              : "Already have an account?"}{" "}
            <button
              onClick={() => setToggleLoginOrSignup(!toggleLoginOrSignup)}
              className="font-medium text-indigo-600 hover:text-indigo-500 hover:cursor-pointer"
            >
              Sign {toggleLoginOrSignup ? "up" : "in"} here
            </button>
          </p>
          {/* Social Media Icons */}
          <div className="mt-4 flex justify-center space-x-4">
            <a
              href="https://www.linkedin.com/company/vidhema-technologies/"
              target="_blank"
              className="text-gray-500 hover:text-blue-600 transition duration-300"
              aria-label="LinkedIn"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" rx="2" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-sky-500 transition duration-300"
              aria-label="Twitter"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
              </svg>
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-pink-500 transition duration-300"
              aria-label="Instagram"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthenticationForm;
