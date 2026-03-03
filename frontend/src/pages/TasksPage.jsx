import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search, CheckCircle, Clock } from "lucide-react";
import { taskAPI } from "../services/api";
import { toast } from "react-hot-toast";

const Badge = ({ children, color }) => (
    <span style={{ display: "inline-flex", alignItems: "center", padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: color + "22", color: color, border: `1px solid ${color}44` }}>{children}</span>
);

export default function TasksPage() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const res = await taskAPI.getAll();
            setTasks(res.data.data || []);
        } catch (err) {
            toast.error("Failed to load tasks");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: 32 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
                <div>
                    <h1 style={{ margin: "0 0 6px", fontSize: 26, fontWeight: 900, color: "#f1f5f9", display: "flex", alignItems: "center", gap: 12 }}>
                        <CheckCircle size={28} color="#3b82f6" /> Task Management
                    </h1>
                    <p style={{ margin: 0, color: "#64748b", fontSize: 14 }}>Track and assignments, follow-ups, and renewals</p>
                </div>
                <button style={{ display: "flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg, #3b82f6, #2563eb)", color: "#fff", border: "none", padding: "10px 20px", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)" }}>
                    <Plus size={18} /> New Task
                </button>
            </div>

            <div style={{ background: "#141824", border: "1px solid #1e2535", borderRadius: 12, overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                    <thead>
                        <tr style={{ background: "#0f1420", color: "#64748b", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                            <th style={{ padding: "16px 20px", fontWeight: 600 }}>Task Title</th>
                            <th style={{ padding: "16px 20px", fontWeight: 600 }}>Category</th>
                            <th style={{ padding: "16px 20px", fontWeight: 600 }}>Due Date</th>
                            <th style={{ padding: "16px 20px", fontWeight: 600 }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={4} style={{ padding: 40, textAlign: "center", color: "#64748b" }}>Loading tasks...</td></tr>
                        ) : tasks.length === 0 ? (
                            <tr><td colSpan={4} style={{ padding: 40, textAlign: "center", color: "#64748b" }}>No tasks found. Click "New Task" to create one.</td></tr>
                        ) : (
                            tasks.map(t => (
                                <tr key={t._id} style={{ borderTop: "1px solid #1e2535" }}>
                                    <td style={{ padding: "16px 20px", color: "#f1f5f9", fontWeight: 600 }}>{t.title}</td>
                                    <td style={{ padding: "16px 20px", color: "#94a3b8" }}>{t.category}</td>
                                    <td style={{ padding: "16px 20px", color: "#cbd5e1" }}>{new Date(t.dueDate).toLocaleDateString()}</td>
                                    <td style={{ padding: "16px 20px" }}><Badge color="#3b82f6">{t.status}</Badge></td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
