/** @type {import('tailwindcss').Config} */
export default {
  content: ["./*.html"],
  theme: {
    extend: {
      colors: {
        primary: "#1A2E44",
        secondary: "#707781",
        tertiary: "#D48C45",
        neutral: "#F8F9FA",
        ink: "#1F2933",
        border: "#D7DCE2",
      },
      borderRadius: {
        soft: "1rem",
        card: "1.5rem",
        pill: "8px",
      },
      boxShadow: {
        soft: "0 10px 30px rgba(26, 46, 68, 0.08)",
        card: "0 24px 60px rgba(31, 41, 51, 0.12)",
      },
      maxWidth: {
        container: "72rem",
      },
    },
  },
  plugins: [],
}
