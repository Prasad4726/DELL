import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { getSocket } from '../services/socket';
import Sidebar from '../components/Sidebar';
import ConversationList from '../components/ConversationList';
import ChatWindow from '../components/ChatWindow';
import CustomerPanel from '../components/CustomerPanel';
import './Dashboard.css';

function Dashboard() {
    const { agent, logout } = useAuth();
    const navigate = useNavigate();
    const socket = getSocket();

    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    // Load conversations
    useEffect(() => {
        loadConversations();
    }, []);

    // Listen for real-time updates
    useEffect(() => {
        if (!socket) return;

        socket.on('new-message', (message) => {
            // Add message to the current conversation if it matches
            if (selectedConversation && message.conversationId === selectedConversation._id) {
                setMessages((prev) => [...prev, message]);
            }
        });

        socket.on('conversation-updated', () => {
            loadConversations();
        });

        return () => {
            socket.off('new-message');
            socket.off('conversation-updated');
        };
    }, [socket, selectedConversation]);

    const loadConversations = async () => {
        try {
            const response = await api.get('/conversations');
            setConversations(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error loading conversations:', error);
            setLoading(false);
        }
    };

    const selectConversation = async (conversation) => {
        setSelectedConversation(conversation);

        // Join Socket.IO room
        if (socket) {
            socket.emit('join-conversation', conversation._id);
        }

        // Load messages
        try {
            const response = await api.get(`/messages/${conversation._id}`);
            setMessages(response.data.data);
        } catch (error) {
            console.error('Error loading messages:', error);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="dashboard">
            <Sidebar
                agent={agent}
                onLogout={handleLogout}
                onNavigate={(path) => navigate(path)}
            />

            <div className="dashboard-main">
                <ConversationList
                    conversations={conversations}
                    selectedConversation={selectedConversation}
                    onSelectConversation={selectConversation}
                    loading={loading}
                />

                {selectedConversation ? (
                    <>
                        <ChatWindow
                            conversation={selectedConversation}
                            messages={messages}
                            onSendMessage={() => loadConversations()}
                        />

                        <CustomerPanel
                            conversation={selectedConversation}
                            onUpdate={() => {
                                loadConversations();
                                selectConversation(selectedConversation);
                            }}
                        />
                    </>
                ) : (
                    <div className="empty-state">
                        <div className="empty-state-content">
                            <div className="empty-icon">💬</div>
                            <h2>No Conversation Selected</h2>
                            <p className="text-secondary">
                                Select a conversation from the list to start chatting
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dashboard;
