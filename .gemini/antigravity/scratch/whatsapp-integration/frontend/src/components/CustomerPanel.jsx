import React, { useState, useEffect } from 'react';
import { FaTimes, FaWpforms } from 'react-icons/fa';
import api from '../services/api';
import './CustomerPanel.css';

function CustomerPanel({ conversation, onUpdate }) {
    const [forms, setForms] = useState([]);
    const [showFormSelector, setShowFormSelector] = useState(false);
    const [sending, setSending] = useState(false);

    useEffect(() => {
        loadForms();
    }, []);

    const loadForms = async () => {
        try {
            const response = await api.get('/forms?isActive=true');
            setForms(response.data.data);
        } catch (error) {
            console.error('Error loading forms:', error);
        }
    };

    const handleSendForm = async (formId) => {
        setSending(true);
        try {
            await api.post(`/forms/${formId}/send`, {
                conversationId: conversation._id,
            });

            setShowFormSelector(false);
            onUpdate();
            alert('Form sent successfully!');
        } catch (error) {
            console.error('Error sending form:', error);
            alert('Failed to send form');
        } finally {
            setSending(false);
        }
    };

    const handleStatusChange = async (newStatus) => {
        try {
            await api.patch(`/conversations/${conversation._id}`, {
                status: newStatus,
            });
            onUpdate();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    return (
        <div className="customer-panel">
            <div className="panel-header">
                <h3>Customer Info</h3>
            </div>

            <div className="panel-content">
                <div className="info-section">
                    <label className="info-label">Name</label>
                    <p className="info-value">{conversation.customerName}</p>
                </div>

                <div className="info-section">
                    <label className="info-label">Phone</label>
                    <p className="info-value">{conversation.customerPhone}</p>
                </div>

                <div className="info-section">
                    <label className="info-label">Status</label>
                    <select
                        className="input"
                        value={conversation.status}
                        onChange={(e) => handleStatusChange(e.target.value)}
                    >
                        <option value="active">Active</option>
                        <option value="pending">Pending</option>
                        <option value="closed">Closed</option>
                    </select>
                </div>

                {conversation.tags && conversation.tags.length > 0 && (
                    <div className="info-section">
                        <label className="info-label">Tags</label>
                        <div className="tags-container">
                            {conversation.tags.map((tag, idx) => (
                                <span key={idx} className="badge badge-info">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <div className="panel-actions">
                    <button
                        className="btn btn-secondary w-full"
                        onClick={() => setShowFormSelector(!showFormSelector)}
                    >
                        <FaWpforms /> Send Form
                    </button>
                </div>

                {showFormSelector && (
                    <div className="form-selector">
                        <div className="form-selector-header">
                            <h4>Select a Form</h4>
                            <button
                                className="btn-icon"
                                onClick={() => setShowFormSelector(false)}
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <div className="form-list">
                            {forms.length === 0 ? (
                                <p className="text-secondary text-sm">No active forms available</p>
                            ) : (
                                forms.map((form) => (
                                    <div
                                        key={form._id}
                                        className="form-item"
                                        onClick={() => !sending && handleSendForm(form._id)}
                                    >
                                        <div>
                                            <h5>{form.name}</h5>
                                            <p className="text-secondary text-sm">{form.description}</p>
                                        </div>
                                        <span className="text-tertiary text-xs">
                                            {form.fields.length} fields
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CustomerPanel;
