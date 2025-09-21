export default function Header({ onLogout }) {
  return (
    <div className="header">
      <h1>🏠 PG Expense Tracker</h1>
      <button className="logout-btn" onClick={onLogout}>
        🚪 Logout
      </button>
    </div>
  );
}
