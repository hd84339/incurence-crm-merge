import React, { useState, useEffect } from "react";
import { Plus, HeartPulse, X } from "lucide-react";
import { claimAPI, clientAPI, policyAPI } from "../services/api";
import { toast } from "react-hot-toast";

const Badge = ({ children, color }) => (
    <span style={{ display: "inline-flex", alignItems: "center", padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: color + "22", color: color, border: `1px solid ${color}44` }}>{children}</span>
);

export default function ClaimsPage() {
    const [claims, setClaims] = useState([]);
    const [clients, setClients] = useState([]);
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ client: "", policy: "", claimNumber: "", claimType: "Medical", claimAmount: "", incidentDate: "" });

    useEffect(() => {
        fetchClaims();
        fetchClientsAndPolicies();
    }, []);

    const fetchClientsAndPolicies = async () => {
        try {
            const [cRes, pRes] = await Promise.all([clientAPI.getAll(), policyAPI.getAll()]);
            setClients(cRes.data.data || []);
            setPolicies(pRes.data.data || []);
        } catch (err) {}
    };

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await claimAPI.create(formData);
            toast.success("Claim filed successfully!");
            setIsModalOpen(false);
            fetchClaims();
        } catch (err) {
            toast.error(err.response?.data?.message || "Error filing claim");
        }
    };

    const openNewModal = () => {
        setFormData({ client: clients[0]?._id || "", policy: policies[0]?._id || "", claimNumber: "", claimType: "Medical", claimAmount: "", incidentDate: "" });
        setIsModalOpen(true);
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
                <button onClick={openNewModal} style={{ display: "flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg, #ef4444, #dc2626)", color: "#fff", border: "none", padding: "10px 20px", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)" }}>
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

            {/* Modal Form */}
            {isModalOpen && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(10, 14, 26, 0.8)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: 20 }}>
                    <div style={{ background: "#141824", border: "1px solid #2d3748", borderRadius: 16, width: "100%", maxWidth: 500, overflow: "hidden", maxHeight: "90vh", display: "flex", flexDirection: "column", boxShadow: "0 20px 40px rgba(0,0,0,0.4)" }}>
                        <div style={{ padding: "20px 24px", borderBottom: "1px solid #1e2535", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <h2 style={{ margin: 0, color: "#f1f5f9", fontSize: 18, fontWeight: 700 }}>New Claim</h2>
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
                                <div>
                                    <label style={{ display: "block", marginBottom: 6, color: "#94a3b8", fontSize: 12, fontWeight: 600, textTransform: "uppercase" }}>Policy *</label>
                                    <select required value={formData.policy} onChange={e => setFormData({ ...formData, policy: e.target.value })} style={{ width: "100%", padding: "10px 14px", background: "#0a0e1a", border: "1px solid #2d3748", borderRadius: 8, color: "#f1f5f9", outline: "none" }}>
                                        <option value="">Select Policy</option>
                                        {policies.filter(p => p.client === formData.client || !formData.client).map(p => <option key={p._id} value={p._id}>{p.policyNumber} - {p.planName}</option>)}
                                    </select>
                                </div>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                                    <div>
                                        <label style={{ display: "block", marginBottom: 6, color: "#94a3b8", fontSize: 12, fontWeight: 600, textTransform: "uppercase" }}>Claim Number *</label>
                                        <input type="text" required value={formData.claimNumber} onChange={e => setFormData({ ...formData, claimNumber: e.target.value })} style={{ width: "100%", padding: "10px 14px", background: "#0a0e1a", border: "1px solid #2d3748", borderRadius: 8, color: "#f1f5f9", outline: "none" }} />
                                    </div>
                                    <div>
                                        <label style={{ display: "block", marginBottom: 6, color: "#94a3b8", fontSize: 12, fontWeight: 600, textTransform: "uppercase" }}>Claim Type *</label>
                                        <select required value={formData.claimType} onChange={e => setFormData({ ...formData, claimType: e.target.value })} style={{ width: "100%", padding: "10px 14px", background: "#0a0e1a", border: "1px solid #2d3748", borderRadius: 8, color: "#f1f5f9", outline: "none" }}>
                                            {['Death','Maturity','Accident','Medical','Surrender','Partial Withdrawal','Other'].map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                                    <div>
                                        <label style={{ display: "block", marginBottom: 6, color: "#94a3b8", fontSize: 12, fontWeight: 600, textTransform: "uppercase" }}>Claim Amount (₹) *</label>
                                        <input type="number" required min="0" value={formData.claimAmount} onChange={e => setFormData({ ...formData, claimAmount: e.target.value })} style={{ width: "100%", padding: "10px 14px", background: "#0a0e1a", border: "1px solid #2d3748", borderRadius: 8, color: "#f1f5f9", outline: "none" }} />
                                    </div>
                                    <div>
                                        <label style={{ display: "block", marginBottom: 6, color: "#94a3b8", fontSize: 12, fontWeight: 600, textTransform: "uppercase" }}>Incident Date *</label>
                                        <input type="date" required value={formData.incidentDate} onChange={e => setFormData({ ...formData, incidentDate: e.target.value })} style={{ width: "100%", padding: "10px 14px", background: "#0a0e1a", border: "1px solid #2d3748", borderRadius: 8, color: "#f1f5f9", outline: "none" }} />
                                    </div>
                                </div>
                                <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 16, paddingTop: 20, borderTop: "1px solid #1e2535" }}>
                                    <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: "10px 20px", background: "transparent", color: "#94a3b8", border: "1px solid #2d3748", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>Cancel</button>
                                    <button type="submit" style={{ padding: "10px 20px", background: "linear-gradient(135deg, #ef4444, #dc2626)", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>File Claim</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
