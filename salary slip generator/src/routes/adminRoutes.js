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
import PensionerForm from "pages/pensioner/PensionerForm";
import Arrears from "pages/arrears/Arrears";
import BankDetails from "pages/bank-details/BankDetails";
import DearnessRelief from "pages/dearness-relief/DearnessRelief";
import MonthlyPension from "pages/monthly-pension/MonthlyPension";
import PensionDeduction from "pages/pension-deduction/PensionDeduction";
import PensionDocuments from "pages/pension-documents/PensionDocuments";
import CreditSocietyMember from "pages/credit/CreditSocietyMember";
import EmployeeLoan from "pages/employee-loan/EmployeeLoan";
import NetSalary from 'pages/net-salary/NetSalary'
import NetSalaryCard from "pages/net-salary/NetSalaryCard";
import Quarter from "pages/paysStructure/Quarter";
import pensionerDetail from "pages/pensioner/pensionerDetail";
import arrearsDetail from "pages/arrears/arrearsDetail";
import ShowBankDetail from "pages/bank-details/ShowBankDetail";
import ShowDearness from "pages/dearness-relief/ShowDearness";
import ShowCredit from "pages/credit/ShowCredit";
import ShowEmployee from "pages/employee-loan/ShowEmployee";
import ShowPensionDoc from "pages/pension-documents/ShowPensionDoc";
import NetPension from "pages/Net-Pension/NetPension";
import NetPensionCard from "pages/Net-Pension/NetPensionCard";
import ShowMonthlyPension from "pages/monthly-pension/ShowMonthlyPension";
import ShowPensionDeduction from "pages/pension-deduction/ShowPensionDeduction";
import UserStepper from "pages/member-store/UserStepper";

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
      path: "/user",
      name: "User",
      icon: "ni ni-single-02 text-yellow",
      component: UserStepper,
      layout: role,
      showInSidebar: false,
    },
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
  employee_masters: [
    {
      path: "/pay-structure",
      name: "Pay Structure",
      icon: "ni ni-settings-gear-65 text-orange",
      component: PaysStructure,
      layout: role,
    },
    {
      path: "/credit-society-member",
      name: "Credit Society Member",
      icon: "fa-regular fa-credit-card", 
      component: CreditSocietyMember,
      layout: role,
    },
    {
      path: "/employee-loan",
      name: "Employee Loan",
      icon: "fa-solid fa-money-check", 
      component: EmployeeLoan,
      layout: role,
    },
    {
      path: "/net-salary",
      name: "Net Salary",
      icon: "fa-solid fa-sack-dollar",
      component: NetSalary,
      layout: role,
    },
    {
      path: "/net-pension",
      name: "Net Pension",
      icon: "fa-solid fa-person-cane",  
      component: NetPension,
      layout: role,
    },
    {
      path: "/employee/net-salary/:id",
      name: "Net Salary",
      icon: "fa-solid fa-sack-dollar",
      component: NetSalaryCard,
      layout: role,
      showInSidebar: false,
    },
    {
      path: "/employee/credit-society-member/view/:id",
      name: "Net Salary",
      icon: "fa-solid fa-sack-dollar",
      component: ShowCredit,
      layout: role,
      showInSidebar: false,
    },
    {
      path: "/employee-loan/view/:id",
      name: "Net Salary",
      icon: "fa-solid fa-sack-dollar",
      component: ShowEmployee,
      layout: role,
      showInSidebar: false,
    },
    {
      path: "/net-pension/view/:id",
      name: "Net Pension",
      icon: "fa-solid fa-person-cane",  
      component: NetPensionCard,
      layout: role,
      showInSidebar: false,
    },
  ],
  pensioner_Management: [
    {
      path: "/pensioners",
      name: "Pensioners",
      icon: "ni ni-circle-08 text-red",
      component: PensionerManagement,
      layout: role,
    },
    {
     path: "/arrears",
      name: "Arrears",
      icon: "fa-solid fa-dollar-sign",
      component: Arrears,
      layout: role,
    },
    {
     path: "/pensioner/bank-detail",
      name: "Bank",
      icon: "fa-solid fa-landmark",
      component: BankDetails,
      layout: role,
    },
    {
     path: "/pensioner/dearness-relief",
      name: "Dearness Relief",
      icon: "fa-solid fa-hand-holding-heart",
      component: DearnessRelief,
      layout: role,
    },
    {
     path: "/pensioner/monthly-pension",
      name: "Monthly Pension",
      icon: "fa-solid fa-hand-holding-dollar", 
      component: MonthlyPension,
      layout: role,
    },
    {
     path: "/pensioner/pension-deduction",
      name: "Pension Deduction",
      icon: "fa-solid fa-money-bill-transfer", 
      component: PensionDeduction,
      layout: role,
    },
    {
     path: "/pensioner/pension-documents",
      name: "Pension Documents",
      icon: "fa-solid fa-receipt",
      component: PensionDocuments,
      layout: role,
    },
    {
      path: "/pensioner/add",
      name: "Add-Pensioners",
      icon: "ni ni-circle-08 text-red",
      component: PensionerForm,
      layout: role,
      showInSidebar: false,
    },
    {
      path: "/pensioner/edit/:id",
      name: "Id-Pensioners",
      icon: "ni ni-circle-08 text-red",
      component: PensionerForm,
      layout: role,
      showInSidebar: false,
    },
    {
      path: "/pensioner/view/:id",
      name: "Id-Pensioners",
      icon: "ni ni-circle-08 text-red",
      component: pensionerDetail,
      layout: role,
      showInSidebar: false,
    },
    {
      path: "/arrears/view/:id",
      name: "Id-Pensioners",
      icon: "ni ni-circle-08 text-red",
      component: arrearsDetail,
      layout: role,
      showInSidebar: false,
    },
    {
      path: "/pensioner/bank-detail/view/:id",
      name: "Id-Pensioners",
      icon: "ni ni-circle-08 text-red",
      component: ShowBankDetail,
      layout: role,
      showInSidebar: false,
    },
    {
      path: "/pensioner/dearness-relief/view/:id",
      name: "Id-Pensioners",
      icon: "ni ni-circle-08 text-red",
      component: ShowDearness,
      layout: role,
      showInSidebar: false,
    },
    {
     path: "/pension-documents/view/:id",
      name: "Pension Documents",
      icon: "fa-solid fa-receipt",
      component: ShowPensionDoc,
      layout: role,
      showInSidebar: false,
    },
     {
     path: "/pensioner/monthly-pension/view/:id",
      name: "Monthly Pension",
      icon: "fa-solid fa-hand-holding-dollar", 
      component: ShowMonthlyPension,
      layout: role,
      showInSidebar: false,
    },
    {
     path: "/pensioner/pension-deduction/view/:id",
      name: "Pension Deduction",
      icon: "fa-solid fa-money-bill-transfer", 
      component: ShowPensionDeduction,
      layout: role,
      showInSidebar: false,
    },
  ],
  processing: [
    {
      path: "/salary",
      name: "Salary",
      icon: "ni ni-settings-gear-65 text-info",
      component: SalaryProcessing,
      layout: role,
      showInSidebar: true,
    },
    // {
    //   path: "/pension",
    //   name: "Pension",
    //   icon: "ni ni-settings-gear-65 text-info",
    //   component: PensionProcessing,
    //   layout: role,
    //   showInSidebar: true,
    // }
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
  masters: [
    {
      path: "/allowance-rates",
      name: "Allowance Rates",
      icon: "ni ni-money-coins text-orange",
      component: AllowanceForm,
      layout: role,
    },
    {
      path: "/quarter",
      name: "Quarter",
      icon: "fa-solid fa-chart-pie text-orange",
      component: Quarter,
      layout: role,
    },
  ],
});
export default getAdminRoutes;