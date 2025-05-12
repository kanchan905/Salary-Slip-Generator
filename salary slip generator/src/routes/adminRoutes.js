import AdminDashboard from "Dashboard/Admin";
import SignOutPage from "views/Register";
import Login from "views/Login.js";
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
import EmployeeForm from "pages/employee/EmployeeForm";
import EmployeeDetail from "pages/employee/EmployeeDetail";
import EmployeeEditForm from 'pages/employee/EmployeeEditForm'
import EmployeeQuarter from 'pages/employee/EmployeeQuarter'


const getAdminRoutes = (role) => (
   {
  dashboard: [
    {
      path: "/index",
      name: "Dashboard",
      icon: "ni ni-tv-2 text-primary",
      component: AdminDashboard,
      layout: role,
    },
  ],
  management: [
    {
      path: "/user-management",
      name: "User",
      icon: "ni ni-single-02 text-yellow",
      component: UserTable,
      layout: role,
    },
    {
      path: "/employee-management",
      name: "Employee",
      icon: "ni ni-single-02 text-blue",
      component: EmployeeTable,
      layout: role,
    },
    {
      path: "/employee/:id",
      name: "Employee",
      icon: "ni ni-single-02 text-blue",
      component: EmployeeDetail,
      layout: role,
      showInSidebar: false,
    },
    {
      path:'/employee/add',
      name:"Add-Employee",
      component: EmployeeForm,
      layout: role,
      showInSidebar: false,
    },
    {
      path:'/employee/edit/:id',
      name:"Edit-Employee",
      component: EmployeeEditForm,
      layout: role,
      showInSidebar: false,
    },
    {
      path:'/employee/:id/quarter',
      name:"Quarter-Employee",
      component: EmployeeQuarter,
      layout: role,
      showInSidebar: false,
    }
  ],
  masters: [
    {
      path: "/pay-structure",
      name: "Pay Structure",
      icon: "ni ni-settings-gear-65 text-orange",
      component: PaysStructure,
      layout: role,
    },
    {
      path: "/allowance-rates",
      name: "Allowance Rates",
      icon: "ni ni-money-coins text-orange",
      component: AllowanceForm,
      layout: role,
    },
  ],
  pentioner: [
    {
      path: "/pensioners",
      name: "Pensioners",
      icon: "ni ni-circle-08 text-red",
      component: PensionerManagement,
      layout: role,
    },
  ],
  processing: [
    {
      path: "/salary",
      name: "Salary Processing",
      icon: "ni ni-settings-gear-65 text-info",
      component: SalaryProcessing,
      layout: role,
      showInSidebar: true,
    },
    {
      path: "/pension",
      name: "Pension Processing",
      icon: "ni ni-sound-wave text-pink",
      component: PensionProcessing,
      layout: role,
      showInSidebar: true,
    },
  ],
  report: [
    {
      path: "/reports",
      name: "Reports",
      icon: "ni ni-paper-diploma text-purple",
      component: ReportsDashboard,
      layout: role,
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
      layout: role,
      showInSidebar: false,
    },
    {
      path: "/user-profile",
      name: "Profile",
      icon: "ni ni-circle-08 text-pink",
      component: Profile,
      layout: role,
      showInSidebar: false, // Add this property
    },
    {
      path: "/setting",
      name: "Settings",
      icon: "ni ni-settings-gear-65 text-info",
      component: SystemSettingsPage,
      layout: role,
    }
  ],
});
export default getAdminRoutes;