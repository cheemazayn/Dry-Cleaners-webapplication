import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../api/axios";

const statusClass = (status) => `status-pill status-${status.replace(/\s/g, "-")}`;

const OrderHistory = () => {
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get("/orders/my-orders");
        setOrders(data);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <>
      <div className="dash-header">
        <div className="container">
          <h1>Order history</h1>
          <p className="sub">Every order you've placed, with live status.</p>
          <div className="dash-tabs">
            <Link to="/dashboard">Overview</Link>
            <Link to="/place-order">Place an order</Link>
            <Link to="/orders" className="active">Order history</Link>
            <Link to="/billing">Billing</Link>
            <Link to="/profile">Profile</Link>
          </div>
        </div>
      </div>

      <div className="dash-body">
        <div className="container">
          {location.state?.placed && (
            <div className="form-success">
              Order {location.state.placed} was placed successfully. We'll see you at pickup.
            </div>
          )}

          {loading ? (
            <p className="small-note">Loading your orders...</p>
          ) : orders.length === 0 ? (
            <div className="empty-state">
              <p>You haven't placed any orders yet.</p>
              <Link to="/place-order" className="btn btn-primary btn-sm">Place your first order</Link>
            </div>
          ) : (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Order #</th>
                    <th>Placed on</th>
                    <th>Pickup</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o._id}>
                      <td>{o.orderNumber}</td>
                      <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                      <td>{new Date(o.pickupDate).toLocaleDateString()} · {o.pickupTime}</td>
                      <td>{o.items.map((it) => `${it.garment} ×${it.quantity}`).join(", ")}</td>
                      <td>Rs {o.totalAmount.toLocaleString()}</td>
                      <td><span className={statusClass(o.status)}>{o.status}</span></td>
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

export default OrderHistory;
