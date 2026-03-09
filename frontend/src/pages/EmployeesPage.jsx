import React, { useState, useEffect } from "react";
import { Plus, Users, X } from "lucide-react";
import { employeeAPI, roleAPI } from "../services/api";
import { toast } from "react-hot-toast";

const Badge = ({ children, color }) => (
    <span style={{ display: "inline-flex", alignItems: "center", padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: color + "22", color: color, border: `1px solid ${color}44` }}>{children}</span>
);

export default function EmployeesPage() {
    const [employees, setEmployees] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: "", email: "", password: "", phone: "", roleId: "", department: "Administration", status: "Active" });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchEmployees();
        fetchRoles();
    }, []);

    const fetchRoles = async () => {
        try {
            const res = await roleAPI.getAll();
            setRoles(res.data.data || []);
        } catch (err) {}
    };

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            const res = await employeeAPI.getAll();
            setEmployees(res.data.data || []);
        } catch (err) {
            toast.error("Failed to load employees");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await employeeAPI.update(editingId, formData);
                toast.success("Employee updated successfully!");
            } else {
                await employeeAPI.create(formData);
                toast.success("Employee registered successfully!");
            }
            setIsModalOpen(false);
            fetchEmployees();
        } catch (err) {
            toast.error(err.response?.data?.message || "Error saving employee");
        }
    };

    const handleEdit = (emp) => {
        setFormData({ name: emp.name, email: emp.email, password: "", phone: emp.phone, roleId: emp.roleId?._id || emp.roleId || "", department: emp.department, status: emp.status });
        setEditingId(emp._id);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this employee?")) return;
        try {
            await employeeAPI.delete(id);
            toast.success("Employee deleted!");
            fetchEmployees();
        } catch (err) {
            toast.error(err.response?.data?.message || "Error deleting employee");
        }
    };

    const openNewModal = () => {
        setFormData({ name: "", email: "", password: "", phone: "", roleId: roles[0]?._id || "", department: "Administration", status: "Active" });
        setEditingId(null);
        setIsModalOpen(true);
    };

    return (
        <div style={{ padding: 32 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
                <div>
                    <h1 style={{ margin: "0 0 6px", fontSize: 26, fontWeight: 900, color: "#f1f5f9", display: "flex", alignItems: "center", gap: 12 }}>
                        <Users size={28} color="#10b981" /> Employees
                    </h1>
                    <p style={{ margin: 0, color: "#64748b", fontSize: 14 }}>Register team members and assign workflows</p>
                </div>
                <button onClick={openNewModal} style={{ display: "flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg, #10b981, #059669)", color: "#fff", border: "none", padding: "10px 20px", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)" }}>
                    <Plus size={18} /> Register Employee
                </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
                {loading ? (
                    <div style={{ color: "#64748b", padding: 20 }}>Loading employees...</div>
                ) : employees.length === 0 ? (
                    <div style={{ color: "#64748b", padding: 20 }}>No employees found. This usually means the seed script hasn't been run yet.</div>
                ) : employees.map(emp => (
                    <div key={emp._id} style={{ background: "#141824", border: "1px solid #1e2535", borderRadius: 12, padding: 20, display: "flex", gap: 16, alignItems: "center", position: "relative", transition: "transform 0.2s" }} onMouseOver={e => e.currentTarget.style.transform = "translateY(-2px)"} onMouseOut={e => e.currentTarget.style.transform = "translateY(0)"}>
                        <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#10b98122", border: "2px solid #10b98144", display: "flex", alignItems: "center", justifyContent: "center", color: "#10b981", fontSize: 18, fontWeight: 700 }}>
                            {emp.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div style={{ flex: 1 }}>
                            <h3 style={{ margin: "0 0 4px", color: "#f1f5f9", fontSize: 15, fontWeight: 700 }}>{emp.name}</h3>
                            <p style={{ margin: "0 0 8px", color: "#64748b", fontSize: 12 }}>{emp.email}</p>
                            <Badge color={emp.status === 'Active' ? '#10b981' : '#ef4444'}>{emp.status}</Badge>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            <button onClick={() => handleEdit(emp)} style={{ background: "none", border: "none", color: "#3b82f6", cursor: "pointer", opacity: 0.7 }}><Plus size={16} /></button>
                            <button onClick={() => handleDelete(emp._id)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", opacity: 0.7 }}><X size={16} /></button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal Form */}
            {isModalOpen && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(10, 14, 26, 0.8)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: 20 }}>
                    <div style={{ background: "#141824", border: "1px solid #2d3748", borderRadius: 16, width: "100%", maxWidth: 500, overflow: "hidden", maxHeight: "90vh", display: "flex", flexDirection: "column", boxShadow: "0 20px 40px rgba(0,0,0,0.4)" }}>
                        <div style={{ padding: "20px 24px", borderBottom: "1px solid #1e2535", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <h2 style={{ margin: 0, color: "#f1f5f9", fontSize: 18, fontWeight: 700 }}>{editingId ? "Edit Employee" : "Register Employee"}</h2>
                            <button onClick={() => setIsModalOpen(false)} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer" }}><X size={20} /></button>
                        </div>
                        <div style={{ overflowY: "auto", padding: 24 }}>
                            <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16 }}>
                                <div>
                                    <label style={{ display: "block", marginBottom: 6, color: "#94a3b8", fontSize: 12, fontWeight: 600, textTransform: "uppercase" }}>Full Name *</label>
                                    <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} style={{ width: "100%", padding: "10px 14px", background: "#0a0e1a", border: "1px solid #2d3748", borderRadius: 8, color: "#f1f5f9", outline: "none" }} />
                                </div>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                                    <div>
                                        <label style={{ display: "block", marginBottom: 6, color: "#94a3b8", fontSize: 12, fontWeight: 600, textTransform: "uppercase" }}>Email *</label>
                                        <input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} style={{ width: "100%", padding: "10px 14px", background: "#0a0e1a", border: "1px solid #2d3748", borderRadius: 8, color: "#f1f5f9", outline: "none" }} />
                                    </div>
                                    <div>
                                        <label style={{ display: "block", marginBottom: 6, color: "#94a3b8", fontSize: 12, fontWeight: 600, textTransform: "uppercase" }}>Phone *</label>
                                        <input type="text" required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} style={{ width: "100%", padding: "10px 14px", background: "#0a0e1a", border: "1px solid #2d3748", borderRadius: 8, color: "#f1f5f9", outline: "none" }} />
                                    </div>
                                </div>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                                    <div>
                                        <label style={{ display: "block", marginBottom: 6, color: "#94a3b8", fontSize: 12, fontWeight: 600, textTransform: "uppercase" }}>Password {editingId && "(Leave blank to keep same)"}</label>
                                        <input type="password" required={!editingId} minLength={6} value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} style={{ width: "100%", padding: "10px 14px", background: "#0a0e1a", border: "1px solid #2d3748", borderRadius: 8, color: "#f1f5f9", outline: "none" }} />
                                    </div>
                                    <div>
                                        <label style={{ display: "block", marginBottom: 6, color: "#94a3b8", fontSize: 12, fontWeight: 600, textTransform: "uppercase" }}>Role *</label>
                                        <select required value={formData.roleId} onChange={e => setFormData({ ...formData, roleId: e.target.value })} style={{ width: "100%", padding: "10px 14px", background: "#0a0e1a", border: "1px solid #2d3748", borderRadius: 8, color: "#f1f5f9", outline: "none" }}>
                                            <option value="">Select Role</option>
                                            {roles.map(r => <option key={r._id} value={r._id}>{r.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                                    <div>
                                        <label style={{ display: "block", marginBottom: 6, color: "#94a3b8", fontSize: 12, fontWeight: 600, textTransform: "uppercase" }}>Department</label>
                                        <select value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })} style={{ width: "100%", padding: "10px 14px", background: "#0a0e1a", border: "1px solid #2d3748", borderRadius: 8, color: "#f1f5f9", outline: "none" }}>
                                            {['Administration','Sales','Operations','Support','Finance','IT'].map(d => <option key={d} value={d}>{d}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: "block", marginBottom: 6, color: "#94a3b8", fontSize: 12, fontWeight: 600, textTransform: "uppercase" }}>Status</label>
                                        <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} style={{ width: "100%", padding: "10px 14px", background: "#0a0e1a", border: "1px solid #2d3748", borderRadius: 8, color: "#f1f5f9", outline: "none" }}>
                                            <option value="Active">Active</option>
                                            <option value="Inactive">Inactive</option>
                                        </select>
                                    </div>
                                </div>
                                <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 16, paddingTop: 20, borderTop: "1px solid #1e2535" }}>
                                    <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: "10px 20px", background: "transparent", color: "#94a3b8", border: "1px solid #2d3748", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>Cancel</button>
                                    <button type="submit" style={{ padding: "10px 20px", background: "linear-gradient(135deg, #10b981, #059669)", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>{editingId ? "Save Changes" : "Register"}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
