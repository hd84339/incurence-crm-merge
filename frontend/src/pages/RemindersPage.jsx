import React, { useState, useEffect } from "react";
import { Plus, Bell } from "lucide-react";
import { reminderAPI } from "../services/api";
import { toast } from "react-hot-toast";

const Badge = ({ children, color }) => (
    <span style={{ display: "inline-flex", alignItems: "center", padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: color + "22", color: color, border: `1px solid ${color}44` }}>{children}</span>
);

export default function RemindersPage() {
    const [reminders, setReminders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReminders();
    }, []);

    const fetchReminders = async () => {
        try {
            setLoading(true);
            const res = await reminderAPI.getAll();
            setReminders(res.data.data || []);
        } catch (err) {
            toast.error("Failed to load reminders");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: 32 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
                <div>
                    <h1 style={{ margin: "0 0 6px", fontSize: 26, fontWeight: 900, color: "#f1f5f9", display: "flex", alignItems: "center", gap: 12 }}>
                        <Bell size={28} color="#f59e0b" /> Smart Reminders
                    </h1>
                    <p style={{ margin: 0, color: "#64748b", fontSize: 14 }}>Automated trigger alerts and custom follow-ups</p>
                </div>
                <button style={{ display: "flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg, #f59e0b, #d97706)", color: "#fff", border: "none", padding: "10px 20px", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 12px rgba(245, 158, 11, 0.3)" }}>
                    <Plus size={18} /> New Reminder
                </button>
            </div>

            <div style={{ background: "#141824", border: "1px solid #1e2535", borderRadius: 12, overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                    <thead>
                        <tr style={{ background: "#0f1420", color: "#64748b", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                            <th style={{ padding: "16px 20px", fontWeight: 600 }}>Message</th>
                            <th style={{ padding: "16px 20px", fontWeight: 600 }}>Type</th>
                            <th style={{ padding: "16px 20px", fontWeight: 600 }}>Date/Time</th>
                            <th style={{ padding: "16px 20px", fontWeight: 600 }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={4} style={{ padding: 40, textAlign: "center", color: "#64748b" }}>Loading reminders...</td></tr>
                        ) : reminders.length === 0 ? (
                            <tr><td colSpan={4} style={{ padding: 40, textAlign: "center", color: "#64748b" }}>You're all caught up! No active reminders.</td></tr>
                        ) : (
                            reminders.map(r => (
                                <tr key={r._id} style={{ borderTop: "1px solid #1e2535" }}>
                                    <td style={{ padding: "16px 20px", color: "#f1f5f9", fontWeight: 600 }}>{r.message}</td>
                                    <td style={{ padding: "16px 20px", color: "#94a3b8" }}>{r.type}</td>
                                    <td style={{ padding: "16px 20px", color: "#cbd5e1" }}>{new Date(r.reminderDate).toLocaleString()}</td>
                                    <td style={{ padding: "16px 20px" }}><Badge color={r.isCompleted ? "#10b981" : "#f59e0b"}>{r.isCompleted ? "Completed" : "Pending"}</Badge></td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
