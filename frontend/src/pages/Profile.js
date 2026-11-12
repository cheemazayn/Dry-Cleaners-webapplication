import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    fullName: user?.fullName || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const { data } = await api.put("/auth/profile", form);
      setUser({ ...user, ...data });
      localStorage.setItem("dc_user", JSON.stringify({ ...user, ...data }));
      setSuccess("Profile updated.");
    } catch (err) {
      setError(err.response?.data?.message || "Could not update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="dash-header">
        <div className="container">
          <h1>Profile</h1>
          <p className="sub">Keep your contact and address details up to date.</p>
          <div className="dash-tabs">
            <Link to="/dashboard">Overview</Link>
            <Link to="/place-order">Place an order</Link>
            <Link to="/orders">Order history</Link>
            <Link to="/billing">Billing</Link>
            <Link to="/profile" className="active">Profile</Link>
          </div>
        </div>
      </div>

      <div className="dash-body">
        <div className="container" style={{ maxWidth: 520 }}>
          {error && <div className="form-error">{error}</div>}
          {success && <div className="form-success">{success}</div>}

          <form onSubmit={handleSubmit} className="card-panel">
            <div className="field">
              <label>Email</label>
              <input value={user?.email || ""} disabled />
            </div>
            <div className="field">
              <label htmlFor="fullName">Full name</label>
              <input id="fullName" name="fullName" value={form.fullName} onChange={handleChange} />
            </div>
            <div className="field">
              <label htmlFor="phone">Phone</label>
              <input id="phone" name="phone" value={form.phone} onChange={handleChange} />
            </div>
            <div className="field">
              <label htmlFor="address">Default pickup address</label>
              <textarea id="address" name="address" rows={3} value={form.address} onChange={handleChange} />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Saving..." : "Save changes"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Profile;
