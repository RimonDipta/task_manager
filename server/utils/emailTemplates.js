export const generateEmailTemplate = (otp, type = "verification") => {
    const isVerification = type === "verification";
    const title = isVerification ? "Verify Your Email" : "2FA Login Code";
    const message = isVerification
        ? "Thanks for signing up for Task Manager! Use the code below to verify your email address and get started."
        : "Use the code below to complete your login. If you didn't request this, please change your password immediately.";

    return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); }
    .header { background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); padding: 30px; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 0.5px; }
    .content { padding: 40px 30px; text-align: center; }
    .logo-icon { font-size: 40px; margin-bottom: 20px; display: block; }
    .otp-box { background: #f0fdf4; border: 1px dashed #16a34a; border-radius: 12px; padding: 20px; margin: 30px 0; display: inline-block; }
    .otp-code { font-size: 36px; font-weight: 700; color: #15803d; letter-spacing: 6px; font-family: monospace; }
    .message { color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 20px; }
    .footer { background: #f9fafb; padding: 20px; text-align: center; color: #9ca3af; font-size: 12px; border-top: 1px solid #e5e7eb; }
    .expiry { color: #ef4444; font-size: 13px; font-weight: 500; margin-top: 10px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Task Manager</h1>
    </div>
    <div class="content">
      <div class="message">
        <strong>Hello there!</strong><br/>
        ${message}
      </div>
      
      <div class="otp-box">
        <div class="otp-code">${otp}</div>
      </div>
      
      <div class="expiry">
        ⏰ This code expires in 10 minutes
      </div>
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} Task Manager. All rights reserved.<br/>
      Secure Authentication System
    </div>
  </div>
</body>
</html>
  `;
};
