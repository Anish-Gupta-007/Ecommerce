const crypto = require("crypto");

let Razorpay;
try {
  Razorpay = require("razorpay");
} catch (error) {
  console.warn("Razorpay is not installed. Run `npm i razorpay` to use online payments.");
}

const createRazorpayOrder = async (req, res) => {
  try {
    if (!Razorpay) {
      return res.status(500).json({
        success: false,
        message: "Razorpay package is missing on the server. Please ask the administrator to run `npm i razorpay`.",
      });
    }

    const { amount } = req.body;

    const key_id = (process.env.RAZORPAY_KEY_ID || "rzp_test_RcqBGtB5tOewQW").trim();
    const key_secret = (process.env.RAZORPAY_KEY_SECRET || "JcFEWS0K6Rex0pQpjFehJiHc").trim();

    console.log("Razorpay Key ID being used:", key_id);

    // Return a mock order if no valid keys are set, so frontend can simulate it
    if (!key_id || key_id === "rzp_test_dummy_key") {
      return res.status(200).json({
        success: true,
        isMocked: true,
        order: {
          id: `order_mock_${Date.now()}`,
          amount: Math.round(amount * 100),
          currency: "INR",
        }
      });
    }

    const instance = new Razorpay({
      key_id,
      key_secret,
    });

    const options = {
      amount: Math.round(amount * 100), // amount in smallest currency unit (paise)
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await instance.orders.create(options);

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.log("Razorpay Error:", error);
    res.status(500).json({
      success: false,
      message: error.error?.description || error.message || "Failed to create razorpay order",
    });
  }
};

module.exports = {
  createRazorpayOrder,
};
