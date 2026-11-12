import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/customers");
      setCustomers(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this customer's account? This cannot be undone.")) return;
    try {
      await api.delete(`/admin/customers/${id}`);
      setCustomers((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Could not remove customer.");
    }
  };

  return (
    <>
      <div className="dash-header">
        <div className="container">
          <h1>Customers</h1>
          <p className="sub">Everyone registered on the platform.</p>
          <div className="dash-tabs">
            <Link to="/admin/dashboard">Overview</Link>
            <Link to="/admin/orders">Orders</Link>
            <Link to="/admin/customers" className="active">Customers</Link>
            <Link to="/admin/billing">Billing</Link>
          </div>
        </div>
      </div>

      <div className="dash-body">
        <div className="container">
          {loading ? (
            <p className="small-note">Loading customers...</p>
          ) : customers.length === 0 ? (
            <div className="empty-state"><p>No customers registered yet.</p></div>
          ) : (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Address</th>
                    <th>Joined</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c) => (
                    <tr key={c._id}>
                      <td>{c.fullName}</td>
                      <td>{c.email}</td>
                      <td>{c.phone}</td>
                      <td>{c.address || "—"}</td>
                      <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c._id)}>
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminCustomers;
