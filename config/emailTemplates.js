export const EMAIL_VERIFY_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Email Verification</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f6f8fa;
        margin: 0;
        padding: 0;
        color: #333333;
      }
      .container {
        max-width: 600px;
        margin: 40px auto;
        background-color: #ffffff;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        padding: 40px;
      }
      .header {
        text-align: center;
        padding-bottom: 20px;
        border-bottom: 1px solid #d8d8d8;
      }
      .header img {
        max-width: 120px;
      }
      .content {
        padding: 20px 0;
      }
      .otp-box {
        font-size: 24px;
        font-weight: bold;
        background: linear-gradient(to bottom, #ff9d5c, #eb793d);
        padding: 15px;
        text-align: center;
        border-radius: 6px;
        margin: 20px auto;
        letter-spacing: 4px;
        color: #ffffff;
        user-select: all;
      }
      .note {
        text-align: center;
        font-size: 14px;
        color: #555;
        margin-bottom: 20px;
      }
      .footer {
        font-size: 12px;
        color: #888888;
        text-align: center;
        padding-top: 30px;
        border-top: 1px solid #eee;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <img
          src="/user-auth-logo.PNG"
          alt="Company Logo" />
        <h1>User Auth</h1>
      </div>
      <div class="content">
        <h2>Email Verification</h2>
        <p>Dear User,</p>
        <p>
          Thank you for registering with us. To verify your email address
          <strong>{{email}}</strong>, please use the following one-time password
          (OTP):
        </p>

        <div class="otp-box">{{Otp}}</div>
        <div class="note">
          Tap and hold to copy the code on mobile, or highlight and copy it
          manually on desktop.
        </div>

        <p>
          This OTP is valid for <strong>10 minutes</strong>. Please do not share
          this code with anyone to ensure your account’s security.
        </p>
        <p>If you didn’t request this, no further action is required.</p>
        <p>Need help? Contact our support team anytime.</p>
      </div>
      <div class="footer">
        &copy; {{year}} Your Company Name. All rights reserved.
      </div>
    </div>
  </body>
</html>


`;

export const PASSWORD_RESET_TEMPLATE = `

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <title>Password Reset Request</title>
    <meta
      http-equiv="X-UA-Compatible"
      content="IE=edge" />
    <meta
      http-equiv="Content-Type"
      content="text/html; charset=UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0" />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap"
      rel="stylesheet" />
    <style type="text/css">
      body {
        margin: 0;
        padding: 0;
        font-family: 'Open Sans', sans-serif;
        background-color: #f6f6f6;
        color: #000;
      }

      .container {
        max-width: 500px;
        margin: 60px auto;
        background-color: #ffffff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      }

      .main-content {
        padding: 48px 30px 40px;
      }

      h1 {
        font-size: 20px;
        margin: 0 0 16px;
        font-weight: 600;
      }

      p {
        font-size: 14px;
        line-height: 1.6;
        margin: 0 0 16px;
      }

      .otp-box {
        background: linear-gradient(to bottom, #ff9d5c, #eb793d);
        color: #ffffff;
        font-size: 22px;
        font-weight: bold;
        padding: 10px;
        text-align: center;
        border-radius: 6px;
        letter-spacing: 2px;
        margin: 20px 0;
        user-select: all;
      }

      .footer {
        font-size: 12px;
        color: #666666;
        text-align: center;
        padding: 24px;
        background-color: #fafafa;
      }
      .header {
        text-align: center;
        padding-bottom: 20px;
        border-bottom: 1px solid #d8d8d8;
        margin-bottom: 10px;
      }
      .header img {
        max-width: 120px;
      }
      @media only screen and (max-width: 480px) {
        .container {
          width: 90% !important;
        }
      }
    </style>
  </head>

  <body>
    <table
      width="100%"
      cellpadding="0"
      cellspacing="0"
      bgcolor="#f6f6f6">
      <tr>
        <td align="center">
          <table
            class="container"
            cellpadding="0"
            cellspacing="0">
            <tr>
              <td class="main-content">
                <div class="header">
                  <img
                    src="/user-auth-logo.PNG"
                    alt="Company Logo" />
                  <h1>User Auth</h1>
                </div>
                <h1>Reset Your Password</h1>
                <p>Hi there,</p>
                <p>
                  We received a request to reset the password for your account
                  associated with the email address:
                  <strong style="color: #eb793d">{{email}}</strong>
                </p>

                <p>
                  To proceed, please use the one-time password (OTP) below. Do
                  not share this OTP with anyone.
                </p>

                <div class="otp-box">{{otp}}</div>

                <p>
                  This OTP is valid for <strong>10 minutes</strong>. If you did
                  not request a password reset, please ignore this message. Your
                  account will remain secure.
                </p>

                <p>
                  For any assistance, feel free to contact our support team.
                </p>
              </td>
            </tr>
            <tr>
              <td class="footer">
                &copy; {{year}} Your Company Name. All rights reserved.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
