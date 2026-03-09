import React, { useState, useEffect } from "react";
import { Plus, Bell, X } from "lucide-react";
import { reminderAPI, clientAPI } from "../services/api";
import { toast } from "react-hot-toast";

const Badge = ({ children, color }) => (
    <span style={{ display: "inline-flex", alignItems: "center", padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: color + "22", color: color, border: `1px solid ${color}44` }}>{children}</span>
);

export default function RemindersPage() {
    const [reminders, setReminders] = useState([]);
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ client: "", reminderType: "Follow-up", title: "", description: "", dueDate: "", priority: "Medium" });

    useEffect(() => {
        fetchReminders();
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const res = await clientAPI.getAll();
            setClients(res.data.data || []);
        } catch (err) {}
    };

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await reminderAPI.create(formData);
            toast.success("Reminder created successfully!");
            setIsModalOpen(false);
            fetchReminders();
        } catch (err) {
            toast.error(err.response?.data?.message || "Error creating reminder");
        }
    };

    const openNewModal = () => {
        setFormData({ client: clients[0]?._id || "", reminderType: "Follow-up", title: "", description: "", dueDate: "", priority: "Medium" });
        setIsModalOpen(true);
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
                <button onClick={openNewModal} style={{ display: "flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg, #f59e0b, #d97706)", color: "#fff", border: "none", padding: "10px 20px", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 12px rgba(245, 158, 11, 0.3)" }}>
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

            {/* Modal Form */}
            {isModalOpen && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(10, 14, 26, 0.8)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: 20 }}>
                    <div style={{ background: "#141824", border: "1px solid #2d3748", borderRadius: 16, width: "100%", maxWidth: 500, overflow: "hidden", maxHeight: "90vh", display: "flex", flexDirection: "column", boxShadow: "0 20px 40px rgba(0,0,0,0.4)" }}>
                        <div style={{ padding: "20px 24px", borderBottom: "1px solid #1e2535", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <h2 style={{ margin: 0, color: "#f1f5f9", fontSize: 18, fontWeight: 700 }}>New Reminder</h2>
                            <button onClick={() => setIsModalOpen(false)} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer" }}><X size={20} /></button>
                        </div>
                        <div style={{ overflowY: "auto", padding: 24 }}>
                            <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16 }}>
                                <div>
                                    <label style={{ display: "block", marginBottom: 6, color: "#94a3b8", fontSize: 12, fontWeight: 600, textTransform: "uppercase" }}>Client *</label>
                                    <select required value={formData.client} onChange={e => setFormData({ ...formData, client: e.target.value })} style={{ width: "100%", padding: "10px 14px", background: "#0a0e1a", border: "1px solid #2d3748", borderRadius: 8, color: "#f1f5f9", outline: "none" }}>
                                        <option value="">Select Client</option>
                                        {clients.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                                    <div>
                                        <label style={{ display: "block", marginBottom: 6, color: "#94a3b8", fontSize: 12, fontWeight: 600, textTransform: "uppercase" }}>Type *</label>
                                        <select required value={formData.reminderType} onChange={e => setFormData({ ...formData, reminderType: e.target.value })} style={{ width: "100%", padding: "10px 14px", background: "#0a0e1a", border: "1px solid #2d3748", borderRadius: 8, color: "#f1f5f9", outline: "none" }}>
                                            {['Renewal','Premium Due','Maturity','Birthday','Anniversary','Health Checkup','Follow-up','Custom'].map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: "block", marginBottom: 6, color: "#94a3b8", fontSize: 12, fontWeight: 600, textTransform: "uppercase" }}>Due Date & Time *</label>
                                        <input type="datetime-local" required value={formData.dueDate} onChange={e => setFormData({ ...formData, dueDate: e.target.value })} style={{ width: "100%", padding: "10px 14px", background: "#0a0e1a", border: "1px solid #2d3748", borderRadius: 8, color: "#f1f5f9", outline: "none" }} />
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: "block", marginBottom: 6, color: "#94a3b8", fontSize: 12, fontWeight: 600, textTransform: "uppercase" }}>Title *</label>
                                    <input type="text" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} style={{ width: "100%", padding: "10px 14px", background: "#0a0e1a", border: "1px solid #2d3748", borderRadius: 8, color: "#f1f5f9", outline: "none" }} />
                                </div>
                                <div>
                                    <label style={{ display: "block", marginBottom: 6, color: "#94a3b8", fontSize: 12, fontWeight: 600, textTransform: "uppercase" }}>Description</label>
                                    <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={3} style={{ width: "100%", padding: "10px 14px", background: "#0a0e1a", border: "1px solid #2d3748", borderRadius: 8, color: "#f1f5f9", outline: "none", resize: "none" }}></textarea>
                                </div>
                                <div>
                                    <label style={{ display: "block", marginBottom: 6, color: "#94a3b8", fontSize: 12, fontWeight: 600, textTransform: "uppercase" }}>Priority</label>
                                    <select value={formData.priority} onChange={e => setFormData({ ...formData, priority: e.target.value })} style={{ width: "100%", padding: "10px 14px", background: "#0a0e1a", border: "1px solid #2d3748", borderRadius: 8, color: "#f1f5f9", outline: "none" }}>
                                        {['High','Medium','Low'].map(p => <option key={p} value={p}>{p}</option>)}
                                    </select>
                                </div>
                                <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 16, paddingTop: 20, borderTop: "1px solid #1e2535" }}>
                                    <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: "10px 20px", background: "transparent", color: "#94a3b8", border: "1px solid #2d3748", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>Cancel</button>
                                    <button type="submit" style={{ padding: "10px 20px", background: "linear-gradient(135deg, #f59e0b, #d97706)", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>Create Reminder</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
