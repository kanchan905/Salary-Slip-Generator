import { Card, CardBody, CardTitle, Container, Row, Col, Spinner, Form, FormGroup, Label, Input } from "reactstrap";
import React, { useState, useEffect } from 'react'
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { fetchDashboardSummary, fetchDashboardReports } from '../../redux/slices/reportSlice';

const Header = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const { name } = useSelector((state) => state?.auth?.user?.roles[0]);
  const dispatch = useDispatch();
  const { summary, loading, error, reports } = useSelector((state) => state.dashboardReport);
  const currentRoles = useSelector((state) =>
    state.auth.user?.roles?.map(role => role.name) || []
  );


  useEffect(() => {
    dispatch(fetchDashboardSummary());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchDashboardReports({ month: selectedMonth, year: selectedYear }));
  }, [dispatch, selectedMonth, selectedYear]);

  const handleMonthChange = (e) => {
    setSelectedMonth(parseInt(e.target.value));
  };

  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value));
  };



  return (
    <>
      <div className="header bg-gradient-info pb-9 pt-9 pt-md-8 main-head">
        <Container fluid>
          <div className="header-body">
            {/* Card stats */}
            <Row>
              {currentRoles.some(role => ['IT Admin'].includes(role)) && (
                <Col xs={12} sm={6} md={6} lg={6} xl={3} className="mb-4 mb-xl-0">
                  <Card className="card-stats h-100">
                    <CardBody>
                      <Row>
                        <div className="col">
                          <CardTitle
                            tag="h5"
                            className="text-uppercase text-muted mb-0"
                          >
                            Users
                          </CardTitle>
                          {loading ? <Spinner size="sm" /> : summary.total_users}
                        </div>
                        <Col className="col-auto">
                          <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                            <i className="fa-solid fa-building" />
                          </div>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </Col>
              )}

              {currentRoles.some(role => ['IT Admin','Section Officer (Accounts)','Accounts Officer','Senior AO','Director','Administrative Officer'].includes(role)) && (
                <Col xs={12} sm={6} md={6} lg={6} xl={3} className="mb-4 mb-xl-0">
                  <Card className="card-stats h-100">
                    <CardBody>
                      <Row>
                        <div className="col">
                          <CardTitle
                            tag="h5"
                            className="text-uppercase text-muted mb-0"
                          >
                            Total Employees
                          </CardTitle>
                          {loading ? <Spinner size="sm" /> : summary.total_employees}
                        </div>
                        <Col className="col-auto">
                          <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                            <i className="fa-solid fa-user-tie"></i>
                          </div>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </Col>
              )}

              {currentRoles.some(role => ['IT Admin','Section Officer (Accounts)','Accounts Officer','Senior AO','Director','Administrative Officer','Pensioners Operator'].includes(role)) && (
                <Col xs={12} sm={6} md={6} lg={6} xl={3} className="mb-4 mb-xl-0">
                  <Card className="card-stats h-100">
                    <CardBody>
                      <Row>
                        <div className="col">
                          <CardTitle
                            tag="h5"
                            className="text-uppercase text-muted mb-0"
                          >
                            Total Pensioners
                          </CardTitle>
                          {loading ? <Spinner size="sm" /> : summary.total_pensioners}
                        </div>
                        <Col className="col-auto">
                          <div className="icon icon-shape bg-warning text-white rounded-circle shadow">
                            <i className="fa-solid fa-users" />
                          </div>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </Col>
              )}

              {/* Show only NIOH Employees card for NIOH Coordinator */}
              {currentRoles.some(role => ['IT Admin', 'Salary Processing Coordinator (NIOH)', 'Drawing and Disbursing Officer (NIOH)'].includes(role)) && (
                <Col xs={12} sm={6} md={6} lg={6} xl={3} className="mb-4 mb-xl-0">
                  <Card className="card-stats h-100">
                    <CardBody>
                      <Row>
                        <div className="col">
                          <CardTitle
                            tag="h5"
                            className="text-uppercase text-muted mb-0"
                          >
                            NIOH Employees
                          </CardTitle>
                          {loading ? <Spinner size="sm" /> : summary.total_nioh_employees}
                        </div>
                        <Col className="col-auto">
                          <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                            <i className="fa-solid fa-building" />
                          </div>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </Col>
              )}
              {/* Show only ROHC Employees card for ROHC Coordinator */}
              {currentRoles.some(role => ['IT Admin', 'Salary Processing Coordinator (ROHC)', 'Drawing and Disbursing Officer (ROHC)'].includes(role)) && (
                <Col xs={12} sm={6} md={6} lg={6} xl={3} className="mb-4 mb-xl-0">
                  <Card className="card-stats h-100">
                    <CardBody>
                      <Row>
                        <div className="col">
                          <CardTitle
                            tag="h5"
                            className="text-uppercase text-muted mb-0"
                          >
                            ROHC Employees
                          </CardTitle>
                          {loading ? <Spinner size="sm" /> : summary.total_rohc_employees}
                        </div>
                        <Col className="col-auto">
                          <div className="icon icon-shape bg-primary text-white rounded-circle shadow">
                            <i className="fa-solid fa-building-columns" />
                          </div>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </Col>
              )}
            </Row>
            {error && <div className="text-danger mt-3">{error}</div>}


            {
              currentRoles.some(role => ['Section Officer (Accounts)','Senior AO','Accounts Officer','Administrative Officer','Director','Salary Processing Coordinator (NIOH)', 'Salary Processing Coordinator (ROHC)', 'IT Admin'].includes(role)) && (
                <>
                  {/* Filter Controls */}
                  <Row className="mt-4">
                    <Col xs={12} sm={6} md={3}>
                      <FormGroup>
                        <Label for="monthSelect" className="text-white">Month</Label>
                        <Input
                          id="monthSelect"
                          type="select"
                          value={selectedMonth}
                          onChange={handleMonthChange}
                        >
                          <option value={1}>January</option>
                          <option value={2}>February</option>
                          <option value={3}>March</option>
                          <option value={4}>April</option>
                          <option value={5}>May</option>
                          <option value={6}>June</option>
                          <option value={7}>July</option>
                          <option value={8}>August</option>
                          <option value={9}>September</option>
                          <option value={10}>October</option>
                          <option value={11}>November</option>
                          <option value={12}>December</option>
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col xs={12} sm={6} md={3}>
                      <FormGroup>
                        <Label for="yearSelect" className="text-white">Year</Label>
                        <Input
                          id="yearSelect"
                          type="select"
                          value={selectedYear}
                          onChange={handleYearChange}
                        >
                          {Array.from({ length: 10 }, (_, i) => {
                            const year = new Date().getFullYear() - 5 + i;
                            return (
                              <option key={year} value={year}>
                                {year}
                              </option>
                            );
                          })}
                        </Input>
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row className="mt-4">
                    <Col xs={12} sm={4} className="mb-4 mb-xl-0">
                      <Card className="card-stats h-100">
                        <CardBody>
                          <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                            Total Income Tax
                          </CardTitle>
                          {reports.loading ? <Spinner size="sm" /> : reports.total_income_tax}
                        </CardBody>
                      </Card>
                    </Col>
                    <Col xs={12} sm={4} className="mb-4 mb-xl-0">
                      <Card className="card-stats h-100">
                        <CardBody>
                          <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                            Total Net Pay
                          </CardTitle>
                          {reports.loading ? <Spinner size="sm" /> : reports.total_net_pay}
                        </CardBody>
                      </Card>
                    </Col>
                    <Col xs={12} sm={4} className="mb-4 mb-xl-0">
                      <Card className="card-stats h-100">
                        <CardBody>
                          <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                            Total Net Pension
                          </CardTitle>
                          {reports.loading ? <Spinner size="sm" /> : reports.total_net_pension}
                        </CardBody>
                      </Card>
                    </Col>
                  </Row>
                  {reports.error && <div className="text-danger mt-3">{reports.error}</div>}
                </>
              )
            }

          </div>
        </Container>
      </div>
    </>
  );
};

export default Header;
