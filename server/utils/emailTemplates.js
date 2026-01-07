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
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <style>
    body { font-family: 'Inter', system-ui, -apple-system, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; color: #0f172a; }
    .container { max-width: 500px; margin: 40px auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.03); border: 1px solid #e2e8f0; }
    
    /* Elegant Header */
    .header { background: #ffffff; padding: 30px; text-align: center; border-bottom: 1px solid #f1f5f9; }
    .app-name { font-size: 20px; font-weight: 700; color: #4f46e5; letter-spacing: -0.5px; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; }
    .app-icon { width: 24px; height: 24px; background: #4f46e5; border-radius: 6px; display: inline-block; }
    
    /* Content Area */
    .content { padding: 40px 36px; text-align: center; }
    .title { font-size: 24px; font-weight: 700; color: #0f172a; margin-bottom: 12px; letter-spacing: -0.5px; }
    .message { color: #64748b; font-size: 15px; line-height: 1.6; margin-bottom: 32px; }
    
    /* Modern OTP Box */
    .otp-wrapper { margin: 32px 0; }
    .otp-code { 
      font-size: 32px; 
      font-weight: 700; 
      color: #4f46e5; 
      letter-spacing: 4px; 
      font-family: 'SF Mono', 'Roboto Mono', monospace; 
      background: #eef2ff; 
      padding: 16px 32px; 
      border-radius: 12px; 
      display: inline-block;
      user-select: all;
    }
    
    /* Minimal Footer */
    .footer { background: #f8fafc; padding: 24px; text-align: center; border-top: 1px solid #e2e8f0; }
    .footer-text { color: #94a3b8; font-size: 12px; line-height: 1.5; }
    .expiry-badge { 
      display: inline-flex; 
      align-items: center; 
      gap: 6px; 
      background: #fee2e2; 
      color: #991b1b; 
      font-size: 12px; 
      font-weight: 600; 
      padding: 6px 12px; 
      border-radius: 99px; 
      margin-top: 24px; 
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
        <div class="app-name">
            <span style="font-size: 22px;">⚡ Doora</span>
        </div>
    </div>
    
    <div class="content">
      <div class="title">${title}</div>
      <div class="message">${message}</div>
      
      <div class="otp-wrapper">
        <div class="otp-code">${otp}</div>
      </div>
      
      <div class="expiry-badge">
        <span>⏰ Expires in 10 minutes</span>
      </div>
    </div>
    
    <div class="footer">
      <div class="footer-text">
        Secure login powered by Doora Task Manager.<br/>
        If you didn't request this code, you can safely ignore this email.
      </div>
    </div>
  </div>
</body>
</html>
  `;
};
