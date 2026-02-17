import Expense from '../models/expense.model.js';
import Participant from '../models/participant.model.js';

/**
 * Calculate who owes whom based on expenses
 * Algorithm: Calculate equal share, then determine settlements
 */
const calculateSplit = async () => {
    try {
        // Get all expenses with participant details
        const expenses = await Expense.find().populate('participant', 'name');
        const participants = await Participant.find();

        if (participants.length === 0) {
            return {
                totalExpense: 0,
                perPersonShare: 0,
                settlements: [],
                message: 'No participants found'
            };
        }

        if (expenses.length === 0) {
            return {
                totalExpense: 0,
                perPersonShare: 0,
                settlements: [],
                message: 'No expenses found'
            };
        }

        // Calculate total expense
        const totalExpense = expenses.reduce((sum, expense) => sum + expense.amount, 0);

        // Calculate per person share
        const perPersonShare = totalExpense / participants.length;

        // Calculate balance for each participant (how much they paid - their share)
        const balances = {};

        // Initialize all participants with 0 balance
        participants.forEach(p => {
            balances[p._id.toString()] = -perPersonShare; // Everyone owes their share initially
        });

        // Add what each person paid
        expenses.forEach(expense => {
            const participantId = expense.participant._id.toString();
            balances[participantId] += expense.amount;
        });

        // Separate creditors (positive balance) and debtors (negative balance)
        const creditors = [];
        const debtors = [];

        for (const [participantId, balance] of Object.entries(balances)) {
            const participant = participants.find(p => p._id.toString() === participantId);
            if (balance > 0.01) { // Small threshold for floating point
                creditors.push({ participant, amount: balance });
            } else if (balance < -0.01) {
                debtors.push({ participant, amount: -balance });
            }
        }

        // Calculate settlements (who pays whom)
        const settlements = [];
        let i = 0, j = 0;

        while (i < debtors.length && j < creditors.length) {
            const debtor = debtors[i];
            const creditor = creditors[j];

            const settlementAmount = Math.min(debtor.amount, creditor.amount);

            settlements.push({
                from: debtor.participant.name,
                to: creditor.participant.name,
                amount: Math.round(settlementAmount * 100) / 100 // Round to 2 decimals
            });

            debtor.amount -= settlementAmount;
            creditor.amount -= settlementAmount;

            if (debtor.amount < 0.01) i++;
            if (creditor.amount < 0.01) j++;
        }

        return {
            totalExpense: Math.round(totalExpense * 100) / 100,
            perPersonShare: Math.round(perPersonShare * 100) / 100,
            settlements,
            participantBalances: Object.entries(balances).map(([id, balance]) => {
                const participant = participants.find(p => p._id.toString() === id);
                return {
                    name: participant.name,
                    balance: Math.round(balance * 100) / 100
                };
            })
        };
    } catch (error) {
        throw error;
    }
};

export { calculateSplit };
