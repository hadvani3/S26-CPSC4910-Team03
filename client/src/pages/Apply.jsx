import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "../components/Nav";
import { AuthContext } from "../components/AuthContext";

export default function Apply() {
  const { token, role } = useContext(AuthContext);
  const navigate = useNavigate();
  const [selectedSponsor, setSelectedSponsor] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    birthdate: "",
    phone: "",
    email: "",
    streetAddress: "",
    city: "",
    state: "",
    zipcode: "",
    cdlNumber: ""
  });
  const [message, setMessage] = useState("");
  const [sponsors, setSponsors] = useState([]);
  const [sponsorsLoading, setSponsorsLoading] = useState(true);
  const [sponsorsError, setSponsorsError] = useState(null);

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    if (role !== "driver") {
      if (role === "sponsor") {
        navigate("/sponsor-page");
      } else if (role === "admin") {
        navigate("/admin-page");
      } else {
        navigate("/home");
      }
    }
  }, [token, role, navigate]);

  useEffect(() => {
    if (!token || role !== "driver") return;

    let cancelled = false;
    setSponsorsLoading(true);
    setSponsorsError(null);

    fetch("/api/sponsors")
      .then((res) => {
        if (!res.ok) throw new Error("Could not load sponsors");
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setSponsors(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (!cancelled) {
          setSponsorsError(err.message || "Could not load sponsors");
          setSponsors([]);
        }
      })
      .finally(() => {
        if (!cancelled) setSponsorsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [token, role]);
  const fieldStyle = {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.35)",
    fontSize: "16px"
  };

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setMessage("Application submitted successfully. A sponsor will review it soon.");
    setSelectedSponsor("");
    setFormData({
      firstName: "",
      lastName: "",
      birthdate: "",
      phone: "",
      email: "",
      streetAddress: "",
      city: "",
      state: "",
      zipcode: "",
      cdlNumber: ""
    });
  };

  const sponsorSelectEnabled =
    !sponsorsLoading && !sponsorsError && sponsors.length > 0;

  if (!token || role !== "driver") {
    return null;
  }

  return (
    <>
      <Nav />
      <div className="container">
        <h1>Apply to a Sponsor</h1>
        <p style={{ color: "white", marginTop: "0" }}>
          Driver applications are only available to driver accounts.
        </p>
        <form onSubmit={handleSubmit}>
          <label style={{ color: "white", fontWeight: "bold" }}>Select Sponsor</label>
          {sponsorsLoading && (
            <p style={{ color: "white", margin: "0 0 8px 0" }}>Loading sponsors…</p>
          )}
          {sponsorsError && (
            <p style={{ color: "#ffb3b3", margin: "0 0 8px 0" }}>{sponsorsError}</p>
          )}
          {!sponsorsLoading && !sponsorsError && sponsors.length === 0 && (
            <p style={{ color: "#ffe082", margin: "0 0 8px 0" }}>
              No active sponsors are available right now.
            </p>
          )}
          <select
            value={selectedSponsor}
            onChange={(event) => setSelectedSponsor(event.target.value)}
            style={fieldStyle}
            required={sponsorSelectEnabled}
            disabled={!sponsorSelectEnabled}
          >
            <option value="">Choose a sponsor...</option>
            {sponsors.map((s) => (
              <option key={s.sponsor_id} value={String(s.sponsor_id)}>
                {s.company_name}
              </option>
            ))}
          </select>

          <label style={{ color: "white", fontWeight: "bold" }}>First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleFieldChange}
            style={fieldStyle}
            required
          />

          <label style={{ color: "white", fontWeight: "bold" }}>Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleFieldChange}
            style={fieldStyle}
            required
          />

          <label style={{ color: "white", fontWeight: "bold" }}>Birthdate</label>
          <input
            type="date"
            name="birthdate"
            value={formData.birthdate}
            onChange={handleFieldChange}
            style={fieldStyle}
            required
          />

          <label style={{ color: "white", fontWeight: "bold" }}>Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleFieldChange}
            placeholder="(555) 123-4567"
            style={fieldStyle}
            required
          />

          <label style={{ color: "white", fontWeight: "bold" }}>Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleFieldChange}
            style={fieldStyle}
            required
          />

          <label style={{ color: "white", fontWeight: "bold" }}>Street Address</label>
          <input
            type="text"
            name="streetAddress"
            value={formData.streetAddress}
            onChange={handleFieldChange}
            style={fieldStyle}
            required
          />

          <label style={{ color: "white", fontWeight: "bold" }}>City</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleFieldChange}
            style={fieldStyle}
            required
          />

          <label style={{ color: "white", fontWeight: "bold" }}>State</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleFieldChange}
            style={fieldStyle}
            required
          />

          <label style={{ color: "white", fontWeight: "bold" }}>Zip Code</label>
          <input
            type="text"
            name="zipcode"
            value={formData.zipcode}
            onChange={handleFieldChange}
            style={fieldStyle}
            required
          />

          <label style={{ color: "white", fontWeight: "bold" }}>CDL Number</label>
          <input
            type="text"
            name="cdlNumber"
            value={formData.cdlNumber}
            onChange={handleFieldChange}
            style={fieldStyle}
            required
          />

          <button type="submit" disabled={!sponsorSelectEnabled}>
            Submit Application
          </button>
        </form>
        {message && <p style={{ color: "#d8fdd8", marginTop: "6px" }}>{message}</p>}
      </div>
    </>
  );
}
