import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import ExpenseDetail from './pages/ExpenseDetail';
import './App.css';

function App() {
    return (
        <Router>
            <div className="app">
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/history" element={<History />} />
                    <Route path="/expense/:id" element={<ExpenseDetail />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
