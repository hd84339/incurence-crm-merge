import React, { useState, useEffect } from "react";
import { Plus, HeartPulse } from "lucide-react";
import { claimAPI } from "../services/api";
import { toast } from "react-hot-toast";

const Badge = ({ children, color }) => (
    <span style={{ display: "inline-flex", alignItems: "center", padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: color + "22", color: color, border: `1px solid ${color}44` }}>{children}</span>
);

export default function ClaimsPage() {
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchClaims();
    }, []);

    const fetchClaims = async () => {
        try {
            setLoading(true);
            const res = await claimAPI.getAll();
            setClaims(res.data.data || []);
        } catch (err) {
            toast.error("Failed to load claims");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: 32 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
                <div>
                    <h1 style={{ margin: "0 0 6px", fontSize: 26, fontWeight: 900, color: "#f1f5f9", display: "flex", alignItems: "center", gap: 12 }}>
                        <HeartPulse size={28} color="#ef4444" /> Claims Processing
                    </h1>
                    <p style={{ margin: 0, color: "#64748b", fontSize: 14 }}>Track claim status history and fast-track processing</p>
                </div>
                <button style={{ display: "flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg, #ef4444, #dc2626)", color: "#fff", border: "none", padding: "10px 20px", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)" }}>
                    <Plus size={18} /> New Claim
                </button>
            </div>

            <div style={{ background: "#141824", border: "1px solid #1e2535", borderRadius: 12, overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                    <thead>
                        <tr style={{ background: "#0f1420", color: "#64748b", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                            <th style={{ padding: "16px 20px", fontWeight: 600 }}>Claim Type</th>
                            <th style={{ padding: "16px 20px", fontWeight: 600 }}>Amount</th>
                            <th style={{ padding: "16px 20px", fontWeight: 600 }}>Submitted On</th>
                            <th style={{ padding: "16px 20px", fontWeight: 600 }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={4} style={{ padding: 40, textAlign: "center", color: "#64748b" }}>Loading claims...</td></tr>
                        ) : claims.length === 0 ? (
                            <tr><td colSpan={4} style={{ padding: 40, textAlign: "center", color: "#64748b" }}>No claims filed yet.</td></tr>
                        ) : (
                            claims.map(c => (
                                <tr key={c._id} style={{ borderTop: "1px solid #1e2535" }}>
                                    <td style={{ padding: "16px 20px", color: "#f1f5f9", fontWeight: 600 }}>{c.type}</td>
                                    <td style={{ padding: "16px 20px", color: "#ef4444", fontWeight: 600 }}>₹{c.claimAmount?.toLocaleString() || 0}</td>
                                    <td style={{ padding: "16px 20px", color: "#cbd5e1" }}>{new Date(c.submissionDate || c.createdAt).toLocaleDateString()}</td>
                                    <td style={{ padding: "16px 20px" }}><Badge color="#ef4444">{c.status}</Badge></td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
