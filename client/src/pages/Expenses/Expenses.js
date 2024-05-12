import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography';
import { Backdrop, CardHeader, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { useExpensesApi } from '../../utils/useExpensesApi';
import 'react-datepicker/dist/react-datepicker.css';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { fetchBudgetPlanCategoriesAPI, fetchCurrentBudgetPlanAPI } from '../../utils/StaticData';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Expenses = () => {
    const userId = '4b3a4b4d-3694-4cb9-bf77-3d6f529f4e69';
    const convertArrayToObject = (ss) => {
        return ss.reduce((obj, item) => {
            obj[item['_id']] = { ...item };
            return obj;
        }, {});
    };

    const { fetchData, addExpense, deleteExpense, editExpense, isVisibleColumn } = useExpensesApi();

    const [expensesData, setExpensesData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [categories, setCategories] = useState([]);
    const [currentBudgetPlan, setCurrentBudgetPlan] = useState([]);
    const actionColumns = {
        edit: { id: 'edit', label: 'Edit' },
        delete: { id: 'delete', label: 'Delete' },
    }

    useEffect(() => {
        const fetchExpensesData = async () => {
            try {
                const data = await fetchData();
                const expensesObject = convertArrayToObject(data);
                setExpensesData(expensesObject);
                const columns = Object.keys(data[0]);
                const _actionColumns = Object.keys(actionColumns);
                setColumns([...columns, ..._actionColumns]);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchExpensesData();
        const fetchCategories = async () => {
            try {
                const response = await fetch(fetchBudgetPlanCategoriesAPI);
                if (!response.ok) {
                    throw new Error('Failed to fetch categories');
                }
                const data = await response.json();
                console.log(data.content)
                setCategories(data.content)
                console.log(categories)
            }
            catch (error) {
                console.error(error)
            }
        }
        fetchCategories();
        const fetchCurrentBudgetPlan = async () => {
            try {
                const response = await fetch(fetchCurrentBudgetPlanAPI);
                if (!response.ok) {
                    throw new Error('Failed to current fetch budget plan');
                }
                const data = await response.json();
                console.log(data.content)
                setCurrentBudgetPlan(data.content)

            }
            catch (error) {
                console.error(error)
            }
        }
        fetchCurrentBudgetPlan();

    }, []);

    const [openModal, setOpenModal] = useState(false);
    const [modalData, setModalData] = useState({});
    const [isAddExpense, setIsAddExpense] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const style = {
        modalStyle: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            boxShadow: 24,
            p: 1,
        },
        row: {
            display: 'flex',
            flexDirection: 'column',
            marginBottom: 10,
        },
        fabStyle: {
            position: 'absolute',
            bottom: 16,
            right: 16,
        },
    };

    const defaultExpenseFormat = {
        userId: '',
        category: '',
        amount: '',
        notes: '',
    };


    const handleEditButtonClick = (data) => {
        setModalData(data);
        setOpenModal(true);
    };

    const handleDeleteButtonClick = async (data) => {
        setIsLoading(true);
        try {
            
            await deleteExpense(data['_id']);

            
            window.location.reload();
        } catch (error) {
            console.error('Error deleting expense:', error);

        } finally {
            setIsLoading(false);
        }
    };


    const handleSubmitButton = async () => {
        setIsLoading(true);

        // Hardcoded the user ID to "1"
        const userId = '1';

        if (modalData['_id']) {
            const dataPayload = {
                ...modalData,
                userId: userId, 
                // date: formatDateString(modalData.date), // Format date string
            };

            try {
                await editExpense(modalData['_id'], dataPayload);

            } catch (error) {
                console.error('Error editing expense:', error);
                // Handle error if needed
            }
        } else {
            const newExpenseData = {
                ...modalData,
                userId: userId,
                // date: formatDateString(modalData.date), // Format date string
                // notes: modalData.notes, // Include notes field, default to empty string if not provided
            };

            try {
                await addExpense(newExpenseData);
                setExpensesData([...expensesData, newExpenseData]); 

            } catch (error) {
                console.error('Error adding expense:', error);

            }
        }
        setIsLoading(false);
        setOpenModal(false);
        window.location.reload();
    }

    const formatDateString = (dateString) => {
        const [day, month, year] = dateString.split('-');
        return `${year}-${month}-${day}`;
    };

    const onValueChange = (value, key) => {
        setModalData({ ...modalData, [key]: value });
    };

    const onAddExpenseButtonClick = () => {
        if (currentBudgetPlan?.length > 0) {
            setModalData(defaultExpenseFormat);
            setOpenModal(true);
            setIsAddExpense(true);
        }
        else {
            toast.warn('Plan your budget before spending!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light"
            });
        }
    };

    const onModalCancelClick = () => {
        setOpenModal(false);
        setIsAddExpense(false);
    };

    const renderEditModal = () => {
        return (
            <Modal
                open={openModal}
                onClose={() => setOpenModal(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style.modalStyle}>
                    <Card sx={{ minWidth: 275 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                {isAddExpense ? 'Add Expense' : 'Edit Expense'}
                            </Typography>
                            {Object.entries(defaultExpenseFormat).map(([key, value]) => {
                                return (isVisibleColumn(key) &&
                                    (
                                        <div key={key} style={style.row}>

                                            <div>
                                                {key !== 'category' && <TextField
                                                    id={key}
                                                    label={key.charAt(0).toUpperCase() + key.slice(1)}
                                                    variant="outlined"
                                                    fullWidth
                                                    value={modalData[key]}
                                                    onChange={(e) => onValueChange(e.target.value, key)}
                                                    disabled={key === "userId"}
                                                />}
                                                {key === 'category' && categories && categories.length > 0 &&
                                                    <div className='flex ml-8'>Category:
                                                        <Select
                                                            sx={{ marginLeft: "20px" }}
                                                            value={modalData[key]}
                                                            label={key}
                                                            onChange={(e) => onValueChange(e.target.value, key)}
                                                        >
                                                            {categories.map((row, rowIndex) => (
                                                                <MenuItem value={row} key={rowIndex}>{row}</MenuItem>

                                                            ))}
                                                        </Select>
                                                    </div>
                                                }
                                            </div>

                                        </div>
                                    )
                                );
                            })}
                        </CardContent>
                        <CardActions>
                            <Button size="small" onClick={onModalCancelClick}>
                                Cancel
                            </Button>
                            <Button size="small" variant="contained" onClick={handleSubmitButton}>
                                Submit
                            </Button>
                        </CardActions>
                    </Card>
                </Box>
            </Modal>
        );
    };

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: theme.palette.common.black,
            color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
        },
    }));

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
        // hide last border
        '&:last-child td, &:last-child th': {
            border: 0,
        },
    }));


    const renderTable = () => {
        
        const dataArray = Object.values(expensesData);

        return (
            <TableContainer style={{ maxHeight: "550px", overflowY: "auto" }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {/* column name as the key */}
                            {columns.map((column) => (isVisibleColumn(column) &&
                                <StyledTableCell key={column} align="left">
                                    {column}
                                </StyledTableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dataArray.map((row, index) => (
                            <StyledTableRow hover role="checkbox" tabIndex={-1} key={index}>
                                {/* Using column name to access corresponding value in row */}
                                {columns.map((column, columnIndex) => (isVisibleColumn(column) &&
                                    <TableCell key={columnIndex} align="left">
                                        {row[column]}
                                        {column === 'edit' && (
                                            <Button onClick={() => handleEditButtonClick(row)}>
                                                <EditIcon />
                                            </Button>
                                        )}
                                        {column === 'delete' && (
                                            <Button onClick={() => handleDeleteButtonClick(row)}>
                                                <DeleteIcon />
                                            </Button>
                                        )}
                                    </TableCell>
                                ))}
                            </StyledTableRow>
                        ))}
                    </TableBody>
                    {renderEditModal()}
                </Table>
            </TableContainer>
        );
    };


    return (
        <Card sx={{ width: '100%', height: '100vh', overflow: 'hidden' }} className="flex">
            <CardHeader title="Expenses" />

            <CardContent>
                {renderTable()}
                <Fab color="secondary" onClick={onAddExpenseButtonClick} aria-label="add" sx={style.fabStyle}>
                    <AddIcon />
                </Fab>
            </CardContent>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={isLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <ToastContainer
            />
            <ToastContainer />
        </Card>

    );
};

export default Expenses;
