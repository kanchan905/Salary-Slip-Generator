import AdminDashboard from "Dashboard/Admin";
import Login from "views/Login.js";
import ForgotPassword from "views/ForgotPassword";
import UserTable from "pages/Users/UsersManagement";
import EmployeeTable from "pages/employee/EmployeeManagement";
import PaysStructure from "pages/paysStructure/PayStructureManagement";
import PensionerManagement from "pages/pensioner/Pensioner";
import SalaryProcessing from "pages/processing/SalaryProcessing";
import ReportsDashboard from "pages/report/reports";
import Profile from "pages/Users/Profile";
import AllowanceForm from "pages/paysStructure/AllowanceForm";
import EmployeeDetail from "pages/employee/EmployeeDetail";
import EmployeeEditForm from 'pages/employee/EmployeeEditForm'
import EmployeeQuarter from 'pages/employee/EmployeeQuarter'
import PensionerForm from "pages/pensioner/PensionerForm";
import EmployeeLoan from "pages/employee-loan/EmployeeLoan";
import NetSalary from 'pages/net-salary/NetSalary'
import NetSalaryCard from "pages/net-salary/NetSalaryCard";
import Quarter from "pages/paysStructure/Quarter";
import pensionerDetail from "pages/pensioner/pensionerDetail";
import ShowEmployee from "pages/employee-loan/ShowEmployee";
import NetPension from "pages/Net-Pension/NetPension";
import NetPensionCard from "pages/Net-Pension/NetPensionCard";
import UserStepper from "pages/member-store/UserStepper";
import PensionerStepper from "pages/pensionerStore/PensionerStepper";
import CommissionCreate from "pages/pay-commission/CommissionCreate";
import PayComission from "pages/pay-commission/PayComission";
import PensionStepper from "pages/processing/pensionProcessing/pensionstepper";
import ViewSalary from "pages/view-salary/ViewSalary";
import ChangePassword from "pages/Users/ChangePassword";
import Designation from "pages/Designation/Designation";
import ViewPension from "pages/view-salary/ViewPension";
import FinalizePension from "pages/Net-Pension/FinalizePension";
import FinalizeSalary from "pages/net-salary/FinalizeSalary";

const getAdminRoutes = () => (
  {
    dashboard: [
      {
        path: "/index",
        name: "Dashboard",
        icon: "ni ni-tv-2 text-primary",
        component: AdminDashboard,
        showInSidebar: true,
        roles: ["IT Admin", "Director", "Senior AO", "Administrative Officer", "Drawing and Disbursing Officer (NIOH)", "Drawing and Disbursing Officer (ROHC)", "Section Officer (Accounts)", "Accounts Officer", "Salary Processing Coordinator (NIOH)", "Salary Processing Coordinator (ROHC)", "Pensioners Operator"]
      },
    ],

    management: [
      {
        path: "/user",
        name: "User",
        component: UserStepper,
        showInSidebar: false,
        roles: ["IT Admin", "Director", "Senior AO", "Administrative Officer"]
      },
      {
        path: "/user-management",
        name: "User",
        icon: "ni ni-single-02 text-yellow",
        component: UserTable,
        roles: ["IT Admin", "Director", "Senior AO", "Administrative Officer"]
      },
      {
        path: "/employee-management",
        name: "Employee",
        icon: "ni ni-single-02 text-blue",
        component: EmployeeTable,
        roles: ["IT Admin", "Director", "Senior AO", "Administrative Officer", "Salary Processing Coordinator (NIOH)", "Salary Processing Coordinator (ROHC)", "Accounts Officer"]
      },
      {
        path: "/employee/:id",
        name: "Employee",
        component: EmployeeDetail,
        showInSidebar: false,
        roles: ["IT Admin", "Director", "Senior AO", "Administrative Officer", "Salary Processing Coordinator (NIOH)", "Salary Processing Coordinator (ROHC)", "Accounts Officer"]
      },
      {
        path: '/employee/add',
        name: "Add-Employee",
        component: UserStepper,
        showInSidebar: false,
        roles: ["IT Admin", "Director", "Senior AO", "Administrative Officer", "Salary Processing Coordinator (NIOH)", "Salary Processing Coordinator (ROHC)"]
      },
      {
        path: '/employee/edit/:id',
        name: "Edit-Employee",
        component: EmployeeEditForm,
        showInSidebar: false,
        roles: ["IT Admin", "Director", "Senior AO", "Administrative Officer", "Salary Processing Coordinator (NIOH)", "Salary Processing Coordinator (ROHC)"]
      },
      {
        path: '/employee/:id/quarter',
        name: "Quarter-Employee",
        component: EmployeeQuarter,
        showInSidebar: false,
        roles: ["IT Admin", "Director", "Senior AO", "Administrative Officer", "Salary Processing Coordinator (NIOH)", "Salary Processing Coordinator (ROHC)"]
      },
      {
        path: "/pensioners",
        name: "Pensioners",
        icon: "ni ni-circle-08 text-red",
        component: PensionerManagement,
        roles: ["IT Admin", "Director", "Senior AO", "Administrative Officer", "Pensioners Operator", "Accounts Officer"]
      },
      {
        path: "/pensioner/add",
        name: "Add-Pensioners",
        component: PensionerStepper,
        showInSidebar: false,
        roles: ["IT Admin", "Director", "Senior AO", "Administrative Officer", "Pensioners Operator"]
      },
      {
        path: "/pensioner/edit/:id",
        name: "Id-Pensioners",
        component: PensionerForm,
        showInSidebar: false,
        roles: ["IT Admin", "Director", "Senior AO", "Administrative Officer", "Pensioners Operator"]
      },
      {
        path: "/pensioner/view/:id",
        name: "Id-Pensioners",
        component: pensionerDetail,
        showInSidebar: false,
        roles: ["IT Admin", "Director", "Senior AO", "Administrative Officer", "Pensioners Operator", "Accounts Officer"]
      },
    ],

    masters: [
      {
        path: "/pay-commission",
        name: "Pay Commission",
        icon: "fa-solid fa-percent text-orange",
        component: CommissionCreate,
        roles: ["IT Admin", "Director", "Senior AO", "Administrative Officer", "Salary Processing Coordinator (NIOH)", "Salary Processing Coordinator (ROHC)", "Accounts Officer", "Drawing and Disbursing Officer (NIOH)", "Drawing and Disbursing Officer (ROHC)", "Section Officer (Accounts)",]
      },
      {
        path: "/pay-commission-table",
        name: "Pay Commission Table",
        icon: "fa-solid fa-table-cells text-orange",
        component: PayComission,
        roles: ["IT Admin", "Director", "Senior AO", "Administrative Officer", "Salary Processing Coordinator (NIOH)", "Salary Processing Coordinator (ROHC)", "Accounts Officer", "Drawing and Disbursing Officer (NIOH)", "Drawing and Disbursing Officer (ROHC)", "Section Officer (Accounts)",]
      },
      {
        path: "/pay-structure",
        name: "Pay Structure",
        icon: "ni ni-settings-gear-65 text-orange",
        component: PaysStructure,
        roles: ["IT Admin", "Director", "Senior AO", "Administrative Officer", "Salary Processing Coordinator (NIOH)", "Salary Processing Coordinator (ROHC)", "Accounts Officer", "Drawing and Disbursing Officer (NIOH)", "Drawing and Disbursing Officer (ROHC)", "Section Officer (Accounts)",]
      },
      {
        path: "/allowance-rates",
        name: "Allowance Rates",
        icon: "ni ni-money-coins text-orange",
        component: AllowanceForm,
        roles: ["IT Admin", "Director", "Senior AO", "Administrative Officer", "Salary Processing Coordinator (NIOH)", "Salary Processing Coordinator (ROHC)", "Accounts Officer", "Pensioners Operator", "Drawing and Disbursing Officer (NIOH)", "Drawing and Disbursing Officer (ROHC)", "Section Officer (Accounts)",]
      },
      {
        path: "/quarter",
        name: "Quarter",
        icon: "fa-solid fa-chart-pie text-orange",
        component: Quarter,
        roles: ["IT Admin", "Director", "Senior AO", "Administrative Officer", "Salary Processing Coordinator (NIOH)", "Salary Processing Coordinator (ROHC)", "Accounts Officer", "Drawing and Disbursing Officer (NIOH)", "Drawing and Disbursing Officer (ROHC)", "Section Officer (Accounts)",]
      },
      {
        path: "/designation",
        name: "Designation",
        icon: "fa-solid fa-user-tag text-orange",
        component: Designation,
        roles: ["IT Admin", "Salary Processing Coordinator (NIOH)", "Salary Processing Coordinator (ROHC)", "Accounts Officer", "Drawing and Disbursing Officer (NIOH)", "Drawing and Disbursing Officer (ROHC)", "Section Officer (Accounts)",]
      }
    ],

    processing: [
      {
        path: "/salary",
        name: "Salary",
        icon: "ni ni-settings-gear-65 text-info",
        component: SalaryProcessing,
        showInSidebar: true,
        roles: ["IT Admin", "Salary Processing Coordinator (NIOH)", "Salary Processing Coordinator (ROHC)"]
      },
      {
        path: "/pension",
        name: "Pension",
        icon: "fa-solid fa-hand-holding-dollar",
        component: PensionStepper,
        showInSidebar: true,
        roles: ["IT Admin", "Pensioners Operator"]
      },
      {
        path: "/finalize-salary",
        name: "Finalize Salary",
        icon: "fa-solid fa-sack-dollar",
        component: FinalizeSalary,
        roles: ["IT Admin", "Director", "Senior AO", "Administrative Officer", "Drawing and Disbursing Officer (NIOH)", "Drawing and Disbursing Officer (ROHC)", "Section Officer (Accounts)", "Accounts Officer", "Salary Processing Coordinator (NIOH)", "Salary Processing Coordinator (ROHC)", "Pensioners Operator"]
      },
      {
        path: "/net-salary",
        name: "Net Salary",
        icon: "fa-solid fa-sack-dollar",
        component: NetSalary,
        roles: ["IT Admin", "Director", "Senior AO", "Administrative Officer", "Drawing and Disbursing Officer (NIOH)", "Drawing and Disbursing Officer (ROHC)", "Section Officer (Accounts)", "Accounts Officer", "Salary Processing Coordinator (NIOH)", "Salary Processing Coordinator (ROHC)"]
      },
      {
        path: "/employee/net-salary/:id",
        name: "Net Salary",
        component: NetSalaryCard,
        showInSidebar: false,
        roles: ["IT Admin", "Director", "Senior AO", "Administrative Officer", "Drawing and Disbursing Officer (NIOH)", "Drawing and Disbursing Officer (ROHC)", "Section Officer (Accounts)", "Accounts Officer", "Salary Processing Coordinator (NIOH)", "Salary Processing Coordinator (ROHC)", "End Users"]
      },
      {
        path: "/finalize-pension",
        name: "Finalize Pension",
        icon: "fa-solid fa-person-cane",
        component: FinalizePension,
        roles: ["IT Admin", "Director", "Senior AO", "Administrative Officer", "Drawing and Disbursing Officer (NIOH)", "Drawing and Disbursing Officer (ROHC)", "Section Officer (Accounts)", "Accounts Officer", "Salary Processing Coordinator (NIOH)", "Salary Processing Coordinator (ROHC)", "Pensioners Operator"]
      },
      {
        path: "/net-pension",
        name: "Net Pension",
        icon: "fa-solid fa-person-cane",
        component: NetPension,
        roles: ["IT Admin", "Director", "Senior AO", "Administrative Officer", "Section Officer (Accounts)", "Accounts Officer", "Pensioners Operator", "Drawing and Disbursing Officer (NIOH)"]
      },
      {
        path: "/net-pension/view/:id",
        name: "Net Pension",
        component: NetPensionCard,
        showInSidebar: false,
        roles: ["IT Admin", "Director", "Senior AO", "Administrative Officer", "Drawing and Disbursing Officer (NIOH)", "Drawing and Disbursing Officer (ROHC)", "Section Officer (Accounts)", "Accounts Officer", "Salary Processing Coordinator (NIOH)", "Salary Processing Coordinator (ROHC)", "End Users", "Pensioners Operator"]
      },
      {
        path: "/employee-loan",
        name: "Employee Loan",
        icon: "fa-solid fa-money-check",
        component: EmployeeLoan,
        roles: ["IT Admin", "Director", "Senior AO", "Administrative Officer", "Salary Processing Coordinator (NIOH)", "Salary Processing Coordinator (ROHC)", "Accounts Officer"]
      },
      {
        path: "/employee-loan/view/:id",
        name: "Net Salary",
        component: ShowEmployee,
        showInSidebar: false,
        roles: ["IT Admin", "Director", "Senior AO", "Administrative Officer", "Salary Processing Coordinator (NIOH)", "Salary Processing Coordinator (ROHC)", "Accounts Officer"]
      },
    ],

    report: [
      {
        path: "/reports",
        name: "Reports",
        icon: "ni ni-paper-diploma text-purple",
        component: ReportsDashboard,
        showInSidebar: true,
        roles: ["IT Admin", "Director", "Senior AO", "Administrative Officer", "Drawing and Disbursing Officer (NIOH)", "Drawing and Disbursing Officer (ROHC)", "Section Officer (Accounts)", "Accounts Officer", "Salary Processing Coordinator (NIOH)", "Salary Processing Coordinator (ROHC)", "Pensioners Operator", "End Users"]
      },
    ],

    PaySlip: [
      {
        path: "/my-salary",
        name: "My Salary",
        component: ViewSalary,
        icon: "fa-solid fa-sack-dollar",
        showInSidebar: true,
        roles: ["IT Admin", "Director", "Senior AO", "Administrative Officer", "Drawing and Disbursing Officer (NIOH)", "Drawing and Disbursing Officer (ROHC)", "Section Officer (Accounts)", "Accounts Officer", "Salary Processing Coordinator (NIOH)", "Salary Processing Coordinator (ROHC)", "Pensioners Operator", "End Users"]
      },
      {
        path: "/my-pension",
        name: "My Pension",
        component: ViewPension,
        icon: "fa-solid fa-person-cane",
        showInSidebar: true,
        roles: ["IT Admin", "Director", "Senior AO", "Administrative Officer", "Section Officer (Accounts)", "Accounts Officer", "Pensioners Operator", "Drawing and Disbursing Officer (NIOH)", "Drawing and Disbursing Officer (ROHC)", "Salary Processing Coordinator (NIOH)", "Salary Processing Coordinator (ROHC)", "End Users"]
      }
    ],

    account: [
      {
        path: "/login",
        name: "login",
        component: Login,
        showInSidebar: false,
      },
      {
        path: "/forgot-password",
        name: "ForgotPassword",
        component: ForgotPassword,
        showInSidebar: false,
      },
      {
        path: "/change-password",
        name: "ChangePassword",
        component: ChangePassword,
        showInSidebar: false,
      },
      {
        path: "/user-profile",
        name: "Profile",
        component: Profile,
        showInSidebar: false,
        roles: ["IT Admin", "Director", "Senior AO", "Administrative Officer", "Drawing and Disbursing Officer (NIOH)", "Drawing and Disbursing Officer (ROHC)", "Accounts Officer", "Salary Processing Coordinator (NIOH)", "Salary Processing Coordinator (ROHC)", "Pensioners Operator", "End Users"]
      },
    ],
  });
export default getAdminRoutes;
