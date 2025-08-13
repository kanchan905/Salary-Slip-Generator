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
      {/* <Container className="mt--7 mb-7" fluid>
        <Row>
          <Col xs={12} sm={12} md={12} lg={8} xl={8} className="mb-4 mb-lg-0">
            <Card className="bg-gradient-default shadow trend">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center flex-wrap">
                  <Col xs={12} md={4} className="d-flex justify-content-center mb-2 mb-md-0">
                    <h6 className="text-uppercase ls-1 mb-1" style={{ color: '#002a5a' }}>
                      Disbursement Trends
                    </h6>
                  </Col>
                  <Col xs={12} md={4} className="d-flex justify-content-center mb-2 mb-md-0">
                    <div className="position-relative d-inline-block w-100 w-md-auto">
                      <button
                        type="button"
                        className="btn trend-btn dropdown-toggle d-flex align-items-center justify-between w-100"
                        onClick={() => setOpen(!open)}
                      >
                        {selected}
                      </button>
                      {open && (
                        <ul className="dropdown-menu show mt-1 shadow w-100">
                          {options.map((option) => (
                            <li key={option}>
                              <button
                                className="dropdown-item"
                                onClick={() => {
                                  setSelected(option);
                                  setOpen(false);
                                }}
                              >
                                {option}
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </Col>
                  <Col xs={12} md={4} className="d-flex justify-content-center">
                    <Nav className="justify-content-end w-100 w-md-auto" pills>
                      <NavItem>
                        <NavLink
                          className={classnames("py-2 px-3", {
                            active: activeNav === 1,
                          })}
                          href="#pablo"
                          onClick={(e) => toggleNavs(e, 1)}
                        >
                          <span className="d-none d-md-block">Month</span>
                          <span className="d-md-none">M</span>
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          className={classnames("py-2 px-3", {
                            active: activeNav === 2,
                          })}
                          data-toggle="tab"
                          href="#pablo"
                          onClick={(e) => toggleNavs(e, 2)}
                        >
                          <span className="d-none d-md-block">Week</span>
                          <span className="d-md-none">W</span>
                        </NavLink>
                      </NavItem>
                    </Nav>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
               
                <div className="chart w-100" style={{ minHeight: 250 }}>
                  <Line
                    data={chartExample1[chartExample1Data]}
                    options={chartExample1.options}
                    getDatasetAtEvent={(e) => console.log(e)}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col xs={12} sm={12} md={12} lg={4} xl={4} className="d-flex flex-column" style={{ gap: "20px" }}>
            <Card className="shadow mb-4">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <Col>
                    <h2 className="mb-0">Institute Breakdown</h2>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <h6 className="text-uppercase text-gray-600 ls-1 mb-1">Employees:</h6>
                <p className="text-blue-700 font-medium">
                  NIOH: {stats.instituteBreakdown.NIOH} | ROHC: {stats.instituteBreakdown.ROHC}
                </p>
                <h6 className="text-uppercase text-gray-600 ls-1 mb-1">Pensioners:</h6>
                <p className="text-purple-700 font-medium">
                  NIOH: {stats.pensionBreakdown.NIOH} | ROHC: {stats.pensionBreakdown.ROHC}
                </p>
              </CardBody>
            </Card>
            <Card className="mb-4">
              <CardBody>
                <div className="chart w-100" style={{ minHeight: 200 }}>
                  <Bar
                    data={chartExample2.data}
                    options={chartExample2.options}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container> */}
    </>
  );
};

export default AdminDashboard;
