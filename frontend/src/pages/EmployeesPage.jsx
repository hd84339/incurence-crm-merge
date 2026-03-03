import React, { useState, useEffect } from "react";
import { Plus, Users } from "lucide-react";
import { employeeAPI } from "../services/api";
import { toast } from "react-hot-toast";

const Badge = ({ children, color }) => (
    <span style={{ display: "inline-flex", alignItems: "center", padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: color + "22", color: color, border: `1px solid ${color}44` }}>{children}</span>
);

export default function EmployeesPage() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEmployees();
    }, []);

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

    return (
        <div style={{ padding: 32 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
                <div>
                    <h1 style={{ margin: "0 0 6px", fontSize: 26, fontWeight: 900, color: "#f1f5f9", display: "flex", alignItems: "center", gap: 12 }}>
                        <Users size={28} color="#10b981" /> Employees
                    </h1>
                    <p style={{ margin: 0, color: "#64748b", fontSize: 14 }}>Register team members and assign workflows</p>
                </div>
                <button style={{ display: "flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg, #10b981, #059669)", color: "#fff", border: "none", padding: "10px 20px", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)" }}>
                    <Plus size={18} /> Register Employee
                </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
                {loading ? (
                    <div style={{ color: "#64748b", padding: 20 }}>Loading employees...</div>
                ) : employees.length === 0 ? (
                    <div style={{ color: "#64748b", padding: 20 }}>No employees found. This usually means the seed script hasn't been run yet.</div>
                ) : employees.map(emp => (
                    <div key={emp._id} style={{ background: "#141824", border: "1px solid #1e2535", borderRadius: 12, padding: 20, display: "flex", gap: 16, alignItems: "center", transition: "transform 0.2s" }} onMouseOver={e => e.currentTarget.style.transform = "translateY(-2px)"} onMouseOut={e => e.currentTarget.style.transform = "translateY(0)"}>
                        <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#10b98122", border: "2px solid #10b98144", display: "flex", alignItems: "center", justifyContent: "center", color: "#10b981", fontSize: 18, fontWeight: 700 }}>
                            {emp.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div style={{ flex: 1 }}>
                            <h3 style={{ margin: "0 0 4px", color: "#f1f5f9", fontSize: 15, fontWeight: 700 }}>{emp.name}</h3>
                            <p style={{ margin: "0 0 8px", color: "#64748b", fontSize: 12 }}>{emp.email}</p>
                            <Badge color={emp.status === 'Active' ? '#10b981' : '#ef4444'}>{emp.status}</Badge>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
