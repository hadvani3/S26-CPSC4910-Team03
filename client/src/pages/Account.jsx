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

    return (
        <>
            <Nav />
            <div className="container">
                <p className="glass-subtitle">Truckers United</p>
                <h1>Account</h1>
                {data.username && <h2>Welcome, {data.username}</h2>}
                <div className="item">
                    <span className="label">Role:</span> {data.role}
                </div>
                <div className="item">
                    <span className="label">Email:</span> {data.email}
                </div>
                <div className="item">
                    <span className="label">Account created:</span> {data.createDate}
                </div>
                <div className="item">
                    <span className="label">Account updated:</span> {data.updatedDate}
                </div>
                <form onSubmit={handleSubmit} className="glass-form">
                    <div className="glass-input-group">
                        <label htmlFor="account-username">Change username:</label>
                        <input
                            id="account-username"
                            type="username"
                            name="username"
                            className="glass-input"
                            value={newValue}
                            onChange={(e) => setValue(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="glass-btn">
                        Update
                    </button>
                </form>
            </div>
        </>
    );
}
