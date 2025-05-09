import { Link, Navigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Form,
  FormGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  InputGroup,
  Navbar,
  Nav,
  Container,
  Media,
  CardTitle,
} from "reactstrap";
import logo from '../../assets/img/images/nioh_logo_white.png'


const AdminNavbar = (props) => {

  const notifications = [
    { id: 1, message: "New salary slip available" },
    { id: 2, message: "Leave approved" },
    { id: 3, message: "Reminder: Fill appraisal form" },
  ];



  return (
    <>
      <Navbar className="navbar-top navbar-dark" expand="md" id="navbar-main">
        <Container fluid>
          <CardTitle
            tag="h5"
            className="text-uppercase text-white mb-0"
          >
            Welcome to Salary & Pension Portal of NIOH
          </CardTitle>
          {/* <Form className="navbar-search navbar-search-dark form-inline mr-3 d-none d-md-flex ml-lg-auto">
            <FormGroup className="mb-0">
              <InputGroup className="input-group-alternative" style={{marginBottom: '0px'}}>
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="fas fa-search" />
                  </InputGroupText>
                </InputGroupAddon>
                <Input placeholder="Search" type="text" />
              </InputGroup>
            </FormGroup>
          </Form> */}
          <div className="mr-3 d-none d-md-flex ml-lg-auto">
            <Nav className="align-items-center d-none d-md-flex" navbar>
              <UncontrolledDropdown nav>
                <DropdownToggle className="pr-0" nav>
                  <Media className="align-items-center">
                    <span className="avatar avatar-sm rounded-circle bg-gradient-primary">
                      <i className="ni ni-bell-55"></i>
                      {notifications.length}
                    </span>
                  </Media>
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-arrow" right>
                  {
                    notifications.length === 0 ? (
                      <DropdownItem className="noti-title" header tag="div">
                        <h6 className="text-overflow m-0">No New Notification</h6>
                      </DropdownItem>
                    ) : (
                      notifications.map((notification) => (
                        <DropdownItem key={notification.id}>
                          <span>{notification.message}</span>
                        </DropdownItem>
                      ))
                    )
                  }
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>

            <Nav className="align-items-center d-none d-md-flex" navbar>
              <UncontrolledDropdown nav>
                <DropdownToggle className="pr-0" nav>
                  <Media className="align-items-center">
                    <span className="avatar avatar-sm rounded-circle">
                      <img
                        alt="..."
                        src={require("../../assets/img/theme/image.png")}
                      />
                    </span>
                    <Media className="ml-2 d-none d-lg-block">
                      <span className="mb-0 text-sm font-weight-bold text-white">
                        Admin
                      </span>
                    </Media>
                  </Media>
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-arrow" right>
                  <DropdownItem className="noti-title" header tag="div">
                    <h6 className="text-overflow m-0">Welcome!</h6>
                  </DropdownItem>
                  <DropdownItem to="/admin/user-profile" tag={Link}>
                    <i className="ni ni-single-02" />
                    <span>Profile</span>
                  </DropdownItem>
                  <DropdownItem to="/admin/user-profile" tag={Link}>
                    <i className="ni ni-calendar-grid-58" />
                    <span>Change password</span>
                  </DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem href="/login">
                    <i className="ni ni-user-run" />
                    <span>Logout</span>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
          </div>
        </Container>
      </Navbar>
    </>
  );
};

export default AdminNavbar;
