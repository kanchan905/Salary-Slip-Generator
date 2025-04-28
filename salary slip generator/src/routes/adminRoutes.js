import AdminDashboard from "Dashboard/Admin";
import SignOutPage from "views/examples/Register";
import Login from "views/examples/Login.js";
import UserTable from "pages/Users/UsersManagement";
import EmployeeTable from "pages/employee/EmployeeManagement";
import PaysStructure from "pages/paysStructure/PayStructureManagement";
import PensionerManagement from "pages/pensioner/Pensioner";
import SalaryProcessing from "pages/processing/SalaryProcessing";
import PensionProcessing from "pages/processing/PentionProcessing";
import ReportsDashboard from "pages/report/reports";
import Profile from "pages/Users/Profile";
import SystemSettingsPage from "layouts/setting";
import AllowanceForm from "pages/paysStructure/AllowanceForm";

var adminRoutes = {
  dashboard: [
    {
      path: "/index",
      name: "Dashboard",
      icon: "ni ni-tv-2 text-primary",
      component: AdminDashboard,
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
      icon: "ni ni-settings-gear-65 text-orange",
      component: PaysStructure,
      layout: "/admin",
    },
    {
      path: "/allowance-rates",
      name: "Allowance Rates",
      icon: "ni ni-money-coins text-orange",
      component: AllowanceForm,
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
      showInSidebar: true,
    },
    {
      path: "/pension",
      name: "Pension Processing",
      icon: "ni ni-sound-wave text-pink",
      component: PensionProcessing,
      layout: "/admin",
      showInSidebar: true,
    },
  ],
  report: [
    {
      path: "/reports",
      name: "Reports",
      icon: "ni ni-paper-diploma text-purple",
      component: ReportsDashboard,
      layout: "/admin",
      showInSidebar: true,
    },
  ],
  account: [
    {
      path: "/login",
      name: "login",
      icon: "ni ni-key-25 text-info",
      component: Login,
      showInSidebar: false,
    },
    {
      path: "/sign-up",
      name: "Sign Up",
      icon: "ni ni-circle-08 text-pink",
      component: SignOutPage,
      layout: "/admin",
      showInSidebar: false,
    },
    {
      path: "/user-profile",
      name: "Profile",
      icon: "ni ni-circle-08 text-pink",
      component: Profile,
      layout: "/admin",
      showInSidebar: false, // Add this property
    },
    {
      path: "/setting",
      name: "Settings",
      icon: "ni ni-settings-gear-65 text-info",
      component: SystemSettingsPage,
      layout: "/admin",
    }
  ],
};
export default adminRoutes;