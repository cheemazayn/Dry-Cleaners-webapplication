import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const Billing = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const { data } = await api.get("/bills/my-bills");
        setBills(data);
      } finally {
        setLoading(false);
      }
    };
    fetchBills();
  }, []);

  return (
    <>
      <div className="dash-header">
        <div className="container">
          <h1>Billing</h1>
          <p className="sub">Invoices generated automatically for every order.</p>
          <div className="dash-tabs">
            <Link to="/dashboard">Overview</Link>
            <Link to="/place-order">Place an order</Link>
            <Link to="/orders">Order history</Link>
            <Link to="/billing" className="active">Billing</Link>
            <Link to="/profile">Profile</Link>
          </div>
        </div>
      </div>

      <div className="dash-body">
        <div className="container">
          {loading ? (
            <p className="small-note">Loading your invoices...</p>
          ) : bills.length === 0 ? (
            <div className="empty-state"><p>No invoices yet — place an order to generate one.</p></div>
          ) : (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Invoice #</th>
                    <th>Order #</th>
                    <th>Subtotal</th>
                    <th>Tax</th>
                    <th>Total</th>
                    <th>Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {bills.map((b) => (
                    <tr key={b._id}>
                      <td>{b.invoiceNumber}</td>
                      <td>{b.order?.orderNumber}</td>
                      <td>Rs {b.subtotal.toLocaleString()}</td>
                      <td>Rs {b.tax.toLocaleString()}</td>
                      <td>Rs {b.totalAmount.toLocaleString()}</td>
                      <td>
                        <span className={`status-pill ${b.paymentStatus === "Paid" ? "status-Delivered" : "status-Placed"}`}>
                          {b.paymentStatus}
                        </span>
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

export default Billing;
