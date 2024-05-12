import './NavBar.scss';
import styles from '../common-styles/buttons.module.scss';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DatasetIcon from '@mui/icons-material/Dataset';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PaymentIcon from '@mui/icons-material/Payment';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link, NavLink, useLocation } from 'react-router-dom';

const NavBar = () => {
  const location = useLocation();
  return (
    <nav className="sidenavbar bg-white">
      <h3 className="sidenavbar-title">Expense Guru</h3>
      <AccountCircleIcon className="profileIcon"></AccountCircleIcon>
      <ul className="list-unstyled">
        <li className={`navbar-item ${location.pathname === '/' ? styles.active : ''}`}>
          <NavLink to="/" className="text-dark">
            <DashboardIcon /> Dashboard
          </NavLink>
        </li>
        <li className={`navbar-item ${location.pathname === '/categories' ? styles.active : ''}`}>
          <NavLink to="/categories" className="text-dark">
            <DatasetIcon /> Categories
          </NavLink>
        </li>
        <li className={`navbar-item ${location.pathname === '/monthlybudget' ? styles.active : ''}`}>
          <NavLink to="/monthlybudget" className="text-dark">
            <AccountBalanceWalletIcon /> Monthly Budget
          </NavLink>
        </li>
        <li className={`navbar-item ${location.pathname === '/expenses' ? styles.active : ''}`}>
          <NavLink to="/expenses" className="text-dark">
            <PaymentIcon /> Expenses
          </NavLink>
        </li>
      </ul>
    </nav>

  );
}

export default NavBar;
