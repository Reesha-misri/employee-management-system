import { useState, useEffect } from "react";

function App() {

  const [employees, setEmployees] = useState([]);
  const [designations, setDesignations] = useState([]);

  const [formData, setFormData] = useState({
    employee_id: "",
    full_name: "",
    department_name: "",
    designation_id: "",
    communication_address: "",
    permanent_address: ""
  });

  const [editId, setEditId] = useState(null);

  // 🔹 Fetch employees
  const fetchEmployees = async () => {
    const res = await fetch("http://localhost:3001/employees");
    const data = await res.json();
    setEmployees(data);
  };

  // 🔹 Fetch designations
  const fetchDesignations = async () => {
    const res = await fetch("http://localhost:3001/designations");
    const data = await res.json();
    setDesignations(data);
  };

  useEffect(() => {
    fetchEmployees();
    fetchDesignations();
  }, []);

  // 🔹 Handle input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔹 Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editId) {

      await fetch(`http://localhost:3001/update-employee/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      setEditId(null);

    } else {

      await fetch("http://localhost:3001/add-employee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

    }

    setFormData({
      employee_id: "",
      full_name: "",
      department_name: "",
      designation_id: "",
      communication_address: "",
      permanent_address: ""
    });

    fetchEmployees();
  };

  // 🔹 Delete employee
  const deleteEmployee = async (id) => {
    await fetch(`http://localhost:3001/delete-employee/${id}`, {
      method: "DELETE"
    });

    fetchEmployees();
  };

  // 🔹 Edit employee
  const editEmployee = (emp) => {

    const designation = designations.find(
      (d) => d.designation_title === emp.designation_title
    );

    setEditId(emp.employee_id);

    setFormData({
      employee_id: emp.employee_id,
      full_name: emp.full_name,
      department_name: emp.department_name,
      designation_id: designation ? designation.designation_id : "",
      communication_address: emp.communication_address,
      permanent_address: emp.permanent_address
    });

  };

  return (
    <div style={{ padding: "20px" }}>

      <h2>{editId ? "Update Employee" : "Add Employee"}</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          name="employee_id"
          placeholder="Employee ID"
          value={formData.employee_id}
          onChange={handleChange}
        />

        <input
          type="text"
          name="full_name"
          placeholder="Full Name"
          value={formData.full_name}
          onChange={handleChange}
        />

        <input
          type="text"
          name="department_name"
          placeholder="Department"
          value={formData.department_name}
          onChange={handleChange}
        />

        {/* 🔹 Designation Dropdown */}
        <select
          name="designation_id"
          value={formData.designation_id}
          onChange={handleChange}
        >
          <option value="">Select Designation</option>

          {designations.map((des) => (
            <option key={des.designation_id} value={des.designation_id}>
              {des.designation_title}
            </option>
          ))}

        </select>

        <input
          type="text"
          name="communication_address"
          placeholder="Communication Address"
          value={formData.communication_address}
          onChange={handleChange}
        />

        <input
          type="text"
          name="permanent_address"
          placeholder="Permanent Address"
          value={formData.permanent_address}
          onChange={handleChange}
        />

        <button type="submit">
          {editId ? "Update Employee" : "Add Employee"}
        </button>

      </form>


      <h2>Employee List</h2>

      <table border="1" cellPadding="10">

        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Department</th>
            <th>Designation</th>
            <th>Communication Address</th>
            <th>Permanent Address</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>

        <tbody>

          {employees.map((emp) => (
            <tr key={emp.employee_id}>

              <td>{emp.employee_id}</td>
              <td>{emp.full_name}</td>
              <td>{emp.department_name}</td>
              <td>{emp.designation_title}</td>
              <td>{emp.communication_address}</td>
              <td>{emp.permanent_address}</td>

              <td>
                <button onClick={() => editEmployee(emp)}>Edit</button>
              </td>

              <td>
                <button onClick={() => deleteEmployee(emp.employee_id)}>
                  Delete
                </button>
              </td>

            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
}

export default App;