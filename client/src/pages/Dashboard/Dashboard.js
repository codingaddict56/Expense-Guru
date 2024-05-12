import { useEffect, useState } from "react";
import InfoCard from './Card'
import './Dashboard.scss';
import DonutChart from "./DonutChart";
import TopExpenses from "./TopExpenses";
import BarChart from "./BarChart";
import { calculateBalance, calculateTotalExpenses } from "./DashboardUtils";
import { fetchExpenses, fetchBudgetPlan } from "./DashboardApi"

const Dashboard = () => {
    const [currentBudgetPlan, setCurrentBudgetPlan] = useState();
    const [expenseHistory, setExpenseHistory] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [balanceAmount, setBalanceAmount] = useState(0);
    const [month, setMonth] = useState(new Date().getMonth());
    const [year, setYear] = useState(new Date().getFullYear());
    const [monthAndYear, setMonthAndYear] = useState(new Date());

    const loadData = async (monthAndYearValue) => {
        try {
            const expensesResponse = await fetchExpenses(monthAndYearValue);
            if (expensesResponse?.data?.content && expensesResponse.data.content.length > 0) {

                let currentExpenses = expensesResponse.data.content.filter(c => new Date(c.date).getMonth() == monthAndYearValue.getMonth() && new Date(c.date).getFullYear() == monthAndYearValue.getFullYear()) || [];
                setExpenses(currentExpenses);
                setExpenseHistory(expensesResponse.data.content.filter(c => new Date(c.date).getMonth() !== monthAndYearValue.getMonth() && new Date(c.date).getFullYear() == monthAndYearValue.getFullYear()) || []);
            }
            else {
                setExpenses([]);
                setExpenseHistory([]);
            }

            const budgetPlanResponse = await fetchBudgetPlan(monthAndYearValue);
            if (budgetPlanResponse?.data?.content && budgetPlanResponse.data.content.length > 0) {
                setCurrentBudgetPlan(budgetPlanResponse.data.content.find(c => c.month == monthAndYearValue.getMonth() && c.year == monthAndYearValue.getFullYear()));
            }
            else {
                setCurrentBudgetPlan({})
            }

        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    // useEffect(() => {
    //     setMonthAndYear(new Date(2024, 1, 1))
    //     loadData(new Date(2024, 1, 1));
    // }, []);


    useEffect(() => {
        let totalExpenses;
        if (expenses) {
            totalExpenses=calculateTotalExpenses(expenses);
            setTotalExpenses(totalExpenses);
        }
        if (currentBudgetPlan) {
            setBalanceAmount(calculateBalance(currentBudgetPlan.incomeAmount, totalExpenses));
        }
    }, [expenses, currentBudgetPlan])

    useEffect(() => {
        if (year > 0 && month >= 0) {
            setMonthAndYear(new Date(year, month, 1));
            loadData(new Date(year, month, 1))
        }
    }, [year, month])


    return (
        <>
            <div className="custom-select" style={{ width: "200px", height: "20px" }}>

                <select
                    style={{ width: '100%' }}
                    onChange={(e) => setYear(e.target.value)}
                    value={parseInt(year)}
                    data-testid="yearinput"
                >
                    <option disabled>Select Year</option>

                    {Array.from({ length: 20 }, (_, index) => new Date().getFullYear() - 10 + index).map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>
            </div>

            <div className="custom-select" style={{ width: "200px" }}>

                <select
                    data-testid="monthinput"
                    style={{ width: '100%' }}
                    onChange={(e) => setMonth(e.target.value)}
                    value={month}
                >    <option  disabled>Select Month</option>

                    {[
                        "January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"
                    ].map((month, index) => (
                        <option key={index} value={index}>
                            {month}
                        </option>
                    ))}
                </select>
            </div>
            {currentBudgetPlan && currentBudgetPlan.incomeAmount && expenses && (
                <div data-testid="data" className="flex-column"><div className="flex-row" style={{ height: "102px" }}>
                    <InfoCard title="Income" value={`€${currentBudgetPlan.incomeAmount}`} color="red" />
                    <InfoCard title="Expenses" value={totalExpenses} color="blue" />
                    <InfoCard title="Balance" value={`€${balanceAmount}`} color="green" />
                    <InfoCard title="Transactions" value={expenses.length} color="yellow" />
                </div>
                    <div data-testid="DonutChart"  className="flex-row" style={{ height: "375px" }}>
                        <div style={{ width: "100%" }}>
                            <DonutChart budgetPlan={currentBudgetPlan} expenses={expenses} />
                        </div>
                    </div>

                    <div className="flex-row" style={{ height: "auto" }}>
                        <div data-testid="TopExpenses"  style={{ width: "50%" }}>
                            <TopExpenses expenses={expenses}  ></TopExpenses>
                        </div>
                        <div data-testid="BarChart"  style={{ width: "50%" }}>
                            <BarChart expenses={expenseHistory} ></BarChart>
                        </div>
                    </div>
                </div>
            )}
            {(!expenses || expenses.length === 0) && (!currentBudgetPlan || !currentBudgetPlan.incomeAmount) &&
                <div className="flex-row" style={{ height: "670px", justifyContent: "space-around", alignItems: "center" }} data-testid="noData">

                    <span>  No data found for the selected month</span>

                </div>
            }
        </>
    )
}

export default Dashboard;