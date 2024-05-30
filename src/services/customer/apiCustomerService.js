import axiosInstance from '../../axiosConfig';

export const getCustomers = () => {
    //const res = axiosInstance.get('/customers').then(res=>{console.log('getCustomers:', res)})
  return axiosInstance.get('/customers');
};

export const getCustomerById = (id) => {    
  return axiosInstance.get(`/customers/${id}`);
};

export const createCustomer = (customer) => {
  return axiosInstance.post(`/customers`, customer);
};

export const updateCustomer = (id, customer) => {
  return axiosInstance.put(`/customers/${id}`, customer);
};

export const deleteCustomer = (id) => {
  return axiosInstance.delete(`/customers/${id}`);
};
