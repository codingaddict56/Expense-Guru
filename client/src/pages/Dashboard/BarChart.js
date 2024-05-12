
import Highcharts from 'highcharts';
import { useEffect, useState } from 'react';


const BarChart = (props) => {
    const { expenses } = props;
    const [ expenseHistory, setExpenseHistory]=useState([]);
    const [ chartData, setCategoriesExpensesSum] = useState({});

    let groupByCategoryAndSum = async() => {

        let sum= await expenses.reduce((acc, expense) => {
          const month = new Date(expense?.date).toLocaleString('default', { month: 'long', year: 'numeric' });
          if (!acc[month]) {
            acc[month] = {};
          }
          if (!acc[month][expense.category]) {
            acc[month][expense.category] = 0;
          }
         
          acc[month][expense.category] += expense.amount;
          return acc;
        }, {});
        let formattedData=await formatData(sum);
        setCategoriesExpensesSum(formattedData)
        return formattedData;
      };
      const formatData = async (rawData) => {
        const months = Object.keys(rawData);
        const allCategories = new Set(); 
      
        months.forEach(month => {
          Object.keys(rawData[month]).forEach(category => {
            allCategories.add(category);
          });
        });
      
        const commonCategories = Array.from(allCategories); 
        const series = commonCategories.map(category => {
          const data = months.map(month => ({
            name: month,
            y: rawData[month][category] || 0
          }));
          return { name: category, data };
        });
      
        return { months, series };
      };
   
    useEffect(()=>{        
        if(expenses && expenses.length>0)
         {  
            setExpenseHistory(expenses); 
            groupByCategoryAndSum();
         }
        else
          { 
            setExpenseHistory(null)
             setCategoriesExpensesSum(null)
          }

    }, [expenses])
    useEffect(() => {
        console.log(chartData)
        Highcharts.chart('bar-chart-container', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Summary of Expense History ',
                align: 'left'
            },
            subtitle: {
                text: 'Previous 6 Months',
                align: 'left'
            },
            xAxis: {
                categories:chartData? chartData.months:[],
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Expenses (Euros)'
                },
                stackLabels: {
                    enabled: true
                }
            },
            legend: {
                align: 'right',
                x: 0,
                verticalAlign: 'top',
                y: 70,
                floating: true,
                layout:"vertical",
                backgroundColor:
                    Highcharts.defaultOptions.legend.backgroundColor || 'white',
                borderColor: '#CCC',
                borderWidth: 1,
                shadow: false
            },
            tooltip: {
                headerFormat: '<b>{point.x}</b><br/>',
                pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: true
                    }
                }
            },
            series: chartData ? chartData.series: []
        });
    }, [chartData, expenseHistory])


    return (
        <div id="bar-chart-container" data-testid="barchart" style={{ borderRadius: "10px", width: '100%' }} className='card-custom'></div>
    );
}

export default BarChart;
