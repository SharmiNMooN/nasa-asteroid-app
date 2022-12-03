import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const Home = () => {
  const [asteroid, setAsteroid] = useState(null);

  const neowFeed = (startDate, endDate) => {
    const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=evpVefJ271MoTyw6Sc2oMZgxk1VS01LbeszZjfcy`;

    fetch(url, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Astroid data ", data);

        const radarData = [];

        const radarLevel = Object.keys(data.near_earth_objects);

        radarLevel.map((date) =>
          radarData.push(data.near_earth_objects[date].length)
        );
        const payload = {
          labels: radarLevel,
          datasets: [
            {
              label: "# Asteroid",
              data: radarData,
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              borderColor: "rgba(255, 99, 132, 1)",
              borderWidth: 1,
            },
          ],
        };
        console.log(radarLevel, radarData);
        setAsteroid(payload);
      })
      .catch((error) => console.log(error));
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    let startDate = form.startDate.value;
    let endDate = form.endDate.value;
    startDate = new Date(startDate)
      .toLocaleDateString()
      .split("/")
      .reverse()
      .join("-");

    endDate = new Date(endDate)
      .toLocaleDateString()
      .split("/")
      .reverse()
      .join("-");

    console.log(startDate, endDate);
    neowFeed(startDate, endDate);
  };
  return (
    <div>
      <Card className="mb-2 d-flex justify-content-center" border="warning">
        <Card.Body>
          <Card.Title className="fw-bold text-warning">{}</Card.Title>

          <Form onSubmit={handleSubmit} className=" d-flex m-auto">
            <Form.Group
              className="me-4 w-25 text-dark"
              controlId="formstartDate"
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

            <Form.Group className="me-4 w-25 text-dark" controlId="formendDate">
              <Form.Label>End Date</Form.Label>
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
          {asteroid ? <Radar className="w-50 h-50" data={asteroid} /> : ""}
        </Card.Body>
      </Card>
    </div>
  );
};

export default Home;
