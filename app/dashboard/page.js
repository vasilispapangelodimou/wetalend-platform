"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const talentModules = [
  ["My Profile", "Build your professional identity.", "👤"],
  ["My CV", "Manage your professional experience.", "📄"],
  ["AI Job Matching", "Discover relevant career opportunities.", "✦"],
  ["Find Jobs", "Explore international job opportunities.", "🌍"],
  ["Find Projects", "Discover freelance and contract work.", "💼"],
  ["My Applications", "Track your job applications.", "📋"],
  ["Messages", "Connect with employers.", "💬"],
  ["My Contracts", "Manage your employment agreements.", "📝"],
  ["Settings", "Manage your account preferences.", "⚙"]
];

const employerModules = [
  ["Company Profile", "Manage your company information.", "🏢"],
  ["Direct Employment", "Find and hire international talent.", "👥"],
  ["Employer of Record", "Employ talent across borders.", "🌍"],
  ["Subcontractor Projects", "Hire professionals for specific projects.", "💼"],
  ["AI Talent Matching", "Discover suitable candidates.", "✦"],
  ["My Workforce", "Manage your employees.", "📋"],
  ["Messages", "Communicate with candidates.", "💬"],
  ["Contracts", "Manage employment and service agreements.", "📝"],
  ["Billing", "Manage invoices and payments.", "💳"]
];

export default function Dashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [supabase, setSupabase] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      try {
        const client = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
        );

        if (!active) return;
        setSupabase(client);

        const {
          data: { user },
          error: authError
        } = await client.auth.getUser();

        if (!active) return;

        if (authError || !user) {
          router.replace("/login");
          return;
        }

        const { data, error: profileError } = await client
          .from("profiles")
          .select("id, full_name, account_type")
          .eq("id", user.id)
          .single();

        if (!active) return;

        if (profileError || !data) {
          setError("Unable to load your profile.");
          return;
        }

        if (!["talent", "employer"].includes(data.account_type)) {
          setError("Invalid account type.");
          return;
        }

        setProfile(data);
      } catch {
        if (active) {
          setError("Unable to connect. Please try again.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadDashboard();

    return () => {
      active = false;
    };
  }, [router]);

  async function logout() {
    if (!supabase) return;

    const { error } = await supabase.auth.signOut();

    if (error) {
      setError("Unable to sign out. Please try again.");
      return;
    }

    setProfile(null);
    router.replace("/login");
  }

  if (loading) {
    return (
      <div style={styles.center}>
        Loading WetalenD...
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={styles.center}>
        <p>{error || "Please sign in."}</p>
        <a href="/login">Return to login</a>
      </div>
    );
  }

  const isEmployer = profile.account_type === "employer";

  const modules = isEmployer
    ? employerModules
    : talentModules;

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <div style={{ ...styles.logo, color: "#10243A" }}>
          Wetalen<span style={{ color: "#3478c8" }}>D</span>
        </div>

        <div style={styles.headerRight}>
          <span style={styles.badge}>
            {isEmployer ? "Employer" : "Talent"}
          </span>

          <button onClick={logout} style={styles.logout}>
            Sign out
          </button>
        </div>
      </header>

      <section style={styles.content}>
        <div style={styles.hero}>
          <p style={styles.eyebrow}>
            YOUR GLOBAL TALENT PLATFORM
          </p>

          <h1 style={styles.heading}>
            Welcome, {profile.full_name || "there"}.
          </h1>

          <p style={styles.subtitle}>
            {isEmployer
              ? "Hire, manage and grow your global workforce."
              : "Discover opportunities. Build your career without borders."}
          </p>
        </div>

        {error && <p role="alert">{error}</p>}

        <h2 style={styles.sectionTitle}>
          {isEmployer ? "Employer Dashboard" : "Talent Dashboard"}
        </h2>

        <div style={styles.grid}>
          {modules.map(([title, description, icon]) => (
            <article key={title} style={styles.card}>
              <div style={styles.icon}>{icon}</div>
              <h3 style={styles.cardTitle}>{title}</h3>
              <p style={styles.description}>{description}</p>
              <span style={styles.status}>Coming soon</span>
            </article>
          ))}
        </div>

        <footer style={styles.footer}>
          WetalenD — Talent without borders.
        </footer>
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f1f5f9",
    color: "#10243b",
    fontFamily: "Arial, sans-serif"
  },
  header: {
    background: "#ffffff",
    padding: "20px 5%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "15px",
    borderBottom: "1px solid #e2e8f0"
  },
  logo: {
    fontSize: "30px",
    fontWeight: "800"
  },
  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "16px"
  },
  badge: {
    background: "#eaf2ff",
    color: "#2563a8",
    padding: "9px 16px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "600"
  },
  logout: {
    background: "#10243b",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    padding: "11px 20px",
    cursor: "pointer"
  },
  content: {
    maxWidth: "1250px",
    margin: "auto",
    padding: "35px 5%"
  },
  hero: {
    background: "linear-gradient(120deg, #10243b, #24558a)",
    color: "#ffffff",
    padding: "40px 30px",
    borderRadius: "20px",
    marginBottom: "35px"
  },
  eyebrow: {
    fontSize: "12px",
    letterSpacing: "2px",
    color: "#b9d8ff"
  },
  heading: {
    fontSize: "clamp(28px, 5vw, 42px)",
    margin: "15px 0"
  },
  subtitle: {
    fontSize: "17px",
    lineHeight: "1.6",
    color: "#dce9f7"
  },
  sectionTitle: {
    fontSize: "24px",
    marginBottom: "22px"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(260px, 100%), 1fr))",
    gap: "22px"
  },
  card: {
    background: "#ffffff",
    borderRadius: "16px",
    padding: "26px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 5px 20px rgba(16,36,59,0.04)"
  },
  icon: {
    fontSize: "30px",
    marginBottom: "18px"
  },
  cardTitle: {
    fontSize: "19px",
    margin: "0 0 10px"
  },
  description: {
    color: "#64748b",
    fontSize: "14px",
    lineHeight: "1.6",
    minHeight: "45px"
  },
  status: {
    display: "inline-block",
    marginTop: "10px",
    background: "#f1f5f9",
    color: "#64748b",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px"
  },
  footer: {
    textAlign: "center",
    color: "#64748b",
    marginTop: "45px",
    fontSize: "14px"
  },
  center: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "#f1f5f9",
    color: "#10243b"
  }
};
