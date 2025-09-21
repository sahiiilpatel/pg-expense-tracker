export default function Login({ username, setUsername, password, setPassword, onSubmit, toggleMode }) {
  return (
    <div className="auth-container">
      <h2>Login</h2>
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
      <button onClick={onSubmit}>Login</button>
      <p>
        Dont have an account?{" "}
        <button onClick={toggleMode}>Register</button>
      </p>
    </div>
  );
}
