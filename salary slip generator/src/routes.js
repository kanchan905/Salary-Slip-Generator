import Index from "views/Index.js";
import Register from "views/examples/Register.js";
import Login from "views/examples/Login.js";
import UserTable from "pages/Users/UsersManagement";
import EmployeeTable from "pages/employee/EmployeeManagement";
import PaysStructure from "pages/paysStructure/PayStructureManagement";
import PensionerManagement from "pages/pensioner/Pensioner";
import SalaryProcessing from "pages/processing/SalaryProcessing";
import PensionProcessing from "pages/processing/PentionProcessing";
import ReportsDashboard from "pages/report/reports";

var routes = {
  dashboard: [
    {
      path: "/index",
      name: "Dashboard",
      icon: "ni ni-tv-2 text-primary",
      component: Index,
      layout: "/admin",
    },
  ],
  management: [
    {
      path: "/user-management",
      name: "User Management",
      icon: "ni ni-single-02 text-yellow",
      component: UserTable,
      layout: "/admin",
    },
    {
      path: "/employee-management",
      name: "Employee Management",
      icon: "ni ni-single-02 text-blue",
      component: EmployeeTable,
      layout: "/admin",
    },
  ],
  masters: [
    {
      path: "/pay-structure",
      name: "Pay Structure",
      icon: "ni ni-money-coins text-orange",
      component: PaysStructure,
      layout: "/admin",
    },
  ],
  pentioner: [
    {
      path: "/pensioners",
      name: "Pensioners",
      icon: "ni ni-circle-08 text-red",
      component: PensionerManagement,
      layout: "/admin",
    },
  ],
  processing: [
    {
      path: "/salary",
      name: "Salary Processing",
      icon: "ni ni-settings-gear-65 text-info",
      component: SalaryProcessing,
      layout: "/admin",
    },
    {
      path: "/pension",
      name: "Pension Processing",
      icon: "ni ni-diamond text-pink",
      component: PensionProcessing,
      layout: "/admin",
    },
  ],
  report: [
    {
      path: "/reports",
      name: "Reports",
      icon: "ni ni-paper-diploma text-purple",
      component: ReportsDashboard,
      layout: "/admin",
    },
  ],
  account: [
    {
      path: "/login",
      name: "login",
      icon: "ni ni-paper-diploma text-purple",
      component: Login,
      layout: "/admin",
    },
    {
      path: "/sign-up",
      name: "Sign Up",
      icon: "ni ni-paper-diploma text-purple",
      component: Register,
      layout: "/admin",
    },
  ],
};
export default routes;
