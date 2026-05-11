import { useState } from "react";
import loginImage from "../assets/img/LoginBanner.png";

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="w-full min-h-screen flex justify-center items-center p-5 bg-gray-100">
      <div className="w-full md:w-[90%] bg-white rounded-xl shadow-lg overflow-hidden flex flex-row">
        {/* Left Image */}
        <div className="hidden md:flex w-[40%]">
          <img
            src={loginImage}
            alt="Dog and Cat"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Form */}
        <div className="w-full md:w-[60%] flex items-center justify-center p-10">
          <div className="w-full md:w-[70%]">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">
                {isSignUp ? "Create Account" : "Welcome Back"}
              </h1>

              <p className="text-gray-500">
                {isSignUp
                  ? "Create your account to continue"
                  : "Manage your pet's favourites and track your orders"}
              </p>
            </div>

            {/* Form */}
            <form className="space-y-4">
              {/* Full Name */}
              {isSignUp && (
                <div>
                  <label className="block mb-1 text-sm font-medium">
                    Full Name
                  </label>

                  <input
                    type="text"
                    placeholder="Enter your full name"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block mb-1 text-sm font-medium">Email</label>

                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              {/* Phone */}
              {isSignUp && (
                <div>
                  <label className="block mb-1 text-sm font-medium">
                    Phone
                  </label>

                  <input
                    type="text"
                    placeholder="Enter your phone number"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>
              )}

              {/* Address */}
              {isSignUp && (
                <div>
                  <label className="block mb-1 text-sm font-medium">
                    Address
                  </label>

                  <input
                    type="text"
                    placeholder="Enter your address"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>
              )}

              {/* Password */}
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Password
                </label>

                <input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              {/* Button */}
              <button
                type="submit"
                className="w-full bg-[var(--color-bg)] text-white py-3 rounded-lg hover:bg-[#0C381B] transition"
              >
                {isSignUp ? "Sign Up" : "Login"}
              </button>
            </form>

            {/* Toggle */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                {isSignUp
                  ? "Already have an account?"
                  : "Don't have an account?"}

                <button
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="ml-2 text-black font-semibold"
                >
                  {isSignUp ? "Login" : "Sign Up"}
                </button>
              </p>
            </div>

            <button
              type="button"
              className="w-full border border-gray-300 py-3 mt-6 rounded-lg flex items-center justify-center gap-3 hover:bg-gray-50 transition cursor-pointer"
            >
              <span className="text-lg font-bold">G</span>
              <span className="font-medium">Continue with Google</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
