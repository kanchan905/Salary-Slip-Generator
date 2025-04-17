import React from "react";
import {
  FormGroup,
  Form,
  Input,
  Row,
  Col
} from "reactstrap";
import { Button } from "reactstrap";

class PayLevel extends React.Component {
  render() {
    return (
      <>
        <Form>
          <Row>
            <Col>
              <FormGroup>
                <Input
                  name="FirstName"
                  placeholder="Level Name"
                //   value={form.levelName}
                //   onChange={handleLevelChange}
                  className="w-full border rounded p-2"
                  required
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col>
            <FormGroup>
                <Input
                  name="Description"
                  placeholder="Description"
                //   value={form.levelName}
                //   onChange={handleLevelChange}
                  className="w-full border rounded p-2"
                  required
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col>
             <FormGroup>
             <Button color="primary" outline type="button">Add Level</Button>
             </FormGroup>
            </Col>
          </Row>
        </Form>
      </>
    );
  }
}

export default PayLevel;