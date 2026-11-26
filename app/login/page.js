
"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleLogin(event) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
      );

      const { data, error: loginError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (loginError) {
        setError("Unable to sign in. Please check your credentials and email verification.");
        return;
      }

      const { data: profile, error: profileError } =
        await supabase
          .from("profiles")
          .select("full_name, account_type")
          .eq("id", data.user.id)
          .single();

      if (profileError || !profile) {
        await supabase.auth.signOut();
        setError("Unable to load your profile. Please contact support.");
        return;
      }

      setPassword("");

      setSuccess(
        `Welcome back, ${profile.full_name || "user"}! ` +
        `You are signed in as ${profile.account_type}.`
      );

    } catch {
      setError("Something went wrong. Please try again.");
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
    marginTop: "6px",
    marginBottom: "20px",
    boxSizing: "border-box",
    background: "#ffffff",
    color: "#10243b",
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f1f5fa",
        padding: "24px",
        fontFamily: "Arial, sans-serif",
        color: "#10243b",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "480px",
          background: "#ffffff",
          borderRadius: "24px",
          padding: "40px",
          boxSizing: "border-box",
          boxShadow: "0 20px 60px rgba(16,36,59,0.08)",
        }}
      >
        <Link
          href="/"
          style={{
            fontSize: "30px",
            fontWeight: "800",
            color: "#10243b",
            textDecoration: "none",
          }}
        >
          Wetalen<span style={{ color: "#3478c8" }}>D</span>
        </Link>

        <h1
          style={{
            fontSize: "32px",
            marginTop: "32px",
            marginBottom: "10px",
          }}
        >
          Welcome back
        </h1>

        <p
          style={{
            color: "#64748b",
            marginBottom: "30px",
            lineHeight: "1.5",
          }}
        >
          Sign in to continue your global talent journey.
        </p>

        <form onSubmit={handleLogin}>
          <label htmlFor="email">Email address</label>

          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
            style={inputStyle}
          />

          <label htmlFor="password">Password</label>

          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
            style={inputStyle}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "16px",
              background: "#10243b",
              color: "#ffffff",
              border: "none",
              borderRadius: "10px",
              fontSize: "16px",
              fontWeight: "700",
              cursor: loading ? "wait" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {error && (
          <div
            role="alert"
            style={{
              background: "#fef2f2",
              color: "#991b1b",
              padding: "15px",
              borderRadius: "10px",
              marginTop: "20px",
            }}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            role="status"
            style={{
              background: "#ecfdf5",
              color: "#166534",
              padding: "15px",
              borderRadius: "10px",
              marginTop: "20px",
            }}
          >
            {success}
          </div>
        )}

        <p
          style={{
            textAlign: "center",
            marginTop: "26px",
            color: "#64748b",
            fontSize: "14px",
          }}
        >
          New to WetalenD?{" "}
          <Link
            href="/register"
            style={{
              color: "#3478c8",
              fontWeight: "700",
              textDecoration: "none",
            }}
          >
            Create an account
          </Link>
        </p>

        <p
          style={{
            textAlign: "center",
            marginTop: "30px",
            fontSize: "13px",
            color: "#64748b",
          }}
        >
          Talent without borders.
        </p>
      </div>
    </main>
  );
}
