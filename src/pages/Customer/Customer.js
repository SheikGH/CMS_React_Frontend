import './Customer.css'
import React, { useEffect, useState } from 'react';
import { Button, EditableText, InputGroup, Toaster } from '@blueprintjs/core';
import { getCustomers, createCustomer, updateCustomer, deleteCustomer } from '../../services/customer/apiCustomerService';

const AppToaster = Toaster.create({
    position: "top"
});

const Customer = () => {
    const [customers, setCustomers] = useState([]);
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: ''
    });

    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: ''
    });

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const validatePhone = (phone) => {
        const re = /^[0-9\b]+$/;
        return re.test(String(phone));
    };

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        //console.log('handleChange:', e.target, name, value);
        setForm({
            ...form,
            [name]: value
        });
    };

    const handleClick = () => {
        const newErrors = {};
        if (!form.firstName) newErrors.firstName = 'First Name is required';
        if (!form.lastName) newErrors.lastName = 'Last Name is required';
        if (!form.email) newErrors.email = 'Email is required';
        else if (!validateEmail(form.email)) newErrors.email = 'Invalid email format';
        if (!form.phone) newErrors.phone = 'Phone is required';
        else if (!validatePhone(form.phone)) newErrors.phone = 'Invalid phone number';
        if (!form.address) newErrors.address = 'Address is required';

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            // All fields are valid, proceed with form submission or other logic
            console.log('Form submitted successfully:', form);
            if (form) {
                createCustomer(JSON.stringify(trimJSONValues(form))).then(response => {
                    console.log('addCustomer:', response.data);
                    const dataNew = {
                        customerId: response.data.customerId,
                        firstName: form.firstName,
                        lastName: form.lastName,
                        email: form.email,
                        phone: form.phone,
                        address: form.address
                    }
                    setCustomers([...customers, dataNew]);
                    setForm({
                        firstName: '',
                        lastName: '',
                        email: '',
                        phone: '',
                        address: ''
                    });
                    
                    AppToaster.show({
                        message: "Customer added sucessfully",
                        intent: "success",
                        timeout: 3000
                    });
                })
                    .catch(error => {
                        console.error('Error fetching data:', error);
                    });
            }
        }
    };

    function onChangeHandler(id, key, value) {
        //console.log('onChangeHandler:', id, key, value);
        setCustomers((customers) => {
            return customers.map(user => {
                return user.customerId === id ? { ...user, [key]: value } : user;
            })
        })
    }

    useEffect(() => {
        getCustomers().then(response => {
            // Assuming the date is in the response data
            setCustomers(response.data)
        })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    function updateUser(id) {

        //if (id > 10) id = 10;
        const user = customers.find((user) => user.customerId === id);
        if (id) {
            updateCustomer(id, JSON.stringify(trimJSONValues(user)))
                .then(response => {
                    if (response.status === 204) {
                        // Handle success (no content)
                        console.log('Resource updated successfully');
                        AppToaster.show({
                            message: "Customer updated sucessfully",
                            intent: "success",
                            timeout: 3000
                        })
                    } else {
                        // Handle other status codes
                        console.error('Failed to update resource');
                    }
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        }
    }

    function deleteUser(id) {
        deleteCustomer(id)
            .then(response => {
                if (response.status === 204) {
                    console.log('Resource deleted successfully');
                    setCustomers((customers) => {
                        return customers.filter(user => user.customerId !== id)
                    })
                    AppToaster.show({
                        message: "Customer deleted sucessfully",
                        intent: "success",
                        timeout: 3000
                    });
                } else {
                    console.error('Failed to delete the resource');
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

    const sortedData = React.useMemo(() => {
        let sortableData = [...customers];
        if (sortConfig !== null) {
            sortableData.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableData;
    }, [customers, sortConfig]);

    const currentData = sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const requestSort = key => {
        alert('requestSort');
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    return (
        <div className="form-group">
            <div className='modal-body' style={{ textAlign: 'center' }}>
                <div>
                    <table className='center'>
                        <thead>
                            <th>ID</th>
                            <th onClick={() => requestSort('firstName')}>First Name</th>
                            <th onClick={() => requestSort('lastName')}>Last Name</th>
                            <th onClick={() => requestSort('email')}>Email</th>
                            <th onClick={() => requestSort('phone')}>Phone</th>
                            <th onClick={() => requestSort('address')}>Address</th>
                        </thead>
                        <tbody>
                            {
                                currentData.map(user =>
                                    <tr key={user.customerId}>
                                        <td>{user.customerId}</td>
                                        <td><EditableText onChange={value => onChangeHandler(user.customerId, 'firstName', value)} value={user.firstName} /></td>
                                        <td><EditableText onChange={value => onChangeHandler(user.customerId, 'lastName', value)} value={user.lastName} /></td>
                                        <td><EditableText onChange={value => onChangeHandler(user.customerId, 'email', value)} value={user.email} /></td>
                                        <td><EditableText onChange={value => onChangeHandler(user.customerId, 'phone', value)} value={user.phone} /></td>
                                        <td><EditableText onChange={value => onChangeHandler(user.customerId, 'address', value)} value={user.address} /></td>
                                        <td>
                                            <Button intent='primary' onClick={() => updateUser(user.customerId)}>Update</Button>&nbsp;
                                            <Button intent='danger' onClick={() => deleteUser(user.customerId)}>Delete</Button>
                                        </td>
                                    </tr>
                                )}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td></td>
                                <td>
                                    <InputGroup
                                        name="firstName" value={form.firstName} onChange={handleChange}
                                        placeholder='Enter First Name...'
                                    />
                                </td>
                                <td>
                                    <InputGroup
                                        name="lastName" value={form.lastName} onChange={handleChange}
                                        placeholder='Enter Last Name...'
                                    />
                                </td>
                                <td>
                                    <InputGroup
                                        name="email" value={form.email} onChange={handleChange}
                                        placeholder='Enter Email...'
                                    />
                                </td>
                                <td>
                                    <InputGroup
                                        name="phone" value={form.phone} onChange={handleChange}
                                        placeholder='Enter Phone...' minLength='10' maxLength='10'
                                    />
                                </td>
                                <td>
                                    <InputGroup
                                        name="address" value={form.address} onChange={handleChange}
                                        placeholder='Enter Address...'
                                    />
                                </td>
                                <td><Button intent='success' onClick={handleClick}>Add Customer</Button></td>
                            </tr>
                            <tr><td></td>
                                <td>{errors.firstName && <p style={{ color: 'red' }}>{errors.firstName}</p>}</td>
                                <td>{errors.lastName && <p style={{ color: 'red' }}>{errors.lastName}</p>}</td>
                                <td>{errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}</td>
                                <td>{errors.phone && <p style={{ color: 'red' }}>{errors.phone}</p>}</td>
                                <td>{errors.address && <p style={{ color: 'red' }}>{errors.address}</p>}</td>
                                <td></td></tr>
                        </tfoot>
                    </table>
                    <div>
                        <Button intent='default' onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                            Previous
                        </Button>
                        <Button intent='default' onClick={() => setCurrentPage(prev => (currentData.length < itemsPerPage ? prev : prev + 1))}>
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )

    
}

export default Customer
