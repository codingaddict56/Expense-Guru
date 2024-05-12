import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';

const TopExpenses = (props) => {
    const { expenses } = props
    const headers = ["category", "date", "amount", "notes"]

    return (
        <Card style={{ backgroundColor: 'white', height: "100%" }} className='card-custom'>
            <Card.Title>
                Top 5 Expenses
            </Card.Title>
            <Card.Body>
                {expenses && expenses.length > 0 &&
                    < Table hover data-testid="data">
                    <tbody>
                        {expenses.sort((a, b) => b.amount - a.amount).slice(0, 5).map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {headers.map(header => (
                                    <td key={header}>  {header === "amount" ? "€" + row[header] : row[header]}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                    </Table>
                }
                { (!expenses || expenses.length===0 ) && 
                    <div data-testid="noData">
                        No expenses for the selected month
                    </div>
                }


        </Card.Body>
        </Card >
    );
}

export default TopExpenses;
