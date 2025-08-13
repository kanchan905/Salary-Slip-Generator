import React from "react";
import classnames from "classnames";
import {
  Card,
  CardBody,
  NavItem,
  NavLink,
  Nav,
} from "reactstrap";
import EmployeePayStructures from "./EmployeePayStructure";

class PaysStructure extends React.Component {
  state = {
    tabs: 3
  };
  toggleNavs = (e, state, index) => {
    e.preventDefault();
    this.setState({
      [state]: index
    });
  };
  render() {
    return (
      <>
       <div className='header bg-gradient-info pb-8 pt-8 pt-md-8 main-head'></div>
       <div className="mt--7 container-fluid">
       <Card style={{ backgroundColor: 'transparent' }} className="shadow border-0 p-0">
        <div className="nav-wrapper p-0">
          <Nav
            className="nav-fill flex-column flex-md-row"
            id="tabs-icons-text"
            pills
            role="tablist"
          >
            <NavItem>
              <NavLink
                aria-selected={this.state.tabs === 3}
                className={classnames("mb-sm-3 mb-md-0 bg-white", {
                  navactive: this.state.tabs === 3
                })}
                onClick={e => this.toggleNavs(e, "tabs", 3)}
                href="#pablo"
                role="tab"
              >
                <i className="ni ni-calendar-grid-58 mr-2" />
                Employee Pay Structure
              </NavLink>
            </NavItem>
          </Nav>
        </div>
        </Card>

        <Card className="shadow mt-7 mb-7">
          <CardBody>
            <EmployeePayStructures/>
          </CardBody>
        </Card>
        </div>
      </>
    );
  }
}

export default PaysStructure;
