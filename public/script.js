async function fetchAllEmployees() {
    const query = `
      query {
        getEmployees {
          _id
          name
          position
          department
          salary
          hireDate
        }
      }
    `;
  
    try {
      const response = await fetch('/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });
  
      const result = await response.json();
      if (result.errors) {
        throw new Error(result.errors[0].message);
      }
  
      displayEmployees(result.data.getEmployees);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  }
  
  function displayEmployees(employees) {
    const tableBody = document.querySelector('#employees tbody');
    tableBody.innerHTML = '';
  
    employees.forEach(employee => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${employee._id}</td>
        <td>${employee.name}</td>
        <td>${employee.position}</td>
        <td>${employee.department}</td>
        <td>${employee.salary}</td>
        <td>${formatDate(employee.hireDate)}</td>
        <td>
          <button class="btn btn-sm btn-info" onclick="editEmployee('${employee._id}')">Edit</button>
          <button class="btn btn-sm btn-danger" onclick="deleteEmployee('${employee._id}')">Delete</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  }
  
  function formatDate(dateString) {
    if (!dateString) return '';
  
    const date = new Date(parseInt(dateString));
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
  
  async function addEmployee() {
    const name = document.getElementById('newEmployeeName').value;
    const position = document.getElementById('newEmployeePosition').value;
    const department = document.getElementById('newEmployeeDepartment').value;
    const salary = parseFloat(document.getElementById('newEmployeeSalary').value);
    const hireDate = document.getElementById('newEmployeeHireDate').value;
  
    if (new Date(hireDate) > new Date()) {
      alert('Hire date cannot be in the future');
      return;
    }
  
    const mutation = `
      mutation {
        addEmployee(name: "${name}", position: "${position}", department: "${department}", salary: ${salary}, hireDate: "${hireDate}") {
          _id
          name
          position
          department
          salary
          hireDate
        }
      }
    `;
  
    try {
      const response = await fetch('/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: mutation }),
      });
  
      const result = await response.json();
      if (result.errors) {
        throw new Error(result.errors[0].message);
      }
  
      alert('Employee added successfully');
      document.getElementById('addEmployeeForm').reset();
      fetchAllEmployees();
    } catch (error) {
      console.error('Error adding employee:', error);
    }
  }
  
  async function editEmployee(id) {
    const query = `
      query {
        getEmployee(id: "${id}") {
          _id
          name
          position
          department
          salary
          hireDate
        }
      }
    `;
  
    try {
      const response = await fetch('/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });
  
      const result = await response.json();
      if (result.errors) {
        throw new Error(result.errors[0].message);
      }
  
      const employee = result.data.getEmployee;
  
      document.getElementById('editEmployeeId').value = employee._id;
      document.getElementById('editEmployeeName').value = employee.name;
      document.getElementById('editEmployeePosition').value = employee.position;
      document.getElementById('editEmployeeDepartment').value = employee.department;
      document.getElementById('editEmployeeSalary').value = employee.salary;
      document.getElementById('editEmployeeHireDate').value = formatDate(employee.hireDate);
  
      document.getElementById('addEmployeeContainer').style.display = 'none';
      document.getElementById('editEmployeeContainer').style.display = 'block';
    } catch (error) {
      console.error('Error fetching employee:', error);
    }
  }
  
  async function updateEmployee() {
    const id = document.getElementById('editEmployeeId').value;
    const name = document.getElementById('editEmployeeName').value;
    const position = document.getElementById('editEmployeePosition').value;
    const department = document.getElementById('editEmployeeDepartment').value;
    const salary = parseFloat(document.getElementById('editEmployeeSalary').value);
    const hireDate = document.getElementById('editEmployeeHireDate').value;
  
    if (new Date(hireDate) > new Date()) {
      alert('Hire date cannot be in the future');
      return;
    }
  
    const mutation = `
      mutation {
        updateEmployee(id: "${id}", name: "${name}", position: "${position}", department: "${department}", salary: ${salary}, hireDate: "${hireDate}") {
          _id
          name
          position
          department
          salary
          hireDate
        }
      }
    `;
  
    try {
      const response = await fetch('/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: mutation }),
      });
  
      const result = await response.json();
      if (result.errors) {
        throw new Error(result.errors[0].message);
      }
  
      alert('Employee updated successfully');
      document.getElementById('editEmployeeForm').reset();
      document.getElementById('editEmployeeContainer').style.display = 'none';
      document.getElementById('addEmployeeContainer').style.display = 'block';
      fetchAllEmployees();
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  }
  
  async function deleteEmployee(id) {
    const mutation = `
      mutation {
        deleteEmployee(id: "${id}") {
          _id
        }
      }
    `;
  
    try {
      const response = await fetch('/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: mutation }),
      });
  
      const result = await response.json();
      if (result.errors) {
        throw new Error(result.errors[0].message);
      }
  
      alert('Employee deleted successfully');
      fetchAllEmployees();
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  }
  
  function cancelEdit() {
    document.getElementById('editEmployeeForm').reset();
    document.getElementById('editEmployeeContainer').style.display = 'none';
    document.getElementById('addEmployeeContainer').style.display = 'block';
  }
  
  async function filterEmployees() {
    const filterType = document.getElementById('filterType').value;
    const filterValue = document.getElementById('filterValue').value;
  
    let filterCriteria = `${filterType}: "${filterValue}"`;
    if (filterType === 'id') {
      filterCriteria = `_id: "${filterValue}"`;
    } else if (filterType === 'hireDate') {
      
    } else if (filterType === 'department') {
      filterCriteria = `department: "${filterValue}"`;
    }
  
    const query = `
      query {
        filterEmployees(${filterCriteria}) {
          _id
          name
          position
          department
          salary
          hireDate
        }
      }
    `;
  
    try {
      const response = await fetch('/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });
  
      const result = await response.json();
      if (result.errors) {
        throw new Error(result.errors[0].message);
      }
  
      displayEmployees(result.data.filterEmployees);
    } catch (error) {
      console.error('Error filtering employees:', error);
    }
  }
  
  function resetFilters() {
    document.getElementById('filterValue').value = '';
    fetchAllEmployees();
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    fetchAllEmployees();
  });
  