import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Dashboard from './Dashboard';
import { calculateTotalExpenses, calculateBalance } from './DashboardUtils';
import { fetchExpenses, fetchBudgetPlan } from './DashboardApi';
import { shallow } from 'enzyme';
import InfoCard from './Card';
import TopExpenses from './TopExpenses';
import DonutChart from './DonutChart';
import BarChart from './BarChart';

const budgetPlanMarch2024 = {
    "userId": 1,
    "incomeAmount": 3000,
    "budgetPlan": [
        {
            "category": "groceries",
            "amount": "100"
        },
        {
            "category": "bills",
            "amount": "200"
        },
        {
            "category": "utilities",
            "amount": "1000"
        },
        {
            "category": "transport and insurance",
            "amount": "250"
        }
    ],
    "month": 2,
    "year": 2024
}
const budgetPlanJan2024={
    "userId": 1,
    "incomeAmount": 4000,
    "budgetPlan": [
        {
            "category": "groceries",
            "amount": "100"
        },
        {
            "category": "bills",
            "amount": "200"
        },
        {
            "category": "utilities",
            "amount": "1000"
        },
        {
            "category": "transport and insurance",
            "amount": "250"
        }
    ],
    "month": 0,
    "year": 2024
}

const budgetPlanFeb2024 = {
    "userId": 1,
    "incomeAmount": 4000,
    "budgetPlan": [
        {
            "category": "groceries",
            "amount": "100"
        },
        {
            "category": "bills",
            "amount": "200"
        },
        {
            "category": "utilities",
            "amount": "1000"
        },
        {
            "category": "transport and insurance",
            "amount": "250"
        }
    ],
    "month": 1,
    "year": 2024
}

const expenses = [{
    "userId": 1,
    "category": "groceries",
    "date": "2024-02-21T00:00:00.000Z",
    "amount": 20,
    "notes": "Dairy and vegetables for week"
}, {
    "userId": 1,
    "category": "bills",
    "date": "2024-02-02T00:00:00.000Z",
    "amount": 100,
    "notes": "Electricity and Gas Bill"
},
{
    "userId": 1,
    "category": "utilities",
    "date": "2024-02-02T00:00:00.000Z",
    "amount": 100,
    "notes": "Utensils"
}]



describe('calculateTotalExpenses', () => {
    it('should return 0 when expenses are not provided', () => {
        const result = calculateTotalExpenses();
        expect(result).toBe(0);
    });

    it('should return 0 when expenses array is empty', () => {
        const expenses = [];
        const result = calculateTotalExpenses(expenses);
        expect(result).toBe(0);
    });

    it('should return the sum of expenses when expenses array is provided', () => {
        const result = calculateTotalExpenses(expenses);
        expect(result).toBe(220);
    });
});

describe('calculateBalance', () => {
    it('should return the correct balance when income amount is greater than total expenses', () => {
        const incomeAmount = 1000;
        const totalExpenses = 500;
        const result = calculateBalance(incomeAmount, totalExpenses);
        expect(result).toBe(500);
    });

    it('should return 0 when income amount is equal to total expenses', () => {
        const incomeAmount = 500;
        const totalExpenses = 500;
        const result = calculateBalance(incomeAmount, totalExpenses);
        expect(result).toBe(0);
    });

    it('should return negative balance when income amount is less than total expenses', () => {
        const incomeAmount = 300;
        const totalExpenses = 500;
        const result = calculateBalance(incomeAmount, totalExpenses);
        expect(result).toBe(-200);
    });
});

jest.mock('./DashboardApi', () => ({
    fetchExpenses: jest.fn(),
    fetchBudgetPlan: jest.fn(),
}));

describe('Dashboard component', () => {
    setUpComponent = async (year, month, budgetPlans, expenses) => {
        await act(async () => {
            render(<Dashboard />);
        });
        await new Promise(resolve => setTimeout(resolve, 2000));
        const yearSelect = screen.getByTestId('yearinput');
        const monthSelect = screen.getByTestId('monthinput');
        userEvent.selectOptions(yearSelect, year);
        userEvent.selectOptions(monthSelect, month);

        await fetchExpenses.mockResolvedValueOnce({
            data: {
                content: expenses
            },
        });

        await fetchBudgetPlan.mockResolvedValueOnce({
            data: {
                content: budgetPlans
            },
        });
    };

    it('renders Dashboard with correct data', async () => {
        await setUpComponent("2024", "January", [budgetPlanFeb2024, budgetPlanMarch2024, budgetPlanJan2024], expenses);
        
        await waitFor(() => {
            expect(screen.getByTestId('data')).toBeInTheDocument();
            expect(screen.getByTestId('DonutChart')).toBeInTheDocument();
            expect(screen.getByTestId('TopExpenses')).toBeInTheDocument();
            expect(screen.getByTestId('BarChart')).toBeInTheDocument();
            expect(screen.getByText('Income')).toBeInTheDocument();
            expect(screen.getByText('€' + budgetPlanMarch2024.incomeAmount)).toBeInTheDocument();
            expect(screen.getByText('Expenses')).toBeInTheDocument();
            expect(screen.getByText('Balance')).toBeInTheDocument();
            expect(screen.getByText('Transactions')).toBeInTheDocument();
            //expect(screen.getByText('No data found for the selected month')).toBeInTheDocument();

        });
    });

    test('displays "No data found" message when there are no expenses or budget plans', async () => {
        await setUpComponent("2020", "March", [], []);

        await waitFor(() => {
            expect(screen.getByText('No data found for the selected month')).toBeInTheDocument();
        });
    });
});


jest.mock('./DashboardApi');

describe('fetchExpenses', () => {
    test('fetches expenses for current and previous 6 months', async () => {
        const expensesData = { data: { success: true, content: expenses } };
        fetchExpenses.mockResolvedValueOnce(expensesData);
        const result = await fetchExpenses(new Date(2024, 0)); // January 2024
        expect(result).toEqual(expensesData);
    });

    test('when passed a garbage string value for date to fetch expenses function, handles errors gracefully', async () => {
        fetchExpenses.mockResolvedValue(null);
        const result = await fetchExpenses("stringvalue");
        expect(result).toEqual(null);
    });
});

describe('fetchBudgetPlan', () => {
    test('fetches budget plan for the given month and year', async () => {
        const budgetPlanData = { data: { success: true, content: [budgetPlanFeb2024, budgetPlanMarch2024] } };
        fetchBudgetPlan.mockResolvedValue(budgetPlanData);
        const result = await fetchBudgetPlan(new Date(2024, 0));
        expect(result).toEqual(budgetPlanData);
    });

    test('when passed a garbage string value for date to fetch budget plan function, handles errors gracefully', async () => {
        fetchBudgetPlan.mockResolvedValue(null);
        const result = await fetchBudgetPlan("stringvalue");
        expect(result).toBe(null);
    });

});

describe('Card component', () => {
    let wrapper = null;
    beforeEach(() => {
    })

    test("checks if the value, title and color changes based on the received props", () => {
        wrapper = shallow(<InfoCard title="Income" value="2000" color="red" />)
        expect(wrapper.find("h3").text()).toBe("2000");
        expect(wrapper.find("h6").text()).toBe("Income");
        expect(wrapper.find("h3").parent().prop("style").color).toBe("red");
    })

});

describe('Top Expenses Component', () => {
    let wrapper = null;
    beforeEach(() => {
    })

    test("top expenses data should be rendered", () => {
        wrapper = shallow(<TopExpenses expenses={expenses} />)
        expect(wrapper.find({ "data-testid": "data" })).toHaveLength(1);
        expect(wrapper.find({ "data-testid": "noData" })).toHaveLength(0);

    })
    test("show no expenses message when there are no expenses", () => {
        wrapper = shallow(<TopExpenses expenses={[]} />)
        expect(wrapper.find({ "data-testid": "data" })).toHaveLength(0);
        expect(wrapper.find({ "data-testid": "noData" })).toHaveLength(1);
    })
});


describe('Donut Chart Component', () => {
    let wrapper = null;

    test("should not show Donut Chart when there is no Budget Plan  ", () => {
        wrapper = shallow(<DonutChart budgetPlan={[]} expenses={[]} />)
        expect(wrapper.find({ "data-testid": "donut" })).toHaveLength(0);
    })
    test("should show the donut chart when there is proper", async () => {
        wrapper = render(<DonutChart budgetPlan={budgetPlanFeb2024} expenses={expenses} />)
        await waitFor(() => {
            expect(wrapper.getByTestId('piechart')).toBeInTheDocument();
        });
    });

});

describe('Bar Chart Component', () => {
    let wrapper = null;

    
    test('renders bar chart with data', async () => {
        wrapper = render(<BarChart expenses={expenses} />);
        await waitFor(() => {
            expect(wrapper.getByTestId('barchart')).toBeInTheDocument();
            
        });
    });
});