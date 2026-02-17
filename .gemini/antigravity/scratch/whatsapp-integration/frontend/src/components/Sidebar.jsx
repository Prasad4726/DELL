import React from 'react';
import { FaWhatsapp, FaComments, FaWpforms, FaSignOutAlt, FaUser } from 'react-icons/fa';
import './Sidebar.css';

function Sidebar({ agent, onLogout, onNavigate }) {
    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <div className="sidebar-logo">
                    <FaWhatsapp size={32} />
                </div>
            </div>

            <nav className="sidebar-nav">
                <button
                    className="sidebar-item active"
                    onClick={() => onNavigate('/dashboard')}
                    title="Conversations"
                >
                    <FaComments size={24} />
                </button>

                <button
                    className="sidebar-item"
                    onClick={() => onNavigate('/forms')}
                    title="Form Manager"
                >
                    <FaWpforms size={24} />
                </button>
            </nav>

            <div className="sidebar-footer">
                <div className="sidebar-item">
                    <div className="agent-avatar" title={agent?.name}>
                        {agent?.name?.charAt(0).toUpperCase()}
                    </div>
                </div>

                <button
                    className="sidebar-item"
                    onClick={onLogout}
                    title="Logout"
                >
                    <FaSignOutAlt size={22} />
                </button>
            </div>
        </div>
    );
}

export default Sidebar;
