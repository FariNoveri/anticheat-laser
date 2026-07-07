import React, { useState, useCallback } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";

export default function LoginScreen() {
  const [email,   setEmail]   = useState("");
  const [pass,    setPass]    = useState("");
  const [error,   setError]   = useState(false);
  const [errMsg,  setErrMsg]  = useState("Email atau password salah");
  const [shake,   setShake]   = useState(false);
  const [loading, setLoading] = useState(false);

  const { executeRecaptcha } = useGoogleReCaptcha();

  const doLogin = useCallback(async () => {
    if (!email || !pass) { triggerError("Email dan password wajib diisi"); return; }
    if (!executeRecaptcha) { triggerError("reCAPTCHA belum siap, coba lagi"); return; }

    setLoading(true);
    try {
      // Jalankan reCAPTCHA v3 secara invisible
      await executeRecaptcha("login");
      await signInWithEmailAndPassword(auth, email, pass);
    } catch {
      setPass("");
      triggerError("Email atau password salah");
    }
    setLoading(false);
  }, [email, pass, executeRecaptcha]);

  function triggerError(msg = "Email atau password salah") {
    setErrMsg(msg);
    setError(true);
    setShake(true);
    setTimeout(() => setError(false), 2500);
    setTimeout(() => setShake(false), 400);
  }

  return (
    <div id="login-screen">
      <div className={`login-box${shake ? " login-shake" : ""}`} id="login-box">
        <div className="login-logo">
          <div className="logo-icon">AL</div>
          <div className="login-title">Anticheat<span>Laser</span></div>
        </div>

        <label className="login-label">Email</label>
        <input
          className="login-input"
          type="email"
          placeholder="admin@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && doLogin()}
          style={{ letterSpacing: "normal" }}
          autoComplete="off"
        />

        <label className="login-label">Password</label>
        <input
          className="login-input"
          type="password"
          placeholder="••••••••"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && doLogin()}
          autoComplete="off"
        />

        <button className="login-btn" onClick={doLogin} disabled={loading}>
          {loading ? "..." : "ACCESS PANEL"}
        </button>

        <div className={`login-error${error ? " show" : ""}`}>
          ⚠ {errMsg}
        </div>
      </div>
    </div>
  );
}