import React, { useState, useEffect } from "react";
import { Plus, Target } from "lucide-react";
import { targetAPI } from "../services/api";
import { toast } from "react-hot-toast";

const Badge = ({ children, color }) => (
    <span style={{ display: "inline-flex", alignItems: "center", padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: color + "22", color: color, border: `1px solid ${color}44` }}>{children}</span>
);

export default function TargetsPage() {
    const [targets, setTargets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTargets();
    }, []);

    const fetchTargets = async () => {
        try {
            setLoading(true);
            const res = await targetAPI.getAll();
            setTargets(res.data.data || []);
        } catch (err) {
            toast.error("Failed to load targets");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: 32 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
                <div>
                    <h1 style={{ margin: "0 0 6px", fontSize: 26, fontWeight: 900, color: "#f1f5f9", display: "flex", alignItems: "center", gap: 12 }}>
                        <Target size={28} color="#10b981" /> Sales Targets
                    </h1>
                    <p style={{ margin: 0, color: "#64748b", fontSize: 14 }}>Monitor team and individual sales goals</p>
                </div>
                <button style={{ display: "flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg, #10b981, #059669)", color: "#fff", border: "none", padding: "10px 20px", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)" }}>
                    <Plus size={18} /> Set Target
                </button>
            </div>

            <div style={{ background: "#141824", border: "1px solid #1e2535", borderRadius: 12, overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                    <thead>
                        <tr style={{ background: "#0f1420", color: "#64748b", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                            <th style={{ padding: "16px 20px", fontWeight: 600 }}>Target Title</th>
                            <th style={{ padding: "16px 20px", fontWeight: 600 }}>Period</th>
                            <th style={{ padding: "16px 20px", fontWeight: 600 }}>Amount Goal</th>
                            <th style={{ padding: "16px 20px", fontWeight: 600 }}>Achievement (%)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={4} style={{ padding: 40, textAlign: "center", color: "#64748b" }}>Loading targets...</td></tr>
                        ) : targets.length === 0 ? (
                            <tr><td colSpan={4} style={{ padding: 40, textAlign: "center", color: "#64748b" }}>No targets structured yet.</td></tr>
                        ) : (
                            targets.map(t => (
                                <tr key={t._id} style={{ borderTop: "1px solid #1e2535" }}>
                                    <td style={{ padding: "16px 20px", color: "#f1f5f9", fontWeight: 600 }}>{t.title}</td>
                                    <td style={{ padding: "16px 20px", color: "#94a3b8" }}>{t.period}</td>
                                    <td style={{ padding: "16px 20px", color: "#cbd5e1" }}>₹{t.targetAmount?.toLocaleString()}</td>
                                    <td style={{ padding: "16px 20px" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                            <div style={{ flex: 1, background: "#1e2535", height: 6, borderRadius: 3, overflow: "hidden" }}>
                                                <div style={{ width: `${Math.min(((t.achievedAmount || 0) / t.targetAmount) * 100, 100)}%`, background: "#10b981", height: "100%", borderRadius: 3 }}></div>
                                            </div>
                                            <span style={{ color: "#10b981", fontSize: 12, fontWeight: 700 }}>{Math.round(((t.achievedAmount || 0) / t.targetAmount) * 100)}%</span>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
