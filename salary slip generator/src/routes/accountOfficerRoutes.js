import AccountsDashboard from "Dashboard/AccountOfficer";



const accountOfficerRoutes = {
  dashboard: [
    {
      path: "/dashboard",
      name: "Dashboard",
      icon: "ni ni-tv-2 text-primary",
      component: AccountsDashboard,
      layout: "/accounts",
      showInSidebar: true,
    },
  ],
};
export { accountOfficerRoutes };