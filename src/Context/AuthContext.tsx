import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../superbase-client";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState(undefined);
  // const [userProfiles, setUserProfiles] = useState([]);

  const signInUser = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        throw error;
      }
      setSession(data.session);
      return { success: true, data };
    } catch (error) {
      console.error("Error signing in:", error.message);
    }
  };

  const signUpUser = async (
    email: string,
    password: string,
    full_name: string,
    phone: string,
    address: string,
    account_type: string,
  ) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name,
            phone,
            address,
            account_type,
          },
        },
      });

      if (error) {
        throw error;
      }

      if (data.session) {
        setSession(data.session);
      }

      return {
        success: true,
        data,
        message: data.session
          ? "Sign up successful"
          : "Sign up successful. Please check your email to confirm your account.",
      };
    } catch (error: any) {
      console.error("Error signing up:", error.message);

      return {
        success: false,
        message: error.message,
      };
    }
  };

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:5173",
      },
    });

    if (error) {
      console.error("Google login error:", error.message);
      return { success: false, message: error.message };
    }

    return { success: true, data };
  };
  const getInitialSession = async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        throw error;
      }
      setSession(data.session);
      // console.log(data.session);
    } catch (error) {
      console.error("Error getting initial session:", error.message);
    }
  };

  // const getAllUserProfiles = async () => {
  //   try {
  //     const { data, error } = await supabase.from("profiles").select(
  //       `id,
  //       full_name,
  //       phone,
  //       address,
  //       account_type
  //       `,
  //     );

  //     if (error) {
  //       throw error;
  //     }
  //     setUserProfiles(data);
  //     console.log("Users Data", userProfiles);
  //   } catch (error) {
  //     console.error("Error Getting fetching the user profiles", error.message);
  //   }
  // };

  useEffect(() => {
    getInitialSession();

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      // console.log("Session Changed", session);
    });
  }, []);

  // useEffect(() => {
  //   if (!session) return;
  //   getAllUserProfiles();
  // }, [session]);

  return (
    <AuthContext.Provider
      value={{
        session,
        signInUser,
        signUpUser,
        // userProfiles,
        signInWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
