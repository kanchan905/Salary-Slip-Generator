import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
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
import { appLogout } from '../../redux/slices/authSlice';


const AdminNavbar = (props) => {

  const dispatch = useDispatch();
  const { roles } = useSelector((state) => state.auth.user);
  const { name } = useSelector((state) => state.auth.user);
  const roleNames = roles.map(role => role.name).join(", ");
  const navigate = useNavigate();



  const handleLogout = () => {
    dispatch(logout());
    dispatch(appLogout());
    navigate("/login");
  }

  return (
    <>
      <Navbar className="navbar-top navbar-dark" expand="md" id="navbar-main">
        <Container fluid className="do-center">
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
                    <span className="avatar avatar-sm rounded-circle">
                      <img
                        alt="..."
                        src={require("../../assets/img/theme/image.png")}
                      />
                    </span>
                    <Media className="ml-2 d-flex flex-column ">
                      <span className="mb-0 text-sm font-weight-bold text-white">
                        {name}
                      </span>                     
                      <span className="mb-0 text-sm font-weight-bold text-white">
                        {roleNames}
                      </span>
                    </Media>
                  </Media>
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-arrow" right>
                  <DropdownItem className="noti-title" header tag="div">
                    <h6 className="text-overflow m-0">Welcome!</h6>
                  </DropdownItem>
                  <DropdownItem to="/user-profile" tag={Link}>
                    <i className="ni ni-single-02" />
                    <span>Profile</span>
                  </DropdownItem>
                  <DropdownItem to="/change-password" tag={Link}>
                    <i className="fa-solid fa-lock"></i>
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
