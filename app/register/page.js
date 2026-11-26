
"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

export default function RegisterPage() {
  const [accountType, setAccountType] = useState("talent");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleRegister(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setSuccess(false);

    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
      );

      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            account_type: accountType,
          },
        },
      });

      if (error) throw error;

      setSuccess(true);
      setMessage(
        "Registration submitted. Check your email for any confirmation instructions."
      );
      setPassword("");
    } catch (error) {
      setMessage(error.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = {
    width: "100%",
    padding: "14px",
    border: "1px solid #d5deea",
    borderRadius: "10px",
    fontSize: "16px",
    boxSizing: "border-box",
    marginBottom: "18px",
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f3f6fb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "30px 20px",
        fontFamily: "Arial, sans-serif",
        color: "#10243d",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "520px",
          background: "#ffffff",
          borderRadius: "20px",
          padding: "36px",
          boxShadow: "0 15px 50px rgba(16,36,61,0.08)",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            fontSize: "28px",
            fontWeight: "bold",
            marginBottom: "30px",
          }}
        >
          Wetalen<span style={{ color: "#397bc5" }}>D</span>
        </div>

        <h1 style={{ fontSize: "32px", margin: "0 0 12px" }}>
          Create your account
        </h1>

        <p style={{ color: "#64748b", marginBottom: "25px" }}>
          Your global talent journey starts here.
        </p>

        <form onSubmit={handleRegister}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
              marginBottom: "25px",
            }}
          >
            {["talent", "employer"].map((type) => (
              <button
                key={type}
                type="button"
                aria-pressed={accountType === type}
                onClick={() => setAccountType(type)}
                style={{
                  padding: "20px 10px",
                  borderRadius: "12px",
                  border:
                    accountType === type
                      ? "2px solid #397bc5"
                      : "1px solid #d5deea",
                  background:
                    accountType === type
                      ? "#edf5ff"
                      : "#ffffff",
                  color: "#10243d",
                  cursor: "pointer",
                  fontSize: "15px",
                  fontWeight: "bold",
                }}
              >
                {type === "talent"
                  ? "I am Talent"
                  : "I am an Employer"}
              </button>
            ))}
          </div>

          <label htmlFor="fullName">Full name</label>
          <input
            id="fullName"
            style={inputStyle}
            type="text"
            autoComplete="name"
            placeholder="Your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            maxLength={150}
          />

          <label htmlFor="email">Email address</label>
          <input
            id="email"
            style={inputStyle}
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            style={inputStyle}
            type="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            required
          />

          <button
            type="submit"
            disabled={loading || success}
            style={{
              width: "100%",
              padding: "16px",
              background: "#10243d",
              color: "#ffffff",
              border: "none",
              borderRadius: "10px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: loading || success ? "default" : "pointer",
            }}
          >
            {loading ? "Creating account..." : "Create account"}
          </button>

          {message && (
            <p
              role="status"
              style={{
                padding: "15px",
                borderRadius: "10px",
                background: success ? "#ecfdf5" : "#fef2f2",
                color: success ? "#166534" : "#b91c1c",
                marginTop: "20px",
              }}
            >
              {message}
            </p>
          )}
        </form>

        <p
          style={{
            textAlign: "center",
            color: "#64748b",
            fontSize: "13px",
            marginTop: "25px",
          }}
        >
          Talent without borders.
        </p>
      </div>
    </main>
  );
}
