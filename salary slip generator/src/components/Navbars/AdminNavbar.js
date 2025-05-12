import { use } from "react";
import { useSelector } from "react-redux";
import { Link} from "react-router-dom";
import {
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Navbar,
  Nav,
  Container,
  Media,
  CardTitle,
} from "reactstrap";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";


const AdminNavbar = (props) => {

  const dispatch = useDispatch();
  const {name} = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const notifications = [
    { id: 1, message: "New salary slip available" },
    { id: 2, message: "Leave approved" },
    { id: 3, message: "Reminder: Fill appraisal form" },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  }

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
                        {name}
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
                  <DropdownItem onClick={handleLogout}>
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
