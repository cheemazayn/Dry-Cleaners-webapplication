import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const defaultPrices = {
  Washing: 150,
  "Dry Cleaning": 400,
  Ironing: 100,
  "Stain Removal": 250,
};

const emptyItem = () => ({
  service: "Washing",
  garment: "",
  quantity: 1,
  pricePerItem: defaultPrices.Washing,
});

const PlaceOrder = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [items, setItems] = useState([emptyItem()]);
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("09:00 - 11:00");
  const [deliveryAddress, setDeliveryAddress] = useState(user?.address || "");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const updateItem = (index, field, value) => {
    const next = [...items];
    next[index][field] = value;
    if (field === "service") {
      next[index].pricePerItem = defaultPrices[value];
    }
    setItems(next);
  };

  const addItem = () => setItems([...items, emptyItem()]);
  const removeItem = (index) => setItems(items.filter((_, i) => i !== index));

  const total = items.reduce((sum, i) => sum + Number(i.quantity) * Number(i.pricePerItem), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (items.some((i) => !i.garment.trim())) {
      setError("Please name every garment (e.g. Shirt, Suit, Bedsheet).");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post("/orders", {
        items,
        pickupDate,
        pickupTime,
        deliveryAddress,
        specialInstructions,
      });
      navigate("/orders", { state: { placed: data.orderNumber } });
    } catch (err) {
      setError(err.response?.data?.message || "Could not place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="dash-header">
        <div className="container">
          <h1>Place an order</h1>
          <p className="sub">Add the garments you'd like collected and choose a pickup window.</p>
          <div className="dash-tabs">
            <Link to="/dashboard">Overview</Link>
            <Link to="/place-order" className="active">Place an order</Link>
            <Link to="/orders">Order history</Link>
            <Link to="/billing">Billing</Link>
            <Link to="/profile">Profile</Link>
          </div>
        </div>
      </div>

      <div className="dash-body">
        <div className="container">
          <div className="split">
            <div>
              <h2 style={{ fontSize: 20 }}>Pickup details</h2>
              <form onSubmit={handleSubmit} id="order-form">
                {error && <div className="form-error">{error}</div>}

                <div className="field-row">
                  <div className="field">
                    <label htmlFor="pickupDate">Pickup date</label>
                    <input
                      id="pickupDate"
                      type="date"
                      required
                      min={new Date().toISOString().split("T")[0]}
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="pickupTime">Pickup window</label>
                    <select id="pickupTime" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)}>
                      <option>09:00 - 11:00</option>
                      <option>11:00 - 13:00</option>
                      <option>14:00 - 16:00</option>
                      <option>16:00 - 18:00</option>
                    </select>
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="deliveryAddress">Pickup &amp; delivery address</label>
                  <textarea
                    id="deliveryAddress"
                    rows={3}
                    required
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                  />
                </div>

                <div className="field">
                  <label htmlFor="specialInstructions">Special instructions (optional)</label>
                  <textarea
                    id="specialInstructions"
                    rows={2}
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="e.g. Delicate embroidery on the blue kurta"
                  />
                </div>
              </form>
            </div>

            <div>
              <h2 style={{ fontSize: 20 }}>Garments</h2>
              <div className="order-items">
                {items.map((item, index) => (
                  <div className="order-item-row card-panel" key={index}>
                    <input
                      placeholder="Garment (e.g. Shirt)"
                      value={item.garment}
                      onChange={(e) => updateItem(index, "garment", e.target.value)}
                      required
                      form="order-form"
                    />
                    <select value={item.service} onChange={(e) => updateItem(index, "service", e.target.value)}>
                      {Object.keys(defaultPrices).map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => updateItem(index, "quantity", e.target.value)}
                    />
                    <input
                      type="number"
                      min={0}
                      value={item.pricePerItem}
                      onChange={(e) => updateItem(index, "pricePerItem", e.target.value)}
                    />
                    <span className="item-total">
                      Rs {(item.quantity * item.pricePerItem).toLocaleString()}
                    </span>
                    {items.length > 1 && (
                      <button type="button" className="remove-item" onClick={() => removeItem(index)}>
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button type="button" className="btn btn-secondary btn-sm" onClick={addItem}>
                + Add another garment
              </button>

              <div className="card-panel" style={{ marginTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p className="small-note" style={{ margin: 0 }}>Estimated total (5% tax added at checkout)</p>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 26, color: "var(--sage-dark)" }}>
                    Rs {total.toLocaleString()}
                  </span>
                </div>
                <button type="submit" form="order-form" className="btn btn-primary" disabled={loading}>
                  {loading ? "Placing order..." : "Confirm pickup"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlaceOrder;
