import { useState } from "react";
import loginImage from "../assets/img/LoginBanner.png";
import type { LoginData, SignUpData } from "../type/type";
import { LoginSchema } from "../schemas/auth.schema";
import { useAuth } from "../Context/AuthContext";

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);

  const [zodError, setZodError] = useState<
    Record<string, string[] | undefined>
  >({});

  const { signInUser, signUpUser, signInWithGoogle } = useAuth();

  const [loginData, setLoginData] = useState<LoginData>({
    email: "",
    password: "",
  });

  const [signUpData, setSignUpData] = useState<SignUpData>({
    email: "",
    password: "",
    full_name: "",
    phone: "",
    address: "",
    account_type: "user",
  });

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setLoginData({
      ...loginData,
      [name]: value,
    });

    setZodError({});
  };

  const handleSignUpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setSignUpData({
      ...signUpData,
      [name]: value,
    });

    setZodError({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSignUp) {
      const result = await signUpUser(
        signUpData.email,
        signUpData.password,
        signUpData.full_name,
        signUpData.phone,
        signUpData.address,
        signUpData.account_type,
      );

      alert(result?.message);

      if (!result?.success) return;

      setSignUpData({
        email: "",
        password: "",
        full_name: "",
        phone: "",
        address: "",
        account_type: "user",
      });
    } else {
      const zodResult = LoginSchema.safeParse(loginData);

      if (!zodResult.success) {
        setZodError(zodResult.error.flatten().fieldErrors);
        return;
      }

      setZodError({});

      const result = await signInUser(loginData.email, loginData.password);

      console.log("Result After Log In", result);

      setLoginData({
        email: "",
        password: "",
      });
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center p-5 bg-gray-100">
      <div className="w-full md:w-[90%] bg-white rounded-xl shadow-lg overflow-hidden flex flex-row">
        <div className="hidden md:flex w-[40%]">
          <img
            src={loginImage}
            alt="Dog and Cat"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="w-full md:w-[60%] flex items-center justify-center p-10">
          <div className="w-full md:w-[70%]">
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

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div>
                  <label className="block mb-1 text-sm font-medium">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="full_name"
                    value={signUpData.full_name}
                    placeholder="Enter your full name"
                    onChange={handleSignUpChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                  />

                  {zodError.full_name && (
                    <p className="text-red-500 text-sm mt-1">
                      {zodError.full_name[0]}
                    </p>
                  )}
                </div>
              )}

              <div>
                <label className="block mb-1 text-sm font-medium">Email</label>

                <input
                  type="email"
                  name="email"
                  value={isSignUp ? signUpData.email : loginData.email}
                  placeholder="Enter your email"
                  onChange={isSignUp ? handleSignUpChange : handleLoginChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                />

                {zodError.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {zodError.email[0]}
                  </p>
                )}
              </div>

              {isSignUp && (
                <div>
                  <label className="block mb-1 text-sm font-medium">
                    Phone
                  </label>

                  <input
                    type="text"
                    name="phone"
                    value={signUpData.phone}
                    placeholder="Enter your phone number"
                    onChange={handleSignUpChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                  />

                  {zodError.phone && (
                    <p className="text-red-500 text-sm mt-1">
                      {zodError.phone[0]}
                    </p>
                  )}
                </div>
              )}

              {isSignUp && (
                <div>
                  <label className="block mb-1 text-sm font-medium">
                    Address
                  </label>

                  <input
                    type="text"
                    name="address"
                    value={signUpData.address}
                    placeholder="Enter your address"
                    onChange={handleSignUpChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                  />

                  {zodError.address && (
                    <p className="text-red-500 text-sm mt-1">
                      {zodError.address[0]}
                    </p>
                  )}
                </div>
              )}

              <div>
                <label className="block mb-1 text-sm font-medium">
                  Password
                </label>

                <input
                  type="password"
                  name="password"
                  value={isSignUp ? signUpData.password : loginData.password}
                  placeholder="Enter your password"
                  onChange={isSignUp ? handleSignUpChange : handleLoginChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                />

                {zodError.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {zodError.password[0]}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-[var(--color-bg)] text-white py-3 rounded-lg hover:bg-[#0C381B] transition"
              >
                {isSignUp ? "Sign Up" : "Login"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                {isSignUp
                  ? "Already have an account?"
                  : "Don't have an account?"}

                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setZodError({});
                  }}
                  className="ml-2 text-black font-semibold"
                >
                  {isSignUp ? "Login" : "Sign Up"}
                </button>
              </p>
            </div>

            <button
              type="button"
              onClick={signInWithGoogle}
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
