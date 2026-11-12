import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const statusOptions = ["Placed", "Picked Up", "In Progress", "Ready", "Delivered", "Cancelled"];
const statusClass = (status) => `status-pill status-${status.replace(/\s/g, "-")}`;

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/orders");
      setOrders(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (id, status) => {
    setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, status } : o)));
    try {
      await api.put(`/admin/orders/${id}/status`, { status });
    } catch (err) {
      fetchOrders(); // revert on failure
    }
  };

  const visible = filter === "All" ? orders : orders.filter((o) => o.status === filter);

  return (
    <>
      <div className="dash-header">
        <div className="container">
          <h1>Orders</h1>
          <p className="sub">Update status as each order moves through the workflow.</p>
          <div className="dash-tabs">
            <Link to="/admin/dashboard">Overview</Link>
            <Link to="/admin/orders" className="active">Orders</Link>
            <Link to="/admin/customers">Customers</Link>
            <Link to="/admin/billing">Billing</Link>
          </div>
        </div>
      </div>

      <div className="dash-body">
        <div className="container">
          <div style={{ marginBottom: 20 }}>
            <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ padding: "8px 10px", border: "1px solid var(--line-strong)", borderRadius: "var(--radius)" }}>
              <option>All</option>
              {statusOptions.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>

          {loading ? (
            <p className="small-note">Loading orders...</p>
          ) : visible.length === 0 ? (
            <div className="empty-state"><p>No orders match this filter.</p></div>
          ) : (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Order #</th>
                    <th>Customer</th>
                    <th>Pickup</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((o) => (
                    <tr key={o._id}>
                      <td>{o.orderNumber}</td>
                      <td>
                        {o.customer?.fullName}
                        <div className="small-note">{o.customer?.email}</div>
                      </td>
                      <td>{new Date(o.pickupDate).toLocaleDateString()} · {o.pickupTime}</td>
                      <td>{o.items.map((it) => `${it.garment} ×${it.quantity}`).join(", ")}</td>
                      <td>Rs {o.totalAmount.toLocaleString()}</td>
                      <td>
                        <select
                          value={o.status}
                          onChange={(e) => handleStatusChange(o._id, e.target.value)}
                          className={statusClass(o.status)}
                          style={{ border: "1px solid var(--line-strong)", background: "#fff" }}
                        >
                          {statusOptions.map((s) => <option key={s}>{s}</option>)}
                        </select>
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

export default AdminOrders;
