export default function UserList({ users, resendOtp, deleteUser }) {
  return (
    <div style={{ marginTop: "20px" }}>
      <h3>All Users</h3>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Username</th>
            <th>Role</th>
            <th>Verified</th>
            <th>OTP</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.username}>
              <td>{u.username}</td>
              <td>{u.role}</td>
              <td>{u.isVerified ? "Yes" : "No"}</td>
              <td>{u.otp || "-"}</td>
              <td>
                {!u.isVerified && (
                  <button style={{ marginRight: "8px" }} onClick={() => resendOtp(u.username)}>Resend OTP</button>
                )}
                {u.role !== "admin" && (
                  <button onClick={() => deleteUser(u.username)}>Delete</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}