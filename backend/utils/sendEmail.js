const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

// Sends the admin an alert email when a customer places a new order
const sendOrderNotification = async (order, customer) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
    console.log("Email not configured — skipping order notification.");
    return;
  }

  const itemsList = order.items
    .map((i) => `  - ${i.garment} (${i.service}) x${i.quantity} — Rs ${i.pricePerItem * i.quantity}`)
    .join("\n");

  const textBody = `A new order was just placed on Pressed & Co.

Order #: ${order.orderNumber}
Placed: ${new Date(order.createdAt).toLocaleString()}

Customer
  Name: ${customer.fullName}
  Email: ${customer.email}
  Phone: ${customer.phone}
  Customer ID: ${customer._id}

Pickup
  Date: ${new Date(order.pickupDate).toLocaleDateString()}
  Time window: ${order.pickupTime}
  Address: ${order.deliveryAddress}
${order.specialInstructions ? `  Notes: ${order.specialInstructions}` : ""}

Items
${itemsList}

Total: Rs ${order.totalAmount}
Status: ${order.status}
`;

  try {
    await transporter.sendMail({
      from: `"Pressed & Co." <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_NOTIFY_EMAIL || process.env.EMAIL_USER,
      subject: `New order ${order.orderNumber} — ${customer.fullName}`,
      text: textBody,
    });
  } catch (error) {
    // Never let an email failure break order placement for the customer
    console.error("Order notification email failed:", error.message);
  }
};

module.exports = { sendOrderNotification };