import React, { useState } from "react";
import api from "../api/axios";
import IMAGES from "../assets/images";

const stages = ["Placed", "Picked Up", "In Progress", "Ready", "Delivered"];

const TrackOrder = () => {
  const [orderNumber, setOrderNumber] = useState("");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setOrder(null);
    setLoading(true);
    try {
      const { data } = await api.get(`/orders/track/${orderNumber.trim()}`);
      setOrder(data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not find that order.");
    } finally {
      setLoading(false);
    }
  };

  const currentIndex = order ? stages.indexOf(order.status) : -1;
  const cancelled = order?.status === "Cancelled";

  return (
    <div className="page-narrow">
      <img className="page-banner" src={IMAGES.track} alt="" />
      <h1>Track your order</h1>
      <p className="sub" style={{ color: "var(--ink-soft)", marginBottom: 28 }}>
        Enter the order number from your confirmation to see where it is.
      </p>

      <form onSubmit={handleSubmit} style={{ display: "flex", gap: 10 }}>
        <input
          placeholder="e.g. DC-12345678"
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          required
          style={{
            flex: 1,
            padding: "11px 12px",
            border: "1px solid var(--line-strong)",
            borderRadius: "var(--radius)",
            fontSize: 15,
          }}
        />
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Searching..." : "Track"}
        </button>
      </form>

      {error && <div className="form-error" style={{ marginTop: 20 }}>{error}</div>}

      {order && (
        <div className="track-result card-panel">
          <p className="small-note" style={{ margin: 0 }}>Order {order.orderNumber}</p>
          <h2 style={{ fontSize: 22, marginTop: 4 }}>
            {cancelled ? "This order was cancelled" : `Status: ${order.status}`}
          </h2>

          {!cancelled && (
            <div className="track-progress">
              {stages.map((s, i) => (
                <div className={`track-step ${i <= currentIndex ? "done" : ""}`} key={s}>
                  <div className="track-dot" />
                  <div className="track-label">{s}</div>
                </div>
              ))}
            </div>
          )}

          <p className="small-note">
            Pickup: {new Date(order.pickupDate).toLocaleDateString()} · {order.pickupTime}
          </p>
          <p className="small-note">Items: {order.items.map((it) => `${it.garment} ×${it.quantity}`).join(", ")}</p>
          <p className="small-note">Total: Rs {order.totalAmount.toLocaleString()}</p>
        </div>
      )}
    </div>
  );
};

export default TrackOrder;
