
export const useExpensesApi = () => {

    const isVisibleColumn = (column) => {
        const visibleColumn = [ 'category', "date", "amount", "notes","edit", "delete"];
        if(visibleColumn.includes(column)){
            return true;
        }
    }


    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/expense/expenses');
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const addExpense = async (newExpenseData) => {
        try {
            // Adding new expense
            const response = await fetch('http://localhost:3001/api/expense/addExpenses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newExpenseData),
            });
            if (!response.ok) {
                throw new Error('Failed to add expense');
            }
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error('Error adding expense:', error);
           
        }
    }
    const deleteExpense = async (id) => {
        try {
            // Sending a DELETE request to the server to delete the expense with the specified ID
            const response = await fetch(`http://localhost:3001/api/expense/deleteExpense/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

          
            if (!response.ok) {
                throw new Error('Failed to delete expense');
            }

            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error('Error deleting expense:', error);
          
        }
    };

    const editExpense = async (id, updatedData) => {
        try {

            
            const response = await fetch(`http://localhost:3001/api/expense/editExpense/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            });

          
            if (!response.ok) {
                throw new Error('Failed to edit expense');
            }

            
            const data = await response.json();
            console.log(data);

        } catch (error) {
            console.error('Error editing expense:', error);
        }
    };

    return {
        fetchData,
        addExpense,
        deleteExpense,
        editExpense,
        isVisibleColumn
    }

}