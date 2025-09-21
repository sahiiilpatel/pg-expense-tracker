"use client";

import { useState, useEffect } from "react";
import Header from "./components/Header";
import Tabs from "./components/Tabs";
import Login from "./components/Login";
import Register from "./components/Register";
import OTPVerification from "./components/OTPVerification";
import UserList from "./components/UserList";
import Entry from "./components/Entry";
import Records from "./components/Records";
import Summary from "./components/Summary";
import Collector from "./components/Collector";
import Settings from "./components/Settings";
import { loadData, saveData } from "./utils/storage";
import { loadUsers, saveUsers, generateOtp } from "./utils/userStorage";

export default function App() {
  const [activeTab, setActiveTab] = useState("records");
  const [transactions, setTransactions] = useState([]);
  const [personList, setPersonList] = useState([]);
  const [collector, setCollector] = useState({});
  const [monthlyResidents, setMonthlyResidents] = useState({});
  const [isClient, setIsClient] = useState(false);
  const [users, setUsers] = useState([]);

  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState("login"); // login, register, otp
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [otpInput, setOtpInput] = useState("");

  // Load app data and users
  useEffect(() => {
    const data = loadData();
    setTransactions(data.transactions);
    setPersonList(data.personList);
    setCollector(data.collector);
    setMonthlyResidents(data.monthlyResidents);

    const sessionUser = localStorage.getItem("pgUser");
    if (sessionUser) setUser(JSON.parse(sessionUser));

    let storedUsers = loadUsers();
    // Ensure superadmin exists
    if (!storedUsers.find((u) => u.username === "superadmin")) {
      storedUsers.push({
        username: "superadmin",
        password: "admin123",
        role: "admin",
        otp: null,
        isVerified: true,
      });
      saveUsers(storedUsers);
    }

    setUsers(storedUsers);
    setIsClient(true);
  }, []);

  // Save transactions and app data
  useEffect(() => {
    if (!isClient) return;
    saveData({ transactions, personList, collector, monthlyResidents });
  }, [transactions, personList, collector, monthlyResidents, isClient]);

  if (!isClient) return null;

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("pgUser");

    // Reset auth state
    setAuthMode("login");      // redirect to login page
    setUsername("");           // clear username field
    setPassword("");           // clear password field
    setOtpInput("");           // clear OTP field
  };

  const handleLogin = () => {
    const existingUser = users.find((u) => u.username === username);
    if (!existingUser) return alert("User not found");
    if (existingUser.password !== password) return alert("Invalid password");
    if (!existingUser.isVerified) return setAuthMode("otp");
    localStorage.setItem("pgUser", JSON.stringify(existingUser));
    setUser(existingUser);
  };

  const handleRegister = () => {
    if (users.find((u) => u.username === username)) return alert("Username exists");
    const otp = generateOtp();
    const newUser = { username, password, role: "user", otp, isVerified: false };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    saveUsers(updatedUsers);
    setAuthMode("otp");
  };

  const handleOTPVerify = () => {
    const updatedUsers = users.map((u) => {
      if (u.username === username && u.otp === otpInput) {
        return { ...u, isVerified: true, otp: null };
      }
      return u;
    });
    setUsers(updatedUsers);
    saveUsers(updatedUsers);

    const verifiedUser = updatedUsers.find((u) => u.username === username);
    if (verifiedUser.isVerified) {
      localStorage.setItem("pgUser", JSON.stringify(verifiedUser));
      setUser(verifiedUser);

      setOtpInput("");

      alert("Registration completed!");
    } else {
      alert("Invalid OTP");
    }
  };

  const resendOtp = (username) => {
    const updatedUsers = users.map(u => {
      if (u.username === username && !u.isVerified) {
        return { ...u, otp: generateOtp() };
      }
      return u;
    });
    setUsers(updatedUsers);
    saveUsers(updatedUsers);
    const u = updatedUsers.find(u => u.username === username);
    alert(`New OTP for ${username}: ${u.otp}`);
  };

  const deleteUser = (username) => {
    if (!window.confirm(`Delete user ${username}?`)) return;
    const updatedUsers = users.filter(u => u.username !== username);
    setUsers(updatedUsers);
    saveUsers(updatedUsers);
  };

  // Render login/register/OTP pages
  if (!user) {
    if (authMode === "login")
      return (
        <Login
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
          onSubmit={handleLogin}
          toggleMode={() => setAuthMode("register")}
        />
      );
    if (authMode === "register")
      return (
        <Register
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
          onSubmit={handleRegister}
          toggleMode={() => setAuthMode("login")}
        />
      );
    if (authMode === "otp")
      return (
        <OTPVerification
          username={username}
          otpInput={otpInput}
          setOtpInput={setOtpInput}
          onVerify={handleOTPVerify}
        />
      );
  }

  const allTabs = [
    { id: "entry", label: "📝 New Entry" },
    { id: "records", label: "📊 All Records" },
    { id: "summary", label: "💰 Summary" },
    { id: "collector", label: "👤 PG Collection Summary" },
    { id: "settings", label: "⚙️ Settings" },
  ];

  const userTabs =
    user.role === "admin"
      ? [...allTabs, { id: "users", label: "👥 Users" }]
      : allTabs.filter((t) =>
        ["records", "summary", "collector"].includes(t.id)
      );

  const renderTab = () => {
    switch (activeTab) {
      case "entry":
        return <Entry transactions={transactions} setTransactions={setTransactions} personList={personList} collector={collector} setCollector={setCollector} />;
      case "records":
        return <Records transactions={transactions} setTransactions={setTransactions} collector={collector} setCollector={setCollector} />;
      case "summary":
        return <Summary transactions={transactions} />;
      case "collector":
        return <Collector collector={collector} />;
      case "settings":
        return <Settings
          personList={personList}
          setPersonList={setPersonList}
          collector={collector}
          setCollector={setCollector}
          monthlyResidents={monthlyResidents}
          setMonthlyResidents={setMonthlyResidents}
          users={users}
          setUsers={setUsers}
        />;
      case "users":
        return <UserList users={users} resendOtp={resendOtp} deleteUser={deleteUser} />;
      default:
        return null;
    }
  };

  return (
    <div className="container">
      <Header onLogout={handleLogout} />
      <p className="subtitle">Manage shared expenses and track monthly rent</p>
      <Tabs tabs={userTabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      {renderTab()}
    </div>
  );
}
