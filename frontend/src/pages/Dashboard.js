import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const statusClass = (status) => `status-pill status-${status.replace(/\s/g, "-")}`;

const Dashboard = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get("/orders/my-orders");
        setOrders(data);
      } catch (err) {
        // fail quietly on dashboard summary
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const active = orders.filter((o) => !["Delivered", "Cancelled"].includes(o.status));

  return (
    <>
      <div className="dash-header">
        <div className="container">
          <h1>Welcome back, {user?.fullName?.split(" ")[0]}</h1>
          <p className="sub">Here's where your orders and account stand.</p>
          <div className="dash-tabs">
            <Link to="/dashboard" className="active">Overview</Link>
            <Link to="/place-order">Place an order</Link>
            <Link to="/orders">Order history</Link>
            <Link to="/billing">Billing</Link>
            <Link to="/profile">Profile</Link>
          </div>
        </div>
      </div>

      <div className="dash-body">
        <div className="container">
          <div className="stat-row">
            <div className="stat-cell">
              <span className="num">{orders.length}</span>
              <span className="label">Total orders</span>
            </div>
            <div className="stat-cell">
              <span className="num">{active.length}</span>
              <span className="label">Active orders</span>
            </div>
            <div className="stat-cell">
              <span className="num">{orders.filter((o) => o.status === "Delivered").length}</span>
              <span className="label">Delivered</span>
            </div>
            <div className="stat-cell">
              <span className="num">
                Rs {orders.reduce((sum, o) => sum + o.totalAmount, 0).toLocaleString()}
              </span>
              <span className="label">Lifetime spend</span>
            </div>
          </div>

          <h2 style={{ fontSize: 20, marginBottom: 16 }}>Recent orders</h2>

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
                    <th>Pickup date</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 6).map((o) => (
                    <tr key={o._id}>
                      <td>{o.orderNumber}</td>
                      <td>{new Date(o.pickupDate).toLocaleDateString()}</td>
                      <td>{o.items.length}</td>
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

export default Dashboard;
