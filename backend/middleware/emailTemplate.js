
// --- CyberCart OTP Verification Email Template ---
export const emailTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your CyberCart Security Code</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f0f0f0; 
            color: #333;
            line-height: 1.6;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 1.5rem;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            border-top: 6px solid #5b42f3; /* Primary Cyber Blue */
            overflow: hidden;
        }
        .header {
            padding: 30px;
            text-align: center;
            background: #e8e8e8;
            border-bottom: 1px solid #ddd;
        }
        .header h1 {
            margin: 0;
            color: #333;
            font-size: 28px;
            font-weight: 800;
            text-shadow: 2px 2px 3px #bababa;
        }
        .content {
            padding: 40px 30px;
            text-align: center;
        }
        .otp-code {
            font-size: 40px;
            font-weight: bold;
            color: #5b42f3;
            margin: 25px 0;
            padding: 15px 30px;
            background: #f3f3f3;
            border-radius: 12px;
            display: inline-block;
            letter-spacing: 8px;
            box-shadow: inset 2px 2px 5px #bababa, inset -2px -2px 5px #ffffff; /* Neumorphic effect */
            border: 1px dashed #5b42f3;
        }
        .warning {
            color: #dc2626;
            font-weight: bold;
            margin-top: 20px;
            font-size: 14px;
        }
        .footer {
            background-color: #5b42f3; /* Cyber Blue */
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #ffffff;
        }
        .footer a {
            color: #00ddeb; /* Cyber Cyan */
            text-decoration: none;
            margin: 0 10px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>CyberCart</h1>
        </div>
        <div class="content">
            <p>Hello [User Name],</p>
            <p>You recently requested a One-Time Password (OTP) for your CyberCart account.</p>
            <p>Please use the following OTP to complete your action:</p>
            <div class="otp-code">[OTP_CODE]</div>
            <p>This OTP is valid for [OTP_VALIDITY_MINUTES] minutes.</p>
            <p class="warning"><strong>Do not share this code with anyone.</strong></p>
        </div>
        <div class="footer">
            <p>&copy; [CURRENT_YEAR] CyberCart. All rights reserved.</p>
            <p>
                <a href="[YOUR_WEBSITE_URL]">Visit Store</a> |
                <a href="[PRIVACY_POLICY_URL]">Privacy Policy</a> |
                <a href="[TERMS_OF_SERVICE_URL]">Terms of Service</a>
            </p>
        </div>
    </div>
</body>
</html>
`;

// --- CyberCart Welcome Email Template ---
export const welcomeEmailTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to CyberCart!</title>
    <style>
        body { font-family: 'Segoe UI', sans-serif; margin: 0; padding: 0; background-color: #f0f0f0; color: #333; }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 1.5rem;
            border-top: 6px solid #af40ff; /* Purple accent */
            overflow: hidden;
        }
        .header { padding: 30px; text-align: center; background: #e8e8e8; }
        .header h1 { color: #333; text-shadow: 2px 2px 3px #bababa; font-size: 28px; }
        .content { padding: 40px 30px; text-align: center; }
        .action-button {
            display: inline-block;
            padding: 15px 30px;
            background: linear-gradient(144deg, #af40ff, #5b42f3 50%, #00ddeb);
            color: #ffffff;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
            font-size: 17px;
            margin: 20px 0;
            box-shadow: 2px 4px 10px rgba(91, 66, 243, 0.3);
        }
        .footer { background-color: #333; padding: 20px; text-align: center; font-size: 12px; color: #bbb; }
        .footer a { color: #00ddeb; text-decoration: none; }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>CyberCart</h1>
        </div>
        <div class="content">
            <p>Hello [User Name],</p>
            <p>Congratulations! Your account with <strong>CyberCart</strong> has been verified.</p>
            <p>We're excited to have you. You can now start exploring our latest tech gear.</p>
            <a href="[EXPLORE_SHOP_URL]" class="action-button">Start Shopping</a>
            <p>Best regards,<br/>The CyberCart Team</p>
        </div>
        <div class="footer">
            <p>&copy; [CURRENT_YEAR] CyberCart. All rights reserved.</p>
            <p><a href="[YOUR_WEBSITE_URL]">Visit our website</a></p>
        </div>
    </div>
</body>
</html>
`;

// --- Order Placed Template ---
export const orderPlacedTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: 'Segoe UI', sans-serif; margin: 0; padding: 0; background-color: #f0f0f0; color: #333; }
        .email-container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 1.5rem; border-top: 6px solid #5b42f3; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
        .header { padding: 30px; text-align: center; background: #e8e8e8; }
        .header h1 { color: #333; text-shadow: 2px 2px 3px #bababa; margin: 0; }
        .content { padding: 30px; text-align: center; }
        .order-box { background: #f9f9f9; border-radius: 12px; padding: 20px; margin: 20px 0; border: 1px solid #ddd; text-align: left; }
        .highlight { color: #5b42f3; font-weight: bold; }
        .action-button { display: inline-block; padding: 12px 25px; background: linear-gradient(144deg, #af40ff, #5b42f3 50%, #00ddeb); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 20px; }
        .footer { background-color: #333; padding: 20px; text-align: center; font-size: 12px; color: #bbb; }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header"><h1>CyberCart</h1></div>
        <div class="content">
            <h2>Order Placed! 🛒</h2>
            <p>Hello [User Name], thank you for your purchase! We've received your order and are getting it ready.</p>
            <div class="order-box">
                <p><strong>Order ID:</strong> <span class="highlight">#[ORDER_ID]</span></p>
                <p><strong>Total Amount:</strong> [TOTAL_AMOUNT]</p>
                <p><strong>Shipping To:</strong> [SHIPPING_ADDRESS]</p>
            </div>
            <a href="[ORDER_HISTORY_URL]" class="action-button">View Order Details</a>
        </div>
        <div class="footer"><p>&copy; [CURRENT_YEAR] CyberCart | Secure Future Shopping</p></div>
    </div>
</body>
</html>
`;

// --- Order Shipped Template ---
export const orderShippedTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f0f0f0; color: #333; line-height: 1.6; }
        .email-container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 1.5rem; border-top: 6px solid #5b42f3; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
        .header { padding: 30px; text-align: center; background: #e8e8e8; border-bottom: 1px solid #ddd; }
        .header h1 { color: #333; text-shadow: 2px 2px 3px #bababa; margin: 0; font-size: 28px; font-weight: 800; }
        .content { padding: 40px 30px; text-align: center; }
        .tracking-box { font-size: 24px; font-weight: bold; color: #5b42f3; margin: 25px 0; padding: 15px 30px; background: #f3f3f3; border-radius: 12px; display: inline-block; letter-spacing: 2px; box-shadow: inset 2px 2px 5px #bababa, inset -2px -2px 5px #ffffff; border: 1px dashed #5b42f3; }
        .action-button { display: inline-block; padding: 15px 30px; background: linear-gradient(144deg, #af40ff, #5b42f3 50%, #00ddeb); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 17px; margin-top: 20px; box-shadow: 2px 4px 10px rgba(91, 66, 243, 0.3); }
        .footer { background-color: #5b42f3; padding: 20px; text-align: center; font-size: 12px; color: #ffffff; }
        .footer a { color: #00ddeb; text-decoration: none; margin: 0 10px; }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header"><h1>CyberCart</h1></div>
        <div class="content">
            <h2>Your Order is on the Way! 🚀</h2>
            <p>Great news, [User Name]! Your order <strong>#[ORDER_ID]</strong> has been shipped and is heading to you.</p>
            <p>Tracking Number:</p>
            <div class="tracking-box">[TRACKING_NUMBER]</div>
            <br>
            <a href="[TRACKING_URL]" class="action-button">Track Package</a>
        </div>
        <div class="footer">
            <p>&copy; [CURRENT_YEAR] CyberCart. All rights reserved.</p>
            <p>
                <a href="[YOUR_WEBSITE_URL]">Visit Store</a> |
                <a href="[PRIVACY_POLICY_URL]">Privacy Policy</a>
            </p>
        </div>
    </div>
</body>
</html>
`;

// --- Order Delivered Template ---
export const orderDeliveredTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f0f0f0; color: #333; line-height: 1.6; }
        .email-container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 1.5rem; border-top: 6px solid #5b42f3; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
        .header { padding: 30px; text-align: center; background: #e8e8e8; border-bottom: 1px solid #ddd; }
        .header h1 { color: #333; text-shadow: 2px 2px 3px #bababa; margin: 0; font-size: 28px; font-weight: 800; }
        .content { padding: 40px 30px; text-align: center; }
        .success-icon { font-size: 60px; color: #5b42f3; margin-bottom: 10px; }
        .action-button { display: inline-block; padding: 15px 30px; background: linear-gradient(144deg, #af40ff, #5b42f3 50%, #00ddeb); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 17px; margin-top: 20px; box-shadow: 2px 4px 10px rgba(91, 66, 243, 0.3); }
        .footer { background-color: #333; padding: 20px; text-align: center; font-size: 12px; color: #bbb; }
        .footer a { color: #00ddeb; text-decoration: none; }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header"><h1>CyberCart</h1></div>
        <div class="content">
            <div class="success-icon">✔</div>
            <h2>Delivered! 📦</h2>
            <p>Hi [User Name], your order <strong>#[ORDER_ID]</strong> has been successfully delivered. We hope you love your new tech!</p>
            <p>We'd love to hear your thoughts on your purchase.</p>
            <a href="[REVIEW_URL]" class="action-button">Leave a Review</a>
        </div>
        <div class="footer">
            <p>&copy; [CURRENT_YEAR] CyberCart. Thank you for shopping with us!</p>
            <p><a href="[YOUR_WEBSITE_URL]">Visit our website</a></p>
        </div>
    </div>
</body>
</html>
`;