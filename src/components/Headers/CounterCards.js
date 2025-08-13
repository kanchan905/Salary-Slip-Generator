import { Card, CardBody, CardTitle, Container, Row, Col, Spinner, Form, FormGroup, Label, Input } from "reactstrap";
import React, { useState, useEffect } from 'react'
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { fetchDashboardSummary, fetchDashboardReports } from '../../redux/slices/reportSlice';

const CounterCards = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const { name } = useSelector((state) => state.auth.user?.roles[0]);

  // Helper flags for coordinator roles
  const isNiohCoordinator = name === 'Coordinator - NIOH';
  const isRohcCoordinator = name === 'Coordinator - ROHC';

  const dispatch = useDispatch();
  const { summary, loading, error, reports } = useSelector((state) => state.dashboardReport);

  // Safely access summary values with fallbacks
  const getSummaryValue = (key) => {
    if (!summary || typeof summary !== 'object') return 0;
    const value = summary[key];
    // Check if value is an object with message property (error case)
    if (value && typeof value === 'object' && value.message) {
      console.warn(`Error object detected for ${key}:`, value);
      return 0;
    }
    // Return the value if it's a number, otherwise 0
    return typeof value === 'number' ? value : 0;
  };

  // Safely access reports values with fallbacks
  const getReportValue = (key) => {
    if (!reports || typeof reports !== 'object') return 0;
    const value = reports[key];
    // Check if value is an object with message property (error case)
    if (value && typeof value === 'object' && value.message) {
      console.warn(`Error object detected for ${key}:`, value);
      return 0;
    }
    // Return the value if it's a number, otherwise 0
    return typeof value === 'number' ? value : 0;
  };

  // Additional safety check for the entire summary object
  const safeSummary = summary && typeof summary === 'object' && !summary.message ? summary : {};
  const safeReports = reports && typeof reports === 'object' && !reports.message ? reports : {};

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
          <div className="header-body">
            {/* Card stats */}
            <Row className="no-gutters">
              <Col xs={12} sm={6} md={3} lg={3} xl={3} className="mb-2 mb-xl-0 px-2">
                  <Card className="card-stats h-100">
                    <CardBody style={{background: 'linear-gradient(87deg, #004080, #002a5a 100%) !important'}}>
                      <Row>
                        <div className="col">
                          <CardTitle
                            tag="h5"
                            className="text-uppercase text-muted mb-0"
                          >
                            Users
                          </CardTitle>
                          <span>
                            {loading ? <Spinner size="sm" /> : getSummaryValue('total_users')}
                          </span>
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

              {/* Show only NIOH Employees card for NIOH Coordinator */}
              {isNiohCoordinator && (
                <Col xs={12} sm={6} md={3} lg={3} xl={3} className="mb-2 mb-xl-0 px-2">
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
                          <span>
                            {loading ? <Spinner size="sm" /> : getSummaryValue('total_nioh_employees')}
                          </span>
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
              {isRohcCoordinator && (
                <Col xs={12} sm={6} md={3} lg={3} xl={3} className="mb-2 mb-xl-0 px-2">
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
                          <span>
                            {loading ? <Spinner size="sm" /> : getSummaryValue('total_rohc_employees')}
                          </span>
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
              {/* For all other users, show all cards as before */}
              {!isNiohCoordinator && !isRohcCoordinator && (
                <>
                  <Col xs={12} sm={6} md={3} lg={3} xl={3} className="mb-2 mb-xl-0 px-2">
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
                            <span>
                              {loading ? <Spinner size="sm" /> : getSummaryValue('total_employees')}
                            </span>
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
                  <Col xs={12} sm={6} md={3} lg={3} xl={3} className="mb-2 mb-xl-0 px-2">
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
                            <span>
                              {loading ? <Spinner size="sm" /> : getSummaryValue('total_pensioners')}
                            </span>
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
                  <Col xs={12} sm={6} md={3} lg={3} xl={3} className="mb-2 mb-xl-0 px-2">
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
                            <span>
                              {loading ? <Spinner size="sm" /> : getSummaryValue('total_nioh_employees')}
                            </span>
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
                  <Col xs={12} sm={6} md={3} lg={3} xl={3} className="mb-2 mb-xl-0 px-2">
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
                            <span>
                              {loading ? <Spinner size="sm" /> : getSummaryValue('total_rohc_employees')}
                            </span>
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
                </>
              )}
            </Row>
            {error && <div className="text-danger mt-3">{error}</div>}

            {
              !isNiohCoordinator && !isRohcCoordinator && (
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

                  <Row className="mt-4 no-gutters">
                    <Col xs={12} sm={6} md={3} className="mb-2 mb-xl-0 px-2">
                      <Card className="card-stats h-100">
                        <CardBody>
                          <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                            Total Income Tax
                          </CardTitle>
                          <span>
                            {reports.loading ? <Spinner size="sm" /> : getReportValue('total_income_tax')}
                          </span>
                        </CardBody>
                      </Card>
                    </Col>
                    <Col xs={12} sm={6} md={3} className="mb-2 mb-xl-0 px-2">
                      <Card className="card-stats h-100">
                        <CardBody>
                          <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                            Total Net Pay
                          </CardTitle>
                          <span>
                            {reports.loading ? <Spinner size="sm" /> : getReportValue('total_net_pay')}
                          </span>
                        </CardBody>
                      </Card>
                    </Col>
                    <Col xs={12} sm={6} md={3} className="mb-2 mb-xl-0 px-2">
                      <Card className="card-stats h-100">
                        <CardBody>
                          <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                            Total Net Pension
                          </CardTitle>
                          <span>
                            {reports.loading ? <Spinner size="sm" /> : getReportValue('total_net_pension')}
                          </span>
                        </CardBody>
                      </Card>
                    </Col>
                    <Col xs={12} sm={6} md={3} className="mb-2 mb-xl-0 px-2">
                      <Card className="card-stats h-100">
                        <CardBody>
                          <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                            Pending Tasks
                          </CardTitle>
                          <span>
                            {reports.loading ? <Spinner size="sm" /> : "5"}
                          </span>
                        </CardBody>
                      </Card>
                    </Col>
                  </Row>
                  {reports.error && <div className="text-danger mt-3">{reports.error}</div>}
                </>
              )
            }

          </div>
    </>
  );
};

export default CounterCards;
