import React, { useState } from 'react';
import { FaSearch, FaPhone } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import './ConversationList.css';

function ConversationList({ conversations, selectedConversation, onSelectConversation, loading }) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredConversations = conversations.filter((conv) =>
        conv.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conv.customerPhone.includes(searchTerm)
    );

    if (loading) {
        return (
            <div className="conversation-list">
                <div className="conversation-list-header">
                    <h2>Conversations</h2>
                </div>
                <div className="loading-state">
                    <div className="pulse">Loading...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="conversation-list">
            <div className="conversation-list-header">
                <h2>Conversations</h2>
                <p className="text-secondary text-sm">{conversations.length} total</p>
            </div>

            <div className="search-box">
                <FaSearch className="search-icon" />
                <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>

            <div className="conversation-items">
                {filteredConversations.length === 0 ? (
                    <div className="empty-conversations">
                        <p className="text-secondary">No conversations found</p>
                    </div>
                ) : (
                    filteredConversations.map((conversation) => (
                        <div
                            key={conversation._id}
                            className={`conversation-item ${selectedConversation?._id === conversation._id ? 'active' : ''
                                }`}
                            onClick={() => onSelectConversation(conversation)}
                        >
                            <div className="conversation-avatar">
                                {conversation.customerName.charAt(0).toUpperCase()}
                            </div>

                            <div className="conversation-content">
                                <div className="conversation-header-row">
                                    <h4 className="conversation-name">{conversation.customerName}</h4>
                                    <span className="conversation-time">
                                        {formatDistanceToNow(new Date(conversation.lastMessageAt), {
                                            addSuffix: true,
                                        })}
                                    </span>
                                </div>

                                <div className="conversation-meta-row">
                                    <p className="conversation-last-message">
                                        {conversation.lastMessage || 'No messages yet'}
                                    </p>
                                    {conversation.unreadCount > 0 && (
                                        <span className="unread-badge">{conversation.unreadCount}</span>
                                    )}
                                </div>

                                <div className="conversation-phone">
                                    <FaPhone size={10} />
                                    <span>{conversation.customerPhone}</span>
                                </div>

                                {conversation.status && (
                                    <span className={`badge badge-${conversation.status}`}>
                                        {conversation.status}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default ConversationList;
