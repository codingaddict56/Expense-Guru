import './App.scss';
import Categories from './pages/Categories/Categories';
import Dashboard from './pages/Dashboard/Dashboard';
import Expenses from './pages/Expenses/Expenses';
import NavBar from './components/NavBar'
import { Routes, Route} from "react-router-dom";
import MonthlyBudget from './pages/MonthlyBudget/MonthlyBudget';
import 'bootstrap/dist/css/bootstrap.min.css';
function App() {
  return (
    <div className="App">
      <NavBar/>
      <div className="main">
        <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/monthlybudget" element={<MonthlyBudget />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
