import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../superbase-client";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState(undefined);
  const [userProfiles, setUserProfiles] = useState([]);

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
    name: string,
    accountType: string,
  ) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        //add meta user data in user tabel of supabase
        options: {
          data: {
            name,
            account_type: accountType,
          },
        },
      });
      if (error) {
        throw error;
      }
      setSession(data.session);
      return { success: true, data };
    } catch (error) {
      console.error("Error signing up:", error.message);
    }
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

  const getAllUserProfiles = async () => {
    try {
      const { data, error } = await supabase.from("user_profiles").select(
        `id,
        name,
        account_type
        `,
      );

      if (error) {
        throw error;
      }
      setUserProfiles(data);
      console.log("Users Data", data);
    } catch (error) {
      console.error("Error Getting fetching the user profiles", error.message);
    }
  };

  useEffect(() => {
    getInitialSession();

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      // console.log("Session Changed", session);
    });
  }, []);

  useEffect(() => {
    if (!session) return;
    getAllUserProfiles();
  }, [session]);

  return (
    <AuthContext.Provider
      value={{ session, signInUser, signUpUser, userProfiles }}
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
