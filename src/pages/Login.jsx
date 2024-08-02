import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../contexts/AuthProvider/AuthProvider";
import toast from "react-hot-toast";

function Login({ setLogin }) {
  const { handleLogin } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm();

  const onSubmit = async (data) => {
    clearErrors(); // Clear any previous errors

    try {
      const response = await handleLogin(data.phoneNumber, data.password);
      console.log("response", response);
      if (response.success) {
        console.log("Login successful");
        toast.success("Login successful");
      } else {
        setError("apiError", {
          type: "manual",
          message: response.error,
        });
      }
    } catch (err) {
      setError("apiError", {
        type: "manual",
        message: "Login failed. Please check your phone number and password.",
      });
    }
  };

  console.log("errors", errors);
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Login
        </h2>
        {errors.apiError && (
          <div className="mb-4 text-red-500 text-center">
            {errors.apiError.message}
          </div>
        )}
        <div className="mb-4">
          <input
            type="text"
            name="phoneNumber"
            placeholder="Phone Number"
            {...register("phoneNumber", {
              required: "Phone number is required",
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.phoneNumber && (
            <p className="text-red-500 text-sm mt-1">
              {errors.phoneNumber.message}
            </p>
          )}
        </div>
        <div className="mb-4">
          <input
            type="password"
            name="password"
            placeholder="Password"
            {...register("password", { required: "Password is required" })}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>
        <p className="py-2 text-sm">
          Don't have an account?{" "}
          <span
            onClick={() => setLogin(false)}
            className="text-blue-500 cursor-pointer"
          >
            Register
          </span>
        </p>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
