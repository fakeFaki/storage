import "./App.css";
import React, { useState, useEffect } from "react";
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
  const [loginStatus, setLoginStatus] = useState("شما وارد نشده‌اید");

  // استفاده از useEffect برای چک کردن وضعیت لاگین بعد از بارگذاری کامپوننت
  useEffect(() => {
    //localStorage بررسی در
    const userLocalStorage = JSON.parse(localStorage.getItem("user") || "{}");

    if (userLocalStorage.token) {
      setLoginStatus("شما وارد شده‌اید");
      return;
    }

    //sessionStorage بررسی در
    const userSessionStorage = JSON.parse(
      sessionStorage.getItem("user") || "{}"
    );
    if (userSessionStorage.token) {
      setLoginStatus("شما وارد شده‌اید");
      return;
    }

    // بررسی در کوکی‌ها

    const userCookie = document?.cookie
      ? JSON.parse(document?.cookie?.split("=")?.[1])
      : null;

    if (userCookie?.token) {
      setLoginStatus("شما وارد شده‌اید");
      return;
    }

    //IndexedDB بررسی در
    const request = indexedDB.open("authDB", 1);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction("user", "readonly");
      const store = transaction.objectStore("user");

      const getAllRequest = store.getAll();

      getAllRequest.onsuccess = () => {
        const users = getAllRequest.result;
        if (users.length && users[0].token) {
          setLoginStatus("شما وارد شده‌اید");
        }
      };
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await axios.get(
      `http://localhost:4000/users?username=${username}&password=${password}`
    );
    if (res.data.length) {
      const user = res.data[0];

      // ذخیره داده‌ها در ذخیره‌سازی مختلف
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

      setLoginStatus("شما وارد شده‌اید");
      alert("✅ ورود موفق");
    } else {
      alert("❌ نام کاربری یا رمز عبور نادرست است");
    }
  };

  return (
    <div>
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
      <p>{loginStatus}</p>
    </div>
  );
};

export default LoginForm;
