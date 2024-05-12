import React, { useState, useEffect } from 'react';
import { Form, Input, Select, message } from "antd";
import axios from "axios";
import Table from 'react-bootstrap/Table';
import { addBudgetPlanAPI } from "../../utils/StaticData"
import "./MonthlyBudget.scss";
import { fetchCategoriesByUserAPI } from '../../utils/StaticData';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const { Option } = Select;



const MonthlyBudget = () => {

    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        selectedDropdownValue: '',
    });
    const [monthlyBudget, setMonthlyBudget] = useState({
        userId: 1,
        incomeAmount: 0,
        month: 0,
        year: Date.getFullYear,
        budgetPlan: [{
            category: "",
            amount: 0,
            description: ""
        }]
    });



    const handleSubmit = async () => {
        try {

            console.log(monthlyBudget)
            const sum = calculateSum();
            console.log(sum)
            if (sum > monthlyBudget.incomeAmount) {
                toast.warn('Category allocation exceeds income!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light"
                });
                return;
            }
            //remove budgetPlans with empty category in monthlyBudget.budgetPlan array 

            monthlyBudget.budgetPlan = monthlyBudget.budgetPlan.filter(b => categories.includes(b.category) && b.amount > 0)
            await axios.post(addBudgetPlanAPI, { monthlyBudget })
            message.success('Budget added ')
        } catch (error) {
            console.log(error)
            message.error('Budget adding failed')
        }
    }

    const handleChange = (e) => {
        console.log(e)
        const { name, value } = e.target;
        setMonthlyBudget(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    const handleSelectChange = (field, value) => {
        setMonthlyBudget(prevState => ({
            ...prevState,
            [field]: value
        }));
    };
    const handleBudgetChange = (index, field, value) => {
        const updatedBudgetPlan = [...monthlyBudget.budgetPlan];
        if (updatedBudgetPlan[index]) {
            updatedBudgetPlan[index][field] = value;
            console.log(updatedBudgetPlan[index][field])
        } else {
            updatedBudgetPlan[index] = { [field]: value };
        }
        setMonthlyBudget(prevState => ({
            ...prevState,
            budgetPlan: updatedBudgetPlan
        }));
        console.log(monthlyBudget.budgetPlan)

    };

    const handleDropdownChange = (e) => {
        setFormData({
            ...formData,
            selectedDropdownValue: e.target.value,
        });
    };

    const calculateSum = () => {
        // Calculate the sum of the array of numbers
        const sum = Object.values(monthlyBudget.budgetPlan.map(b => parseInt(b.amount)))
        const result = sum.reduce((acc, num) => acc + num, 0);
        return result;
    };

    const AddEmptyBudgetPlanObject = () => {
        const updatedBudgetPlan = [...monthlyBudget.budgetPlan];

        updatedBudgetPlan.push({ category: "", amount: 0, description: "" })
        setMonthlyBudget(prevState => ({
            ...prevState,
            budgetPlan: updatedBudgetPlan
        }));

    }

    useEffect(() => {
        const fetchCategoriesForUser = async () => {
            try {
                const response = await axios.get(fetchCategoriesByUserAPI);
                setCategories(response?.data?.content?.map(c => c.name));
            }
            catch (error) {
                console.error(error)
            }
        }
        fetchCategoriesForUser();
    }, []);

    useEffect(()=>{
        console.log(monthlyBudget)
    },monthlyBudget);
    return (
        <div className="container">
            <h3>Monthly Budget Plan</h3>

            <Form layout="vertical" class="form">
                <div className="mb-3">
                    <label className="form-label">Add Income</label>
                    <Input
                        type="text"
                        value={monthlyBudget.incomeAmount}
                        name="incomeAmount"
                        onChange={(e) => handleChange(e)}
                    />
                </div>

             
                <div className="mb-3">
                    <label className="form-label">Month</label>
                    <Select
                        placeholder="Select Month"
                        style={{ width: '100%' }}
                        onChange={(value) => handleSelectChange("month", value)}
                        value={monthlyBudget.month}
                    >
                        {[
                            "January", "February", "March", "April", "May", "June",
                            "July", "August", "September", "October", "November", "December"
                        ].map((month, index) => (
                            <Option key={index} value={index}>
                                {month}
                            </Option>
                        ))}
                    </Select>
                </div>
                <div className="mb-3">
                    <label className="form-label">Year</label>
                    <Select
                        placeholder="Select Year"
                        style={{ width: '100%' }}
                        onChange={(value) => handleSelectChange("year", value)}
                        value={monthlyBudget.year}
                    >
                        {Array.from({ length: 10 }, (_, index) => new Date().getFullYear() + index).map((year) => (
                            <Option key={year} value={year}>
                                {year}
                            </Option>
                        ))}
                    </Select>
                </div>


                <Table hover>
                    <thead>
                        <tr>
                            <th>Category</th>
                            <th>Amount</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories && categories.length > 0 && monthlyBudget.budgetPlan && monthlyBudget.budgetPlan.map((budget, index) => (
                            <tr key={index}>
                                <td style={{ width: "30%" }}>
                                    <Select style={{ width: "100%" }}
                                        value={budget.category}
                                        onChange={(value) => handleBudgetChange(index, 'category', value)}
                                    >
                                        {categories.map((row, rowIndex) => (
                                            <Select.Option value={row} key={rowIndex}>{row}</Select.Option>
                                        ))}
                                    </Select>
                                </td>
                                <td style={{ width: "30%" }}>

                                    <Input
                                        type="number"
                                        value={budget.amount}
                                        onChange={(e) => handleBudgetChange(index, 'amount', e.target.value)}
                                    />
                                </td>
                                <td style={{ width: "40%" }}>
                                    <Input
                                        type="text"
                                        value={budget.description}
                                        onChange={(e) => handleBudgetChange(index, 'description', e.target.value)}
                                    />
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </Table>

                <div className='flex-row' >
                    <button className="btn btn btn-light" onClick={() => AddEmptyBudgetPlanObject()} style={{ float: 'right' }}>
                        Add Another Category
                    </button>
                </div>
                <div className='submit-btn'>
                    <button type="submit" className="button" class="btn btn-primary" onClick={() => handleSubmit()}>
                        Submit
                    </button>
                </div>

            </Form>
            <ToastContainer
            />
            <ToastContainer />
        </div >

    );
}

export default MonthlyBudget;