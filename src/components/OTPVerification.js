export default function OTPVerification({ username, otpInput, setOtpInput, onVerify }) {
  return (
    <div className="auth-container">
      <h2>OTP Verification</h2>
      <p>Enter OTP sent during registration for {username}</p>
      <input
        type="text"
        placeholder="OTP"
        value={otpInput}
        onChange={(e) => setOtpInput(e.target.value)}
      />
      <button onClick={onVerify}>Verify OTP</button>
    </div>
  );
}
