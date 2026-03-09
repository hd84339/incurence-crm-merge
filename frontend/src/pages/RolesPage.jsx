import React, { useState, useEffect } from "react";
import { Plus, Shield, X } from "lucide-react";
import { roleAPI } from "../services/api";
import { toast } from "react-hot-toast";

const Badge = ({ children, color }) => (
    <span style={{ display: "inline-flex", alignItems: "center", padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: color + "22", color: color, border: `1px solid ${color}44` }}>{children}</span>
);

export default function RolesPage() {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: "", description: "", color: "#6366f1", permissions: [] });

    const availablePermissions = ['all','clients','policies','claims','reminders','targets','reports','tasks','employees','roles'];

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await roleAPI.create(formData);
            toast.success("Role created successfully!");
            setIsModalOpen(false);
            fetchRoles();
        } catch (err) {
            toast.error(err.response?.data?.message || "Error creating role");
        }
    };

    const openNewModal = () => {
        setFormData({ name: "", description: "", color: "#6366f1", permissions: [] });
        setIsModalOpen(true);
    };

    const togglePermission = (perm) => {
        setFormData(prev => ({
            ...prev,
            permissions: prev.permissions.includes(perm) 
                ? prev.permissions.filter(p => p !== perm)
                : [...prev.permissions, perm]
        }));
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
                <button onClick={openNewModal} style={{ display: "flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg, #f59e0b, #d97706)", color: "#fff", border: "none", padding: "10px 20px", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 12px rgba(245, 158, 11, 0.3)" }}>
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

            {/* Modal Form */}
            {isModalOpen && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(10, 14, 26, 0.8)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: 20 }}>
                    <div style={{ background: "#141824", border: "1px solid #2d3748", borderRadius: 16, width: "100%", maxWidth: 500, overflow: "hidden", maxHeight: "90vh", display: "flex", flexDirection: "column", boxShadow: "0 20px 40px rgba(0,0,0,0.4)" }}>
                        <div style={{ padding: "20px 24px", borderBottom: "1px solid #1e2535", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <h2 style={{ margin: 0, color: "#f1f5f9", fontSize: 18, fontWeight: 700 }}>Build Custom Role</h2>
                            <button onClick={() => setIsModalOpen(false)} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer" }}><X size={20} /></button>
                        </div>
                        <div style={{ overflowY: "auto", padding: 24 }}>
                            <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16 }}>
                                <div>
                                    <label style={{ display: "block", marginBottom: 6, color: "#94a3b8", fontSize: 12, fontWeight: 600, textTransform: "uppercase" }}>Role Name *</label>
                                    <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} style={{ width: "100%", padding: "10px 14px", background: "#0a0e1a", border: "1px solid #2d3748", borderRadius: 8, color: "#f1f5f9", outline: "none" }} />
                                </div>
                                <div>
                                    <label style={{ display: "block", marginBottom: 6, color: "#94a3b8", fontSize: 12, fontWeight: 600, textTransform: "uppercase" }}>Description</label>
                                    <input type="text" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} style={{ width: "100%", padding: "10px 14px", background: "#0a0e1a", border: "1px solid #2d3748", borderRadius: 8, color: "#f1f5f9", outline: "none" }} />
                                </div>
                                <div>
                                    <label style={{ display: "block", marginBottom: 6, color: "#94a3b8", fontSize: 12, fontWeight: 600, textTransform: "uppercase" }}>Color Code</label>
                                    <div style={{ display: "flex", gap: 12 }}>
                                        <input type="color" value={formData.color} onChange={e => setFormData({ ...formData, color: e.target.value })} style={{ width: 40, height: 40, padding: 0, border: "none", borderRadius: 8, cursor: "pointer", background: "transparent" }} />
                                        <input type="text" value={formData.color} onChange={e => setFormData({ ...formData, color: e.target.value })} style={{ flex: 1, padding: "10px 14px", background: "#0a0e1a", border: "1px solid #2d3748", borderRadius: 8, color: "#f1f5f9", outline: "none" }} />
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: "block", marginBottom: 6, color: "#94a3b8", fontSize: 12, fontWeight: 600, textTransform: "uppercase" }}>Permissions</label>
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                                        {availablePermissions.map(p => (
                                            <label key={p} style={{ display: "flex", alignItems: "center", gap: 6, background: formData.permissions.includes(p) ? "#f59e0b22" : "#0a0e1a", border: `1px solid ${formData.permissions.includes(p) ? '#f59e0b' : '#2d3748'}`, padding: "6px 12px", borderRadius: 20, cursor: "pointer", fontSize: 12, color: formData.permissions.includes(p) ? "#f59e0b" : "#94a3b8", transition: "all 0.2s" }}>
                                                <input type="checkbox" checked={formData.permissions.includes(p)} onChange={() => togglePermission(p)} style={{ display: "none" }} />
                                                {p}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 16, paddingTop: 20, borderTop: "1px solid #1e2535" }}>
                                    <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: "10px 20px", background: "transparent", color: "#94a3b8", border: "1px solid #2d3748", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>Cancel</button>
                                    <button type="submit" style={{ padding: "10px 20px", background: "linear-gradient(135deg, #f59e0b, #d97706)", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>Create Role</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
