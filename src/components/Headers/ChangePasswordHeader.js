import { Button, Container, Row, Col } from "reactstrap";
import { useNavigate } from "react-router-dom";

const ChangePasswordHeader = ({user}) => {
  const navigate = useNavigate();

  return (
    <>
      <div
        className="header pb-8 pt-8 pt-lg-8 d-flex align-items-center">
        {/* Mask */}
        <span className="mask bg-gradient-default opacity-8" />
        {/* Header container */}
        <Container className="d-flex align-items-center" fluid>
          <Row>
            <Col lg="7" md="10">
              <h1 className="display-2 text-white">Change Password</h1>
              <p className="text-white mt-0 mb-5">
                Update your account password to keep your account secure. 
                Make sure to use a strong password that you can remember.
              </p>
              <Button
                color="secondary"
                size="sm"
                onClick={() => navigate("/user-profile")}
                className="mr-3"
              >
                <i className="ni ni-bold-left mr-2"></i>
                Back to Profile
              </Button>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default ChangePasswordHeader;
