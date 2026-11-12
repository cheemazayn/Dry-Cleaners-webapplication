import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-col">
          <p className="footer-brand">Pressed &amp; Co.</p>
          <p className="footer-note">
            Pickup, cleaning and delivery, managed online from start to finish.
          </p>
        </div>
        <div className="footer-col">
          <p className="footer-heading">Services</p>
          <Link to="/register">Washing</Link>
          <Link to="/register">Dry cleaning</Link>
          <Link to="/register">Ironing</Link>
          <Link to="/register">Stain removal</Link>
        </div>
        <div className="footer-col">
          <p className="footer-heading">Account</p>
          <Link to="/login">Log in</Link>
          <Link to="/register">Create an account</Link>
          <Link to="/track">Track an order</Link>
        </div>
        <div className="footer-col">
          <p className="footer-heading">Contact</p>
          <p className="footer-note">hello@pressedandco.example</p>
          <p className="footer-note">+92 300 0000000</p>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Pressed &amp; Co. All rights reserved.</span>
      </div>
    </footer>
  );
};

export default Footer;
