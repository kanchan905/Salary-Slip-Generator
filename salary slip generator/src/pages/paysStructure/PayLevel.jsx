import React,{useState} from "react";
import {
  FormGroup,
  Form,
  Input,
  Row,
  Col
} from "reactstrap";
import { Button } from "reactstrap";
import { useDispatch } from "react-redux";
import { addLevel } from "../../redux/slices/levelSlice";

function PayLevel(){
  const [form, setForm] = useState({ levelName: "", description: "" });
  const dispatch = useDispatch();
  const handleLevelChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
   };

   const handleAddLevel = (e) => {
    e.preventDefault();
    dispatch(addLevel({ id: Date.now(), levelName:`${form.levelName}`, description: `${form.description}` }));
    console.log('Level added:', form.levelName, form.description);
    setForm({ levelName: "", description: "" });
  }; 

    return (
      <>
        <Form onSubmit={handleAddLevel} >
          <Row>
            <Col>
              <FormGroup>
                <Input
                  name="levelName"
                  placeholder="Level Name"
                  value={form.levelName}
                  onChange={handleLevelChange}
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
                  name="description"
                  placeholder="Description"
                  value={form.description}
                  onChange={handleLevelChange}
                  className="w-full border rounded p-2"
                  required
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col>
             <FormGroup>
             <Button 
             style={{background:"#004080" , color:'#fff'}}
            //  color="primary"
              outline 
              typeof="submit">Add Level</Button>
             </FormGroup>
            </Col>
          </Row>
        </Form>
      </>
    );
  }


export default PayLevel;