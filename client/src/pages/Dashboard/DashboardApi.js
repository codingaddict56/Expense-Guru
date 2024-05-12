import { fetchAllBudgetPlansAPI, fetchAllExpensesAPI } from "../../utils/StaticData"
import axios from 'axios';

export const fetchExpenses = async (monthAndYear) => {
    try {
        const response = await axios.get(`${fetchAllExpensesAPI}?userid=1&month=${monthAndYear?.getMonth()}&year=${monthAndYear?.getFullYear()}`);
        if (response.data.success) {
            return response;
        }

    } catch (error) {
        console.error('Error fetching data:', error);
    }
    return null;
};
export const fetchBudgetPlan = async (monthAndYear) => {
    try {
        const response = await axios.get(`${fetchAllBudgetPlansAPI}?userid=1&month=${monthAndYear?.getMonth()}&year=${monthAndYear?.getFullYear()}`);
        if (response.data.success) {
            return response;
        }

    } catch (error) {
        console.error('Error fetching data:', error);
    }
    return null;
} 

