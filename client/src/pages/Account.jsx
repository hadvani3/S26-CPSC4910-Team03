import React, { useEffect, useState, useContext } from 'react';
import Nav from '../components/Nav';
import { AuthContext } from "../components/AuthContext.jsx";

export default function Account() {
    const { token, role } = useContext(AuthContext);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [newValue, setValue] = useState("");
    const [field, setField] = useState("username");

    useEffect(() => {
        async function fetchAccount() {
            try {
                const res = await fetch("https://team03.cpsc4911.com/AccountInfo", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        key: token,
                        role: role,
                    }),
                });

                const result = await res.json();

                if (res.ok) {
                    setData(result);
                } else {
                    setError("Failed to fetch account info");
                }
            } catch (err) {
                console.error(err);
                setError("Server error");
            }
        }

        if (token) {
            fetchAccount();
        }
    }, [token, role]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch("https://team03.cpsc4911.com/UpdateUser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    newValue: newValue,
                    toUpdate: field,
                    key: token,
                    user_id: data.user_id,
                    role: role,
                }),
            });

            console.log(res.status)

            if (res.ok) {
                if (data.accessToken) {
                    console.log("Username changed successfully!");

                }
            }
        } catch (err) {
            console.error(err);
            alert("Server error");
        }

    }

    if (error) {
        return (
            <>
                <Nav />
                <div className="container">
                    <h1>Server Error</h1>
                    <p className="item">{error}</p>
                </div>
            </>
        );
    }

    if (!data) {
        return (
            <>
                <Nav />
                <div className="container">
                    <h1>Loading...</h1>
                </div>
            </>
        );
    }

    const updateInputType =
        field === 'email' ? 'email' : field === 'phone_number' ? 'tel' : 'text';

    return (
        <>
            <Nav />
            <div className="container">
                <p className="glass-subtitle">Truckers United</p>
                {data.username && <h1>Welcome, {data.username}</h1>}
                <p className="item" style={{ lineHeight: 1.7 }}>
                    {data.first_name && (
                        <>
                            Name: {data.first_name} {data.last_name}
                            <br />
                        </>
                    )}
                    {data.phone && (
                        <>
                            Phone: {data.phone}
                            <br />
                        </>
                    )}
                    Role: {data.role}
                    <br />
                    Email: {data.email}
                    <br />
                    Account created: {data.createDate}
                    <br />
                    Account updated: {data.updatedDate}
                    <br />
                </p>
                <form onSubmit={handleSubmit} className="glass-form">
                    <div className="glass-input-group">
                        <label htmlFor="account-update-value">Update Account:</label>
                        <input
                            id="account-update-value"
                            type={updateInputType}
                            name={field}
                            className="glass-input"
                            value={newValue}
                            onChange={(e) => setValue(e.target.value)}
                            required
                        />
                    </div>
                    <div className="glass-input-group">
                        <label htmlFor="account-field-select">Select field to update:</label>
                        <select
                            id="account-field-select"
                            className="glass-input"
                            value={field}
                            onChange={(e) => {
                                setField(e.target.value);
                                setValue('');
                            }}
                        >
                            <option value="username">Username</option>
                            <option value="email">Email</option>
                            {data.first_name && (
                                <option value="first_name">First Name</option>
                            )}
                            {data.last_name && (
                                <option value="last_name">Last Name</option>
                            )}
                            {data.phone && (
                                <option value="phone_number">Phone Number</option>
                            )}
                        </select>
                    </div>
                    <button type="submit" className="glass-btn">
                        Update
                    </button>
                </form>
            </div>
        </>
    );
}
