import { useState } from "react";
import classnames from "classnames";
import Chart from "chart.js";
import { Line} from "react-chartjs-2";
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
} from "variables/charts.js";
import Header from "components/Headers/Header.js";


const Index = () => {
  const [activeNav, setActiveNav] = useState(1);
  const [chartExample1Data, setChartExample1Data] = useState("data1");
  
  // Sample static data (replace with API later)
  const [stats] = useState({
    totalEmployees: 120,
    totalPensioners: 80,
    pendingTasks: 5,
    instituteBreakdown: { NIOH: 70, ROHC: 50 },
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
  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row>
          <Col className="mb-5 mb-xl-0" xl="8">
            <Card className="bg-gradient-default shadow">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <div className="col">
                    <h2 className="text-white mb-0">Disbursement Trends</h2>
                  </div>
                  <div className="col">
                    <Nav className="justify-content-end" pills>
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
                  </div>
                </Row>
              </CardHeader>
              <CardBody>
                {/* Chart */}
                <div className="chart">
                  <Line
                    data={chartExample1[chartExample1Data]}
                    options={chartExample1.options}
                    getDatasetAtEvent={(e) => console.log(e)}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col xl="4">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <div className="col">
                    <h2 className="mb-0">Institute Breakdown</h2>
                  </div>
                </Row>
              </CardHeader>
              <CardBody>
              <h6 className="text-uppercase text-gray-600 ls-1 mb-1">Employees:</h6>
                <p className="text-blue-700 font-medium">NIOH: {stats.instituteBreakdown.NIOH} | ROHC: {stats.instituteBreakdown.ROHC}</p>
              <h6 className="text-uppercase text-gray-600 ls-1 mb-1">Pensioners:</h6>
                <p className="text-purple-700 font-medium">NIOH: {stats.pensionBreakdown.NIOH} | ROHC: {stats.pensionBreakdown.ROHC}</p>
              </CardBody>
            </Card>
          </Col>
        </Row>
        
      </Container>
    </>
  );
};

export default Index;
