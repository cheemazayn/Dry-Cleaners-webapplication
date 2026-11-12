const axios = require("axios");
const Order = require("../models/Order");

const GEMINI_API_URL = (model) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

const SYSTEM_PROMPT = `You are the support assistant for Pressed & Co., an online dry cleaning
management platform. Answer only using the information below and the track_order tool. Keep
replies short (2-4 sentences), friendly and specific. If you don't know something, say so and
suggest the customer contact support directly rather than guessing.

What this website is and how it works:
Pressed & Co. lets customers create an account, schedule a pickup online, and have their
laundry cleaned and delivered back to them. Customers can track order status in real time,
view their order history, and see auto-generated invoices in their account. There is also
an admin side that staff use to manage orders, customers and billing.

Services & pricing (per item):
- Washing: from Rs 150
- Dry Cleaning: from Rs 400
- Ironing: from Rs 100
- Stain Removal: from Rs 250

Order flow: Placed -> Picked Up -> In Progress -> Ready -> Delivered. An invoice is generated
automatically per order with 5% tax added.

If the customer gives an order number (format like DC-12345678) or asks about an order's status,
use the track_order tool to look it up rather than guessing. Never invent an order status.
Do not discuss anything unrelated to Pressed & Co.'s dry cleaning service.`;

const trackOrderTool = {
  function_declarations: [
    {
      name: "track_order",
      description:
        "Look up a Pressed & Co. order by its order number and return its current status, pickup details, items and total.",
      parameters: {
        type: "object",
        properties: {
          orderNumber: {
            type: "string",
            description: "The order number, e.g. DC-12345678",
          },
        },
        required: ["orderNumber"],
      },
    },
  ],
};

// Frontend sends {role: "user"|"assistant", content: string} — Gemini wants "user"/"model"
const toGeminiContents = (messages) =>
  messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

const callGemini = async (contents, model) => {
  const response = await axios.post(
    `${GEMINI_API_URL(model)}?key=${process.env.GEMINI_API_KEY}`,
    {
      system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents,
      tools: [trackOrderTool],
    },
    { headers: { "content-type": "application/json" } }
  );
  return response.data;
};

const runTrackOrderTool = async (args) => {
  const order = await Order.findOne({ orderNumber: args.orderNumber });
  if (!order) {
    return { error: "No order found with that order number." };
  }
  return {
    orderNumber: order.orderNumber,
    status: order.status,
    pickupDate: order.pickupDate,
    pickupTime: order.pickupTime,
    items: order.items.map((i) => ({ garment: i.garment, service: i.service, quantity: i.quantity })),
    totalAmount: order.totalAmount,
  };
};

// @route POST /api/chat
// body: { messages: [{ role: "user" | "assistant", content: string }, ...] }
const handleChat = async (req, res) => {
  try {
    const model = process.env.GEMINI_MODEL || "gemini-3.1-flash-lite";

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.includes("your-real")) {
      return res.status(503).json({
        message: "The chat assistant isn't configured yet — add a real GEMINI_API_KEY to .env.",
      });
    }

    const { messages } = req.body;
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ message: "messages array is required" });
    }

    let contents = toGeminiContents(messages);
    let replyText = null;
    let iterations = 0;

    // Loop to handle Gemini requesting the track_order tool before giving a final answer
    while (!replyText && iterations < 4) {
      iterations += 1;
      const data = await callGemini(contents, model);

      const candidate = data.candidates?.[0];
      const parts = candidate?.content?.parts || [];
      const functionCallPart = parts.find((p) => p.functionCall);

      if (!functionCallPart) {
        replyText = parts
          .filter((p) => p.text)
          .map((p) => p.text)
          .join("\n")
          .trim();
        break;
      }

      // Put the model's function-call turn back into the conversation
      contents.push({ role: "model", parts });

      if (functionCallPart.functionCall.name === "track_order") {
        const toolResult = await runTrackOrderTool(functionCallPart.functionCall.args);
        contents.push({
          role: "function",
          parts: [
            {
              functionResponse: {
                name: "track_order",
                response: toolResult,
              },
            },
          ],
        });
      }
    }

    if (!replyText) {
      replyText = "Sorry, I'm having trouble answering that right now — please contact support directly.";
    }

    return res.json({ reply: replyText });
  } catch (error) {
    console.error("Chat error:", error.response?.data || error.message);
    return res.status(500).json({ message: "Chat request failed", error: error.message });
  }
};

module.exports = { handleChat };
