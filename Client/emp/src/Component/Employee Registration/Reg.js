import React, { useState } from "react";
import {
  Alert,
  Button,
  ButtonGroup,
  Col,
  Container,
  Dropdown,
  DropdownButton,
  Form,
  FormControl,
  FormGroup,
  Modal,
  Row,
} from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Reg() {
  // Naming UseState
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [dateOfJoining, setDateOfJoining] = useState("");
  const [gender, setGender] = useState("");
  const [personalEmail, setPersonalEmail] = useState("");
  const [officeEmail, setOfficeEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [panNo, setPanNo] = useState("");
  const [aadharNo, setAadharNo] = useState("");

  const [presentStreetNo, setPresentStreetNo] = useState("");
  const [presentCity, setPresentCity] = useState("");
  const [presentPincode, setPresentPincode] = useState("");
  const [presentState, setPresentState] = useState("");

  const [permanentStreetNo, setPermanentStreetNo] = useState("");
  const [permanentCity, setPermanentCity] = useState("");
  const [permanentPincode, setPermanentPincode] = useState("");
  const [permanentState, setPermanentState] = useState("");
  const [show, setShow] = useState(false);
  /* Error Handling */
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [dateOfBirthError, setDateOfBirthError] = useState(false);
  const [dateOfJoiningError, setDateOfJoiningError] = useState(false);
  const [genderError, setGenderError] = useState(false);
  const [personalEmailError, setPersonalEmailError] = useState(false);
  const [officeEmailError, setOfficeEmailError] = useState(false);
  const [mobileError, setMobileError] = useState(false);
  const [panNoError, setPanNoError] = useState(false);
  const [aadharNoError, setAadharNoError] = useState(false);

  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();
  ////////////////////

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;
    else {
      //   ShowAlert(true);
      event.preventDefault();
      setShow(true);
      const userData = {
        firstName: firstName,
        lastName: lastName,
        password: password,
        gender: gender,
        dateOfBirth: dateOfBirth,
        dateOfJoining: dateOfJoining,
        personalEmail: personalEmail,
        officeEmail: officeEmail,
        mobile: mobile,
        panNo: panNo,
        aadharNo: aadharNo,
        presentAddress: {
          streetNo: presentStreetNo,
          city: presentCity,
          state: presentState,
          pinCode: presentPincode,
        },
        permanentAddress: {
          streetNo: permanentStreetNo,
          city: permanentCity,
          state: permanentState,
          pinCode: permanentPincode,
        },
      };

      // console.log(JSON.stringify(userData));
      try {
        const response = await axios.post(
          "http://localhost:3000/api/insert",
          userData
        );
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    console.log(personalEmail, officeEmail);
    try {
      await axios.post("http://localhost:3000/api/send", {
        personalEmail,
        officeEmail,
        firstName,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleGetAll = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:3000/api/getData");
      // console.log(res.data);

      setEmployees(res.data);
      navigate("/ListOfAllEmp", { state: { employees: res.data } });
      console.log(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSameAsPresentAddress = () => {
    setPermanentStreetNo(presentStreetNo);
    setPermanentCity(presentCity);
    setPermanentPincode(presentPincode);
    setPermanentState(presentState);
  };

  ////VALIDATE FORM ////////////////

  const validateForm = () => {
    let isValid = true;

    if (firstName.length < 1 || firstName.length > 50) {
      setFirstNameError(true);
      isValid = false;
    } else {
      setFirstNameError(false);
    }

    if (lastName.length < 1 || lastName.length > 50) {
      setLastNameError(true);
      isValid = false;
    } else {
      setLastNameError(false);
    }

    if (password.length < 8) {
      setPasswordError(true);
      isValid = false;
    } else {
      setPasswordError(false);
    }

    if (dateOfBirth === "") {
      setDateOfBirthError(true);
      isValid = false;
    } else {
      setDateOfBirthError(false);
    }

    if (dateOfJoining === "") {
      setDateOfJoiningError(true);
      isValid = false;
    } else {
      setDateOfJoiningError(false);
    }

    if (gender === "") {
      setGenderError(true);
      isValid = false;
    } else {
      setGenderError(false);
    }

    if (!personalEmail.includes("@") || !personalEmail.includes(".com")) {
      setPersonalEmailError(true);
      isValid = false;
    } else {
      setPersonalEmailError(false);
    }

    if (!officeEmail.includes("@") || !officeEmail.includes(".com")) {
      setOfficeEmailError(true);
      isValid = false;
    } else {
      setOfficeEmailError(false);
    }

    if (mobile.length < 10) {
      setMobileError(true);
      isValid = false;
    } else {
      setMobileError(false);
    }

    // if (!panNo.match(/^[A-Z]{5}[0-9]{4}$/)) {
    if (panNo.length < 5) {
      setPanNoError(true);
      isValid = false;
    } else {
      setPanNoError(false);
    }

    if (aadharNo.length < 12) {
      setAadharNoError(true);
      isValid = false;
    } else {
      setAadharNoError(false);
    }

    return isValid;
  };

  return (
    <Container>
      <Form>
        <center className="mb-5">
          <h1>Employee Registration Form</h1>
        </center>
        <Form.Group as={Row} controlId="firstName" className="mt-3">
          <Form.Label column sm={2}>
            First Name:
          </Form.Label>
          <Col>
            <Form.Control
              type="text"
              value={firstName}
              placeholder="Enter your firstName"
              onChange={(text) => setFirstName(text.target.value)}
            />
            {firstNameError && (
              <Form.Text className="text-danger">
                Name must be at least 5 characters
              </Form.Text>
            )}
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="formLastName" className="mt-3">
          <Form.Label column sm={2}>
            Last Name:
          </Form.Label>
          <Col>
            <Form.Control
              type="text"
              value={lastName}
              placeholder="Enter your lastName"
              onChange={(text) => setLastName(text.target.value)}
            />
            {lastNameError && (
              <Form.Text className="text-danger">
                Name must be at least 5 characters
              </Form.Text>
            )}
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="formPassword" className="mt-3">
          <Form.Label column sm={2}>
            Password:
          </Form.Label>
          <Col>
            <Form.Control
              type="password"
              value={password}
              placeholder="Enter your password"
              onChange={(text) => setPassword(text.target.value)}
            />
            {passwordError && (
              <Form.Text className="text-danger">
                Password must be at least 8 characters, contain at least one
                uppercase letter and one digit
              </Form.Text>
            )}
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="formDateOfBirth" className="mt-3">
          <Form.Label column sm={2}>
            Date of Birth:
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              type="date"
              name="dateOfBirth"
              value={dateOfBirth}
              placeholder="YYYY-MM-DD"
              onChange={(event) => setDateOfBirth(event.target.value)}
            />
            {dateOfBirthError && (
              <Form.Text className="text-danger">
                Please enter a valid Date of Birth
              </Form.Text>
            )}
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="formDateOfJoining" className="mt-3">
          <Form.Label column sm={2}>
            Date of Joining:
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              type="date"
              name="dateOfJoining"
              value={dateOfJoining}
              onChange={(event) => setDateOfJoining(event.target.value)}
            />
            {dateOfJoiningError && (
              <Form.Text className="text-danger">
                Please enter a valid Date of Joining
              </Form.Text>
            )}
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="formGender" className="mt-3">
          <Form.Label column sm={2}>
            Gender:
          </Form.Label>
          <Col sm={10}>
            <Form.Check
              type="radio"
              label="Male"
              name="gender"
              id="formGenderMale"
              value="male"
              checked={gender === "male"}
              onChange={(event) => setGender(event.target.value)}
            />
            <Form.Check
              type="radio"
              label="Female"
              name="gender"
              id="formGenderFemale"
              value="female"
              checked={gender === "female"}
              onChange={(event) => setGender(event.target.value)}
            />
            <Form.Check
              type="radio"
              label="Other"
              id="formGenderOther"
              name="gender"
              value="other"
              checked={gender === "other"}
              onChange={(event) => setGender(event.target.value)}
            />
            {genderError && (
              <Form.Text className="text-danger">
                Please select a Gender
              </Form.Text>
            )}
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="formPersonalEmail" className="mt-3">
          <Form.Label column sm={2}>
            Personal Email:
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              type="email"
              value={personalEmail}
              onChange={(event) => setPersonalEmail(event.target.value)}
              placeholder="Enter personal email"
            />
            {personalEmailError && (
              <Form.Text className="text-danger">
                Please enter a valid personal email
              </Form.Text>
            )}
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="formOfficeEmail" className="mt-3">
          <Form.Label column sm={2}>
            Office Email:
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              type="email"
              value={officeEmail}
              onChange={(event) => setOfficeEmail(event.target.value)}
              placeholder="Enter office email"
            />
            {officeEmailError && (
              <Form.Text className="text-danger">
                Please enter a valid office email
              </Form.Text>
            )}
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="formMobile" className="mt-3">
          <Form.Label column sm={2}>
            Mobile:
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              type="tel"
              value={mobile}
              onChange={(event) => setMobile(event.target.value)}
              placeholder="Enter mobile number"
            />
            {mobileError && (
              <Form.Text className="text-danger">
                Please enter a valid mobile number
              </Form.Text>
            )}
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="formPanNo" className="mt-3">
          <Form.Label column sm={2}>
            PAN No:
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              type="text"
              value={panNo}
              onChange={(event) => setPanNo(event.target.value)}
              placeholder="Enter PAN number"
            />
            {panNoError && (
              <Form.Text className="text-danger">
                Please enter a valid PAN number
              </Form.Text>
            )}
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="formAadharNo" className="mt-3">
          <Form.Label column sm={2}>
            Aadhar No:
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              type="text"
              value={aadharNo}
              onChange={(event) => setAadharNo(event.target.value)}
              placeholder="Enter Aadhar number"
            />
            {aadharNoError && (
              <Form.Text className="text-danger">
                Please enter a valid Aadhar number
              </Form.Text>
            )}
          </Col>
        </Form.Group>

        {/* Addresss */}

        <Form>
          <Form.Group as={Row} controlId="present-street-no" className="mt-3">
            <Form.Label column sm={2}>
              Present Street No:
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                type="text"
                value={presentStreetNo}
                onChange={(event) => setPresentStreetNo(event.target.value)}
                placeholder="Enter present street no"
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="present-city" className="mt-3">
            <Form.Label column sm={2}>
              Present City:
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                type="text"
                value={presentCity}
                onChange={(event) => setPresentCity(event.target.value)}
                placeholder="Enter present city"
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="present-pincode" className="mt-3">
            <Form.Label column sm={2}>
              Present Pincode:
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                type="text"
                value={presentPincode}
                onChange={(event) => setPresentPincode(event.target.value)}
                placeholder="Enter present pincode"
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="present-state" className="mt-3">
            <Form.Label column sm={2}>
              Present State:
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                type="text"
                value={presentState}
                onChange={(event) => setPresentState(event.target.value)}
                placeholder="Enter present state"
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="permanent-street-no" className="mt-3">
            <Form.Label column sm={2}>
              Permanent Street No:
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                type="text"
                value={permanentStreetNo}
                onChange={(event) => setPermanentStreetNo(event.target.value)}
                placeholder="Enter permanent street no"
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="permanent-city" className="mt-3">
            <Form.Label column sm={2}>
              Permanent City:
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                type="text"
                value={permanentCity}
                onChange={(event) => setPermanentCity(event.target.value)}
                placeholder="Enter permanent city"
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="permanent-pincode" className="mt-3">
            <Form.Label column sm={2}>
              Permanent Pincode:
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                type="text"
                value={permanentPincode}
                onChange={(event) => setPermanentPincode(event.target.value)}
                placeholder="Enter permanent pincode"
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="permanent-state" className="mt-3">
            <Form.Label column sm={2}>
              Permanent State:
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                type="text"
                value={permanentState}
                onChange={(event) => setPermanentState(event.target.value)}
                placeholder="Enter permanent state"
              />
            </Col>
          </Form.Group>{" "}
          <Button
            style={{ margin: "20px" }}
            variant="primary"
            onClick={handleSameAsPresentAddress}
          >
            Same as Present Address
          </Button>
        </Form>

        {/* <Button
              className="mt-3"
              onClick={handleSubmit}
              variant="primary"
              type="submit"
            >
              Submit
            </Button> */}
        <Row className="justify-content-md-center">
          <Col md="auto">
            <Button variant="primary" onClick={handleSubmit} className="me-3">
              Submit
            </Button>
            <Button onClick={handleGetAll} className="me-3">
              Get All Employees Data
            </Button>
          </Col>
        </Row>

        <Modal show={show} onHide={() => setShow(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Submission Successful</Modal.Title>
          </Modal.Header>
          <Modal.Body>Your data has been submitted successfully!</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShow(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Form>
    </Container>
  );
}
