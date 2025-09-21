export default function Register({ username, setUsername, password, setPassword, onSubmit, toggleMode }) {
  return (
    <div className="auth-container">
      <h2>Register</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={onSubmit}>Register</button>
      <p>
        Already have an account?{" "}
        <button onClick={toggleMode}>Login</button>
      </p>
    </div>
  );
}
