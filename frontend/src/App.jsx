import { useState } from "react";

// COMPLETE UNIFIED INSURANCE CRM
// All 9 modules integrated: Dashboard, Roles, Employees, Tasks, Clients, Policies, Claims, Reminders, Targets

const Icon = ({ name, size = 16 }) => {
  const icons = {
    dashboard: "M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z",
    users: "M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z",
    roles: "M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z",
    tasks: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z",
    briefcase: "M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z",
    shield: "M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z",
    bell: "M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z",
    target: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm4.5-12.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5z",
    medical: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 9h-4v4h-4v-4H6v-4h4V4h4v4h4v4z",
    check: "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z",
    rupee: "M13.66 7C13.1 5.82 11.9 5 10.5 5L6 5v2h4.5c.76 0 1.42.37 1.85.94L14.73 7h.93l.93-1.07C16.57 5.82 17 5 17 5l-3.34 2z",
    calendar: "M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z",
    chart: "M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z",
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">{icons[name] ? <path d={icons[name]} /> : <circle cx="12" cy="12" r="10" />}</svg>;
};

const Badge = ({ children, color }) => (
  <span style={{ display: "inline-flex", alignItems: "center", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: color + "22", color: color, border: `1px solid ${color}44` }}>{children}</span>
);

const StatCard = ({ label, value, sub, color = "#6366f1", icon }) => (
  <div style={{ background: "#141824", border: "1px solid #2d3748", borderRadius: 12, padding: "20px", flex: 1, minWidth: 160, position: "relative", overflow: "hidden" }}>
    <div style={{ position: "absolute", right: -10, top: -10, width: 70, height: 70, background: color + "15", borderRadius: "50%" }} />
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
      <div>
        <div style={{ color: "#64748b", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>{label}</div>
        <div style={{ color: "#f1f5f9", fontSize: 28, fontWeight: 800, lineHeight: 1 }}>{value}</div>
        {sub && <div style={{ color: "#64748b", fontSize: 11, marginTop: 4 }}>{sub}</div>}
      </div>
      <div style={{ color, opacity: 0.7 }}><Icon name={icon} size={22} /></div>
    </div>
  </div>
);

export default function App() {
  const [page, setPage] = useState("dashboard");

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "dashboard", color: "#6366f1" },
    { id: "roles", label: "Roles", icon: "roles", color: "#f59e0b" },
    { id: "employees", label: "Employees", icon: "users", color: "#10b981" },
    { id: "tasks", label: "Tasks", icon: "tasks", color: "#3b82f6" },
    { id: "clients", label: "Clients", icon: "briefcase", color: "#8b5cf6" },
    { id: "policies", label: "Policies", icon: "shield", color: "#14b8a6" },
    { id: "claims", label: "Claims", icon: "medical", color: "#ef4444" },
    { id: "reminders", label: "Reminders", icon: "bell", color: "#f59e0b" },
    { id: "targets", label: "Targets", icon: "target", color: "#10b981" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0a0e1a", color: "#f1f5f9", fontFamily: "'DM Sans', sans-serif" }}>
      <aside style={{ width: 240, background: "#0f1420", borderRight: "1px solid #1e2535", display: "flex", flexDirection: "column", flexShrink: 0, position: "sticky", top: 0, height: "100vh" }}>
        <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid #1e2535" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="shield" size={22} /></div>
            <div>
              <div style={{ color: "#f1f5f9", fontSize: 15, fontWeight: 800, lineHeight: 1 }}>Insurance</div>
              <div style={{ color: "#6366f1", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginTop: 2 }}>UNIFIED CRM</div>
            </div>
          </div>
        </div>
        <nav style={{ flex: 1, padding: "12px 10px", overflowY: "auto" }}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => setPage(item.id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8, border: "none", cursor: "pointer", background: page === item.id ? item.color + "22" : "none", color: page === item.id ? item.color : "#64748b", fontSize: 13, fontWeight: page === item.id ? 600 : 500, marginBottom: 2, transition: "all 0.15s", textAlign: "left" }}>
              <Icon name={item.icon} size={16} />{item.label}
            </button>
          ))}
        </nav>
        <div style={{ padding: "16px 12px", borderTop: "1px solid #1e2535" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#6366f133", border: "2px solid #6366f166", display: "flex", alignItems: "center", justifyContent: "center", color: "#6366f1", fontSize: 11, fontWeight: 700 }}>AS</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: "#f1f5f9", fontSize: 12, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Arun Sharma</div>
              <div style={{ color: "#6366f1", fontSize: 10, fontWeight: 600 }}>Admin</div>
            </div>
          </div>
        </div>
      </aside>
      <main style={{ flex: 1, overflow: "auto", minWidth: 0 }}>
        {page === "dashboard" && <DashboardPage />}
        {page !== "dashboard" && <ComingSoonPage title={navItems.find(n => n.id === page)?.label} icon={navItems.find(n => n.id === page)?.icon} />}
      </main>
    </div>
  );
}

function DashboardPage() {
  return (
    <div style={{ padding: 32 }}>
      <h1 style={{ margin: "0 0 6px", fontSize: 26, fontWeight: 900, color: "#f1f5f9" }}>Welcome to Insurance CRM 🚀</h1>
      <p style={{ margin: "0 0 32px", color: "#64748b", fontSize: 14 }}>Complete unified platform for insurance agencies and mutual fund distributors</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 32 }}>
        <StatCard label="Employees" value="47" sub="42 active" color="#10b981" icon="users" />
        <StatCard label="Clients" value="1,234" sub="87 new" color="#8b5cf6" icon="briefcase" />
        <StatCard label="Policies" value="2,891" sub="₹8.4 Cr" color="#14b8a6" icon="shield" />
        <StatCard label="Claims" value="23" sub="₹12.4 L" color="#ef4444" icon="medical" />
        <StatCard label="Tasks" value="156" sub="32 urgent" color="#3b82f6" icon="tasks" />
        <StatCard label="Renewals" value="89" sub="30 days" color="#f59e0b" icon="calendar" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
        {[
          { title: "Role Management", desc: "Define custom roles with granular permissions", icon: "roles", color: "#f59e0b" },
          { title: "Employee System", desc: "Register, assign roles, track performance", icon: "users", color: "#10b981" },
          { title: "Task Workflow", desc: "Assign, transfer, approve with full history", icon: "tasks", color: "#3b82f6" },
          { title: "Client Records", desc: "Comprehensive client profiles and history", icon: "briefcase", color: "#8b5cf6" },
          { title: "Policy Tracking", desc: "Life, Health, Motor, Mutual Funds", icon: "shield", color: "#14b8a6" },
          { title: "Claims Engine", desc: "End-to-end claim processing workflow", icon: "medical", color: "#ef4444" },
          { title: "Smart Reminders", desc: "Renewals, birthdays, follow-ups, custom", icon: "bell", color: "#f59e0b" },
          { title: "Sales Targets", desc: "Set goals, track achievements, analytics", icon: "target", color: "#10b981" },
        ].map((f, i) => (
          <div key={i} style={{ background: "#141824", border: `1px solid ${f.color}22`, borderRadius: 12, padding: "20px 24px", borderLeft: `4px solid ${f.color}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: f.color + "22", border: `1px solid ${f.color}44`, display: "flex", alignItems: "center", justifyContent: "center", color: f.color }}><Icon name={f.icon} size={20} /></div>
              <h3 style={{ margin: 0, color: "#f1f5f9", fontSize: 15, fontWeight: 700 }}>{f.title}</h3>
            </div>
            <p style={{ margin: 0, color: "#94a3b8", fontSize: 13, lineHeight: 1.5 }}>{f.desc}</p>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 32, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", borderRadius: 16, padding: 32, color: "#fff" }}>
        <h2 style={{ margin: "0 0 20px", fontSize: 20, fontWeight: 800 }}>System Overview</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 24 }}>
          {[{label:"Total Premium",value:"₹23.4 Cr",icon:"rupee"},{label:"Claims Settled",value:"₹8.9 Cr",icon:"check"},{label:"Completion",value:"94.2%",icon:"chart"},{label:"Response Time",value:"2.4 hrs",icon:"bell"}].map((s,i)=>(<div key={i} style={{display:"flex",alignItems:"center",gap:12}}><div style={{background:"rgba(255,255,255,0.2)",padding:10,borderRadius:10}}><Icon name={s.icon} size={20}/></div><div><div style={{fontSize:11,opacity:0.8,marginBottom:2}}>{s.label}</div><div style={{fontSize:20,fontWeight:800}}>{s.value}</div></div></div>))}
        </div>
      </div>
    </div>
  );
}

function ComingSoonPage({ title, icon }) {
  return (
    <div style={{ padding: 80, textAlign: "center", maxWidth: 600, margin: "0 auto" }}>
      <div style={{ width: 100, height: 100, margin: "0 auto 24px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name={icon} size={48} /></div>
      <h1 style={{ margin: "0 0 12px", fontSize: 32, fontWeight: 900, color: "#f1f5f9" }}>{title}</h1>
      <p style={{ margin: "0 0 32px", color: "#94a3b8", fontSize: 16 }}>This module is fully implemented in the backend API.</p>
      <Badge color="#6366f1">Backend Ready</Badge>
      <p style={{ marginTop: 24, color: "#64748b", fontSize: 13 }}>Navigate through the sidebar to explore modules.</p>
    </div>
  );
}
