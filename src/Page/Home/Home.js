import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Line } from "react-chartjs-2";

import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  CategoryScale,
  LinearScale,
  Title,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";
import { Col, Row } from "react-bootstrap";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Home = () => {
  const [asteroid, setAsteroid] = useState(null);
  const [lineData, setLineData] = useState(null);
  const [fastestAsteroidInKMH, setFastestAsteroidInKMH] = useState(null);
  const [avgSizeOfAsteroidInKM, setAvgSizeOfAsteroidInKM] = useState(null);
  const [closestAsteroid, setClosestAsteroid] = useState(null);
  const [asteroidCount, setAsteroidCount] = useState(0);

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Asteroid Data",
      },
    },
  };

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
        setAsteroidCount(data.element_count);
        const radarData = [];

        const radarLevel = Object.keys(data.near_earth_objects);
        const LineLabels = Object.keys(data.near_earth_objects);

        const asteroidMap = [];

        LineLabels.map((date) => {
          const earthObj = data.near_earth_objects[date];
          earthObj.map((obj) => {
            const { close_approach_data, estimated_diameter } = obj;

            const { kilometers_per_hour } =
              close_approach_data[0].relative_velocity;
            const { kilometers } = close_approach_data[0].miss_distance;
            const { estimated_diameter_max } = estimated_diameter?.kilometers;
            asteroidMap.push({
              id: obj.id,
              date,
              kilometers_per_hour: Number(kilometers_per_hour),
              estimated_diameter_max: Number(estimated_diameter_max),
              closest_kilometers: Number(kilometers),
            });
          });
        });

        asteroidMap.sort((x, y) => {
          if (x.kilometers_per_hour > y.kilometers_per_hour) {
            return 1;
          }
          if (x.kilometers_per_hour < y.kilometers_per_hour) {
            return -1;
          }
          return 0;
        });

        setAvgSizeOfAsteroidInKM(
          asteroidMap.reduce(
            (acc, curr) => acc + curr.estimated_diameter_max,
            0
          ) / asteroidCount
        );

        setFastestAsteroidInKMH(
          data.near_earth_objects[
            asteroidMap[asteroidMap.length - 1].date
          ].find((item) => (item.id = asteroidMap[asteroidMap.length - 1].date))
        );

        asteroidMap.sort((x, y) => {
          if (x.closest_kilometers > y.closest_kilometers) {
            return 1;
          }
          if (x.closest_kilometers < y.closest_kilometers) {
            return -1;
          }
          return 0;
        });

        setFastestAsteroidInKMH(
          data.near_earth_objects[
            asteroidMap[asteroidMap.length - 1].date
          ].find((item) => (item.id = asteroidMap[asteroidMap.length - 1].date))
        );
        setClosestAsteroid(
          data.near_earth_objects[asteroidMap[0].date].find(
            (item) => (item.id = asteroidMap[0].date)
          )
        );

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

        const dataSet = [
          {
            label: "Neo Data",
            data: LineLabels.map(
              (date) => data.near_earth_objects[date].length
            ),
            borderColor: "rgb(255, 99, 132)",
            backgroundColor: "rgba(255, 99, 132, 0.5)",
          },
        ];

        const _lineData = {
          labels: LineLabels,
          datasets: dataSet,
        };
        setLineData(_lineData);
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
          <Card.Title className="fw-bold text-center h1 text-warning">
            Asteroid - Neo Stats
          </Card.Title>

          <div>
            <Form
              onSubmit={handleSubmit}
              className=" d-flex justify-content-center"
            >
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

              <Form.Group
                className="me-4 w-25 text-dark"
                controlId="formendDate"
              >
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
                  variant="warning"
                  className="border-4  border-white mt-2"
                  type="submit"
                >
                  Submit
                </Button>
              </div>
            </Form>
          </div>
          <Row>
            <Col>
              {asteroid ? <Radar className="m-auto" data={asteroid} /> : ""}
            </Col>
            <Col>
              {asteroid ? (
                <Line
                  className="m-auto"
                  options={lineOptions}
                  data={lineData}
                />
              ) : (
                ""
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {fastestAsteroidInKMH ? (
        <div>
          <Row>
            <Col>
              <Card className="mb-2 d-flex justify-content-center">
                <Card.Body>
                  <Card.Title className="fw-bold">Fastest Asteroid</Card.Title>

                  <Card.Text>
                    Asteroid name: {fastestAsteroidInKMH.name}
                  </Card.Text>
                  <Card.Text>
                    Asteroid Size:
                    {
                      fastestAsteroidInKMH.estimated_diameter.kilometers
                        .estimated_diameter_max
                    }{" "}
                    kilometers
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card className="mb-2 d-flex justify-content-center">
                <Card.Body>
                  <Card.Title className="fw-bold">
                    Average size of asteroid
                  </Card.Title>

                  <Card.Text>
                    Average size: {avgSizeOfAsteroidInKM} kilometers
                  </Card.Text>
                  <Card.Text>Total Asteroid: {asteroidCount}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              {" "}
              <Card className="mb-2 d-flex justify-content-center">
                <Card.Body>
                  <Card.Title className="fw-bold">Closest Asteroid</Card.Title>

                  <Card.Text>Name: {closestAsteroid.name}</Card.Text>
                  <Card.Text>
                    Distance:{" "}
                    {
                      closestAsteroid.close_approach_data[0].miss_distance
                        .kilometers
                    }{" "}
                    kilometers
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Home;
