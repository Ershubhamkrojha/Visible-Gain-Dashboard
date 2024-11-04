import dotenv from 'dotenv';
import nodemailer from 'nodemailer'; // Ensure you have nodemailer imported

dotenv.config();




// Configure your transporter here (replace with your SMTP details)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

export const sendAdminVerificationEmail = async (user) => {
    const adminEmail = process.env.ADMIN_EMAIL; // Define admin email in your environment variables
    const verificationLink = `${process.env.APP_URL}/auth/verify-user?userEmail=${user.email}`; // Ensure temporaryUser.id is defined

    const mailOptions = {
        from: process.env.SMTP_USER,
        to: process.env.adminEmail, // Correctly reference adminEmail
        subject: 'New User Registration Awaiting Approval',
        html: `<p>A new user has registered:</p>
               <p>Username: ${user.username}</p>
               <p>Email: ${user.email}</p>
               <p>Please verify the user by clicking the link: <a href="${verificationLink}">Verify User</a></p>`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Verification email sent to admin: ${adminEmail}`);
    } catch (error) {
        console.error('Error sending admin verification email:', error);
        throw new Error('Could not send admin verification email'); // Throw an error instead of calling next
    }
};
