
import Highcharts from 'highcharts';
import { useEffect, useState } from 'react';
import Drilldown from 'highcharts/modules/drilldown';
Drilldown(Highcharts);


const DonutChart = (props) => {
  const { budgetPlan, expenses } = props;
  const [chartDataState, setChartData] = useState();
  const [drillDownDataState, setDrillDownData] = useState();
  const [expenseCategoriesSum, setCategoriesExpensesSum] = useState({});
  const calculatePercentage = (amount, totalAmount) => {
    if (amount && totalAmount) {
      return (100 * amount) / totalAmount;
    }
    else
      return 0;
  }
  const addChart = () => {
    // const colors = Highcharts.getOptions().colors.map((c, i) =>
    //   // Start out with a darkened base color (negative brighten), and end
    //   // up with a much brighter color
    //   Highcharts.color(Highcharts.getOptions().colors[0])
    //     .brighten((i - 2) / 7)
    //     .get()
    // );
    if (drillDownDataState && chartDataState) {
      const options = {
        chart: {
          type: 'pie'
        },
        title: {
          text: 'Budget Allocation for the Current Month',
          align: 'left'
        },
        subtitle: {
          text: 'Click the slices to view balance amount for each category.',
          align: 'left'
        },
        accessibility: {
          announceNewData: {
            enabled: true
          },
          point: {
            valueSuffix: '%'
          }
        },
        plotOptions: {
          pie: {
            innerSize: "45%",

            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>',
              fontSize: "10px"
            },
            showInLegend: true

          },

        },
        tooltip: {
          headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
          pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>'
        },
        series: [{
          name: 'Expense Categories',
          colorByPoint: true,
          data: chartDataState
        }],
        drilldown: {
          series: drillDownDataState,
          colorByPoint: true
        },
        legend: {
          useHTML: true,

          layout: "vertical",
          align: "right",
          verticalAlign: "middle",
          itemMarginTop: 8,
          itemStyle: { "cursor": "pointer", "fontSize": "15px", "textOverflow": "ellipsis" },
          labelFormatter: function () {
            return '<div >' +
              '<span style="display: inline-block; width: 170px; overflow: hidden; text-overflow: ellipsis;">' + this.name + '</span>' +
              '<span style="display: inline-block; width: 60px; text-align: left;">' + (Math.ceil(this.percentage * 100) / 100) + '%</span>' +
              '<span style="display: inline-block; width: 60px; text-align: left;">Є' + this.amount + '</span>' +
              '</div>';
          },
          x: -140
        },
      };

      Highcharts.chart('pie-chart-container', options);

    }
  }
  let groupByCategoryAndSum = async () => {

    let sum = await expenses.reduce((acc, expense) => {
      if (!acc[expense.category]) {
        acc[expense.category] = 0;
      }
      acc[expense.category] += expense.amount;
      return acc;
    }, {});
    setCategoriesExpensesSum(sum)
  };

  useEffect(() => {
    groupByCategoryAndSum();
  }, [expenses, budgetPlan])

  useEffect(() => {
    let chartData = [];
    let drillDownData = []
    let budgetAmountSum = 0;
    budgetPlan.budgetPlan.forEach(element => {
      let budgetPercentage = calculatePercentage(element.amount, budgetPlan.incomeAmount);
      let spentPercentage = calculatePercentage(expenseCategoriesSum[element.category], element.amount);

      chartData.push({ name: element.category, y: budgetPercentage, drilldown: element.category, amount: element.amount });
      let balance = (100 - spentPercentage) > 0 ? 100 - spentPercentage : 0;
      if (balance == 0) {
        drillDownData.push(
          {
            name: element.category,
            id: element.category,
            data: [{
              name: "utilized",
              y: spentPercentage - (100 - spentPercentage),
              color: "red",
              amount: parseInt(expenseCategoriesSum[element.category] || 0)
            },
            {
              name: "balance",
              y: balance,
              amount: 0
            }]
          })
      }
      else {
        drillDownData.push(
          {
            name: element.category,
            id: element.category,
            data: [{
              name: "utilized",
              y: spentPercentage,
              amount: parseInt(expenseCategoriesSum[element.category] || 0)
            },
            {
              name: "balance",
              y: balance,
              amount: parseInt(element.amount || 0) - parseInt(expenseCategoriesSum[element.category] || 0)
            }]
          });
      }
      budgetAmountSum = budgetAmountSum + element.amount;
    });

    if (budgetAmountSum < budgetPlan.incomeAmount) {
      chartData.push({ name: "savings", y: calculatePercentage(budgetPlan.incomeAmount - budgetAmountSum, budgetPlan.incomeAmount), drilldown: "savings", id: "savings", amount: budgetPlan.incomeAmount - budgetAmountSum });
    }
    setChartData(chartData);
    setDrillDownData(drillDownData);
  }, [expenseCategoriesSum])

  useEffect(()=>{
    addChart();
  }, [chartDataState, drillDownDataState])
  
  return (
    <div id="pie-chart-container" data-testid="piechart" style={{ borderRadius: "10px", height: "100%" }} className='card-custom'></div>

  );
}

export default DonutChart;
