import "./App.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  saveLocalStorage,
  saveSession,
  saveCookie,
  saveIndexedDB,
} from "./storage";

const LoginForm = () => {
  const [loginStatus, setLoginStatus] = useState(false);

  // Effect to check login status on load
  useEffect(() => {
    // Check in localStorage
    const userLocalStorage = JSON.parse(localStorage.getItem("user") || "{}");
    if (userLocalStorage.token) {
      setLoginStatus(true);
      return;
    }

    // Check in sessionStorage
    const userSessionStorage = JSON.parse(
      sessionStorage.getItem("user") || "{}"
    );
    if (userSessionStorage.token) {
      setLoginStatus(true);
      return;
    }

    // Check in cookies
    const userCookie = document?.cookie
      ? JSON.parse(document?.cookie?.split("=")?.[1])
      : null;
    if (userCookie?.token) {
      setLoginStatus(true);
      return;
    }

    // Check in IndexedDB
    const request = indexedDB.open("authDB", 1);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction("user", "readonly");
      const store = transaction.objectStore("user");

      const getAllRequest = store.getAll();
      getAllRequest.onsuccess = () => {
        const users = getAllRequest.result;
        if (users.length && users[0].token) {
          setLoginStatus(true);
        }
      };
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Get values directly from the form elements
    const form = e.target as HTMLFormElement;
    const username = form.username.value;
    const password = form.password.value;
    const method = form.method.value;

    if (!loginStatus) {
      form.reset();

      if (!username.trim() || !password.trim()) {
        alert("❌ لطفاً نام کاربری و رمز عبور را وارد کنید");
        return;
      }
      const res = await axios.get(
        `http://localhost:4000/users?username=${username}&password=${password}`
      );
      if (res.data.length) {
        const user = res.data[0];

        // Save data in selected storage method
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

        setLoginStatus(true);
        alert("✅ ورود موفق");
      } else {
        alert("❌ نام کاربری یا رمز عبور نادرست است");
      }
    } else {
      // Clear data from storage
      localStorage.clear();
      sessionStorage.clear();

      // Clear cookies
      document.cookie.split(";").forEach((cookie) => {
        document.cookie =
          cookie.trim().split("=")[0] +
          "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      });

      // Clear IndexedDB
      if (indexedDB.databases) {
        indexedDB.databases().then((dbs) => {
          dbs.forEach((db) => indexedDB.deleteDatabase(db.authDB));
        });
      }

      setLoginStatus(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <h2>ورود</h2>
        <input name="username" placeholder="نام کاربری" />
        <input name="password" type="password" placeholder="رمز" />
        <select name="method">
          <option value="localStorage">LocalStorage</option>
          <option value="sessionStorage">SessionStorage</option>
          <option value="cookie">Cookie</option>
          <option value="indexedDB">IndexedDB</option>
        </select>
        <button type="submit">{loginStatus ? "خروج" : "ورود"}</button>
      </form>
      <p style={{ fontSize: "3rem", margin: "3rem", fontWeight: "bold" }}>
        {loginStatus ? "شما وارد شده‌اید" : "شما وارد نشده اید"}
      </p>
    </div>
  );
};

export default LoginForm;
