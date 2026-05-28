const { google } = require('googleapis');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// Google Sheets configuration
const SPREADSHEET_ID = '152dK2m3gluxCdBal9GGLs43aDKFBvy5BiHdnKL3gV4o';
const CREDENTIALS_SHEET = 'Credentials';

const JWT_SECRET = process.env.JWT_SECRET || 'FPG2025SecureKey!ChangeThisInProduction';
const RESET_TOKEN_EXPIRY = '1h'; // Reset link expires in 1 hour

async function getAuthClient() {
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
  
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  });

  return await auth.getClient();
}

function getTransporter() {
  if (process.env.SENDGRID_API_KEY) {
    return nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 587,
      auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY
      }
    });
  } else {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const authClient = await getAuthClient();
    const sheets = google.sheets({ version: 'v4', auth: authClient });

    let credentialsData;
    try {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${CREDENTIALS_SHEET}!A2:E`
      });
      credentialsData = response.data.values || [];
    } catch (error) {
      console.error('Error accessing credentials sheet:', error);
      return res.status(500).json({ error: 'System error. Please contact administrator.' });
    }

    let foundUser = null;
    let userRowIndex = -1;

    for (let i = 0; i < credentialsData.length; i++) {
      const row = credentialsData[i];
      const storedUsername = row[0] || '';
      const storedEmail = row[3] || row[0];
      
      if (email.toLowerCase() === storedEmail.toLowerCase() || 
          email.toLowerCase() === storedUsername.toLowerCase()) {
        foundUser = {
          username: storedUsername,
          email: storedEmail,
          role: row[2] || 'Leadership'
        };
        userRowIndex = i + 2;
        break;
      }
    }

    if (!foundUser) {
      console.log(`Password reset requested for unknown email: ${email}`);
      return res.json({ 
        success: true, 
        message: 'If an account with that email exists, a password reset link has been sent.' 
      });
    }

    const resetToken = jwt.sign(
      {
        username: foundUser.username,
        email: foundUser.email,
        purpose: 'password_reset',
        rowIndex: userRowIndex
      },
      JWT_SECRET,
      { expiresIn: RESET_TOKEN_EXPIRY }
    );

    const baseUrl = process.env.BASE_URL || 'https://fpg.complitrst.com';
    const resetUrl = `${baseUrl}/reset-password.html?token=${resetToken}`;

    const transporter = getTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@complitrst.com',
      to: foundUser.email,
      subject: 'FPG Leadership Portal - Password Reset Request',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #2d5016 0%, #4a7c2c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .btn { display: inline-block; padding: 15px 30px; background: #2d5016; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
            .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset</h1>
              <p>Florida Players Group</p>
            </div>
            <div class="content">
              <p>Hi ${foundUser.username},</p>
              <p>We received a request to reset your password for the FPG Leadership Portal.</p>
              <p style="text-align: center;">
                <a href="${resetUrl}" class="btn">Reset My Password</a>
              </p>
              <div class="warning">
                <strong>This link expires in 1 hour.</strong>
                <p style="margin: 5px 0 0 0;">If you didn't request this reset, you can safely ignore this email.</p>
              </div>
              <p>If the button doesn't work, copy and paste this link into your browser:</p>
              <p style="word-break: break-all; background: #eee; padding: 10px; border-radius: 5px; font-size: 12px;">
                ${resetUrl}
              </p>
            </div>
            <div class="footer">
              <p>Florida Players Group - Good Golf · Good Friends · Good Times</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`Password reset email sent to ${foundUser.email}`);
    } catch (emailError) {
      console.error('Error sending reset email:', emailError);
      return res.status(500).json({ error: 'Failed to send reset email. Please try again.' });
    }

    return res.json({ 
      success: true, 
      message: 'If an account with that email exists, a password reset link has been sent.' 
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ error: 'An error occurred. Please try again.' });
  }
};
