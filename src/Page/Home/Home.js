import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const Home = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    const startDate = form.startDate.value;
    const endDate = form.endDate.value;
    console.log(startDate, endDate);
  };
  return (
    <div>
      <Card className="mb-2" border="warning">
        <Card.Body>
          <Card.Title className="fw-bold text-warning">{}</Card.Title>

          <Form onSubmit={handleSubmit} className=" d-flex m-auto">
            <Form.Group
              className="me-4 w-25 text-white"
              controlId="formBasicEmail"
            >
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                name="startDate"
                type="date"
                className="border-4 border-dark"
                placeholder="Start Date"
                required
              />
            </Form.Group>

            <Form.Group
              className="me-4 w-25 text-white"
              controlId="formBasicPassword"
            >
              <Form.Label>endDate</Form.Label>
              <Form.Control
                name="endDate"
                type="date"
                placeholder="End Date"
                className="border-4 border-dark"
                required
              />
            </Form.Group>

            <div className="w-25 mt-4">
              <Button
                variant="light"
                className="border-4  border-dark mt-2"
                type="submit"
              >
                Submit
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Home;
