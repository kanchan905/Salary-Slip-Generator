import {  Row, Col, Nav, NavItem, NavLink } from "reactstrap";

const Footer = () => {
  return (
    <footer className="footer p-4" >
      <Row className="align-items-center justify-content-between">
        <Col xl="6">
          <div className="copyright text-center text-xl-left text-muted">
            © {new Date().getFullYear()}{" "}
            <a
              className="font-weight-bold ml-1"
              href="../index.html"
              rel="noopener noreferrer"
              target="_blank"
            >
               ICMR-NIOH/ ICMR-ROHC 
            </a>
          </div>
        </Col>
        <Col xl="6">
            <NavItem>
              <NavLink
                href="https://nioh.org"
                rel="noopener noreferrer"
                target="_blank"
              >
                About Us
              </NavLink>
            </NavItem>
        </Col>
      </Row>
    </footer>
  );
};

export default Footer;
