import transporter from "./emailConfig.js";
import { emailTemplate, welcomeEmailTemplate, orderPlacedTemplate,orderShippedTemplate, orderDeliveredTemplate } from "./emailTemplate.js";
import "dotenv/config";

const sendVerificationCode = async (
  fname,
  lname,
  email,
  subject,
  verificationCode,
  verificationCodeExpiresAt
) => {
  const mailOptions = {
    from: '"CyberCart" <info.mail.sender23@gmail.com>', // Updated Name
    to: email,
    subject: subject,
    html: emailTemplate
      .replace("[User Name]", `${fname} ${lname}`)
      .replace("[OTP_CODE]", verificationCode)
      .replace(
        "[OTP_VALIDITY_MINUTES]",
        Math.floor((verificationCodeExpiresAt - Date.now()) / 60000)
      )
      .replace("[CURRENT_YEAR]", new Date().getFullYear())
      .replace("[YOUR_WEBSITE_URL]", process.env.FRONTEND_URL)
      .replace("[PRIVACY_POLICY_URL]", `${process.env.FRONTEND_URL}privacypolicy`)
      .replace("[TERMS_OF_SERVICE_URL]", `${process.env.FRONTEND_URL}termsofservices`),
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("CyberCart Verification email sent:", info.response);
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
};

const sendWelcomeEmail = async (fname, lname, email) => {
  const mailOptions = {
    from: '"CyberCart" <info.mail.sender23@gmail.com>',
    to: email,
    subject: `🛒 Welcome to CyberCart, ${fname}! Let's get shopping!`,
    html: welcomeEmailTemplate
      .replace("[User Name]", `${fname} ${lname}`)
      .replace("[CURRENT_YEAR]", new Date().getFullYear())
      .replace("[EXPLORE_SHOP_URL]", `${process.env.FRONTEND_URL}shop`)
      .replace("[YOUR_WEBSITE_URL]", `${process.env.FRONTEND_URL}`)
      .replace("[PRIVACY_POLICY_URL]", `${process.env.FRONTEND_URL}privacypolicy`)
      .replace("[TERMS_OF_SERVICE_URL]", `${process.env.FRONTEND_URL}termsofservices`),
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("CyberCart Welcome email sent:", info.response);
  } catch (error) {
    console.error("Error sending welcome email:", error);
  }
};

const sendOrderPlacedEmail = async (fname, lname, email, orderDetails) => {
  const mailOptions = {
    from: '"CyberCart" <info.mail.sender23@gmail.com>',
    to: email,
    subject: `✅ Order Confirmed: #${orderDetails.id}`,
    html: orderPlacedTemplate
      .replace("[User Name]", `${fname} ${lname}`)
      .replace("[ORDER_ID]", orderDetails.id)
      .replace("[TOTAL_AMOUNT]", orderDetails.total)
      .replace("[SHIPPING_ADDRESS]", orderDetails.address)
      .replace("[CURRENT_YEAR]", new Date().getFullYear())
      .replace("[ORDER_HISTORY_URL]", `${process.env.FRONTEND_URL}myorders`)
  };
  await transporter.sendMail(mailOptions);
};

const sendOrderShippedEmail = async (fname, email, orderId, trackingNumber) => {
  const mailOptions = {
    from: '"CyberCart" <info.mail.sender23@gmail.com>',
    to: email,
    subject: `🚀 Your Order #${orderId} has been shipped!`,
    html: orderShippedTemplate
      .replace("[User Name]", fname)
      .replace("[ORDER_ID]", orderId)
      .replace("[TRACKING_NUMBER]", trackingNumber)
      .replace("[TRACKING_URL]", `${process.env.FRONTEND_URL}track/${trackingNumber}`)
      .replace("[CURRENT_YEAR]", new Date().getFullYear())
  };
  await transporter.sendMail(mailOptions);
};

const sendOrderDeliveredEmail = async (fname, email, orderId) => {
  const mailOptions = {
    from: '"CyberCart" <info.mail.sender23@gmail.com>',
    to: email,
    subject: `📦 Your CyberCart order #${orderId} is here!`,
    html: orderDeliveredTemplate
      .replace("[User Name]", fname)
      .replace("[ORDER_ID]", orderId)
      .replace("[REVIEW_URL]", `${process.env.FRONTEND_URL}product-review`)
      .replace("[CURRENT_YEAR]", new Date().getFullYear())
      .replace("[YOUR_WEBSITE_URL]", `${process.env.FRONTEND_URL}`)
  };
  await transporter.sendMail(mailOptions);
};

export { sendVerificationCode, sendWelcomeEmail, sendOrderPlacedEmail, sendOrderShippedEmail, sendOrderDeliveredEmail };