import React, { useState } from 'react';
import { plants, WA_NUMBER } from '../data/plants.js';
import { PageHero } from '../components/PageHero.jsx';
import Reveal from '../components/Reveal.jsx';
import { IconPin, IconPhone, IconMail, IconWhatsapp } from '../components/Icons.jsx';

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState({});

  const submit = e => {
    e.preventDefault();
    const form = new FormData(e.target);
    const name = form.get('name')?.toString().trim();
    const email = form.get('email')?.toString().trim();
    const messageText = form.get('message')?.toString().trim();
    const nextErrors = {};
    if (!name) nextErrors.name = 'Please enter your name.';
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) nextErrors.email = 'Please enter a valid email.';
    if (!messageText) nextErrors.message = 'Let us know what you need.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      setSent(true);
      e.target.reset();
    }
  };

  return (
    <main>
      <PageHero eyebrow="LET'S TALK" title="Tell us what you want to grow" copy="Need assistance? Share your requirement and our team will get back to you." image="/brand/community-banner.jpg" />
      <section className="contact-page container">
        <Reveal as="div" className="contact-info">
          <span className="eyebrow">CONTACT DETAILS</span>
          <h2>Ganesh Nursery</h2>
          <p>Our roots are in Thanjavur, and our plants reach customers across India.</p>
          <div className="contact-lines">
            <p><IconPin size={16} /> Natchathira Nagar, Thanjavur,<br />Tamil Nadu 613007</p>
            <p><IconPhone size={16} /> +91 99432 59955</p>
            <p><IconMail size={16} /> care@ganeshnursery.com</p>
          </div>
          <a className="btn primary" href={`https://wa.me/${WA_NUMBER}`} target="_blank" rel="noreferrer"><IconWhatsapp size={16} /> Chat on WhatsApp</a>
        </Reveal>

        <Reveal as="form" delay={80} className="contact-form" onSubmit={submit} noValidate>
          <h2>Send an enquiry</h2>
          <label>Your name
            <input name="name" placeholder="Your Name" aria-invalid={!!errors.name} />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </label>
          <label>Email
            <input name="email" type="email" placeholder="Email" aria-invalid={!!errors.email} />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </label>
          <label>Phone
            <input name="phone" placeholder="Phone Number (Optional)" />
          </label>
          <label>Message
            <textarea name="message" placeholder="Tell us what you need…" rows="5" aria-invalid={!!errors.message} />
            {errors.message && <span className="field-error">{errors.message}</span>}
          </label>
          <button className="btn primary" type="submit">Send Message</button>
          {sent && <div className="success">Thanks! Your enquiry is ready for the nursery team.</div>}
        </Reveal>

        <div className="contact-photo" style={{ backgroundImage: `url(${plants[7].image})` }}></div>
      </section>
    </main>
  );
}
