import React, { useState, useEffect, useRef } from 'react';
import { FaPaperPlane, FaPaperclip, FaWpforms } from 'react-icons/fa';
import { format } from 'date-fns';
import api from '../services/api';
import './ChatWindow.css';

function ChatWindow({ conversation, messages, onSendMessage }) {
    const [messageText, setMessageText] = useState('');
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();

        if (!messageText.trim() || sending) return;

        setSending(true);

        try {
            await api.post('/messages/send', {
                conversationId: conversation._id,
                body: messageText,
            });

            setMessageText('');
            onSendMessage();
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Failed to send message');
        } finally {
            setSending(false);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const uploadResponse = await api.post('/messages/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const mediaUrl = uploadResponse.data.data.url;

            await api.post('/messages/send', {
                conversationId: conversation._id,
                mediaUrl,
                body: file.name,
            });

            onSendMessage();
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Failed to upload file');
        }
    };

    return (
        <div className="chat-window">
            <div className="chat-header">
                <div className="chat-header-info">
                    <h3>{conversation.customerName}</h3>
                    <p className="text-secondary text-sm">{conversation.customerPhone}</p>
                </div>
                <div className="chat-header-status">
                    <span className={`badge badge-${conversation.status}`}>
                        {conversation.status}
                    </span>
                </div>
            </div>

            <div className="chat-messages">
                {messages.length === 0 ? (
                    <div className="empty-chat">
                        <p className="text-secondary">No messages yet</p>
                    </div>
                ) : (
                    messages.map((message) => (
                        <div
                            key={message._id}
                            className={`message ${message.direction === 'outbound' ? 'outbound' : 'inbound'}`}
                        >
                            <div className="message-bubble">
                                {message.mediaUrl && (
                                    <div className="message-media">
                                        {message.messageType === 'image' ? (
                                            <img src={message.mediaUrl} alt="Media" />
                                        ) : (
                                            <a href={message.mediaUrl} target="_blank" rel="noopener noreferrer">
                                                📎 {message.body || 'File'}
                                            </a>
                                        )}
                                    </div>
                                )}

                                {message.body && !message.mediaUrl && (
                                    <p className="message-text">{message.body}</p>
                                )}

                                {message.formData && (
                                    <div className="message-form-data">
                                        <p className="form-response-header">📋 Form Response:</p>
                                        {Object.entries(message.formData).map(([key, value]) => (
                                            <div key={key} className="form-field">
                                                <span className="field-label">{key}:</span>
                                                <span className="field-value">{value}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <span className="message-time">
                                    {format(new Date(message.createdAt), 'HH:mm')}
                                    {message.direction === 'outbound' && (
                                        <span className="message-status"> • {message.status}</span>
                                    )}
                                </span>
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            <form className="chat-input" onSubmit={handleSend}>
                <input
                    type="file"
                    id="file-upload"
                    style={{ display: 'none' }}
                    onChange={handleFileUpload}
                    accept="image/*,.pdf,.doc,.docx"
                />

                <label htmlFor="file-upload" className="btn-icon">
                    <FaPaperclip />
                </label>

                <input
                    type="text"
                    className="input"
                    placeholder="Type a message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    disabled={sending}
                />

                <button type="submit" className="btn-icon btn-send" disabled={sending || !messageText.trim()}>
                    <FaPaperPlane />
                </button>
            </form>
        </div>
    );
}

export default ChatWindow;
