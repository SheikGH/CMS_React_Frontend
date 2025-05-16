import './Customer.css';
import React, { useEffect, useState } from 'react';
import { Button, EditableText, InputGroup, Toaster } from '@blueprintjs/core';
import { getCustomers, createCustomer, updateCustomer, deleteCustomer } from '../../services/customer/apiCustomerService';

const AppToaster = Toaster.create({ position: "top" });

const Customer = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true); // <-- New loading state
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: ''
    });

    const [errors, setErrors] = useState({});

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.toLowerCase());
    const validatePhone = (phone) => /^[0-9\b]+$/.test(phone);

    const trimJSONValues = (obj) => {
        if (typeof obj === 'string') return obj.trim();
        if (Array.isArray(obj)) return obj.map(trimJSONValues);
        if (typeof obj === 'object' && obj !== null) {
            const trimmedObj = {};
            for (const key in obj) {
                if (Object.hasOwnProperty.call(obj, key)) {
                    trimmedObj[key] = trimJSONValues(obj[key]);
                }
            }
            return trimmedObj;
        }
        return obj;
    };
    const validateUser = (user) => {
        const newErrors = {};

        if (!user.firstName.trim()) newErrors.firstName = "First Name is required.";
        if (!user.lastName.trim()) newErrors.lastName = "Last Name is required.";

        if (!user.email.trim()) {
            newErrors.email = "Email is required.";
        } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(user.email)) {
            newErrors.email = "Invalid email format.";
        }

        if (!user.phone.trim()) {
            newErrors.phone = "Phone is required.";
        } else if (!/^\d{10}$/.test(user.phone)) {
            newErrors.phone = "Phone must be 10 digits.";
        }

        if (!user.address.trim()) newErrors.address = "Address is required.";

        return newErrors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
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
            createCustomer(JSON.stringify(trimJSONValues(form)))
                .then(response => {
                    const newCustomer = { customerId: response.data.customerId, ...form };
                    setCustomers(prev => [...prev, newCustomer]);
                    setForm({ firstName: '', lastName: '', email: '', phone: '', address: '' });
                    AppToaster.show({ message: "Customer added successfully", intent: "success", timeout: 3000 });
                })
                .catch(error => {
                    console.error('Error adding customer:', error);
                });
        }
    };

    const onChangeHandler = (id, key, value) => {
        setCustomers(prev => prev.map(c => c.customerId === id ? { ...c, [key]: value } : c));
    };

    // useEffect(() => {
    //     getCustomers()
    //         .then(response => setCustomers(response.data))
    //         .catch(error => console.error('Error fetching customers:', error));
    // }, []);
    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await getCustomers();
                setCustomers(response.data);
                console.log('setCustomers:', response.data);
            } catch (error) {
                console.error('Error fetching customers:', error);
            } finally {
                setLoading(false); // <-- Done loading
            }
        };

        fetchCustomers();
    }, []);
    const updateUser = (id) => {
        const user = customers.find(c => c.customerId === id);
        const validationErrors = validateUser(user);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});
        updateCustomer(id, JSON.stringify(trimJSONValues(user)))
            .then(response => {
                if (response.status === 204) {
                    AppToaster.show({ message: "Customer updated successfully", intent: "success", timeout: 3000 });
                }
            })
            .catch(error => {
                console.error('Error updating customer:', error)
                let message = "Edit Customer failed. Please enter valid data.";
                if (error.response?.data?.message) {
                    message = error.response.data.message;
                }

                window.alert(message);
                AppToaster.show({
                    message,
                    intent: "danger",
                    timeout: 3000,
                });

            });
    };

    const deleteUser = (id) => {
        deleteCustomer(id)
            .then(response => {
                if (response.status === 204) {
                    setCustomers(prev => prev.filter(c => c.customerId !== id));
                    AppToaster.show({ message: "Customer deleted successfully", intent: "success", timeout: 3000 });
                }
            })
            .catch(error => console.error('Error deleting customer:', error));
    };

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

    const sortedData = React.useMemo(() => {
        const sortableData = [...customers];
        if (sortConfig.key) {
            sortableData.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
        }
        return sortableData;
    }, [customers, sortConfig]);

    const currentData = sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const requestSort = key => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    return (
        <div className="form-group">
            <div className='modal-body' style={{ textAlign: 'center' }}>
                {loading ? (
                    <div>Loading customers...</div>
                ) : (
                    <table className='center'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th onClick={() => requestSort('firstName')}>First Name</th>
                                <th onClick={() => requestSort('lastName')}>Last Name</th>
                                <th onClick={() => requestSort('email')}>Email</th>
                                <th onClick={() => requestSort('phone')}>Phone</th>
                                <th onClick={() => requestSort('address')}>Address</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentData.map(user => (
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
                            ))}
                            {/* <tr>
                                <td></td>
                                <td>
                                    <InputGroup name="firstName" value={form.firstName} onChange={handleChange} placeholder='Enter First Name...' />
                                </td>
                                <td>
                                    <InputGroup name="lastName" value={form.lastName} onChange={handleChange} placeholder='Enter Last Name...' />
                                </td>
                                <td>
                                    <InputGroup name="email" value={form.email} onChange={handleChange} placeholder='Enter Email...' />
                                </td>
                                <td>
                                    <InputGroup name="phone" value={form.phone} onChange={handleChange} placeholder='Enter Phone...' maxLength={10} />
                                </td>
                                <td>
                                    <InputGroup name="address" value={form.address} onChange={handleChange} placeholder='Enter Address...' />
                                </td>
                                <td>
                                    <Button intent='success' onClick={handleClick}>Add Customer</Button>
                                </td>
                            </tr> */}
                            <tr>
                                <td colSpan="7">
                                    <div>
                                        <Button intent='default' onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                                            Previous
                                        </Button>
                                        <Button intent='default' onClick={() => setCurrentPage(prev => (currentData.length < itemsPerPage ? prev : prev + 1))}>
                                            Next
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <td colSpan="6" style={{ textAlign: 'left', color: 'red' }}>
                                    {Object.keys(errors).map(key => (
                                        errors[key] && <div key={key}>{errors[key]}</div>
                                    ))}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                )
                }
            </div>
        </div>
    );
};

export default Customer;
