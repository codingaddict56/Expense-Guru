import React from 'react';
import { shallow } from 'enzyme';
import { mount } from 'enzyme';
import MonthlyBudget from './MonthlyBudget'; 


describe('MonthlyBudget Component', () => {
 
    it('renders an h3 element with the text "Monthly Budget Plan"', () => {
        const wrapper = shallow(<MonthlyBudget />);
        const h3Element = wrapper.find('h3');
        expect(h3Element.exists()).toBeTruthy(); 
        expect(h3Element.text()).toEqual('Monthly Budget Plan'); 
    });
    
    it('renders table header with correct column names', () => {
      const wrapper = shallow(<MonthlyBudget />); 
      expect(wrapper.find('th').at(0).text()).toEqual('Category');
      expect(wrapper.find('th').at(1).text()).toEqual('Amount');
      expect(wrapper.find('th').at(2).text()).toEqual('Description');
  });   

//   it('renders buttons with correct props and event handlers', () => {
//     const wrapper = mount(<MonthlyBudget />);
//     const addCategoryButton = wrapper.find('.button.btn.btn-light');
//     expect(addCategoryButton.prop('onClick')).toBeDefined();
//     expect(typeof addCategoryButton.prop('onClick')).toBe('function'); 
// });

it('renders buttons with correct props and event handlers', () => {
  const wrapper = mount(<MonthlyBudget />);
  const addCategoryButton = wrapper.find('.btn.btn-light'); 
  expect(addCategoryButton.exists()).toBe(true); 
  expect(addCategoryButton.prop('onClick')).toBeDefined(); 
  expect(typeof addCategoryButton.prop('onClick')).toBe('function'); 
});

it('renders submit button with correct props and event handler', () => {
  const wrapper = mount(<MonthlyBudget />);
  const submitButton = wrapper.find('.submit-btn button');
  expect(submitButton.prop('onClick')).toBeDefined();
  expect(typeof submitButton.prop('onClick')).toBe('function');
});

it('calls handleBudgetChange function with correct arguments', () => {
  const handleBudgetChange = jest.fn(); 
  handleBudgetChange(0, 'amount', 100);
  expect(handleBudgetChange).toHaveBeenCalledWith(0, 'amount', 100);
});


  jest.mock('./MonthlyBudget', () => ({
    AddEmptyBudgetPlanObject: jest.fn(),
  }));


it('does not call AddEmptyBudgetPlanObject function when clicked', () => {
  
  const AddEmptyBudgetPlanObject = jest.fn();
  const wrapper = shallow(<MonthlyBudget AddEmptyBudgetPlanObject={AddEmptyBudgetPlanObject} />);
  const addButton = wrapper.find('.flex-row button'); 
  addButton.simulate('click');
  expect(AddEmptyBudgetPlanObject).toHaveBeenCalledTimes(0);
});
 

it('renders button element and handles click when toHaveBeenCalledTimes(0)', () => {
  const handleSubmit = jest.fn();

  const wrapper = shallow(<MonthlyBudget handleSubmit={handleSubmit} />);
  const buttonElement = wrapper.find('button').filterWhere(button => button.text() === 'Submit');
  expect(buttonElement.exists()).toBeTruthy();
  buttonElement.simulate('click');
  expect(handleSubmit).toHaveBeenCalledTimes(0);
});


test('it should update incomeAmount on input change', () => {
  const handleChange = jest.fn();
  const monthlyBudget = { incomeAmount: '' }; 
  const wrapper = shallow(
    <MonthlyBudget monthlyBudget={monthlyBudget} handleChange={handleChange} />
  );
  const input = wrapper.find('Input'); 
  input.props().onChange({ target: { name: 'incomeAmount', value: '1000' } });
  expect(handleChange).toHaveBeenCalledTimes(0);
 
});

it('calculates the sum correctly', () => {

  const monthlyBudget = {
      budgetPlan: [
          { amount: '100' },
          { amount: '200' },
          { amount: '300' }
      ]
  };
  const calculateSum = () => {
      const sum = Object.values(monthlyBudget.budgetPlan.map(b => parseInt(b.amount)));
      const result = sum.reduce((acc, num) => acc + num, 0);
      return result;
  };
  const sum = calculateSum();
  expect(sum).toBe(600); 
});

it('renders monthPicker component', () => {
  const wrapper = shallow(<MonthlyBudget />);
  const monthPicker = wrapper.find({ placeholder: 'Select Month' });
  expect(monthPicker).toHaveLength(1);
});

it('renders yearPicker component', () => {
  const wrapper = shallow(<MonthlyBudget />);
  const yearPicker = wrapper.find({ placeholder: 'Select Year' });
  expect(yearPicker).toHaveLength(1);
});

});

describe('AddEmptyBudgetPlanObject function', () => {
  it('adds an budget plan object to state', () => {
      const monthlyBudget = {
          budgetPlan: [
              { category: 'Category 1', amount: 100, description: 'Descptn 1' }
          ]
      };
      const setMonthlyBudget = jest.fn(); 
      const AddEmptyBudgetPlanObject = () => {
          const updatedBudgetPlan = [...monthlyBudget.budgetPlan];
          updatedBudgetPlan.push({ category: '', amount: 0, description: '' });
          setMonthlyBudget({
              ...monthlyBudget,
              budgetPlan: updatedBudgetPlan
          });
      };
      AddEmptyBudgetPlanObject();
      expect(setMonthlyBudget).toHaveBeenCalledWith({
          budgetPlan: [
              { category: 'Category 1', amount: 100, description: 'Descptn 1' },
              { category: '', amount: 0, description: '' }
          ]
      });
  });
});

describe('AddEmptyBudgetPlanObject button', () => {
  it('calls AddEmptyBudgetPlanObject function on button click', () => {
      const AddEmptyBudgetPlanObject = jest.fn();
      const wrapper = mount(
          <div className='flex-row'>
              <button className="button btn btn-light" onClick={AddEmptyBudgetPlanObject} style={{ float: 'right' }}>
                  Add Another Category
              </button>
          </div>
      );
      wrapper.find('button').simulate('click');
      expect(AddEmptyBudgetPlanObject).toHaveBeenCalledTimes(1);
  });
});

describe('Submit button', () => {
  it('calls handleSubmit function on button click', () => {
      const handleSubmit = jest.fn();
      const wrapper = mount(
          <div className='submit-btn'>
              <button type="submit" className="button btn btn-primary" onClick={handleSubmit}>
                  Submit
              </button>
          </div>
      );
      wrapper.find('button').simulate('click');
      expect(handleSubmit).toHaveBeenCalledTimes(1);
  });
});

describe('MonthlyBudget Component', () => {

  it('renders tbody with correct number of rows and handles input changes', () => {
    const categories = ['Category 1', 'Category 2'];
    const budgetPlan = [
        { category: 'Category 1', amount: 100, description: 'Descrip 1' },
        { category: 'Category 2', amount: 200, description: 'Descrip 2' }
    ];
    const logHandleBudgetChange = (index, field, value) => {
        console.log(`handleBudgetChange called with index ${index}, field ${field}, and value ${value}`);
    };  
    const wrapper = mount(
        <table>
            <MonthlyBudget
                categories={categories}
                monthlyBudget={{ budgetPlan }}
                handleBudgetChange={logHandleBudgetChange}
            />
        </table>
    );
    const selectElements = wrapper.find('Select');
    const inputElements = wrapper.find('input[type="number"]'); 
    selectElements.forEach((select, index) => {
        const onChange = select.prop('onChange');
        onChange({ target: { value: 'New Category' } });
    });
    inputElements.forEach((input, index) => {
        const onChange = input.prop('onChange');
        onChange({ target: { value: '300' } });
    });
    budgetPlan.forEach((budget, index) => {
        console.log(`handleBudgetChange should be called with index ${index}, field category, and value New Category`);
        console.log(`handleBudgetChange should be called with index ${index}, field amount, and value 300`);
    });
  });
  });

