import ContactMessage from '../models/contactMessageModel.js';
import transporter from '../config/mailer.js';

// Submit contact form
export const submitContact = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        // Save to database
        const contactMessage = new ContactMessage({
            name,
            email,
            subject,
            message
        });
        await contactMessage.save();

        // Send confirmation email (non-blocking)
        try {
            const mailOptions = {
                from: process.env.EMAIL_USER || 'noreply@sapphireoptics.co.uk',
                to: email,
                subject: 'Thank you for contacting Sapphire Optics',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <h2 style="color: #0F172A;">Thank you, ${name}!</h2>
                        <p style="color: #334155;">We have received your message and will respond within 24 hours.</p>
                        <p style="color: #334155;">Your message:</p>
                        <div style="background: #F1F5F9; padding: 15px; border-radius: 8px; margin: 10px 0;">
                            <p style="margin: 0; color: #475569;"><strong>Subject:</strong> ${subject}</p>
                            <p style="margin: 10px 0 0 0; color: #475569;">${message}</p>
                        </div>
                        <p style="color: #334155;">Best regards,<br>The Sapphire Optics Team</p>
                    </div>
                `
            };
            await transporter.sendMail(mailOptions);
        } catch (emailError) {
            console.error('Email sending failed (message still saved):', emailError.message);
        }

        res.status(200).json({ success: true, message: 'Message sent successfully' });
    } catch (error) {
        console.error('Contact form error:', error);
        console.error('Error details:', error.message);
        console.error('Error stack:', error.stack);
        res.status(500).json({ success: false, message: 'Error sending message', error: error.message });
    }
};

// Get all contact messages (admin only)
export const getAllContacts = async (req, res) => {
    try {
        const contacts = await ContactMessage.find().sort({ receivedAt: -1 });
        res.status(200).json({ success: true, contacts });
    } catch (error) {
        console.error('Get contacts error:', error);
        res.status(500).json({ success: false, message: 'Error fetching contacts' });
    }
};

// Mark contact as read
export const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const contact = await ContactMessage.findByIdAndUpdate(id, { isRead: true }, { new: true });
        
        if (!contact) {
            return res.status(404).json({ success: false, message: 'Contact not found' });
        }

        res.status(200).json({ success: true, contact });
    } catch (error) {
        console.error('Mark as read error:', error);
        res.status(500).json({ success: false, message: 'Error updating contact' });
    }
};
