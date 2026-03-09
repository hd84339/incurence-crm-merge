import React, { useState, useEffect } from "react";
import { Plus, ShieldAlert, X } from "lucide-react";
import { policyAPI, clientAPI } from "../services/api";
import { toast } from "react-hot-toast";

const Badge = ({ children, color }) => (
    <span style={{ display: "inline-flex", alignItems: "center", padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: color + "22", color: color, border: `1px solid ${color}44` }}>{children}</span>
);

export default function PoliciesPage() {
    const [policies, setPolicies] = useState([]);
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ client: "", policyNumber: "", policyType: "Life Insurance", company: "LIC", planName: "", premiumAmount: "", sumAssured: "", policyTerm: "", startDate: "", maturityDate: "" });

    useEffect(() => {
        fetchPolicies();
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const res = await clientAPI.getAll();
            setClients(res.data.data || []);
        } catch (err) {}
    };

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await policyAPI.create(formData);
            toast.success("Policy created successfully!");
            setIsModalOpen(false);
            fetchPolicies();
        } catch (err) {
            toast.error(err.response?.data?.message || "Error creating policy");
        }
    };

    const openNewModal = () => {
        setFormData({ client: clients[0]?._id || "", policyNumber: "", policyType: "Life Insurance", company: "LIC", planName: "", premiumAmount: "", sumAssured: "", policyTerm: "", startDate: "", maturityDate: "" });
        setIsModalOpen(true);
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
                <button onClick={openNewModal} style={{ display: "flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg, #14b8a6, #0d9488)", color: "#fff", border: "none", padding: "10px 20px", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 12px rgba(20, 184, 166, 0.3)" }}>
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

            {/* Modal Form */}
            {isModalOpen && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(10, 14, 26, 0.8)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: 20 }}>
                    <div style={{ background: "#141824", border: "1px solid #2d3748", borderRadius: 16, width: "100%", maxWidth: 600, overflow: "hidden", maxHeight: "90vh", display: "flex", flexDirection: "column", boxShadow: "0 20px 40px rgba(0,0,0,0.4)" }}>
                        <div style={{ padding: "20px 24px", borderBottom: "1px solid #1e2535", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <h2 style={{ margin: 0, color: "#f1f5f9", fontSize: 18, fontWeight: 700 }}>Add Policy</h2>
                            <button onClick={() => setIsModalOpen(false)} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer" }}><X size={20} /></button>
                        </div>
                        <div style={{ overflowY: "auto", padding: 24 }}>
                            <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16 }}>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                                    <div>
                                        <label style={{ display: "block", marginBottom: 6, color: "#94a3b8", fontSize: 12, fontWeight: 600, textTransform: "uppercase" }}>Client *</label>
                                        <select required value={formData.client} onChange={e => setFormData({ ...formData, client: e.target.value })} style={{ width: "100%", padding: "10px 14px", background: "#0a0e1a", border: "1px solid #2d3748", borderRadius: 8, color: "#f1f5f9", outline: "none" }}>
                                            <option value="">Select Client</option>
                                            {clients.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: "block", marginBottom: 6, color: "#94a3b8", fontSize: 12, fontWeight: 600, textTransform: "uppercase" }}>Policy Number *</label>
                                        <input type="text" required value={formData.policyNumber} onChange={e => setFormData({ ...formData, policyNumber: e.target.value })} style={{ width: "100%", padding: "10px 14px", background: "#0a0e1a", border: "1px solid #2d3748", borderRadius: 8, color: "#f1f5f9", outline: "none" }} />
                                    </div>
                                </div>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                                    <div>
                                        <label style={{ display: "block", marginBottom: 6, color: "#94a3b8", fontSize: 12, fontWeight: 600, textTransform: "uppercase" }}>Policy Type *</label>
                                        <select required value={formData.policyType} onChange={e => setFormData({ ...formData, policyType: e.target.value })} style={{ width: "100%", padding: "10px 14px", background: "#0a0e1a", border: "1px solid #2d3748", borderRadius: 8, color: "#f1f5f9", outline: "none" }}>
                                            {['Life Insurance','General Insurance','Mutual Fund','Health','Motor','Travel'].map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: "block", marginBottom: 6, color: "#94a3b8", fontSize: 12, fontWeight: 600, textTransform: "uppercase" }}>Company *</label>
                                        <select required value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} style={{ width: "100%", padding: "10px 14px", background: "#0a0e1a", border: "1px solid #2d3748", borderRadius: 8, color: "#f1f5f9", outline: "none" }}>
                                            {['LIC','Bajaj','HDFC','ICICI','TATA AIA','SBI Life','Max Life','Other'].map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: "block", marginBottom: 6, color: "#94a3b8", fontSize: 12, fontWeight: 600, textTransform: "uppercase" }}>Plan Name *</label>
                                    <input type="text" required value={formData.planName} onChange={e => setFormData({ ...formData, planName: e.target.value })} style={{ width: "100%", padding: "10px 14px", background: "#0a0e1a", border: "1px solid #2d3748", borderRadius: 8, color: "#f1f5f9", outline: "none" }} />
                                </div>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                                    <div>
                                        <label style={{ display: "block", marginBottom: 6, color: "#94a3b8", fontSize: 12, fontWeight: 600, textTransform: "uppercase" }}>Premium (₹) *</label>
                                        <input type="number" required min="0" value={formData.premiumAmount} onChange={e => setFormData({ ...formData, premiumAmount: e.target.value })} style={{ width: "100%", padding: "10px 14px", background: "#0a0e1a", border: "1px solid #2d3748", borderRadius: 8, color: "#f1f5f9", outline: "none" }} />
                                    </div>
                                    <div>
                                        <label style={{ display: "block", marginBottom: 6, color: "#94a3b8", fontSize: 12, fontWeight: 600, textTransform: "uppercase" }}>Sum Assured (₹) *</label>
                                        <input type="number" required min="0" value={formData.sumAssured} onChange={e => setFormData({ ...formData, sumAssured: e.target.value })} style={{ width: "100%", padding: "10px 14px", background: "#0a0e1a", border: "1px solid #2d3748", borderRadius: 8, color: "#f1f5f9", outline: "none" }} />
                                    </div>
                                    <div>
                                        <label style={{ display: "block", marginBottom: 6, color: "#94a3b8", fontSize: 12, fontWeight: 600, textTransform: "uppercase" }}>Term (Years) *</label>
                                        <input type="number" required min="1" value={formData.policyTerm} onChange={e => setFormData({ ...formData, policyTerm: e.target.value })} style={{ width: "100%", padding: "10px 14px", background: "#0a0e1a", border: "1px solid #2d3748", borderRadius: 8, color: "#f1f5f9", outline: "none" }} />
                                    </div>
                                </div>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                                    <div>
                                        <label style={{ display: "block", marginBottom: 6, color: "#94a3b8", fontSize: 12, fontWeight: 600, textTransform: "uppercase" }}>Start Date *</label>
                                        <input type="date" required value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} style={{ width: "100%", padding: "10px 14px", background: "#0a0e1a", border: "1px solid #2d3748", borderRadius: 8, color: "#f1f5f9", outline: "none" }} />
                                    </div>
                                    <div>
                                        <label style={{ display: "block", marginBottom: 6, color: "#94a3b8", fontSize: 12, fontWeight: 600, textTransform: "uppercase" }}>Maturity Date *</label>
                                        <input type="date" required value={formData.maturityDate} onChange={e => setFormData({ ...formData, maturityDate: e.target.value })} style={{ width: "100%", padding: "10px 14px", background: "#0a0e1a", border: "1px solid #2d3748", borderRadius: 8, color: "#f1f5f9", outline: "none" }} />
                                    </div>
                                </div>
                                <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 16, paddingTop: 20, borderTop: "1px solid #1e2535" }}>
                                    <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: "10px 20px", background: "transparent", color: "#94a3b8", border: "1px solid #2d3748", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>Cancel</button>
                                    <button type="submit" style={{ padding: "10px 20px", background: "linear-gradient(135deg, #14b8a6, #0d9488)", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>Create Policy</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
