import { useStore } from 'vuex';
import {
  Company,
} from '@/hooks/useCompanies';
import { UserRole } from '@/hooks/useUser';
import { ApiResponse, ListingRequestSource, ListingResponse } from '@/store/modules/api';

export enum EmployeeRole {
  manager = 'manager',
  employee = 'employee',
  guest = 'guest',
  owner = 'owner',
  admin = 'admin'
}

export enum EmployeePosition {
}

export type Employee = {
  id: number;
  email: string;
  user_phone: string;
  first_name: string;
  last_name: string;
  linked_companies: Array<Company['id']>;
  is_deletable: boolean;
  is_demo: boolean;
  is_active: boolean;
  user_role: UserRole;
  employee_role: EmployeeRole;
  position_name: string;
  position: EmployeePosition | null;
  is_me: boolean;

  company_id: Company['id'];
}

export type FetchEmployeesModel = ListingRequestSource<Employee>;
export type FetchEmployeesResponse = ListingResponse<Employee>;

export type FetchEmployeeModel = {id: Employee['id']; companyId: Company['id']};
export type FetchEmployeeResponse = Employee;

export type RemoveEmployeeModel = {
  id: Employee['id'];
  companyId: Company['id'];
}

export type RemoveEmployeeResponse = null;

export type UpdateEmployeeModel = {
  id: Employee['id'];
  payload: Partial<Employee>;
  companyId: Company['id'];
}

export type UpdateEmployeeResponse = Employee;

export type CreateEmployeeModel = Partial<Employee>;

export type CreateEmployeeResponse = Employee;

export type AddEmployeeModel = {
  id: Employee['id'];
  payload: Employee;
  companyId: Company['id'];
}

export type AddEmployeeResponse = Employee;

export const useEmployees = () => {
  const store = useStore();

  const fetchEmployees = async (
    model: FetchEmployeesModel,
  ): Promise<ApiResponse<FetchEmployeesResponse>> => {
    const { status, response } = await store.dispatch('employees/fetchEmployees', model);

    return { status, response };
  };

  const fetchEmployee = async (
    model: FetchEmployeeModel,
  ): Promise<ApiResponse<FetchEmployeeResponse>> => {
    const { status, response } = await store.dispatch('employees/fetchEmployee', model);

    return { status, response };
  };

  const removeEmployee = async (
    payload: RemoveEmployeeModel,
  ): Promise<ApiResponse<RemoveEmployeeResponse>> => {
    const { status, response } = await store.dispatch('employees/removeEmployee', payload);

    return { status, response };
  };

  const updateEmployee = async (
    model: UpdateEmployeeModel,
  ): Promise<ApiResponse<UpdateEmployeeResponse>> => {
    const { status, response } = await store.dispatch('employees/updateEmployee', model);

    return { status, response };
  };

  const createEmployee = async (
    model: CreateEmployeeModel,
  ): Promise<ApiResponse<CreateEmployeeResponse>> => {
    const { status, response } = await store.dispatch('employees/createEmployee', model);

    return { status, response };
  };

  return {
    fetchEmployees,
    fetchEmployee,
    removeEmployee,
    updateEmployee,
    createEmployee,
  };
};
