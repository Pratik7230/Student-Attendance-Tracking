import nodemailer from "nodemailer";
const sendEmail = async ({ to, subject, text }) => {

    const envConfig = {
        user: process.env.EMAIL_USER, // Replace with your Gmail address
        pass: process.env.EMAIL_APP_PASSWORD, // Replace with your generated App Password
    };

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: envConfig.user,
            pass: envConfig.pass,
        },
    });

    try {
        const mailOptions = {
            from: envConfig.user,
            to,
            subject,
            html:text
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully:", info.response);
        return { success: true, response: info.response };
    } catch (error) {
        console.error("Error sending email:", error);
        return { success: false, error };
    }
};

export default sendEmail;