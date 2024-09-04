import axios from "axios";
import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useParams } from "react-router-dom";

export default function GetSingleUser() {
  const { id } = useParams();

  const [employee, setEmployee] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/employees/${id}`)
      .then((response) => {
        if (response.data && response.data.length > 0) {
          setEmployee(response.data[0]);
        } else {
          setError("No data found for the given ID");
        }
      })
      .catch((error) => {
        setError(error.message);
      });
  }, [id]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Container>
      <h2>Employee Information</h2>
      <p>Employee ID: {employee.id}</p>
      <p>First Name: {employee.firstName}</p>
      <p>Last Name: {employee.lastName}</p>
      <p>Mobile: {employee.mobile}</p>
      <p>Permanent Street No: {employee.permanentStreetNo}</p>
      <p>Permanent City: {employee.permanentCity}</p>
      <p>Permanent State: {employee.permanentState}</p>
      <p>Permanent Country: {employee.permanentPinCode}</p>

      <p>Permanent Street: {employee.presentStreetNo}</p>
      <p>Permanent City: {employee.presentCity}</p>
      <p>Permanent State: {employee.presentState}</p>
      <p>Permanent Country: {employee.presentPinCode}</p>
    </Container>
  );
}
