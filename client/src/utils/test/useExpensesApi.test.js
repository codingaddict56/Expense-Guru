import { useExpensesApi } from "../useExpensesApi";

const mockFetchDataValues = [
    {
        "_id": "65f20f3369cb608da7a468f7",
        "userId": 1,
        "category": "bills",
        "date": "2024-03-13T20:40:19.596Z",
        "amount": 20,
        "notes": "Electricity",
        "__v": 0
    }
];


jest.mock('../../utils/useExpensesApi', () => ({
    useExpensesApi: jest.fn() // Mocking the function
}));

describe('Fetch table data', () => {
    
    test('Fetches all the expenses', async() => {
        const tableData = { data: mockFetchDataValues };
        useExpensesApi.mockReturnValueOnce({ fetchData: jest.fn().mockResolvedValueOnce(tableData) }); // Mocking fetchData inside useExpensesApi
        const result = await useExpensesApi().fetchData();
        expect(result).toEqual(tableData);
    });
});
