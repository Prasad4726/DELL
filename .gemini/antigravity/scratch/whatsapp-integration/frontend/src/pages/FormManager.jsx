import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaPlus, FaTrash, FaEdit, FaArrowLeft } from 'react-icons/fa';
import api from '../services/api';
import Sidebar from '../components/Sidebar';
import './FormManager.css';

function FormManager() {
    const [forms, setForms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        fields: [],
    });

    const { agent, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        loadForms();
    }, []);

    const loadForms = async () => {
        try {
            const response = await api.get('/forms');
            setForms(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error loading forms:', error);
            setLoading(false);
        }
    };

    const handleCreateForm = async (e) => {
        e.preventDefault();

        try {
            await api.post('/forms', formData);
            setShowCreateForm(false);
            setFormData({ name: '', description: '', fields: [] });
            loadForms();
            alert('Form created successfully!');
        } catch (error) {
            console.error('Error creating form:', error);
            alert('Failed to create form');
        }
    };

    const handleDeleteForm = async (formId) => {
        if (!confirm('Are you sure you want to delete this form?')) return;

        try {
            await api.delete(`/forms/${formId}`);
            loadForms();
        } catch (error) {
            console.error('Error deleting form:', error);
            alert('Failed to delete form');
        }
    };

    const addField = () => {
        setFormData({
            ...formData,
            fields: [
                ...formData.fields,
                {
                    fieldName: `field_${formData.fields.length + 1}`,
                    label: '',
                    type: 'text',
                    required: false,
                    options: [],
                },
            ],
        });
    };

    const updateField = (index, key, value) => {
        const updatedFields = [...formData.fields];
        updatedFields[index][key] = value;
        setFormData({ ...formData, fields: updatedFields });
    };

    const removeField = (index) => {
        setFormData({
            ...formData,
            fields: formData.fields.filter((_, i) => i !== index),
        });
    };

    return (
        <div className="dashboard">
            <Sidebar
                agent={agent}
                onLogout={() => {
                    logout();
                    navigate('/login');
                }}
                onNavigate={(path) => navigate(path)}
            />

            <div className="form-manager">
                <div className="form-manager-header">
                    <div className="header-left">
                        <button className="btn-icon" onClick={() => navigate('/dashboard')}>
                            <FaArrowLeft />
                        </button>
                        <div>
                            <h1>Form Manager</h1>
                            <p className="text-secondary">{forms.length} forms created</p>
                        </div>
                    </div>
                    <button className="btn btn-primary" onClick={() => setShowCreateForm(true)}>
                        <FaPlus /> Create Form
                    </button>
                </div>

                <div className="form-manager-content">
                    {loading ? (
                        <div className="loading-state pulse">Loading forms...</div>
                    ) : forms.length === 0 ? (
                        <div className="empty-state">
                            <h3>No Forms Yet</h3>
                            <p className="text-secondary">Create your first form to send to customers</p>
                            <button className="btn btn-primary mt-2" onClick={() => setShowCreateForm(true)}>
                                <FaPlus /> Create Form
                            </button>
                        </div>
                    ) : (
                        <div className="forms-grid">
                            {forms.map((form) => (
                                <div key={form._id} className="form-card glass">
                                    <div className="form-card-header">
                                        <h3>{form.name}</h3>
                                        <button
                                            className="btn-icon"
                                            onClick={() => handleDeleteForm(form._id)}
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                    <p className="form-description text-secondary">
                                        {form.description || 'No description'}
                                    </p>
                                    <div className="form-meta">
                                        <span className="text-tertiary text-sm">
                                            {form.fields.length} fields
                                        </span>
                                        <span className="text-tertiary text-sm">
                                            {form.submissionCount} submissions
                                        </span>
                                    </div>
                                    <span className={`badge ${form.isActive ? 'badge-success' : 'badge-error'}`}>
                                        {form.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {showCreateForm && (
                    <div className="modal-overlay" onClick={() => setShowCreateForm(false)}>
                        <div className="modal glass" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>Create New Form</h2>
                                <button className="btn-icon" onClick={() => setShowCreateForm(false)}>
                                    ×
                                </button>
                            </div>

                            <form onSubmit={handleCreateForm} className="modal-body">
                                <div className="form-group">
                                    <label className="form-label">Form Name *</label>
                                    <input
                                        type="text"
                                        className="input"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Description</label>
                                    <textarea
                                        className="input"
                                        rows="3"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>

                                <div className="form-group">
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="form-label">Fields</label>
                                        <button type="button" className="btn btn-secondary" onClick={addField}>
                                            <FaPlus /> Add Field
                                        </button>
                                    </div>

                                    {formData.fields.map((field, index) => (
                                        <div key={index} className="field-builder">
                                            <input
                                                type="text"
                                                className="input"
                                                placeholder="Field Label"
                                                value={field.label}
                                                onChange={(e) => updateField(index, 'label', e.target.value)}
                                            />
                                            <select
                                                className="input"
                                                value={field.type}
                                                onChange={(e) => updateField(index, 'type', e.target.value)}
                                            >
                                                <option value="text">Text</option>
                                                <option value="number">Number</option>
                                                <option value="email">Email</option>
                                                <option value="phone">Phone</option>
                                                <option value="textarea">Textarea</option>
                                            </select>
                                            <button
                                                type="button"
                                                className="btn-icon"
                                                onClick={() => removeField(index)}
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowCreateForm(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        Create Form
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default FormManager;
