import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Participants
export const getParticipants = async () => {
    const response = await api.get('/participants');
    return response.data;
};

export const addParticipant = async (name) => {
    const response = await api.post('/participants', { name });
    return response.data;
};

export const deleteParticipant = async (id) => {
    const response = await api.delete(`/participants/${id}`);
    return response.data;
};

export const deleteAllParticipants = async () => {
    const response = await api.delete('/participants');
    return response.data;
};

// Expenses
export const getExpenses = async () => {
    const response = await api.get('/expenses');
    return response.data;
};

export const addExpense = async (participantId, amount) => {
    const response = await api.post('/expenses', {
        participant: participantId,
        amount: parseFloat(amount)
    });
    return response.data;
};

export const deleteExpense = async (id) => {
    const response = await api.delete(`/expenses/${id}`);
    return response.data;
};

export const deleteAllExpenses = async () => {
    const response = await api.delete('/expenses');
    return response.data;
};

// Results
export const calculateResults = async () => {
    const response = await api.get('/results/calculate');
    return response.data;
};

export default api;
