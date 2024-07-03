import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Employee {
    _id: ID!
    name: String
    position: String
    department: String
    salary: Float
    hireDate: String
  }

  type Query {
    getEmployees: [Employee]
    getEmployee(id: ID!): Employee
    filterEmployees(id: ID, position: String, hireDate: String, department: String): [Employee]
  }

  type Mutation {
    addEmployee(name: String, position: String, department: String, salary: Float, hireDate: String): Employee
    updateEmployee(id: ID!, name: String, position: String, department: String, salary: Float, hireDate: String): Employee
    deleteEmployee(id: ID!): Employee
  }
`;

export default typeDefs;
