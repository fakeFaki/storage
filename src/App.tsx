import "./App.css";
import React, { useState } from "react";
import axios from "axios";
import {
  saveLocalStorage,
  saveSession,
  saveCookie,
  saveIndexedDB,
} from "./storage";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [method, setMethod] = useState("localStorage");

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await axios.get(
      `http://localhost:4000/users?username=${username}&password=${password}`
    );
    if (res.data.length) {
      const user = res.data[0];
      switch (method) {
        case "localStorage":
          saveLocalStorage(user);
          break;
        case "sessionStorage":
          saveSession(user);
          break;
        case "cookie":
          saveCookie(user);
          break;
        case "indexedDB":
          saveIndexedDB(user);
          break;
        default:
          break;
      }
      alert("✅ ورود موفق");
    } else {
      alert("❌ نام کاربری یا رمز عبور نادرست است");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>ورود</h2>
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="نام کاربری"
      />
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        placeholder="رمز"
      />
      <select value={method} onChange={(e) => setMethod(e.target.value)}>
        <option value="localStorage">LocalStorage</option>
        <option value="sessionStorage">SessionStorage</option>
        <option value="cookie">Cookie</option>
        <option value="indexedDB">IndexedDB</option>
      </select>
      <button type="submit">ورود</button>
    </form>
  );
};

export default LoginForm;
