import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col,
} from "reactstrap";
import UserHeader from "components/Headers/UserHeader.js";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchCurrentUser } from "../../redux/slices/authSlice";

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  return (
    <>
      <UserHeader user={user} />
      <Container className="mt--7" fluid>
        <Row>
          <Col className="order-xl-2 mb-5 mb-xl-0" xl="4">
            <Card className="card-profile shadow">
              <Row className="justify-content-center">
                <Col className="order-lg-2" lg="3">
                  <div className="card-profile-image">
                    <a href="#pablo" onClick={(e) => e.preventDefault()}>
                      <img
                        alt="..."
                        className="rounded-circle"
                        src={require("../../assets/img/theme/image.png")}
                      />
                    </a>
                  </div>
                </Col>
              </Row>
              <CardBody className="pt-0 pt-md-4">
                <div className="text-center mt-8">
                  <h3>
                    {user?.name || "N/A"}
                  </h3>
                  <div className="h5 font-weight-300">
                    <i className="ni location_pin mr-2" />
                    {user?.institute || "No institute info"}
                  </div>
                  <div className="h5 mt-4">
                    <i className="ni business_briefcase-24 mr-2" />
                    Role: {user?.roles[0]?.name || "Unknown"}
                  </div>
                  <hr className="my-4" />
                  <p>
                    {user?.email || "No email provided"}
                  </p>
                </div>
              </CardBody>
            </Card>
          </Col>

          <Col className="order-xl-1" xl="8">
            <Card className="shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">My account</h3>
                  </Col>
                 
                </Row>
              </CardHeader>
              <CardBody>
                <Form>
                  <h6 className="heading-small text-muted mb-4">User information</h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label" htmlFor="input-name">
                            Name
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-name"
                            defaultValue={user?.name || ""}
                            type="text"
                            disabled
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label" htmlFor="input-email">
                            Email address
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-email"
                            defaultValue={user?.email || ""}
                            type="email"
                            disabled
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>

                  <hr className="my-4" />

                  <h6 className="heading-small text-muted mb-4">Role Information</h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label" htmlFor="input-role">
                            Role
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-role"
                            defaultValue={user?.roles[0]?.name || ""}
                            type="text"
                            disabled
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label" htmlFor="input-status">
                            Status
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-status"
                            defaultValue={user?.is_active ? "Active" : "Inactive"}
                            type="text"
                            disabled
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>

                  <hr className="my-4" />

                  <h6 className="heading-small text-muted mb-4">Account Details</h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label" htmlFor="input-created">
                            Created At
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-created"
                            defaultValue={user?.created_at?.split("T")[0] || ""}
                            type="text"
                            disabled
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label" htmlFor="input-updated">
                            Updated At
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-updated"
                            defaultValue={user?.updated_at?.split("T")[0] || ""}
                            type="text"
                            disabled
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Profile;
