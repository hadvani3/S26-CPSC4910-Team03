import React, { useEffect, useState, useContext } from 'react';
import Nav from '../components/Nav';
import { AuthContext } from "../components/AuthContext.jsx";

export default function Account() {
    const { token, role } = useContext(AuthContext);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [sponsorID, setID] = useState(null);
    const [drivers, setDrivers] = useState(null);
    const [pointsChanges, setPointsChanges] = useState({});
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

        async function fetchSponsor() {
            try {
                const res = await fetch("https://team03.cpsc4911.com/GetSponsor", {
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
                    setID(result.sponsor_id);
                } else {
                    setError("Failed to fetch sponsor ID");
                }
            } catch (err) {
                console.error(err);
                setError("Server error");
            }
        }

        if (role === "sponsor") {
            fetchSponsor()
        }
        console.log(sponsorID)

        async function fetchSponsorDrivers() {
            try {
                const res = await fetch("https://team03.cpsc4911.com/GetSponsorDrivers", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        sponsorID: sponsorID,
                    }),
                });

                const result = await res.json();

                if (res.ok) {
                    setDrivers(result);
                } else {
                    setError("Failed to fetch sponsor drivers");
                }
            } catch (err) {
                console.error(err);
                setError("Server error");
            }
        }

        if (sponsorID) {
            fetchSponsorDrivers()
            console.log("Fetching drivers")
        }
        console.log(drivers)
    }, [token, role]);

    useEffect(() => {
        async function fetchSponsorDrivers() {
            try {
                const res = await fetch("https://team03.cpsc4911.com/GetSponsorDrivers", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        sponsorID: sponsorID,
                    }),
                });

                const result = await res.json();

                if (res.ok) {
                    setDrivers(result);
                } else {
                    setError("Failed to fetch sponsor drivers");
                }
            } catch (err) {
                console.error(err);
                setError("Server error");
            }
        }

        if (sponsorID && drivers === null) {
            fetchSponsorDrivers()
            console.log("Fetching drivers")
        }
        console.log(drivers)
    }, [sponsorID, drivers])

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch("https://team03.cpsc4911.com/SetUsername", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    newUsername: newUsername,
                    key: token,
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

    const handleChangePoints = async (driver_id) => {
        const change = pointsChanges[driver_id];

        if (!change) return alert("Enter a value");

        try {
            const res = await fetch("https://team03.cpsc4911.com/ChangePoints", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    driver_id,
                    change,
                    sponsor_id: sponsorID,
                }),
            });

            const result = await res.json();

            if (res.ok && result.success) {
                setDrivers((prev) =>
                    prev.map((d) =>
                        d.driver_id === driver_id
                            ? { ...d, points: d.points + change }
                            : d
                    )
                );
                setPointsChanges((prev) => ({ ...prev, [driver_id]: "" }));
            } else {
                alert("Failed to update points");
            }
        } catch (err) {
            console.error(err);
            alert("Server error");
        }
    };

    if (error) {
        return <h1>Server Error</h1>;
    }

    if (!data) {
        return <h1>Loading...</h1>;
    }

    return (
        <>
            <Nav />
            {data.username && <h1>Welcome, {data.username}</h1>}
            <p>
                Role: {data.role}
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
                <button type="submit">
                    Update
                </button>
            </form>
            {drivers && drivers.length > 0 && (
                <>
                    <h2>Your Drivers</h2>
                    <table border="1" cellPadding="8">
                        <thead>
                        <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Phone</th>
                            <th>Points</th>
                            <th>Update Points</th>
                        </tr>
                        </thead>
                        <tbody>
                        {drivers.length > 0 && drivers.map((driver, index) => (
                            <tr key={index}>
                                <td>{driver.firstname}</td>
                                <td>{driver.lastname}</td>
                                <td>{driver.phone}</td>
                                <td>{driver.points}</td>
                                <td><input
                                    type="number"
                                    value={pointsChanges[driver.driver_id] || ""}
                                    onChange={(e) =>
                                        setPointsChanges({
                                            ...pointsChanges,
                                            [driver.driver_id]: Number(e.target.value),
                                        })
                                    }
                                />
                                    <button
                                        onClick={() => handleChangePoints(driver.driver_id)}
                                    >
                                        Update
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </>
            )}
        </>
    );
}