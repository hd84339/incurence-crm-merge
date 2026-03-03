import React, { useState, useEffect } from "react";
import { Plus, Shield } from "lucide-react";
import { roleAPI } from "../services/api";
import { toast } from "react-hot-toast";

const Badge = ({ children, color }) => (
    <span style={{ display: "inline-flex", alignItems: "center", padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: color + "22", color: color, border: `1px solid ${color}44` }}>{children}</span>
);

export default function RolesPage() {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRoles();
    }, []);

    const fetchRoles = async () => {
        try {
            setLoading(true);
            const res = await roleAPI.getAll();
            setRoles(res.data.data || []);
        } catch (err) {
            toast.error("Failed to load roles");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: 32 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
                <div>
                    <h1 style={{ margin: "0 0 6px", fontSize: 26, fontWeight: 900, color: "#f1f5f9", display: "flex", alignItems: "center", gap: 12 }}>
                        <Shield size={28} color="#f59e0b" /> Roles & Permissions
                    </h1>
                    <p style={{ margin: 0, color: "#64748b", fontSize: 14 }}>Manage user roles and system access levels</p>
                </div>
                <button style={{ display: "flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg, #f59e0b, #d97706)", color: "#fff", border: "none", padding: "10px 20px", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 12px rgba(245, 158, 11, 0.3)" }}>
                    <Plus size={18} /> Build Custom Role
                </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
                {loading ? (
                    <div style={{ color: "#64748b", padding: 20 }}>Loading roles...</div>
                ) : roles.length === 0 ? (
                    <div style={{ color: "#64748b", padding: 20 }}>No roles found. Please run the seed script to generate default ones.</div>
                ) : roles.map(r => (
                    <div key={r._id} style={{ background: "#141824", border: `1px solid ${r.color}33`, borderRadius: 12, padding: 24, borderTop: `4px solid ${r.color}` }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                            <h3 style={{ margin: 0, color: "#f1f5f9", fontSize: 18, fontWeight: 700 }}>{r.name}</h3>
                            {r.isSystem && <Badge color="#64748b">System</Badge>}
                        </div>
                        <p style={{ color: "#94a3b8", fontSize: 13, marginBottom: 16 }}>{r.description || 'No description provided.'}</p>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                            {r.permissions.map(p => <Badge key={p} color={r.color}>{p}</Badge>)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
