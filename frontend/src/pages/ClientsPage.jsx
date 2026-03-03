import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search, X, Briefcase } from "lucide-react";
import { clientAPI } from "../services/api";
import { toast } from "react-hot-toast";

const Badge = ({ children, color }) => (
    <span style={{ display: "inline-flex", alignItems: "center", padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: color + "22", color: color, border: `1px solid ${color}44` }}>{children}</span>
);

export default function ClientsPage() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: "", email: "", phone: "", clientType: "Individual", priority: "Medium", status: "Prospect" });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            setLoading(true);
            const res = await clientAPI.getAll();
            setClients(res.data.data || []);
        } catch (err) {
            toast.error("Failed to load clients");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await clientAPI.update(editingId, formData);
                toast.success("Client updated!");
            } else {
                await clientAPI.create(formData);
                toast.success("Client created!");
            }
            setIsModalOpen(false);
            fetchClients();
        } catch (err) {
            toast.error(err.response?.data?.message || "Error saving client");
        }
    };

    const handleEdit = (client) => {
        setFormData({ name: client.name, email: client.email, phone: client.phone, clientType: client.clientType, priority: client.priority, status: client.status });
        setEditingId(client._id);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this client?")) return;
        try {
            await clientAPI.delete(id);
            toast.success("Client deleted!");
            fetchClients();
        } catch (err) {
            toast.error("Error deleting client");
        }
    };

    const openNewModal = () => {
        setFormData({ name: "", email: "", phone: "", clientType: "Individual", priority: "Medium", status: "Prospect" });
        setEditingId(null);
        setIsModalOpen(true);
    };

    const filteredClients = clients.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || (c.email && c.email.toLowerCase().includes(search.toLowerCase())));

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active': return '#10b981';
            case 'Prospect': return '#3b82f6';
            case 'Inactive': return '#ef4444';
            default: return '#64748b';
        }
    };

    return (
        <div style={{ padding: 32 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
                <div>
                    <h1 style={{ margin: "0 0 6px", fontSize: 26, fontWeight: 900, color: "#f1f5f9", display: "flex", alignItems: "center", gap: 12 }}>
                        <Briefcase size={28} color="#8b5cf6" /> Client Management
                    </h1>
                    <p style={{ margin: 0, color: "#64748b", fontSize: 14 }}>Manage your insurance clients and prospects</p>
                </div>
                <button onClick={openNewModal} style={{ display: "flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg, #8b5cf6, #6366f1)", color: "#fff", border: "none", padding: "10px 20px", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)" }}>
                    <Plus size={18} /> Add Client
                </button>
            </div>

            <div style={{ background: "#141824", border: "1px solid #1e2535", borderRadius: 12, overflow: "hidden" }}>
                <div style={{ padding: "16px 20px", borderBottom: "1px solid #1e2535", display: "flex", alignItems: "center", gap: 12 }}>
                    <Search size={18} color="#64748b" />
                    <input
                        type="text"
                        placeholder="Search clients by name or email..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{ background: "transparent", border: "none", color: "#f1f5f9", fontSize: 14, width: "100%", outline: "none" }}
                    />
                </div>

                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                        <thead>
                            <tr style={{ background: "#0f1420", color: "#64748b", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                <th style={{ padding: "16px 20px", fontWeight: 600 }}>Client Name</th>
                                <th style={{ padding: "16px 20px", fontWeight: 600 }}>Contact Info</th>
                                <th style={{ padding: "16px 20px", fontWeight: 600 }}>Type</th>
                                <th style={{ padding: "16px 20px", fontWeight: 600 }}>Status</th>
                                <th style={{ padding: "16px 20px", fontWeight: 600, textAlign: "right" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={5} style={{ padding: 40, textAlign: "center", color: "#64748b" }}>Loading clients...</td></tr>
                            ) : filteredClients.length === 0 ? (
                                <tr><td colSpan={5} style={{ padding: 40, textAlign: "center", color: "#64748b" }}>No clients found.</td></tr>
                            ) : (
                                filteredClients.map(client => (
                                    <tr key={client._id} style={{ borderTop: "1px solid #1e2535", transition: "background 0.2s" }} onMouseOver={e => e.currentTarget.style.background = "#1a1f2e"} onMouseOut={e => e.currentTarget.style.background = "transparent"}>
                                        <td style={{ padding: "16px 20px" }}>
                                            <div style={{ color: "#f1f5f9", fontSize: 14, fontWeight: 600 }}>{client.name}</div>
                                            <div style={{ color: "#64748b", fontSize: 12, marginTop: 4 }}>Priority: <span style={{ color: client.priority === 'High' ? '#ef4444' : '#94a3b8' }}>{client.priority}</span></div>
                                        </td>
                                        <td style={{ padding: "16px 20px" }}>
                                            <div style={{ color: "#cbd5e1", fontSize: 13 }}>{client.phone}</div>
                                            <div style={{ color: "#64748b", fontSize: 12, marginTop: 4 }}>{client.email || 'No email provided'}</div>
                                        </td>
                                        <td style={{ padding: "16px 20px", color: "#94a3b8", fontSize: 13 }}>{client.clientType}</td>
                                        <td style={{ padding: "16px 20px" }}>
                                            <Badge color={getStatusColor(client.status)}>{client.status}</Badge>
                                        </td>
                                        <td style={{ padding: "16px 20px", textAlign: "right" }}>
                                            <button onClick={() => handleEdit(client)} style={{ background: "none", border: "none", color: "#3b82f6", cursor: "pointer", padding: 6, opacity: 0.8 }}><Edit size={16} /></button>
                                            <button onClick={() => handleDelete(client._id)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", padding: 6, opacity: 0.8, marginLeft: 8 }}><Trash2 size={16} /></button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Form */}
            {isModalOpen && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(10, 14, 26, 0.8)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: 20 }}>
                    <div style={{ background: "#141824", border: "1px solid #2d3748", borderRadius: 16, width: "100%", maxWidth: 500, overflow: "hidden", boxShadow: "0 20px 40px rgba(0,0,0,0.4)" }}>
                        <div style={{ padding: "20px 24px", borderBottom: "1px solid #1e2535", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <h2 style={{ margin: 0, color: "#f1f5f9", fontSize: 18, fontWeight: 700 }}>{editingId ? "Edit Client" : "Add New Client"}</h2>
                            <button onClick={() => setIsModalOpen(false)} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer" }}><X size={20} /></button>
                        </div>

                        <form onSubmit={handleSubmit} style={{ padding: 24 }}>
                            <div style={{ display: "grid", gap: 16 }}>
                                <div>
                                    <label style={{ display: "block", marginBottom: 6, color: "#94a3b8", fontSize: 12, fontWeight: 600, textTransform: "uppercase" }}>Full Name *</label>
                                    <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} style={{ width: "100%", padding: "10px 14px", background: "#0a0e1a", border: "1px solid #2d3748", borderRadius: 8, color: "#f1f5f9", outline: "none" }} />
                                </div>

                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                                    <div>
                                        <label style={{ display: "block", marginBottom: 6, color: "#94a3b8", fontSize: 12, fontWeight: 600, textTransform: "uppercase" }}>Phone *</label>
                                        <input type="text" required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} style={{ width: "100%", padding: "10px 14px", background: "#0a0e1a", border: "1px solid #2d3748", borderRadius: 8, color: "#f1f5f9", outline: "none" }} />
                                    </div>
                                    <div>
                                        <label style={{ display: "block", marginBottom: 6, color: "#94a3b8", fontSize: 12, fontWeight: 600, textTransform: "uppercase" }}>Email</label>
                                        <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} style={{ width: "100%", padding: "10px 14px", background: "#0a0e1a", border: "1px solid #2d3748", borderRadius: 8, color: "#f1f5f9", outline: "none" }} />
                                    </div>
                                </div>

                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                                    <div>
                                        <label style={{ display: "block", marginBottom: 6, color: "#94a3b8", fontSize: 12, fontWeight: 600, textTransform: "uppercase" }}>Type</label>
                                        <select value={formData.clientType} onChange={e => setFormData({ ...formData, clientType: e.target.value })} style={{ width: "100%", padding: "10px 14px", background: "#0a0e1a", border: "1px solid #2d3748", borderRadius: 8, color: "#f1f5f9", outline: "none" }}>
                                            <option value="Individual">Individual</option>
                                            <option value="Corporate">Corporate</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: "block", marginBottom: 6, color: "#94a3b8", fontSize: 12, fontWeight: 600, textTransform: "uppercase" }}>Priority</label>
                                        <select value={formData.priority} onChange={e => setFormData({ ...formData, priority: e.target.value })} style={{ width: "100%", padding: "10px 14px", background: "#0a0e1a", border: "1px solid #2d3748", borderRadius: 8, color: "#f1f5f9", outline: "none" }}>
                                            <option value="Low">Low</option>
                                            <option value="Medium">Medium</option>
                                            <option value="High">High</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: "block", marginBottom: 6, color: "#94a3b8", fontSize: 12, fontWeight: 600, textTransform: "uppercase" }}>Status</label>
                                        <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} style={{ width: "100%", padding: "10px 14px", background: "#0a0e1a", border: "1px solid #2d3748", borderRadius: 8, color: "#f1f5f9", outline: "none" }}>
                                            <option value="Prospect">Prospect</option>
                                            <option value="Active">Active</option>
                                            <option value="Inactive">Inactive</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 24, paddingTop: 20, borderTop: "1px solid #1e2535" }}>
                                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: "10px 20px", background: "transparent", color: "#94a3b8", border: "1px solid #2d3748", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>Cancel</button>
                                <button type="submit" style={{ padding: "10px 20px", background: "#8b5cf6", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>{editingId ? "Save Changes" : "Create Client"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
