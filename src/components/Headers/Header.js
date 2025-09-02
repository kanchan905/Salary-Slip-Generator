import { Card, CardBody, CardTitle, Container, Row, Col, Spinner, Form, FormGroup, Label, Input } from "reactstrap";
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux"; // Combined imports
import { fetchDashboardSummary, fetchDashboardReports } from '../../redux/slices/reportSlice';
import '../../assets/css/custom.css';

const Header = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedInstitute, setSelectedInstitute] = useState('nioh');
  const { name } = useSelector((state) => state?.auth?.user?.roles[0]); // This 'name' variable isn't used after being declared.
  const dispatch = useDispatch();
  const { summary, loading, error, reports } = useSelector((state) => state.dashboardReport);
  const currentRoles = useSelector((state) =>
    state.auth.user?.roles?.map(role => role.name) || []
  );

  useEffect(() => {
    dispatch(fetchDashboardSummary());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchDashboardReports({ month: selectedMonth, year: selectedYear, institute: selectedInstitute }));
  }, [dispatch, selectedMonth, selectedYear, selectedInstitute]);

  const handleMonthChange = (e) => {
    setSelectedMonth(parseInt(e.target.value));
  };

  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value));
  };

  const handleInstituteChange = (e) => {
    setSelectedInstitute(e.target.value);
  };

  return (
    <>
      {/* Custom header gradient and padding */}
      <div className="header custom-header-bg pb-9 pt-9 pt-md-8">
        <Container fluid>
          <div className="header-body">
            <h2 className="text-black mb-4 dashboard-title">Dashboard Overview</h2> {/* Added Dashboard Title */}
            <Row className="mb-5"> {/* Increased bottom margin for the first row of cards */}
              {currentRoles.some(role => ['IT Admin'].includes(role)) && (
                <Col xs={12} sm={6} md={6} lg={6} xl={3} className="mb-4 mb-xl-0">
                  <Card className="card-stats h-100 custom-card card-custom-bg-blue"> {/* Added custom-card class and specific background */}
                    <CardBody>
                      <Row className="align-items-center">
                        <Col className="col">
                          <CardTitle tag="h6" className="text-uppercase text-white mb-1"> {/* Adjusted tag and color */}
                            Users
                          </CardTitle>
                          <h2 className="text-white font-weight-bold mb-0"> {/* Styled actual value */}
                            {loading ? <Spinner size="sm" color="white" /> : summary.total_users}
                          </h2>
                        </Col>
                        <Col className="col-auto">
                          <div className="icon icon-shape text-white rounded-circle shadow custom-icon-shape">
                            <i className="fa-solid fa-building" />
                          </div>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </Col>
              )}

              {currentRoles.some(role => ['IT Admin', 'Section Officer (Accounts)', 'Accounts Officer', 'Senior AO', 'Director', 'Administrative Officer'].includes(role)) && (
                <Col xs={12} sm={6} md={6} lg={6} xl={3} className="mb-4 mb-xl-0">
                  <Card className="card-stats h-100 custom-card card-custom-bg-green">
                    <CardBody>
                      <Row className="align-items-center">
                        <Col className="col">
                          <CardTitle tag="h6" className="text-uppercase text-white mb-1">
                            Total Employees
                          </CardTitle>
                          <h2 className="text-white font-weight-bold mb-0">
                            {loading ? <Spinner size="sm" color="white" /> : summary.total_employees}
                          </h2>
                        </Col>
                        <Col className="col-auto">
                          <div className="icon icon-shape text-white rounded-circle shadow custom-icon-shape">
                            <i className="fa-solid fa-user-tie"></i>
                          </div>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </Col>
              )}

              {currentRoles.some(role => ['IT Admin', 'Section Officer (Accounts)', 'Accounts Officer', 'Senior AO', 'Director', 'Administrative Officer', 'Pensioners Operator'].includes(role)) && (
                <Col xs={12} sm={6} md={6} lg={6} xl={3} className="mb-4 mb-xl-0">
                  <Card className="card-stats h-100 custom-card card-custom-bg-orange">
                    <CardBody>
                      <Row className="align-items-center">
                        <Col className="col">
                          <CardTitle tag="h6" className="text-uppercase text-white mb-1">
                            Total Pensioners
                          </CardTitle>
                          <h2 className="text-white font-weight-bold mb-0">
                            {loading ? <Spinner size="sm" color="white" /> : summary.total_pensioners}
                          </h2>
                        </Col>
                        <Col className="col-auto">
                          <div className="icon icon-shape text-white rounded-circle shadow custom-icon-shape">
                            <i className="fa-solid fa-users" />
                          </div>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </Col>
              )}

              {currentRoles.some(role => ['IT Admin', 'Salary Processing Coordinator (NIOH)', 'Drawing and Disbursing Officer (NIOH)'].includes(role)) && (
                <Col xs={12} sm={6} md={6} lg={6} xl={3} className="mb-4 mb-xl-0">
                  <Card className="card-stats h-100 custom-card card-custom-bg-purple">
                    <CardBody>
                      <Row className="align-items-center">
                        <Col className="col">
                          <CardTitle tag="h6" className="text-uppercase text-white mb-1">
                            NIOH Employees
                          </CardTitle>
                          <h2 className="text-white font-weight-bold mb-0">
                            {loading ? <Spinner size="sm" color="white" /> : summary.total_nioh_employees}
                          </h2>
                        </Col>
                        <Col className="col-auto">
                          <div className="icon icon-shape text-white rounded-circle shadow custom-icon-shape">
                            <i className="fa-solid fa-building" />
                          </div>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </Col>
              )}

              {currentRoles.some(role => ['IT Admin', 'Salary Processing Coordinator (ROHC)', 'Drawing and Disbursing Officer (ROHC)'].includes(role)) && (
                <Col xs={12} sm={6} md={6} lg={6} xl={3} className="mb-4 mb-xl-0">
                  <Card className="card-stats h-100 custom-card card-custom-bg-primary"> {/* Assuming you want a different custom background here */}
                    <CardBody>
                      <Row className="align-items-center">
                        <Col className="col">
                          <CardTitle tag="h6" className="text-uppercase text-white mb-1">
                            ROHC Employees
                          </CardTitle>
                          <h2 className="text-white font-weight-bold mb-0">
                            {loading ? <Spinner size="sm" color="white" /> : summary.total_rohc_employees}
                          </h2>
                        </Col>
                        <Col className="col-auto">
                          <div className="icon icon-shape text-white rounded-circle shadow custom-icon-shape">
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
              currentRoles.some(role => ['Section Officer (Accounts)', 'Senior AO', 'Accounts Officer', 'Administrative Officer', 'Director', 'Salary Processing Coordinator (NIOH)', 'Salary Processing Coordinator (ROHC)', 'IT Admin', 'Drawing and Disbursing Officer (NIOH)', 'Drawing and Disbursing Officer (ROHC)'].includes(role)) && (
                <>
                  {/* Filter Controls */}
                  <Row className="mt-4">
                    <Col xs={12} sm={6} md={3} className="mb-3"> {/* Added margin bottom for small screens */}
                      <FormGroup>
                        <Label for="monthSelect" className="text-black font-weight-bold filter-label">Month</Label>
                        <Input
                          id="monthSelect"
                          type="select"
                          value={selectedMonth}
                          onChange={handleMonthChange}
                          className="custom-select-input"
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
                    <Col xs={12} sm={6} md={3} className="mb-3">
                      <FormGroup>
                        <Label for="yearSelect" className="text-black font-weight-bold filter-label">Year</Label>
                        <Input
                          id="yearSelect"
                          type="select"
                          value={selectedYear}
                          onChange={handleYearChange}
                          className="custom-select-input"
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
                    {
                      !currentRoles.some(role => ['Salary Processing Coordinator (NIOH)', 'Salary Processing Coordinator (ROHC)', 'Drawing and Disbursing Officer (NIOH)', 'Drawing and Disbursing Officer (ROHC)'].includes(role)) && (
                        <Col xs={12} sm={6} md={3} className="mb-3">
                          <FormGroup>
                            <Label for="instituteSelect" className="text-black font-weight-bold filter-label">Institute</Label>
                            <Input
                              id="instituteSelect"
                              type="select"
                              value={selectedInstitute}
                              onChange={handleInstituteChange}
                              className="custom-select-input"
                            >
                              <option value="nioh">NIOH</option>
                              <option value="rohc">ROHC</option>
                            </Input>
                          </FormGroup>
                        </Col>
                      )}
                  </Row>

                  <Row className="mt-4">
                    <Col xs={12} sm={4} className="mb-4 mb-xl-0">
                      <Card className="card-stats h-100 custom-card">
                        <CardBody>
                          <CardTitle tag="h6" className="text-uppercase text-muted mb-1">
                            Total Income Tax
                          </CardTitle>
                          <h2 className="text-info font-weight-bold mb-0"> {/* Applied color to value */}
                            {reports.loading ? <Spinner size="sm" /> : reports.total_income_tax}
                          </h2>
                        </CardBody>
                      </Card>
                    </Col>
                    <Col xs={12} sm={4} className="mb-4 mb-xl-0">
                      <Card className="card-stats h-100 custom-card">
                        <CardBody>
                          <CardTitle tag="h6" className="text-uppercase text-muted mb-1">
                            Total Net Pay
                          </CardTitle>
                          <h2 className="text-success font-weight-bold mb-0"> {/* Applied color to value */}
                            {reports.loading ? <Spinner size="sm" /> : reports.total_net_pay}
                          </h2>
                        </CardBody>
                      </Card>
                    </Col>
                    <Col xs={12} sm={4} className="mb-4 mb-xl-0">
                      <Card className="card-stats h-100 custom-card">
                        <CardBody>
                          <CardTitle tag="h6" className="text-uppercase text-muted mb-1">
                            Total Net Pension
                          </CardTitle>
                          <h2 className="text-warning font-weight-bold mb-0"> {/* Applied color to value */}
                            {reports.loading ? <Spinner size="sm" /> : reports.total_net_pension}
                          </h2>
                        </CardBody>
                      </Card>
                    </Col>
                    <Col xs={12} sm={4} className="mb-4 mb-xl-0">
                      <Card className="card-stats h-100 custom-card">
                        <CardBody>
                          <CardTitle tag="h6" className="text-uppercase text-muted mb-1">
                            Total Deduction
                          </CardTitle>
                          <h2 className="text-warning font-weight-bold mb-0"> {/* Applied color to value */}
                            {reports.loading ? <Spinner size="sm" /> : reports.total_deduction}
                          </h2>
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