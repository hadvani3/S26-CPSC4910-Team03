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
    zipcode: "",
    reason: ""
  });
  const [message, setMessage] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setSubmitError("");

    const sponsor = sponsors.find((s) => String(s.sponsor_id) === selectedSponsor);
    if (!sponsor) {
      setSubmitError("Please select a sponsor.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/driver-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: formData.firstName.trim(),
          last_name: formData.lastName.trim(),
          birth_date: formData.birthdate,
          email_address: formData.email.trim(),
          phone_number: formData.phone.trim(),
          street_address: formData.streetAddress.trim(),
          city: formData.city.trim(),
          zip_code: formData.zipcode.trim(),
          reason: formData.reason.trim(),
          company_name: sponsor.company_name.trim()
        })
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setSubmitError(data.error || "Could not submit application.");
        return;
      }

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
        zipcode: "",
        reason: ""
      });
    } catch {
      setSubmitError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
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
          Driver applications are only available to driver accounts. Use the email tied to your
          driver account so we can match your profile.
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
            maxLength={50}
            required
          />

          <label style={{ color: "white", fontWeight: "bold" }}>Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleFieldChange}
            style={fieldStyle}
            maxLength={50}
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
            maxLength={25}
            required
          />

          <label style={{ color: "white", fontWeight: "bold" }}>Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleFieldChange}
            style={fieldStyle}
            maxLength={100}
            required
          />

          <label style={{ color: "white", fontWeight: "bold" }}>Street Address</label>
          <input
            type="text"
            name="streetAddress"
            value={formData.streetAddress}
            onChange={handleFieldChange}
            style={fieldStyle}
            maxLength={255}
            required
          />

          <label style={{ color: "white", fontWeight: "bold" }}>City</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleFieldChange}
            style={fieldStyle}
            maxLength={100}
            required
          />

          <label style={{ color: "white", fontWeight: "bold" }}>Zip Code</label>
          <input
            type="text"
            name="zipcode"
            value={formData.zipcode}
            onChange={handleFieldChange}
            style={fieldStyle}
            maxLength={20}
            required
          />

          <label style={{ color: "white", fontWeight: "bold" }}>Reason for applying</label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleFieldChange}
            style={{ ...fieldStyle, minHeight: "120px", resize: "vertical" }}
            required
          />

          <button type="submit" disabled={!sponsorSelectEnabled || submitting}>
            {submitting ? "Submitting…" : "Submit Application"}
          </button>
        </form>
        {submitError && (
          <p style={{ color: "#ffb3b3", marginTop: "6px" }}>{submitError}</p>
        )}
        {message && <p style={{ color: "#d8fdd8", marginTop: "6px" }}>{message}</p>}
      </div>
    </>
  );
}
