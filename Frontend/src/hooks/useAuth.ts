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
    const [user, setUser] =
        useState<User | null>(null);

    const [loading, setLoading] =
        useState(true);

    // LOAD USER
    const loadUser = async () => {
        try {
            const res = await getProfile();

            console.log("PROFILE RESPONSE:", res);

            if (res.success && res.user) {
                setUser(res.user);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.log(
                "LOAD USER ERROR:",
                error
            );

            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            loadUser();
        }, 500);

        return () => clearTimeout(timer);
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
        }

        return res;
    };

    // LOGOUT
    const logout = async () => {
        await logoutUser();

        setUser(null);
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