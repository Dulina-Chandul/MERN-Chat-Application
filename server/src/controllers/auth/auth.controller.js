export const authController = {
  signUp: async (req, res) => {
    const { fullname, email, password } = req.body;

    try {
      if (!fullname || !email || !password) {
        return res.status(400).json({ message: "Please fill all the fields" });
      }

      if (password.length < 6) {
        return res
          .status(400)
          .json({ message: "Password must be at least 6 characters long" });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Please enter a valid email" });
      }
    } catch (error) {}
  },
};
