// utils/userStorage.js

// Load all registered users from localStorage
export function loadUsers() {
  return JSON.parse(localStorage.getItem("pgUsers")) || [];
}

// Save all users to localStorage
export function saveUsers(users) {
  localStorage.setItem("pgUsers", JSON.stringify(users));
}

// Generate 6-digit OTP
export function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
