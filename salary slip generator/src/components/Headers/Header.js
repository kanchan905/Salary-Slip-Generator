import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";
import React,{useState, useEffect} from 'react'
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { fetchEmployees } from "../../redux/slices/employeeSlice";
import { fetchPensioners } from "../../redux/slices/pensionerSlice";

const Header = () => {


  const [open, setOpen] = useState(false);
  const employeeTotalCount = useSelector((state) => state.employee.totalCount) || 0;
  const pensionerTotalCount = useSelector((state) => state.pensioner.totalCount) || 0;
  const dispatch = useDispatch();
 
  // Sample static data (replace with API later)
  const stats = {
    totalEmployees: employeeTotalCount,
    totalPensioners: pensionerTotalCount,
    pendingTasks: 5,
    instituteBreakdown: { NIOH: 70, ROHC: 50 },
    pensionBreakdown: { NIOH: 45, ROHC: 35 }
  };

useEffect(() => {
     dispatch(fetchEmployees({page:'',limit:'',search:''}))
     dispatch(fetchPensioners())
    if (stats.pendingTasks > 0) {
      setOpen(true);
    }
  }, [stats.pendingTasks,dispatch]);

  return (
    <>
      <div className="header bg-gradient-info pb-9 pt-9 pt-md-8 main-head">
        <Container fluid>
          <div className="header-body">
            {/* Card stats */}
            <Row>
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0" style={{height: "100%"}}>
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Total Employees
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">
                        {stats.totalEmployees}
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                          <i className="fa-solid fa-user-tie"></i>
                        </div>
                      </Col>
                    </Row>
                    <p className="mt-3 mb-0 text-muted text-sm">
                      <span className="text-success mr-2">
                        <i className="fa fa-arrow-up" /> 3.48%
                      </span>{" "}
                      <span className="text-nowrap">Since last month</span>
                    </p>
                  </CardBody>
                </Card>
              </Col>
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0" style={{height: "100%"}}>
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                         Total Pensioners
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">{stats.totalPensioners}</span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-warning text-white rounded-circle shadow">
                          <i className="fa-solid fa-users" />
                        </div>
                      </Col>
                    </Row>
                    <p className="mt-3 mb-0 text-muted text-sm">
                      <span className="text-danger mr-2">
                        <i className="fas fa-arrow-down" /> 3.48%
                      </span>{" "}
                      <span className="text-nowrap">Since last week</span>
                    </p>
                  </CardBody>
                </Card>
              </Col>
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0" style={{height: "100%"}}>
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                           Pending Tasks
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">{stats.pendingTasks}</span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                          <i className="fa-solid fa-list-check"></i>
                        </div>
                      </Col>
                    </Row>
                    <p className="mt-3 mb-0 text-muted text-sm">
                      <span className="text-success mr-2">
                        <i className="fas fa-arrow-up" /> 12%
                      </span>{" "}
                      <span className="text-nowrap">Since last month</span>
                    </p>
                  </CardBody>
                </Card>
              </Col>
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0" style={{height: "100%"}}>
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          NIOH
                        </CardTitle>
                        <p className="mt-3 mb-0 text-muted text-sm">
                        <span className="text-success mr-2">
                        <i className="fa fa-arrow-up" /> 3.48%
                      </span>{" "}
                    </p>
                      </div>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          ROHC
                        </CardTitle>
                        <p className="mt-3 mb-0 text-muted text-sm">
                        <span className="text-danger mr-2">
                        <i className="fas fa-arrow-down" /> 3.48%
                      </span>{" "}
                    </p>
                      </div>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </Container>

        {/* <CustomSnackbar
        open={open}
        handleClose={() => setOpen(false)}
        message={`You have ${stats.pendingTasks} pending tasks`}
        severity="warning"
      /> */}

      </div>
    </>
  );
};

export default Header;
