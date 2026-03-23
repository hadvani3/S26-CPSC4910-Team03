import React, { useEffect, useState, useContext } from 'react';
import Nav from '../components/Nav';
import { AuthContext } from "../components/AuthContext.jsx";

export default function Account() {
    const { token } = useContext(AuthContext);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [newUsername, setUsername] = useState("");

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
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch("https://team03.cpsc4911.com/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    newUsername: newUsername,
                    token: token,
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
        alert("Server error");
    }

    if (!data) {
        return <h1>Loading...</h1>;
    }

    return (
        <>
            <Nav />
            {data.username && <h1>Welcome, {data.username}</h1>}
            <p>
                Role: {data.role}<br/>
                Email: {data.email}<br/>
                Account created: {data.createDate}<br/>
                Account updated: {data.updatedDate}<br/>
            </p>
            <form onSubmit={handleSubmit}>
                <label>
                    Change username:
                    <input
                        type="username"
                        name="username"
                        value={newUsername}
                        onChange={(e) => setUsername(e.target.value)}
                        required/>
                </label>
            </form>
        </>
    );
}