import axiosInstance from '../../axiosConfig';

export const loginCustomer = (login) => {
    return axiosInstance.post(`/auth/login`, login);
};
export const registerCustomer = (register) => {
    return axiosInstance.post(`/auth/register`, register);
};