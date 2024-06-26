import endpoint from "@/utility/axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UseGetProfile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    async function fetchUserProfile() {
      const userId = localStorage.getItem("userId");
      if (!userId) return navigate("/login");
      const result = await endpoint.get(`/users/${userId}`);
      // console.log(result);
      setUser({
        name: result.data.fullName,
        email: result.data.email,
        role: result.data.role,
        salonId: result.data?.Salon?.salonId || undefined,
        imageUrl: result.data?.imageUrl,
      });
    }

    fetchUserProfile();
  }, []);
  return user;
};

export default UseGetProfile;
