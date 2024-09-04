import React, { useEffect, useState } from "react";
import { Table, Button, Container, Modal, Form } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import axios from "axios";

export default function ListOfAllEmp(employee) {
  const location = useLocation();
  const employees = location.state?.employees;
  // console.log(employee);
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [roleNames, setRoleNames] = useState([]);
  const [department, setDepartment] = useState([]);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [selectedManagerId, setSelectedManagerId] = useState("");
  const [selectedHierarchyLevel, setSelectedHierarchyLevel] = useState("");
  const [selectedManager, setSelectedManager] = useState([]);
  const [selectedDepartmentName, setSelectedDepartmentName] = useState(" ");
  const [selectedRoleName, setSelectedRoleName] = useState("");
  const [selectedManagerName, setSelectedManagerName] = useState("");

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);

    // console.log(employee);
    // console.log(employee.dept, );
    setSelectedEmployeeId(employee.id);
    // console.log(selectedEmployeeId);
    // console.log(employee.hierarchy);
    // console.log(employee.roleId);
    if (employee.deptId) {
      setSelectedDepartmentId(employee.deptId);
      handleRoleNames(employee.deptId);
      if (employee.roleId) {
        setSelectedRoleId(employee.roleId);
        handleGetManagers(employee.deptId, employee.roleId);
      }
      if (employee.manager) {
        setSelectedManagerId(employee.manager);
      }
      // console.log(employee.manager);
    } else {
      setSelectedDepartmentId("");
    }

    if (!employee.roleId) {
      setSelectedRoleId("");
    }

    if (!employee.manager) {
      setSelectedManagerId("");
    }

    setShowModal(true);
  };

  const handleUpdate = async (
    selectedEmployee,
    selectedDepartmentId,
    selectedRoleId,
    selectedHierarchyLevel
  ) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/api/updateEmp/${selectedEmployee}/${selectedDepartmentId}/${selectedRoleId}/${selectedHierarchyLevel}`
      );
      // console.log(response.data);
      if (response.data) {
        console.log(response.data);
      } else {
        console.log("no data");
      }
    } catch (err) {
      console.error(err);
    }
    setShowModal(false);
  };

  useEffect(() => {
    handleGetDepartment();
  }, []);

  // useEffect(() => {
  //   if (selectedDepartmentId) {
  //     handleRoleNames(selectedDepartmentId);
  //   }
  // }, [selectedRoleId, selectedDepartmentId]);

  const handleUpdateFunction = () => {
    // const updateApi = {
    //   employee.id,
    //   selectedDepartmentId,
    //   selectedRoleId,
    //   selectedHierarchyLevel,
    // };
    console.log(
      selectedEmployeeId,
      parseInt(selectedDepartmentId),
      parseInt(selectedRoleId),
      selectedHierarchyLevel
    );
    // if(hierarchyLevel)
    handleUpdate(
      selectedEmployeeId,
      selectedDepartmentId,
      parseInt(selectedRoleId),
      selectedHierarchyLevel
    );
  };

  // useEffect(() => {
  //   // console.log(selectedDepartmentId);
  //   console.log("this" + selectedHierarchyLevel);
  //   handleGetManagers(selectedDepartmentId, selectedHierarchyLevel);
  // }, [
  //   selectedDepartmentId,
  //   selectedHierarchyLevel,
  //   selectedHierarchyLevel,
  //   selectedEmployee,
  // ]);

  const handleRoleNames = async (depId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/roles/${depId}`
      );
      if (response.data) {
        const rolesData = response.data.map((role) => ({
          id: role.id,
          name: role.name,
          hierarchyLevel: role.hierarchyLevel,
        }));
        setRoleNames(rolesData);
      } else {
        console.log(`Department with ID ${depId} not found`);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleGetManagers = async (depId, hierarchyLevel) => {
    // console.log(depId, hierarchyLevel);
    try {
      const response = await axios.get(
        `http://localhost:3000/api/manager/${depId}/${hierarchyLevel}`
      );
      if (response.data) {
        setSelectedManager(response.data);
        // console.log(response.data);
      } else {
        console.log("no data");
      }
    } catch (err) {
      if (err.response.status === 404) {
        console.log("Manager not found");
      } else {
        console.error(err);
      }
    }
  };

  const handleGetDepartment = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/departments");
      const departmentData = response.data.map((dept) => ({
        id: dept.id,
        name: dept.departName,
      }));
      // console.log(departmentData);
      setDepartment(departmentData);
    } catch (err) {
      console.error(err);
    }
  };

  const handleManagerChange = (e) => {
    setSelectedManagerId(e.target.value);
  };

  const handleDepartmentChange = (e) => {
    // console.log(selectedDepartmentId);
    setSelectedDepartmentId(e.target.value);
    handleRoleNames(e.target.value);
    handleGetManagers(e.target.value, "");
  };

  const handleRoleChange = (e) => {
    const selectedRoleId = e.target.value;
    const selectedRole = roleNames.filter(
      (role) => role.id === parseInt(selectedRoleId)
    );
    if (selectedRole.length > 0) {
      const hierarchyLevel = selectedRole[0].hierarchyLevel;
      // console.log("Hl" + hierarchyLevel); // logs the hierarchyLevel of the selected role
      handleGetManagers(selectedDepartmentId, hierarchyLevel);
      setSelectedHierarchyLevel(hierarchyLevel);
    } else {
      console.log("Role not found");
    }
    setSelectedRoleId(selectedRoleId);
    console.log(selectedRoleId);

    // Use the memoized handleGetManagers function
  };

  const handleDeactivate = async (employee) => {
    setSelectedEmployee(employee);
    try {
      await axios.put(
        `http://localhost:3000/api/deactivate/${selectedEmployee?.id}`,
        {
          onAdmin: false,
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  const fetchEmployeeDetails = async (employeeId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/getNames/${employeeId}`
      );
      const data = response.data;
      const departmentName = data.department.name;
      const roleName = data.role.name;
      const managerName = data.manager.name;
      setSelectedDepartmentName(departmentName);
      console.log(departmentName);
      setSelectedRoleName(roleName);
      setSelectedManagerName(managerName);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Container className="mt-5 mb-5">
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Emp Code</th>
            <th>Full Name</th>
            <th>Mobile</th>
            <th>Department:</th>
            <th>Role:</th>
            <th>Manager:</th>
            <th>Action:</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee, index) => (
            <tr key={index}>
              <td>{employee.id}</td>
              <td>
                <Button
                  variant="link"
                  onClick={() => {
                    window.location.href = `/GetSingleUser/${employee.id}`;
                  }}
                >
                  {employee.firstName} {employee.lastName}
                </Button>
              </td>
              <td>{employee.mobile}</td>
              <td>{employee.deptName}</td>
              <td>{employee.roleName}</td>
              <td>{employee.managerName}</td>
              <td>
                <Button
                  variant="primary"
                  size="sm"
                  className="mr-5"
                  onClick={() => handleEdit(employee)}
                >
                  Edit Employee
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  className="ml-5"
                  onClick={() => handleDeactivate(employee)}
                >
                  Deactivate
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Employee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="departmentId">
              <Form.Label>Department </Form.Label>
              <Form.Control
                as="select"
                // value={employee.deptId || selectedDepartmentId}
                value={selectedDepartmentId}
                onChange={handleDepartmentChange}
              >
                {/* <option value="" disabled hidden>
                  {selectedDepartmentName
                    ? selectedDepartmentName
                    : "Select Department"}
                </option> */}

                <option key="" value="">
                  Select Department
                </option>
                {department.map((d, index) => (
                  <option
                    key={index}
                    value={d.id}
                    // selected={d.name === selectedDepartmentName}
                  >
                    {/* {selectedDepartmentId ? d.name : "Select Department"} */}
                    {d.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="roleId">
              <Form.Label>Role</Form.Label>
              <Form.Control
                as="select"
                value={selectedRoleId}
                onChange={handleRoleChange}
              >
                <option key="" value="" disabled hidden>
                  select Role
                </option>
                {roleNames.map((r, index) => (
                  <option key={index} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="managerId">
              <Form.Label>Manager</Form.Label>
              <Form.Control
                as="select"
                value={selectedManagerId}
                onChange={handleManagerChange}
              >
                <option value="" key="" disabled hidden>
                  Select Manager
                </option>
                {selectedManager.map((r, index) => (
                  <option key={index} value={r.id}>
                    {r.hierarchy} - {r.EmpName}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdateFunction}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
