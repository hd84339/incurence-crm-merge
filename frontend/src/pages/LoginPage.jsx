import React, { useState } from 'react';
import { authAPI } from '../services/api';
import { toast } from 'react-hot-toast';
import { Shield, Lock, Mail, ArrowRight } from 'lucide-react';

export default function LoginPage({ onLogin }) {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await authAPI.login(formData);
            localStorage.setItem('token', res.data.token);
            toast.success('Login successful!');
            onLogin(res.data.user);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0e1a', padding: 20 }}>
            <div style={{ width: '100%', maxWidth: 400 }}>
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <div style={{ width: 64, height: 64, borderRadius: 16, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, boxShadow: '0 0 30px rgba(99, 102, 241, 0.3)' }}>
                        <Shield size={32} color="#fff" />
                    </div>
                    <h1 style={{ color: '#f1f5f9', fontSize: 28, fontWeight: 800, margin: '0 0 8px' }}>Welcome Back</h1>
                    <p style={{ color: '#64748b', fontSize: 14 }}>Insurance CRM Unified Management</p>
                </div>

                <div style={{ background: '#141824', border: '1px solid #2d3748', borderRadius: 20, padding: 32, boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
                    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 20 }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: 8, color: '#94a3b8', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email Address</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                                <input 
                                    type="email" 
                                    required 
                                    placeholder="admin@crm.com"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    style={{ width: '100%', padding: '12px 12px 12px 42px', background: '#0a0e1a', border: '1px solid #2d3748', borderRadius: 12, color: '#f1f5f9', outline: 'none', transition: 'border-color 0.2s', fontSize: 14 }}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: 8, color: '#94a3b8', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Password</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                                <input 
                                    type="password" 
                                    required 
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    style={{ width: '100%', padding: '12px 12px 12px 42px', background: '#0a0e1a', border: '1px solid #2d3748', borderRadius: 12, color: '#f1f5f9', outline: 'none', transition: 'border-color 0.2s', fontSize: 14 }}
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            style={{ 
                                width: '100%', 
                                padding: '14px', 
                                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', 
                                color: '#fff', 
                                border: 'none', 
                                borderRadius: 12, 
                                fontWeight: 700, 
                                fontSize: 15, 
                                cursor: 'pointer', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                gap: 8,
                                transition: 'transform 0.2s, boxShadow 0.2s',
                                opacity: loading ? 0.7 : 1,
                                marginTop: 10
                            }}
                        >
                            {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight size={18} />
                        </button>
                    </form>
                </div>
                
                <p style={{ textAlign: 'center', color: '#475569', fontSize: 13, marginTop: 32 }}>
                    &copy; 2024 Harsh Dubey. All rights reserved.
                </p>
            </div>
        </div>
    );
}
