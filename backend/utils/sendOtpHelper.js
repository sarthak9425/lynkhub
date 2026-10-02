const nodemailer = require('nodemailer');

/**
 * Send 6-digit OTP by Email and/or SMS.
 * Purpose:
 * registration | login | password-reset
 */
const sendOtpCode = async ({
  email,
  phone,
  otpCode,
  recipientName = 'User',
  purpose = 'registration'
}) => {
  let emailSent = false;
  let smsSent = false;

  let title = 'Security Verification';
  let actionText = 'complete your security verification';
  let subjectText = `Your LynkHub Security OTP Code: ${otpCode}`;

  if (purpose === 'registration') {
    title = 'Account Registration';
    actionText = 'complete your account registration';
    subjectText = `Your LynkHub Registration OTP: ${otpCode}`;
  } else if (purpose === 'login') {
    title = 'Login Authentication';
    actionText = 'verify your identity and log into your account';
    subjectText = `Your LynkHub Login Verification OTP: ${otpCode}`;
  } else if (purpose === 'password-reset') {
    title = 'Password Reset Request';
    actionText = 'reset your account password';
    subjectText = `Your LynkHub Password Reset OTP: ${otpCode}`;
  }

  // =========================================================
  // EMAIL OTP - NODEMAILER
  // =========================================================

  const smtpConfigured =
    Boolean(process.env.SMTP_HOST) &&
    Boolean(process.env.SMTP_USER) &&
    Boolean(process.env.SMTP_PASS);

  console.log('[SMTP] Configuration check:', {
    host: process.env.SMTP_HOST || 'MISSING',
    port: process.env.SMTP_PORT || '587',
    user: process.env.SMTP_USER ? 'SET' : 'MISSING',
    pass: process.env.SMTP_PASS ? 'SET' : 'MISSING',
    from: process.env.SMTP_FROM ? 'SET' : 'DEFAULT'
  });

  if (smtpConfigured) {
    try {
      const smtpPort = parseInt(
        process.env.SMTP_PORT || '587',
        10
      );

      const smtpSecure =
        process.env.SMTP_SECURE === 'true';

      console.log(
        `[SMTP] Connecting to ${process.env.SMTP_HOST}:${smtpPort} secure=${smtpSecure}`
      );

      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: smtpPort,
        secure: smtpSecure,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        },

        // Prevent Render request from hanging indefinitely
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 15000
      });

      const mailOptions = {
        from:
          process.env.SMTP_FROM ||
          `"LynkHub Security" <${process.env.SMTP_USER}>`,

        to: email,

        subject: subjectText,

        html: `
          <div style="
            font-family: Arial, sans-serif;
            max-width: 500px;
            margin: 0 auto;
            padding: 24px;
            background-color: #F8FAFC;
            border-radius: 16px;
            border: 1px solid #E2E8F0;
          ">

            <div style="
              text-align: center;
              margin-bottom: 20px;
            ">
              <h1 style="
                color: #4F46E5;
                margin: 0;
                font-size: 24px;
              ">
                LynkHub
              </h1>

              <p style="
                color: #64748B;
                font-size: 14px;
                margin-top: 4px;
              ">
                ${title}
              </p>
            </div>

            <div style="
              background-color: #FFFFFF;
              padding: 24px;
              border-radius: 12px;
              border: 1px solid #E2E8F0;
              text-align: center;
            ">

              <p style="
                color: #0F172A;
                font-size: 16px;
                margin-bottom: 12px;
              ">
                Hello <strong>${recipientName}</strong>,
              </p>

              <p style="
                color: #64748B;
                font-size: 14px;
                margin-bottom: 20px;
              ">
                Use the following 6-digit One-Time Password (OTP)
                to ${actionText}:
              </p>

              <div style="
                background-color: #EEF2FF;
                border: 1px solid #C7D2FE;
                color: #4F46E5;
                font-size: 32px;
                font-weight: bold;
                letter-spacing: 8px;
                padding: 16px;
                border-radius: 8px;
                display: inline-block;
                margin-bottom: 20px;
              ">
                ${otpCode}
              </div>

              <p style="
                color: #94A3B8;
                font-size: 12px;
                margin: 0;
              ">
                This OTP code will expire in 10 minutes.
                If you did not request this code, please ignore this email.
              </p>

            </div>
          </div>
        `
      };

      console.log(`[SMTP] Sending OTP to ${email}...`);

      const info = await transporter.sendMail(mailOptions);

      emailSent = true;

      console.log(
        `[EMAIL DISPATCHED] OTP sent to ${email} for purpose: ${purpose}`
      );

      console.log('[SMTP] Message ID:', info.messageId);

    } catch (err) {
      console.error(
        '[Nodemailer Email Error]:',
        err.message
      );

      console.error(
        '[Nodemailer Error Code]:',
        err.code || 'UNKNOWN'
      );

      console.error(
        '[Nodemailer Command]:',
        err.command || 'UNKNOWN'
      );

      console.error(
        '[Nodemailer Response]:',
        err.response || 'NO RESPONSE'
      );
    }
  } else {
    console.error(
      '[SMTP] SMTP configuration is incomplete.'
    );
  }

  // =========================================================
  // OPTIONAL TWILIO SMS
  // =========================================================

  if (
    phone &&
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_PHONE_NUMBER
  ) {
    try {
      const twilio = require('twilio');

      const client = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );

      await client.messages.create({
        body:
          `Your LynkHub ${title} OTP is: ` +
          `${otpCode}. Valid for 10 minutes.`,

        from: process.env.TWILIO_PHONE_NUMBER,

        to: phone
      });

      smsSent = true;

      console.log(
        `[SMS DISPATCHED] OTP sent to ${phone} for purpose: ${purpose}`
      );

    } catch (err) {
      console.error(
        '[Twilio SMS Error]:',
        err.message
      );
    }
  }

  // =========================================================
  // FINAL STATUS
  // =========================================================

  if (!emailSent && !smsSent) {
    console.error(
      `[OTP DELIVERY FAILED] No OTP delivery method succeeded for ${email}`
    );
  }

  return {
    emailSent,
    smsSent
  };
};

module.exports = sendOtpCode;