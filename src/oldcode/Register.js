import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Toaster } from '@blueprintjs/core';
import { registerCustomer } from '../../services/customer/apiAuthService';

const AppToaster = Toaster.create({
    position: "top"
});


const Register = () => {
    const navigate = useNavigate();
    const [customer, setCustomer] = useState({
        customerId: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        address: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCustomer({
            ...customer,
            [name]: value
        });
    };

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     // Here you would typically send the form data to your backend server
    //     console.log('Customer data:', customer);
    // };
    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
            phone: '',
            address: '',
        },
        validationSchema: Yup.object({
            firstName: Yup.string()
                .max(15, 'Must be 15 characters or less')
                .required('Required'),
            lastName: Yup.string()
                .max(20, 'Must be 20 characters or less')
                .required('Required'),
            email: Yup.string()
                .email('Invalid email address')
                .required('Required'),
            password: Yup.string()
                .min(8, 'Password must be at least 8 characters')
                .required('Password is required'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password'), null], 'Password must match')
                .required('Confirm Password is required'),
            phone: Yup.string()
                .matches(/^[0-9]+$/, 'Must be only digits')
                .min(10, 'Must be exactly 10 digits')
                .max(10, 'Must be exactly 10 digits')
                .required('Required'),
            address: Yup.string()
                .max(100, 'Must be 100 characters or less')
                .required('Required'),
        }),
        onSubmit: values => {
            //alert(JSON.stringify(values, null, 2));
            // All fields are valid, proceed with customer submission or other logic
            console.log('Form submitted successfully:', values);
            if (values) {
                registerCustomer(JSON.stringify(trimJSONValues(values))).then(response => {

                    if (response.status === 201) {
                        AppToaster.show({
                            message: "Register added sucessfully",
                            intent: "success",
                            timeout: 3000
                        });
                        setCustomer({
                            customerId: '',
                            firstName: '',
                            lastName: '',
                            email: '',
                            password: '',
                            confirmPassword: '',
                            phone: '',
                            address: ''
                        });
                        navigate('/');
                        //console.log('registerCustomer:', customer, response);
                    }
                    else {
                        console.error('Failed to register the resource');
                    }
                })
                    .catch(error => {
                        if (error.response && error.response.status === 409) {
                            alert("Email already exists, please try something else");
                        }
                        console.error('Error fetching data:', error, error.response, error.response.status);
                    });
            }
        },
    });
    function trimJSONValues(obj) {
        if (typeof obj === 'string') {
            return obj.trim();
        } else if (Array.isArray(obj)) {
            return obj.map(item => trimJSONValues(item));
        } else if (typeof obj === 'object' && obj !== null) {
            const trimmedObj = {};
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    trimmedObj[key] = trimJSONValues(obj[key]);
                }
            }
            return trimmedObj;
        }
        return obj;
    }
    return (
        <div className="container">
            <div class="row">
                <div className="modal-body">
                    <form onSubmit={formik.handleSubmit}>
                        <div className="form-group">
                            <h1>Register Page</h1>
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="firstName">First Name:</label>
                            <input className="form-control"
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={customer.firstName}
                                onChange={handleChange}
                                {...formik.getFieldProps('firstName')}
                            />
                            {formik.touched.firstName && formik.errors.firstName ? (
                                <div className="text-danger">{formik.errors.firstName}</div>
                            ) : null}
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="lastName">Last Name:</label>
                            <input className="form-control"
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={customer.lastName}
                                onChange={handleChange}
                                {...formik.getFieldProps('lastName')}
                            />
                            {formik.touched.lastName && formik.errors.lastName ? (
                                <div className="text-danger">{formik.errors.lastName}</div>
                            ) : null}
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="email">Email:</label>
                            <input className="form-control"
                                type="email"
                                id="email"
                                name="email"
                                value={customer.email}
                                onChange={handleChange}
                                {...formik.getFieldProps('email')}
                            />
                            {formik.touched.email && formik.errors.email ? (
                                <div className="text-danger">{formik.errors.email}</div>
                            ) : null}
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="password">Password:</label>
                            <input className="form-control"
                                type="password"
                                id="password"
                                name="password"
                                value={customer.password}
                                onChange={handleChange}
                                {...formik.getFieldProps('password')}
                            />
                            {formik.touched.password && formik.errors.password ? (
                                <div className="text-danger">{formik.errors.password}</div>
                            ) : null}
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="confirmPassword">Confirm Password:</label>
                            <input className="form-control"
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={customer.confirmPassword}
                                onChange={handleChange}
                                {...formik.getFieldProps('confirmPassword')}
                            />
                            {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                                <div className="text-danger">{formik.errors.confirmPassword}</div>
                            ) : null}
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="phone">Phone:</label>
                            <input className="form-control"
                                type="text"
                                id="phone"
                                name="phone"
                                value={customer.phone}
                                onChange={handleChange}
                                {...formik.getFieldProps('phone')}
                            />
                            {formik.touched.phone && formik.errors.phone ? (
                                <div className="text-danger">{formik.errors.phone}</div>
                            ) : null}
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="address">Address:</label>
                            <input className="form-control"
                                type="text"
                                id="address"
                                name="address"
                                value={customer.address}
                                onChange={handleChange}
                                {...formik.getFieldProps('address')}
                            />
                            {formik.touched.address && formik.errors.address ? (
                                <div className="text-danger">{formik.errors.address}</div>
                            ) : null}
                        </div>
                        <Link className="btn btn-danger" to="/" >Login</Link>&nbsp;<button className="btn btn-primary" type="submit">Register</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
