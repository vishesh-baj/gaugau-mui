import { PATHS } from "./paths";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Customers from "../pages/Customers";
import Clients from "../pages/Clients";
import Campaigns from "../pages/Campaigns";
import ClientDetails from "../pages/ClientDetails";
import CustomerDetails from "../pages/CustomerDetails";
const routes = [
  // primary routes
  { path: PATHS.login, element: <Login /> },
  { path: PATHS.dashboard, element: <Dashboard /> },
  { path: PATHS.customers, element: <Customers /> },
  { path: PATHS.clients, element: <Clients /> },
  { path: PATHS.campaigns, element: <Campaigns /> },
  // other routes
  { path: PATHS.clientDetails, element: <ClientDetails /> },
  { path: PATHS.customerDetails, element: <CustomerDetails /> },
];

export default routes;
