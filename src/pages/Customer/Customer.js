import './Customer.css'
import React, { useEffect, useState } from 'react';
import { Button, EditableText, InputGroup, Toaster } from '@blueprintjs/core';

const AppToaster = Toaster.create({
    position: "top"
});

const Customer = () =>  {
    const [customers, setCustomers] = useState([]);
    const [newFirstName, setNewFirstName] = useState('');
    const [newLastName, setNewLastName] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newPhone, setNewPhone] = useState('');
    const [newAddress, setNewAddress] = useState('');
    useEffect(() => {
        fetch('https://localhost:7067/api/Customers')
            .then((response) => response.json())
            .then((json) => setCustomers(json))
    }, []);

    function addUser() {
        const firstName = newFirstName.trim();
        const lastName = newLastName.trim();
        const email = newEmail.trim();
        const phone = newPhone.trim();
        const address = newAddress.trim();
        if (firstName && lastName && email && phone) {
            //process.env.REACT_APP_API_URL +
            fetch('https://localhost:7067/api/customers',
                {
                    method: "POST",
                    body: JSON.stringify(
                        {
                            firstName,
                            lastName,
                            email,
                            phone,
                            address
                        }),
                    headers: {
                        "Content-Type": "application/json;charset:UTF-8;"
                    }
                }).then((response) => response.json())
                .then(data => {
                    const dataNew = {
                        customerId: data.customerId,
                        firstName: firstName,
                        lastName:lastName,
                        email: email,
                        phone: phone,
                        address: address,
                    }
                    setCustomers([...customers, dataNew])
                    AppToaster.show({
                        message: "Customer added sucessfully",
                        intent: "success",
                        timeout: 3000
                    });
                    setNewFirstName("");
                    setNewLastName("");
                    setNewEmail("");
                    setNewPhone("");
                    setNewAddress("");
                });
        }
    }

    function onChangeHandler(id, key, value) {
        console.log('onChangeHandler:',id, key, value);
        setCustomers((customers) => {
            return customers.map(user => {
                return user.customerId === id ? { ...user, [key]: value } : user;
            })
        })
    }

    function updateUser(id) {
        console.log('updateUser:',id,`https://localhost:7067/api/customers/` + id);
        if (id > 10) id = 10;
        const user = customers.find((user) => user.customerId === id);
        if (id) {
            //process.env.REACT_APP_API_URL +
            fetch('https://localhost:7067/api/customers/' + id,
                {
                    method: "PUT",
                    body: JSON.stringify(user),
                    headers: {
                        "Content-Type": "application/json;charset:UTF-8;"
                    }
                }).then((response) => response.json())
                .then(data => {
                    AppToaster.show({
                        message: "Customer updated sucessfully",
                        intent: "success",
                        timeout: 3000
                    });

                });
        }
    }

    function deleteUser(id) {
        console.log('deleteUser',id);
        //process.env.REACT_APP_API_URL +
        fetch( 'https://localhost:7067/api/customers/' + id,
            {
                method: "DELETE",
            }).then((response) => response.json())
            .then(data => {
                setCustomers((customers) => {
                    return customers.filter(user => user.customerId !== id)
                })
                AppToaster.show({
                    message: "Customer deleted sucessfully",
                    intent: "success",
                    timeout: 3000
                });
            })
    }

    return (
        <div className='modal-body' style={{textAlign:'center'}}>
            <table className='bp4-html-table'>
                <thead>
                    <th>ID</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Address</th>
                </thead>
                <tbody>
                    {
                    customers.map(user =>
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
                                value={newFirstName}
                                onChange={(e) => setNewFirstName(e.target.value)}
                                placeholder='Enter First Name...'
                            />
                        </td>
                        <td>
                            <InputGroup
                                value={newLastName}
                                onChange={(e) => setNewLastName(e.target.value)}
                                placeholder='Enter Last Name...'
                            />
                        </td>
                        <td>
                            <InputGroup
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                placeholder='Enter Email...'
                            />
                        </td>
                        <td>
                            <InputGroup
                                value={newPhone}
                                onChange={(e) => setNewPhone(e.target.value)}
                                placeholder='Enter Phone...'
                            />
                        </td>
                        <td>
                            <InputGroup
                                value={newAddress}
                                onChange={(e) => setNewAddress(e.target.value)}
                                placeholder='Enter Address...'
                            />
                        </td>
                        <td><Button intent='success' onClick={addUser}>Add Customer</Button></td>
                    </tr>
                </tfoot>
            </table>

        </div>
    )
}

export default Customer