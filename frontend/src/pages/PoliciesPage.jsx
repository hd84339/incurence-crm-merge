import React, { useState, useEffect } from "react";
import { Plus, ShieldAlert } from "lucide-react";
import { policyAPI } from "../services/api";
import { toast } from "react-hot-toast";

const Badge = ({ children, color }) => (
    <span style={{ display: "inline-flex", alignItems: "center", padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: color + "22", color: color, border: `1px solid ${color}44` }}>{children}</span>
);

export default function PoliciesPage() {
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPolicies();
    }, []);

    const fetchPolicies = async () => {
        try {
            setLoading(true);
            const res = await policyAPI.getAll();
            setPolicies(res.data.data || []);
        } catch (err) {
            toast.error("Failed to load policies");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: 32 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
                <div>
                    <h1 style={{ margin: "0 0 6px", fontSize: 26, fontWeight: 900, color: "#f1f5f9", display: "flex", alignItems: "center", gap: 12 }}>
                        <ShieldAlert size={28} color="#14b8a6" /> Policy Tracking
                    </h1>
                    <p style={{ margin: 0, color: "#64748b", fontSize: 14 }}>Manage all Life, Health, Motor, and Mutual Funds</p>
                </div>
                <button style={{ display: "flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg, #14b8a6, #0d9488)", color: "#fff", border: "none", padding: "10px 20px", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 12px rgba(20, 184, 166, 0.3)" }}>
                    <Plus size={18} /> Add Policy
                </button>
            </div>

            <div style={{ background: "#141824", border: "1px solid #1e2535", borderRadius: 12, overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                    <thead>
                        <tr style={{ background: "#0f1420", color: "#64748b", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                            <th style={{ padding: "16px 20px", fontWeight: 600 }}>Policy Number</th>
                            <th style={{ padding: "16px 20px", fontWeight: 600 }}>Type</th>
                            <th style={{ padding: "16px 20px", fontWeight: 600 }}>Company</th>
                            <th style={{ padding: "16px 20px", fontWeight: 600 }}>Premium</th>
                            <th style={{ padding: "16px 20px", fontWeight: 600 }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={5} style={{ padding: 40, textAlign: "center", color: "#64748b" }}>Loading policies...</td></tr>
                        ) : policies.length === 0 ? (
                            <tr><td colSpan={5} style={{ padding: 40, textAlign: "center", color: "#64748b" }}>No policies found.</td></tr>
                        ) : (
                            policies.map(p => (
                                <tr key={p._id} style={{ borderTop: "1px solid #1e2535" }}>
                                    <td style={{ padding: "16px 20px", color: "#f1f5f9", fontWeight: 600 }}>{p.policyNumber}</td>
                                    <td style={{ padding: "16px 20px", color: "#94a3b8" }}>{p.type}</td>
                                    <td style={{ padding: "16px 20px", color: "#cbd5e1" }}>{p.company}</td>
                                    <td style={{ padding: "16px 20px", color: "#cbd5e1", fontWeight: 600 }}>₹{p.premiumAmount?.toLocaleString() || 0}</td>
                                    <td style={{ padding: "16px 20px" }}><Badge color="#14b8a6">{p.status}</Badge></td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
