import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { theme } from "./theme.js";
import { applyTheme } from "./applyTheme.js";
import "./styles.css";

applyTheme(theme);
createRoot(document.getElementById("root")).render(<App />);
