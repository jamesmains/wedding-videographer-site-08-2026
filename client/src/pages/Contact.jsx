import { useState } from 'react';

export default function Contact({ navigate }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        event_date: '',
        venue: '',
        message: ''
    });

    const [status, setStatus] = useState({
        loading: false,
        success: false,
        error: null
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const api_url = import.meta.env.VITE_API_URL;


    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, success: false, error: null });

        try {
            const response = await fetch(`${api_url}/api/inquiries`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to send inquiry.');
            }

            // Reset form on success
            setStatus({ loading: false, success: true, error: null });
            setFormData({ name: '', email: '', event_date: '', venue: '', message: '' });
        } catch (err) {
            console.error('Contact Form Error:', err);
            setStatus({ loading: false, success: false, error: err.message });
        }
    };

    return (
        <div className="contact-page">
            <div className="contact-grid">

                {/* Left Column: About & Bio */}
                <section className="about-section">
                    <h1 className="page-title">About the Videographer</h1>
                    <p className="bio-text">
                        We specialize in creating timeless, documentary-style wedding films that capture
                        the raw emotion, romance, and authentic moments of your special day.
                    </p>
                    <div className="contact-details">
                        <h3>Direct Contact</h3>
                        <p><strong>Email:</strong> [Email Address]</p>
                        <p><strong>Location:</strong> [Availability]</p>
                    </div>
                </section>

                {/* Right Column: Inquiry Form */}
                <section className="form-section">
                    <h2 className="form-title">Let’s Connect</h2>

                    {status.success && (
                        <div className="alert alert-success">
                            ✨ Thank you! Your inquiry has been sent. We'll be in touch soon.
                        </div>
                    )}

                    {status.error && (
                        <div className="alert alert-error">
                            ❌ {status.error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="inquiry-form">
                        <div className="form-group">
                            <label htmlFor="name">Your Name *</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Sarah & Mark"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email Address *</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="sarah@example.com"
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="event_date">Wedding Date</label>
                                <input
                                    type="date"
                                    id="event_date"
                                    name="event_date"
                                    value={formData.event_date}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="venue">Venue / Location</label>
                                <input
                                    type="text"
                                    id="venue"
                                    name="venue"
                                    value={formData.venue}
                                    onChange={handleChange}
                                    placeholder="City, State, or Venue"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="message">Tell Us About Your Vision *</label>
                            <textarea
                                id="message"
                                name="message"
                                rows="4"
                                required
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="Share details about your wedding day..."
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className="btn-primary form-submit-btn"
                            disabled={status.loading}
                        >
                            {status.loading ? 'Sending...' : 'Send Inquiry'}
                        </button>
                    </form>
                </section>

            </div>
        </div>
    );
}