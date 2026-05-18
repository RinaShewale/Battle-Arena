import { useEffect, useState } from "react";

import {
  loginUser,
  registerUser,
  logoutUser,
  getProfile,
  updateProfile,
} from "../services/auth.api";

type User = {
  _id: string;
  name: string;
  email: string;
};

export const useAuth = () => {
  // INSTANT USER RESTORE
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored =
        localStorage.getItem("user");

      return stored
        ? JSON.parse(stored)
        : null;
    } catch {
      return null;
    }
  });

  // START FALSE
  const [loading, setLoading] =
    useState(false);

  // LOAD USER
  const loadUser = async () => {
    try {
      setLoading(true);

      const res = await getProfile();

      console.log(
        "PROFILE RESPONSE:",
        res
      );

      if (res.success && res.user) {
        setUser(res.user);

        // SAVE USER
        localStorage.setItem(
          "user",
          JSON.stringify(res.user)
        );
      } else {
        setUser(null);

        localStorage.removeItem("user");
      }
    } catch (error) {
      console.log(
        "LOAD USER ERROR:",
        error
      );

      setUser(null);

      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  };

  // REMOVE DELAY
  useEffect(() => {
    loadUser();
  }, []);

  // LOGIN
  const login = async (
    email: string,
    password: string
  ) => {
    const res = await loginUser({
      email,
      password,
    });

    if (res.user) {
      setUser(res.user);

      // SAVE USER
      localStorage.setItem(
        "user",
        JSON.stringify(res.user)
      );
    }

    return res;
  };

  // REGISTER
  const register = async (
    name: string,
    email: string,
    password: string
  ) => {
    const res = await registerUser({
      name,
      email,
      password,
    });

    if (res.user) {
      setUser(res.user);

      // SAVE USER
      localStorage.setItem(
        "user",
        JSON.stringify(res.user)
      );
    }

    return res;
  };

  // LOGOUT
  const logout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.log(
        "LOGOUT ERROR:",
        error
      );
    }

    setUser(null);

    localStorage.removeItem("user");
  };

  // UPDATE PROFILE
  const updateUserProfile = async (
    name: string
  ) => {
    try {
      const res = await updateProfile({
        name,
      });

      if (res.success) {
        setUser(res.user);

        // UPDATE STORAGE
        localStorage.setItem(
          "user",
          JSON.stringify(res.user)
        );
      }

      return res;
    } catch (error) {
      console.log(
        "UPDATE PROFILE ERROR:",
        error
      );

      throw error;
    }
  };

  return {
    user,
    loading,
    login,
    register,
    logout,
    refreshUser: loadUser,
    isAuthenticated: !!user,
    updateUserProfile,
  };
};