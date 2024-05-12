import Categories from "../src/pages/Categories/Categories";
import Dashboard from "../src/pages/Dashboard/Dashboard";
import MonthlyBudget from "../src/pages/MonthlyBudget/MonthlyBudget";
import Expenses from "../src/pages/Expenses/Expenses";
import { mount } from "enzyme";
import { MemoryRouter } from "react-router-dom";
import App from "./App"
describe("App Component", () => {
    let wrapper = null;

    const component = (path) => {
        return mount(<MemoryRouter initialEntries={[`${path}`]}>
            <App />
        </MemoryRouter>);
    }

    //memory router is for testing
    // browser router is for production/development

    beforeEach(() => {
        wrapper = component();
    })

    it("is rendered", () => {
        const app = wrapper.find(App);
        expect(app.length).toBe(1);
    });

    it("display navLinks with correct display name", () => {
        const navLinks = wrapper.find("NavLink");
        expect(navLinks.at(0).text()).toBe(" Dashboard");
        expect(navLinks.at(1).text()).toBe(" Categories");
        expect(navLinks.at(2).text()).toBe(" Monthly Budget");
        expect(navLinks.at(3).text()).toBe(" Expenses");

    })

    it("display navLinks with correct path name", () => {
        const navLinks = wrapper.find("NavLink");
        expect(navLinks.at(0).prop("to")).toBe("/");
        expect(navLinks.at(1).prop("to")).toBe("/categories");
        expect(navLinks.at(2).prop("to")).toBe("/monthlybudget");
        expect(navLinks.at(3).prop("to")).toBe("/expenses");

    })


    it("renders dashboard correctly", () => {
        wrapper = component("/");
        expect(wrapper.find(Dashboard)).toHaveLength(1);
        expect(wrapper.find(Categories)).toHaveLength(0);
        expect(wrapper.find(MonthlyBudget)).toHaveLength(0);
        expect(wrapper.find(Expenses)).toHaveLength(0);

    })
    it("renders categories correctly", () => {
        wrapper = component("/categories");
        expect(wrapper.find(Dashboard)).toHaveLength(0);
        expect(wrapper.find(Categories)).toHaveLength(1);
        expect(wrapper.find(MonthlyBudget)).toHaveLength(0);
        expect(wrapper.find(Expenses)).toHaveLength(0);

    })
    it("renders monthlybudget correctly", () => {
        wrapper = component("/monthlybudget");
        expect(wrapper.find(Dashboard)).toHaveLength(0);
        expect(wrapper.find(Categories)).toHaveLength(0);
        expect(wrapper.find(MonthlyBudget)).toHaveLength(1);
        expect(wrapper.find(Expenses)).toHaveLength(0);

    })
    it("renders expenses correctly", () => {
        wrapper = component("/expenses");
        expect(wrapper.find(Dashboard)).toHaveLength(0);
        expect(wrapper.find(Categories)).toHaveLength(0);
        expect(wrapper.find(MonthlyBudget)).toHaveLength(0);
        expect(wrapper.find(Expenses)).toHaveLength(1);

    })
});