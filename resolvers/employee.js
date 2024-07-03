import Employee from '../models/employee.js';
import { ApolloError } from 'apollo-server-express';

const resolvers = {
  Query: {
    async getEmployees() {
      try {
        const employees = await Employee.find();
        return employees.map(employee => ({
          ...employee._doc,
          name: employee.name || 'Nombre predeterminado',
        }));
      } catch (error) {
        throw new ApolloError('Error al obtener los empleados');
      }
    },
    async getEmployee(parent, { id }) {
      try {
        const employee = await Employee.findById(id);
        if (!employee) throw new ApolloError('Empleado no encontrado');
        return {
          ...employee._doc,
          name: employee.name || 'Nombre predeterminado',
        };
      } catch (error) {
        throw new ApolloError('Error al obtener el empleado');
      }
    },
    async filterEmployees(parent, args) {
      const filter = {};

      if (args.id) filter._id = args.id;
      if (args.position) filter.position = { $regex: args.position, $options: 'i' };
      if (args.hireDate) filter.hireDate = args.hireDate;
      if (args.department) filter.department = { $regex: args.department, $options: 'i' };

      try {
        const employees = await Employee.find(filter);
        return employees.map(employee => ({
          ...employee._doc,
          name: employee.name || 'Nombre predeterminado',
        }));
      } catch (error) {
        throw new ApolloError('Error al filtrar empleados');
      }
    }
  },
  Mutation: {
    async addEmployee(parent, args) {
      if (new Date(args.hireDate) > new Date()) {
        throw new ApolloError('La fecha de contratación no puede ser mayor a la fecha actual');
      }
      try {
        const newEmployee = new Employee(args);
        return await newEmployee.save();
      } catch (error) {
        throw new ApolloError('Error al agregar el empleado');
      }
    },
    async updateEmployee(parent, { id, ...args }) {
      if (args.hireDate && new Date(args.hireDate) > new Date()) {
        throw new ApolloError('La fecha de contratación no puede ser mayor a la fecha actual');
      }
      try {
        const updatedEmployee = await Employee.findByIdAndUpdate(id, args, { new: true });
        if (!updatedEmployee) throw new ApolloError('Empleado no encontrado');
        return updatedEmployee;
      } catch (error) {
        throw new ApolloError('Error al actualizar el empleado');
      }
    },
    async deleteEmployee(parent, { id }) {
      try {
        const deletedEmployee = await Employee.findByIdAndRemove(id);
        if (!deletedEmployee) throw new ApolloError('Empleado no encontrado');
        return deletedEmployee;
      } catch (error) {
        throw new ApolloError('Error al eliminar el empleado');
      }
    }
  }
};

export default resolvers;
