import AdminDashboard from "Dashboard/Admin";
import SignOutPage from "views/Register";
import Login from "views/Login.js";
import UserTable from "pages/Users/UsersManagement";
import EmployeeTable from "pages/employee/EmployeeManagement";
import PaysStructure from "pages/paysStructure/PayStructureManagement";
import PensionerManagement from "pages/pensioner/Pensioner";
import SalaryProcessing from "pages/processing/SalaryProcessing";
import ReportsDashboard from "pages/report/reports";
import Profile from "pages/Users/Profile";
import SystemSettingsPage from "layouts/setting";
import AllowanceForm from "pages/paysStructure/AllowanceForm";
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
import PensionerStepper from "pages/pensionerStore/PensionerStepper";
import PensionerInfoList from 'pages/PensionRelatedInfo/PensionerInfoList';
import ShowPensionerRelatedInfo from 'pages/PensionRelatedInfo/ShowPensionerRelatedInfo';

const getAdminRoutes = () => (
   {
  dashboard: [
    {
      path: "/index",
      name: "Dashboard",
      icon: "ni ni-tv-2 text-primary",
      component: AdminDashboard,
    },
  ],
  
  management: [
    {
      path: "/user",
      name: "User",
      component: UserStepper,   
      showInSidebar: false,
    },
    {
      path: "/user-management",
      name: "User",
      icon: "ni ni-single-02 text-yellow",
      component: UserTable,    
    },
    {
      path: "/employee-management",
      name: "Employee",
      icon: "ni ni-single-02 text-blue",
      component: EmployeeTable,
    },
    {
      path: "/employee/:id",
      name: "Employee",
      component: EmployeeDetail,
      showInSidebar: false,
    },
    {
      path:'/employee/add',
      name:"Add-Employee",
      component: UserStepper,
      showInSidebar: false,
    },
    {
      path:'/employee/edit/:id',
      name:"Edit-Employee",
      component: EmployeeEditForm,
      showInSidebar: false,
    },
    {
      path:'/employee/:id/quarter',
      name:"Quarter-Employee",
      component: EmployeeQuarter,
      showInSidebar: false,
    }
  ],
  employee_masters: [
    {
      path: "/pay-structure",
      name: "Pay Structure",
      icon: "ni ni-settings-gear-65 text-orange",
      component: PaysStructure,     
    },
    {
      path: "/credit-society-member",
      name: "Credit Society Member",
      icon: "fa-regular fa-credit-card", 
      component: CreditSocietyMember,     
    },
    {
      path: "/employee-loan",
      name: "Employee Loan",
      icon: "fa-solid fa-money-check", 
      component: EmployeeLoan,     
    },
    {
      path: "/net-salary",
      name: "Net Salary",
      icon: "fa-solid fa-sack-dollar",
      component: NetSalary,     
    },
    {
      path: "/net-pension",
      name: "Net Pension",
      icon: "fa-solid fa-person-cane",  
      component: NetPension,
    },
    {
      path: "/employee/net-salary/:id",
      name: "Net Salary",
      component: NetSalaryCard,
      showInSidebar: false,
    },
    {
      path: "/employee/credit-society-member/view/:id",
      name: "Net Salary",
      component: ShowCredit,
      showInSidebar: false,
    },
    {
      path: "/employee-loan/view/:id",
      name: "Net Salary",
      component: ShowEmployee,
      showInSidebar: false,
    },
    {
      path: "/net-pension/view/:id",
      name: "Net Pension",
      component: NetPensionCard,
      showInSidebar: false,
    },
  ],
  pensioner_Management: [
    {
      path: "/pensioners",
      name: "Pensioners",
      icon: "ni ni-circle-08 text-red",
      component: PensionerManagement,
    },
    {
      path: "/pensioner/add",
      name: "Add-Pensioners",
      component: PensionerStepper,
      showInSidebar: false,
    },
    {
     path: "/arrears",
      name: "Arrears",
      icon: "fa-solid fa-dollar-sign",
      component: Arrears,
    },
    {
     path: "/pensioner/bank-detail",
      name: "Bank",
      icon: "fa-solid fa-landmark",
      component: BankDetails,
    },
    {
     path: "/pensioner/dearness-relief",
      name: "Dearness Relief",
      icon: "fa-solid fa-hand-holding-heart",
      component: DearnessRelief,
    },
    {
     path: "/pensioner/monthly-pension",
      name: "Monthly Pension",
      icon: "fa-solid fa-hand-holding-dollar", 
      component: MonthlyPension,     
    },
    {
     path: "/pensioner/pension-deduction",
      name: "Pension Deduction",
      icon: "fa-solid fa-money-bill-transfer", 
      component: PensionDeduction,     
    },
    {
     path: "/pensioner/pension-documents",
      name: "Pension Documents",
      icon: "fa-solid fa-receipt",
      component: PensionDocuments,     
    },
    {
      path: "/pensioner/edit/:id",
      name: "Id-Pensioners",
      component: PensionerForm,    
      showInSidebar: false,
    },
    {
      path: "/pensioner/view/:id",
      name: "Id-Pensioners",
      component: pensionerDetail,
      showInSidebar: false,
    },
    {
      path: "/arrears/view/:id",
      name: "Id-Pensioners",
      component: arrearsDetail,
      showInSidebar: false,
    },
    {
      path: "/pensioner/bank-detail/view/:id",
      name: "Id-Pensioners",
      component: ShowBankDetail,
      showInSidebar: false,
    },
    {
      path: "/pensioner/dearness-relief/view/:id",
      name: "Id-Pensioners",
      component: ShowDearness,
      showInSidebar: false,
    },
    {
     path: "/pension-documents/view/:id",
      name: "Pension Documents",
      component: ShowPensionDoc,
      showInSidebar: false,
    },
     {
     path: "/pensioner/monthly-pension/view/:id",
      name: "Monthly Pension",
      component: ShowMonthlyPension,
      showInSidebar: false,
    },
    {
     path: "/pensioner/pension-deduction/view/:id",
      name: "Pension Deduction", 
      component: ShowPensionDeduction,
      showInSidebar: false,
    },
    {
      path: "/pension-related-info",
       name: "Pension Info",
       component: PensionerInfoList,
       icon: "fa-solid fa-info-circle",
     },
     {
      path: "/pension-related-info/view/:id",
       name: "Pension Info",
       component: ShowPensionerRelatedInfo,
       showInSidebar: false,
     },
  ],
  processing: [
    {
      path: "/salary",
      name: "Salary",
      icon: "ni ni-settings-gear-65 text-info",
      component: SalaryProcessing,
      showInSidebar: true,
    }
  ],
  report: [
    {
      path: "/reports",
      name: "Reports",
      icon: "ni ni-paper-diploma text-purple",
      component: ReportsDashboard,
      showInSidebar: true,
    },
  ],
  account: [
    {
      path: "/login",
      name: "login",
      component: Login,
      showInSidebar: false,
    },
    {
      path: "/sign-up",
      name: "Sign Up",
      component: SignOutPage,
      showInSidebar: false,
    },
    {
      path: "/user-profile",
      name: "Profile",
      component: Profile,
      showInSidebar: false,
    },
    {
      path: "/setting",
      name: "Settings",
      icon: "ni ni-settings-gear-65 text-info",
      component: SystemSettingsPage,
    }
  ],
  masters: [
    {
      path: "/allowance-rates",
      name: "Allowance Rates",
      icon: "ni ni-money-coins text-orange",
      component: AllowanceForm,
    },
    {
      path: "/quarter",
      name: "Quarter",
      icon: "fa-solid fa-chart-pie text-orange",
      component: Quarter,
    },
  ],
});
export default getAdminRoutes;