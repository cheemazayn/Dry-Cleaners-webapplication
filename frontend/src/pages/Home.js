import React from "react";
import { Link } from "react-router-dom";
import IMAGES from "../assets/images";

const services = [
  { name: "Washing", desc: "Everyday laundry, sorted and washed to care-label spec.", price: "From Rs 150 / item" },
  { name: "Dry Cleaning", desc: "Solvent cleaning for suits, silk, wool and delicate fabric.", price: "From Rs 400 / item" },
  { name: "Ironing", desc: "Press and finish only — for garments that just need shape back.", price: "From Rs 100 / item" },
  { name: "Stain Removal", desc: "Targeted treatment for oil, ink and set-in stains.", price: "From Rs 250 / item" },
];

const steps = [
  { title: "Schedule a pickup", body: "Choose a date, time window and address — we come to you, no drop-off required." },
  { title: "We clean it properly", body: "Each garment is sorted by fabric and service type and handled by trained staff." },
  { title: "Track it in real time", body: "Your order status updates as it moves from pickup through to ready-for-delivery." },
  { title: "Delivered back to you", body: "Pressed, folded and delivered to your door, with a digital invoice waiting in your account." },
];

const Home = () => {
  return (
    <>
      <section className="hero">
        <div className="hero-inner">
          <div>
            <p className="hero-eyebrow">Online dry cleaning, managed end to end</p>
            <h1>Laundry care, run from your phone.</h1>
            <p className="hero-lede">
              Book a pickup, track every garment through cleaning, and pay online —
              Pressed &amp; Co. replaces the counter with a system that actually tells you
              where your order is.
            </p>
            <div className="hero-actions">
              <Link to="/register" className="btn btn-primary">Book a pickup</Link>
              <Link to="/track" className="btn btn-secondary">Track an order</Link>
            </div>
          </div>
          <div className="hero-figures">
            <div className="hero-figure">
              <span className="num">24 hr</span>
              <span className="label">Average turnaround on standard washing</span>
            </div>
            <div className="hero-figure">
              <span className="num">4</span>
              <span className="label">Service types — wash, dry clean, iron, stain removal</span>
            </div>
            <div className="hero-figure">
              <span className="num">100%</span>
              <span className="label">Orders tracked from pickup to delivery</span>
            </div>
          </div>
        </div>
      </section>

      <div className="photo-band photo-band-tall">
        <img src={IMAGES.heroBand} alt="Freshly pressed shirts, folded and ready for delivery" />
        <span className="photo-caption">Cleaned, pressed and folded — then delivered.</span>
      </div>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>What used to happen at the counter now happens online.</h2>
            <p className="section-note">
              Paper tickets and phone calls made it hard to know where an order stood.
              Every step below is logged against your account instead.
            </p>
          </div>
          <div className="steps-media">
            <img className="side-photo" src={IMAGES.steps} alt="Staff member handling garments at the cleaning counter" loading="lazy" />
          <div className="steps">
            {steps.map((s, i) => (
              <div className="step" key={s.title}>
                <span className="step-num">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </div>
              </div>
            ))}
          </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="split">
            <div>
              <h2>Services &amp; pricing</h2>
              <p className="section-note">
                Pricing is per item and shown at checkout before you confirm pickup — no
                surprise line items on the invoice.
              </p>
              <img className="side-photo" src={IMAGES.services} alt="Suits hanging on a rail after dry cleaning" loading="lazy" />
            </div>
            <div className="service-list">
              {services.map((s) => (
                <div className="service-row" key={s.name}>
                  <h4>{s.name}</h4>
                  <p>{s.desc}</p>
                  <span className="service-price">{s.price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="photo-band">
        <img src={IMAGES.band} alt="Washers and dryers in our cleaning facility" loading="lazy" />
        <span className="photo-caption">Professional machines, fabric-specific programmes.</span>
      </div>

      <section className="section">
        <div className="container">
          <div className="split">
            <div>
              <h2>Built for people who don't want to guess.</h2>
              <p className="section-note">
                Every account keeps a running order history and billing record, so you
                always know what was cleaned, when, and what it cost.
              </p>
              <img className="side-photo" src={IMAGES.ironing} alt="Shirt being pressed with a steam iron" loading="lazy" />
            </div>
            <div className="steps">
              <div className="step">
                <span className="step-num">—</span>
                <div>
                  <h3>One account, every order</h3>
                  <p>Your pickup addresses, past orders and invoices live in one place, ready the next time you book.</p>
                </div>
              </div>
              <div className="step">
                <span className="step-num">—</span>
                <div>
                  <h3>Status that actually updates</h3>
                  <p>Orders move through Placed, Picked Up, In Progress, Ready and Delivered — visible any time you check.</p>
                </div>
              </div>
              <div className="step">
                <span className="step-num">—</span>
                <div>
                  <h3>No account needed to track</h3>
                  <p>Anyone with an order number can check status from the Track order page, no login required.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="cta-band cta-band-photo"
        style={{ backgroundImage: `linear-gradient(rgba(44,77,58,0.86), rgba(44,77,58,0.9)), url(${IMAGES.cta})` }}
      >
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
          <div>
            <h2>Ready to hand off your laundry?</h2>
            <p>Create an account and your first pickup can be scheduled in under two minutes.</p>
          </div>
          <Link to="/register" className="btn btn-secondary">Create an account</Link>
        </div>
      </section>
    </>
  );
};

export default Home;
