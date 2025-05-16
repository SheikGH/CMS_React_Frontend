import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Toaster } from '@blueprintjs/core';
import { registerCustomer } from '../../services/customer/apiAuthService';

const AppToaster = Toaster.create({ position: "top" });

const Register = () => {
    const navigate = useNavigate();

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
            firstName: Yup.string().max(15, 'Must be 15 characters or less').required('Required'),
            lastName: Yup.string().max(20, 'Must be 20 characters or less').required('Required'),
            email: Yup.string().email('Invalid email address').required('Required'),
            password: Yup.string().min(8, 'Must be at least 8 characters').required('Required'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password'), null], 'Passwords must match')
                .required('Required'),
            phone: Yup.string()
                .matches(/^[0-9]+$/, 'Only digits allowed')
                .length(10, 'Must be exactly 10 digits')
                .required('Required'),
            address: Yup.string().max(100, 'Max 100 characters').required('Required'),
        }),
        onSubmit: (values, { resetForm }) => {
            const trimmedValues = trimJSONValues(values);
            registerCustomer(JSON.stringify(trimmedValues))
                .then((response) => {
                    if (response.status === 201) {
                        AppToaster.show({
                            message: 'Registered successfully!',
                            intent: 'success',
                            timeout: 3000,
                        });
                        resetForm(); // Clear the form
                        navigate('/');
                    } else {
                        console.error('Registration failed');
                    }
                })
                .catch((error) => {
                    let message = "Register failed. Please enter valid data.";
                    if (error.response?.status === 409) {
                        alert('Email already exists, try a different one');
                        message = 'Email already exists, try a different one';
                    } else {
                        console.error('Error during registration:', error);
                        message = `Error during registration`;
                    }
                    window.alert(message);
                    AppToaster.show({
                        message,
                        intent: "danger",
                        timeout: 3000,
                    });
                });
        },
    });

    const trimJSONValues = (obj) => {
        if (typeof obj === 'string') return obj.trim();
        if (Array.isArray(obj)) return obj.map(trimJSONValues);
        if (typeof obj === 'object' && obj !== null) {
            const trimmed = {};
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    trimmed[key] = trimJSONValues(obj[key]);
                }
            }
            return trimmed;
        }
        return obj;
    };

    return (
        <div className="container">
            <div className="row">
                <div className="modal-body">
                    <form onSubmit={formik.handleSubmit}>
                        <h1>Register Page</h1>

                        {['firstName', 'lastName', 'email', 'password', 'confirmPassword', 'phone', 'address'].map((field) => (
                            <div key={field} className="form-group">
                                <label className="form-label" htmlFor={field}>
                                    {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}:
                                </label>
                                <input
                                    className="form-control"
                                    id={field}
                                    name={field}
                                    type={field.toLowerCase().includes('password') ? 'password' : 'text'}
                                    {...formik.getFieldProps(field)}
                                />
                                {formik.touched[field] && formik.errors[field] ? (
                                    <div className="text-danger">{formik.errors[field]}</div>
                                ) : null}
                            </div>
                        ))}
                        <div style={{ textAlign: 'center' }}>
                            <Link className="btn btn-danger" to="/">Login</Link>&nbsp;
                            <button className="btn btn-primary" type="submit">Register</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
