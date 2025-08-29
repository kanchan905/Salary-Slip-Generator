import { useEffect, useState } from "react";
import classnames from "classnames";
import Chart from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import {
  Card,
  CardHeader,
  CardBody,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col,
} from "reactstrap";
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2,
} from "variables/charts.js";
import Header from "components/Headers/Header.js";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { fetchEmployees } from "../redux/slices/employeeSlice";


const AdminDashboard = () => {
  const [activeNav, setActiveNav] = useState(1);
  const [chartExample1Data, setChartExample1Data] = useState("data1");
  const EmpNiohTotalCount = useSelector((state) => state.employee.totalCount) || 0;
  const EmpRohcTotalCount = useSelector((state) => state.employee.totalCount) || 0;
  const dispatch = useDispatch();


  useEffect(() => {
    dispatch(fetchEmployees({ page: 1, limit: 1000, search: '', institute: 'NIOH' }));
    dispatch(fetchEmployees({ page: 1, limit: 1000, search: '', institute: 'ROHC' }));
  }, [ dispatch]);


  // Sample static data (replace with API later)
  const [stats] = useState({
    pendingTasks: 5,
    instituteBreakdown: { NIOH: EmpNiohTotalCount, ROHC: EmpRohcTotalCount },
    pensionBreakdown: { NIOH: 45, ROHC: 35 }
  });

  if (window.Chart) {
    parseOptions(Chart, chartOptions());
  }

  const toggleNavs = (e, index) => {
    e.preventDefault();
    setActiveNav(index);
    setChartExample1Data("data" + index);
  };

  const [selected, setSelected] = useState("Select Institute");
  const [open, setOpen] = useState(false);
  const options = ["NIOH", "RHOC", "BOTH"];


  useEffect(() => {
    dispatch(fetchEmployees())
  }, [])

  return (
    <>
      <Header />
    </>
  );
};

export default AdminDashboard;
