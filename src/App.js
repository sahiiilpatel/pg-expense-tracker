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
import { generateOtp } from "./utils/userStorage";

export default function App() {
  const [activeTab, setActiveTab] = useState("records");
  const [transactions, setTransactions] = useState([]);
  const [personList, setPersonList] = useState([]);
  const [collector, setCollector] = useState({});
  const [monthlyResidents, setMonthlyResidents] = useState({});
  const [users, setUsers] = useState([]);
  const [isClient, setIsClient] = useState(false);

  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState("login"); // login, register, otp
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [otpInput, setOtpInput] = useState("");

  // Load app data and users
  useEffect(() => {
    async function fetchData() {
      const data = await loadData();

      setTransactions(data.transactions || []);
      setPersonList(data.personList || []);
      setCollector(data.collector || { name: "", collected: 0, paid: 0, savings: 0, pending: {} });
      setMonthlyResidents(data.monthlyResidents || {});
      let storedUsers = data.users || [];

      // Ensure superadmin exists
      if (!storedUsers.find(u => u.username === "superadmin")) {
        storedUsers.push({
          username: "superadmin",
          password: "admin123",
          role: "admin",
          otp: null,
          isVerified: true,
        });
      }

      setUsers(storedUsers);

      // Check session user
      const sessionUser = localStorage.getItem("pgUser");
      if (sessionUser) setUser(JSON.parse(sessionUser));

      setIsClient(true);
    }
    fetchData();
  }, []);

  // Save data on changes
  useEffect(() => {
    if (!isClient) return;
    saveData({ transactions, users, monthlyResidents, collector }).catch(err =>
      console.error("Failed to save data:", err)
    );
  }, [transactions, personList, collector, monthlyResidents, users, isClient]);

  // Logout
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("pgUser");
    setAuthMode("login");
    setUsername("");
    setPassword("");
    setOtpInput("");
  };

  // Login
  const handleLogin = () => {
    const existingUser = users.find(u => u.username === username);
    if (!existingUser) return alert("User not found");
    if (existingUser.password !== password) return alert("Invalid password");
    if (!existingUser.isVerified) return setAuthMode("otp");

    localStorage.setItem("pgUser", JSON.stringify(existingUser));
    setUser(existingUser);
  };

  // Register
  const handleRegister = async () => {
    if (users.find(u => u.username === username)) return alert("Username exists");

    const otp = generateOtp();
    const newUser = { username, password, role: "user", otp, isVerified: false };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);

    await saveData({ transactions, users: updatedUsers, monthlyResidents, collector });

    setAuthMode("otp");
  };

  // Verify OTP
  const handleOTPVerify = async () => {
    const updatedUsers = users.map(u => {
      if (u.username === username && u.otp === otpInput) {
        return { ...u, isVerified: true, otp: null };
      }
      return u;
    });

    setUsers(updatedUsers);
    await saveData({ transactions, users: updatedUsers, monthlyResidents, collector });

    const verifiedUser = updatedUsers.find(u => u.username === username);
    if (verifiedUser && verifiedUser.isVerified) {
      localStorage.setItem("pgUser", JSON.stringify(verifiedUser));
      setUser(verifiedUser);
      setOtpInput("");
      alert("Registration completed!");
    } else {
      alert("Invalid OTP");
    }
  };

  // Resend OTP
  const resendOtp = async (username) => {
    const updatedUsers = users.map(u => {
      if (u.username === username && !u.isVerified) {
        return { ...u, otp: generateOtp() };
      }
      return u;
    });
    setUsers(updatedUsers);
    await saveData({ transactions, users: updatedUsers, monthlyResidents, collector });

    const u = updatedUsers.find(u => u.username === username);
    alert(`New OTP for ${username}: ${u.otp}`);
  };

  // Delete User
  const deleteUser = async (username) => {
    if (!window.confirm(`Delete user ${username}?`)) return;
    const updatedUsers = users.filter(u => u.username !== username);
    setUsers(updatedUsers);
    await saveData({ transactions, users: updatedUsers, monthlyResidents, collector });
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
      : allTabs.filter(t => ["records", "summary", "collector"].includes(t.id));

  const renderTab = () => {
    switch (activeTab) {
      case "entry":
        return <Entry transactions={transactions} setTransactions={setTransactions} personList={personList || []} collector={collector} setCollector={setCollector} />;
      case "records":
        return <Records transactions={transactions} setTransactions={setTransactions} collector={collector} setCollector={setCollector} />;
      case "summary":
        return <Summary transactions={transactions} />;
      case "collector":
        return <Collector collector={collector} />;
      case "settings":
        return <Settings
          personList={personList || []}
          setPersonList={setPersonList}
          collector={collector}
          setCollector={setCollector}
          monthlyResidents={monthlyResidents}
          setMonthlyResidents={setMonthlyResidents}
          users={users}
          setUsers={setUsers}
        />;
      case "users":
        return <UserList users={users || []} resendOtp={resendOtp} deleteUser={deleteUser} />;
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
