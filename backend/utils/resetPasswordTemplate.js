const resetPasswordTemplate = (resetUrl) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f6f9; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
        <tr>
          <td align="center" style="padding: 40px 10px;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 500px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); overflow: hidden;">
              
              <!-- Header Bar -->
              <tr>
                <td style="background-color: #4f46e5; padding: 30px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;">
                    Password Reset Request
                  </h1>
                </td>
              </tr>

              <!-- Body Content -->
              <tr>
                <td style="padding: 40px 30px; color: #334155; font-size: 15px; line-height: 1.6;">
                  <p style="margin-top: 0;">Hello,</p>
                  <p>We received a request to reset the password for your account. Click the button below to choose a new password:</p>
                  
                  <!-- Call to Action Button -->
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 30px 0;">
                    <tr>
                      <td align="center">
                        <a href="${resetUrl}" target="_blank" style="background-color: #4f46e5; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 6px; font-weight: bold; font-size: 15px; display: inline-block;">
                          Reset Password
                        </a>
                      </td>
                    </tr>
                  </table>

                  <p style="margin-bottom: 0; color: #64748b; font-size: 13px;">
                    <strong>Note:</strong> This link will expire in <strong> 5 minutes</strong> for security reasons. If you did not request this, you can safely ignore this email.
                  </p>
                </td>
              </tr>

              <!-- Divider -->
              <tr>
                <td style="padding: 0 30px;">
                  <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 0;">
                </td>
              </tr>

              <!-- Fallback Link -->
              <tr>
                <td style="padding: 20px 30px; color: #94a3b8; font-size: 12px; line-height: 1.4; word-break: break-all;">
                  If the button above doesn't work, copy and paste this link into your web browser:
                  <br>
                  <a href="${resetUrl}" style="color: #4f46e5; text-decoration: underline;">${resetUrl}</a>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

module.exports = resetPasswordTemplate;