import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [signup, isSigningUp] = useAuthStore();

  const handleSubmit = (e) => {};

  return <div>SignUpPage</div>;
};

export default SignUpPage;
