import React from 'react';
import { shallow } from 'enzyme'; 
import Expenses from './Expenses';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import { TableBody, TableCell, Button } from '@mui/material';
import { StyledTableRow } from './Expenses'
import TableRow from '@mui/material/TableRow';
import Modal from '@mui/material/Modal';
import Backdrop from '@mui/material/Backdrop';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Fab from '@mui/material/Fab';
// import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
// import TextField from '@mui/material/TextField';
// import CircularProgress from '@mui/material/CircularProgress';
// import ToastContainer from 'react-toastify';
// import * as useExpensesApi from '../../utils/useExpensesApi';
import { useExpensesApi } from "../../utils/useExpensesApi";

describe('Expense Component', () => {
    let wrapper = null;

    beforeEach(() => {
        wrapper = shallow(<Expenses />);
    });

    it('renders without crashing', () => {
        expect(wrapper.exists()).toBe(true);
    });

        it('renders all required components', () => { 

        expect(wrapper.find(Table).exists()).toBe(true);
        expect(wrapper.find(TableContainer).exists()).toBe(true);
        expect(wrapper.find(TableHead).exists()).toBe(true);
        expect(wrapper.find(TableBody).exists()).toBe(true);
        expect(wrapper.find(TableRow).exists()).toBe(true);
        expect(wrapper.find(Modal).exists()).toBe(true);
        expect(wrapper.find(Backdrop).exists()).toBe(true);
        expect(wrapper.find(Card).exists()).toBe(true);
        expect(wrapper.find(CardContent).exists()).toBe(true);
        expect(wrapper.find(CardHeader).exists()).toBe(true);
        expect(wrapper.find(CardActions).exists()).toBe(true);
        expect(wrapper.find(Typography).exists()).toBe(true);
        expect(wrapper.find(Fab).exists()).toBe(true);
        expect(wrapper.find(Button).exists()).toBe(true);
        // expect(wrapper.find(Select).exists()).toBe(true); 
        expect(wrapper.find(MenuItem).exists()).toBe(false);
        // expect(wrapper.find(TextField).exists()).toBe(true);
        // expect(wrapper.find(CircularProgress).exists()).toBe(true);
    });
});

describe('isVisibleColumn', () => {
    test('returns true if column is present', () => {
      const visibleColumn = ['category', "date", "amount", "notes", "edit", "delete"];
      visibleColumn.forEach((col) => {
        const res = useExpensesApi().isVisibleColumn(col);
        expect(res).toBe(true);
      })
    })
  
    test('returns false if column is not present', () => {
      const res = useExpensesApi().isVisibleColumn('non existing col name');
      expect(res).toBe();
    })
 })    



describe('Add Expense Button', () => {
    let wrapper = null;

    beforeEach(async () => {
        wrapper = shallow(<Expenses />);
        await new Promise((resolve) => setTimeout(resolve)); 
    });

    it('renders the modal when add expense button is clicked', () => {

        wrapper.find(Fab).simulate('click');
        expect(wrapper.find(Modal).exists()).toBe(true);
    });


});

describe('CardActions Component', () => {
    let onCancelMock, onSubmitMock, wrapper;

    beforeEach(() => {
        onCancelMock = jest.fn(); 
        onSubmitMock = jest.fn(); 
        wrapper = shallow(
            <CardActions>
                <Button size="small" onClick={onCancelMock}>Cancel</Button>
                <Button size="small" variant="contained" onClick={onSubmitMock}>Submit</Button>
            </CardActions>
        );
    });

    it('renders two buttons', () => {
        
        expect(wrapper.find(Button)).toHaveLength(2);
    });

    it('calls onCancelMock when Cancel button is clicked', () => {
        
        wrapper.find(Button).at(0).simulate('click');
      
        expect(onCancelMock).toHaveBeenCalled();
    });

    it('calls onSubmitMock when Submit button is clicked', () => {
        
        wrapper.find(Button).at(1).simulate('click');
       
        expect(onSubmitMock).toHaveBeenCalled();
    });
});


