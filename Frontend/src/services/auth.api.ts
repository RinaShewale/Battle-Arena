import api from "./api";

/* REGISTER */
export const registerUser = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

/* LOGIN */
export const loginUser = async (data: {
  email: string;
  password: string;
}) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};

/* PROFILE */
export const getProfile = async () => {
  const res = await api.get("/auth/profile");
  return res.data;
};

/* LOGOUT */
export const logoutUser = async () => {
  const res = await api.post("/auth/logout");
  return res.data;
};


// UPDATE PROFILE
export const updateProfile = async (
  data: { name: string }
) => {
  const response = await api.put(
    "/auth/profile",
    data
  );

  return response.data;
};

/* GOOGLE LOGIN */
export const googleLogin = () => {
  window.location.href = "https://battle-arena-589s.onrender.com/api/auth/google";
};