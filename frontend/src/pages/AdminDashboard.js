import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const statusClass = (status) => `status-pill status-${status.replace(/\s/g, "-")}`;

const AdminDashboard = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get("/admin/stats");
        setStats(data);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <>
      <div className="dash-header">
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <h1>Admin dashboard</h1>
              <p className="sub">Signed in as {admin?.username}</p>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={handleLogout}>Log out</button>
          </div>
          <div className="dash-tabs">
            <Link to="/admin/dashboard" className="active">Overview</Link>
            <Link to="/admin/orders">Orders</Link>
            <Link to="/admin/customers">Customers</Link>
            <Link to="/admin/billing">Billing</Link>
          </div>
        </div>
      </div>

      <div className="dash-body">
        <div className="container">
          {loading || !stats ? (
            <p className="small-note">Loading dashboard...</p>
          ) : (
            <>
              <div className="stat-row">
                <div className="stat-cell">
                  <span className="num">{stats.totalOrders}</span>
                  <span className="label">Total orders</span>
                </div>
                <div className="stat-cell">
                  <span className="num">{stats.pendingOrders}</span>
                  <span className="label">Pending orders</span>
                </div>
                <div className="stat-cell">
                  <span className="num">{stats.totalCustomers}</span>
                  <span className="label">Registered customers</span>
                </div>
                <div className="stat-cell">
                  <span className="num">Rs {stats.totalRevenue.toLocaleString()}</span>
                  <span className="label">Revenue collected</span>
                </div>
              </div>

              <h2 style={{ fontSize: 20, marginBottom: 16 }}>Recent orders</h2>
              {stats.recentOrders.length === 0 ? (
                <div className="empty-state"><p>No orders placed yet.</p></div>
              ) : (
                <div className="table-wrap">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Order #</th>
                        <th>Customer</th>
                        <th>Total</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentOrders.map((o) => (
                        <tr key={o._id}>
                          <td>{o.orderNumber}</td>
                          <td>{o.customer?.fullName || "—"}</td>
                          <td>Rs {o.totalAmount.toLocaleString()}</td>
                          <td><span className={statusClass(o.status)}>{o.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
