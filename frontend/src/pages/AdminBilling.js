import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const AdminBilling = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBills = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/bills");
      setBills(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  const handleMarkPaid = async (id) => {
    setBills((prev) => prev.map((b) => (b._id === id ? { ...b, paymentStatus: "Paid" } : b)));
    try {
      await api.put(`/bills/${id}/pay`, {});
    } catch (err) {
      fetchBills();
    }
  };

  const totalCollected = bills.filter((b) => b.paymentStatus === "Paid").reduce((s, b) => s + b.totalAmount, 0);
  const totalOutstanding = bills.filter((b) => b.paymentStatus === "Unpaid").reduce((s, b) => s + b.totalAmount, 0);

  return (
    <>
      <div className="dash-header">
        <div className="container">
          <h1>Billing</h1>
          <p className="sub">Invoices generated automatically from orders.</p>
          <div className="dash-tabs">
            <Link to="/admin/dashboard">Overview</Link>
            <Link to="/admin/orders">Orders</Link>
            <Link to="/admin/customers">Customers</Link>
            <Link to="/admin/billing" className="active">Billing</Link>
          </div>
        </div>
      </div>

      <div className="dash-body">
        <div className="container">
          <div className="stat-row">
            <div className="stat-cell">
              <span className="num">{bills.length}</span>
              <span className="label">Total invoices</span>
            </div>
            <div className="stat-cell">
              <span className="num">Rs {totalCollected.toLocaleString()}</span>
              <span className="label">Collected</span>
            </div>
            <div className="stat-cell">
              <span className="num">Rs {totalOutstanding.toLocaleString()}</span>
              <span className="label">Outstanding</span>
            </div>
            <div className="stat-cell">
              <span className="num">{bills.filter((b) => b.paymentStatus === "Unpaid").length}</span>
              <span className="label">Unpaid invoices</span>
            </div>
          </div>

          {loading ? (
            <p className="small-note">Loading invoices...</p>
          ) : bills.length === 0 ? (
            <div className="empty-state"><p>No invoices yet.</p></div>
          ) : (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Invoice #</th>
                    <th>Customer</th>
                    <th>Order #</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {bills.map((b) => (
                    <tr key={b._id}>
                      <td>{b.invoiceNumber}</td>
                      <td>{b.customer?.fullName}</td>
                      <td>{b.order?.orderNumber}</td>
                      <td>Rs {b.totalAmount.toLocaleString()}</td>
                      <td>
                        <span className={`status-pill ${b.paymentStatus === "Paid" ? "status-Delivered" : "status-Placed"}`}>
                          {b.paymentStatus}
                        </span>
                      </td>
                      <td>
                        {b.paymentStatus === "Unpaid" && (
                          <button className="btn btn-secondary btn-sm" onClick={() => handleMarkPaid(b._id)}>
                            Mark paid
                          </button>
                        )}
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

export default AdminBilling;
