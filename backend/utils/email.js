import nodemailer from 'nodemailer';
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASSWORD:", process.env.EMAIL_PASSWORD ? "SET" : "NOT SET");
const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT),
        secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });
};

const emailTemplates = {
  verification: (username, token, clientUrl) => ({
    subject: '✉️ Verify your Chatify account',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Segoe UI', sans-serif; background: #0f0f13; color: #e2e8f0; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 40px auto; background: #1a1a2e; border-radius: 16px; overflow: hidden; border: 1px solid #2d2d4e; }
            .header { background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 40px; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; font-weight: 700; color: white; }
            .body { padding: 40px; }
            .btn { display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 24px 0; }
            .footer { text-align: center; padding: 20px; color: #64748b; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⚡ Chatify</h1>
            </div>
            <div class="body">
              <h2>Welcome, ${username}! 👋</h2>
              <p>Thanks for joining Chatify. Please verify your email address to get started.</p>
              <a href="${clientUrl}/verify-email/${token}" class="btn">Verify Email Address</a>
              <p style="color: #64748b; font-size: 14px;">This link expires in 24 hours. If you didn't create an account, ignore this email.</p>
            </div>
            <div class="footer">© 2024 Chatify. All rights reserved.</div>
          </div>
        </body>
      </html>
    `,
  }),

  passwordReset: (username, token, clientUrl) => ({
    subject: '🔐 Reset your Chatify password',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Segoe UI', sans-serif; background: #0f0f13; color: #e2e8f0; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 40px auto; background: #1a1a2e; border-radius: 16px; overflow: hidden; border: 1px solid #2d2d4e; }
            .header { background: linear-gradient(135deg, #ef4444, #dc2626); padding: 40px; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; font-weight: 700; color: white; }
            .body { padding: 40px; }
            .btn { display: inline-block; background: linear-gradient(135deg, #ef4444, #dc2626); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 24px 0; }
            .footer { text-align: center; padding: 20px; color: #64748b; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⚡ Chatify</h1>
            </div>
            <div class="body">
              <h2>Password Reset, ${username}</h2>
              <p>You requested a password reset. Click the button below to create a new password.</p>
              <a href="${clientUrl}/reset-password/${token}" class="btn">Reset Password</a>
              <p style="color: #64748b; font-size: 14px;">This link expires in 1 hour. If you didn't request this, ignore this email.</p>
            </div>
            <div class="footer">© 2024 Chatify. All rights reserved.</div>
          </div>
        </body>
      </html>
    `,
  }),

  welcomeBack: (username) => ({
    subject: '👋 Welcome back to Chatify!',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 40px; background: #1a1a2e; color: #e2e8f0; border-radius: 16px;">
        <h2>Welcome back, ${username}! 🎉</h2>
        <p>You've just logged in to Chatify. If this wasn't you, please reset your password immediately.</p>
      </div>
    `,
  }),
};


export const sendEmail = async ({ to, templateName,data}) => {
    try {
        const transporter = createTransporter();
        const { subject, html } = emailTemplates[templateName](...data);
        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to,
            subject,
            html 
        });
        console.log(`📧 Email sent: ${templateName} to ${to}`);
    } catch (error) {
        console.error(`❌ Email error: ${error.message}`);
        //throw error;
        // Don't throw - email failures shouldn't break the app
    }
};
