import React, { useState } from 'react';
import { site, waLink, mapsLink, fullAddress } from '../data/site.js';
import { PageHero } from '../components/PageHero.jsx';
import Reveal from '../components/Reveal.jsx';
import Seo from '../components/Seo.jsx';
import { IconPin, IconPhone, IconMail, IconWhatsapp, IconClock } from '../components/Icons.jsx';

const SUBJECTS = [
  'Bulk / institutional order',
  'Timber saplings',
  'Fruit trees',
  'Landscaping or green wall',
  'Something else'
];

export default function Contact() {
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [errors, setErrors] = useState({});

  const validate = data => {
    const next = {};
    if (!data.name) next.name = 'Please enter your name.';
    if (!data.email && !data.phone) {
      next.email = 'Give us either an email or a phone number so we can reply.';
    } else if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email)) {
      next.email = 'That email address does not look right.';
    }
    // Indian mobile numbers: 10 digits, optionally with +91 or 0 prefix.
    if (data.phone && !/^(\+?91)?0?[6-9]\d{9}$/.test(data.phone.replace(/[\s-]/g, ''))) {
      next.phone = 'Enter a 10-digit mobile number.';
    }
    if (!data.message) next.message = 'Tell us what you need.';
    return next;
  };

  const submit = async e => {
    e.preventDefault();
    const form = e.target;
    const fd = new FormData(form);

    // Honeypot — bots fill hidden fields, humans do not. Silently accept.
    if (fd.get('company')) { setStatus('sent'); form.reset(); return; }

    const data = {
      name: (fd.get('name') || '').toString().trim(),
      email: (fd.get('email') || '').toString().trim(),
      phone: (fd.get('phone') || '').toString().trim(),
      subject: (fd.get('subject') || '').toString(),
      message: (fd.get('message') || '').toString().trim()
    };

    const nextErrors = validate(data);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      form.querySelector(`[name="${Object.keys(nextErrors)[0]}"]`)?.focus();
      return;
    }

    // -----------------------------------------------------------------------
    // THE BIG ONE. The previous form validated the input, showed "Thanks!",
    // cleared the fields — and then did nothing at all with the data. Every
    // enquiry submitted through the website was silently discarded.
    //
    // Now: if VITE_CONTACT_ENDPOINT is configured, the lead is POSTed there.
    // If it is not configured, or the request fails, the message is handed to
    // WhatsApp pre-filled so the customer can still reach you in one tap.
    // -----------------------------------------------------------------------
    const composed =
      'New website enquiry\n\n' +
      `Name: ${data.name}\n` +
      (data.email ? `Email: ${data.email}\n` : '') +
      (data.phone ? `Phone: ${data.phone}\n` : '') +
      `Topic: ${data.subject}\n\n${data.message}`;

    if (!site.contactEndpoint) {
      window.open(waLink(composed), '_blank', 'noopener');
      setStatus('sent');
      form.reset();
      return;
    }

    setStatus('sending');
    try {
      const res = await fetch(site.contactEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...data, source: 'ganeshnursery.co.in', sentAt: new Date().toISOString() })
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      setStatus('sent');
      form.reset();
    } catch {
      setStatus('error');
    }
  };

  return (
    <main>
      <Seo
        title="Contact Our Nursery in Thanjavur"
        description={`Visit or contact ${site.name} in ${site.address.city} — call ${site.phoneDisplay}, message on WhatsApp, or send an enquiry for timber saplings, macadamia, fruit trees and landscaping. Open ${site.openingHours}.`}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'ContactPage',
          name: `Contact ${site.name}`,
          url: `${site.url}/contact`
        }}
      />

      <PageHero
        eyebrow="Let's talk"
        title="Tell us what you want to grow"
        copy="Share your site, quantity and timeline. We usually reply the same working day."
        image="/brand/banner-contact.jpg"
      />

      <section className="contact-page container">
        <Reveal as="div" className="contact-info">
          <span className="eyebrow">Contact details</span>
          <h2>{site.name}</h2>
          <p>Our roots are in {site.address.city}, and our plants reach customers across India.</p>

          <ul className="contact-lines">
            <li>
              <IconPin size={16} />
              <span>{fullAddress.map(line => <React.Fragment key={line}>{line}<br /></React.Fragment>)}</span>
            </li>
            <li><IconPhone size={16} /><a href={`tel:${site.phoneE164}`}>{site.phoneDisplay}</a></li>
            <li><IconMail size={16} /><a href={`mailto:${site.email}`}>{site.email}</a></li>
            <li><IconClock size={16} /><span>{site.openingHours}</span></li>
          </ul>

          <div className="contact-cta-row">
            <a className="btn primary" href={waLink(`Hi ${site.name}, I have an enquiry.`)} target="_blank" rel="noreferrer">
              <IconWhatsapp size={16} /> Chat on WhatsApp
            </a>
            <a className="btn ghost" href={mapsLink} target="_blank" rel="noreferrer">Get directions</a>
          </div>
        </Reveal>

        <Reveal as="div" delay={80} className="contact-form-wrap">
          <form className="contact-form" onSubmit={submit} noValidate>
            <h2>Send an enquiry</h2>

            <label htmlFor="cf-name">
              Your name <span className="req" aria-hidden="true">*</span>
              <input id="cf-name" name="name" autoComplete="name" aria-invalid={!!errors.name} aria-describedby={errors.name ? 'err-name' : undefined} />
              {errors.name && <span className="field-error" id="err-name">{errors.name}</span>}
            </label>

            <div className="field-row">
              <label htmlFor="cf-email">
                Email
                <input id="cf-email" name="email" type="email" autoComplete="email" inputMode="email" aria-invalid={!!errors.email} aria-describedby={errors.email ? 'err-email' : undefined} />
                {errors.email && <span className="field-error" id="err-email">{errors.email}</span>}
              </label>
              <label htmlFor="cf-phone">
                Phone / WhatsApp
                <input id="cf-phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="98765 43210" aria-invalid={!!errors.phone} aria-describedby={errors.phone ? 'err-phone' : undefined} />
                {errors.phone && <span className="field-error" id="err-phone">{errors.phone}</span>}
              </label>
            </div>

            <label htmlFor="cf-subject">
              What is this about?
              <select id="cf-subject" name="subject" defaultValue={SUBJECTS[0]}>
                {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>

            <label htmlFor="cf-message">
              Message <span className="req" aria-hidden="true">*</span>
              <textarea id="cf-message" name="message" rows="5" placeholder="Species, quantity, delivery district and timeline…" aria-invalid={!!errors.message} aria-describedby={errors.message ? 'err-message' : undefined} />
              {errors.message && <span className="field-error" id="err-message">{errors.message}</span>}
            </label>

            {/* Honeypot: off-screen, not focusable, ignored by humans. */}
            <div className="hp-field" aria-hidden="true">
              <label htmlFor="cf-company">Company (leave blank)</label>
              <input id="cf-company" name="company" tabIndex={-1} autoComplete="off" />
            </div>

            <button className="btn primary" type="submit" disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending…' : 'Send enquiry'}
            </button>

            <div role="status" aria-live="polite">
              {status === 'sent' && (
                <div className="form-note success">
                  Thanks — your enquiry is on its way. We usually reply the same working day.
                </div>
              )}
              {status === 'error' && (
                <div className="form-note error">
                  Something went wrong sending that. Please{' '}
                  <a href={waLink(`Hi ${site.name}, I tried the website form and it failed.`)} target="_blank" rel="noreferrer">
                    message us on WhatsApp
                  </a>{' '}
                  or call {site.phoneDisplay} — we do not want to lose your enquiry.
                </div>
              )}
            </div>
          </form>
        </Reveal>

        <Reveal as="div" delay={140} className="contact-map">
          {/* A real embedded map, replacing the decorative dashed circles that
              used to sit here pretending to be one. */}
          <iframe
            title={`Map showing ${site.name}`}
            src={`https://www.google.com/maps?q=${encodeURIComponent(site.mapsQuery)}&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </Reveal>
      </section>
    </main>
  );
}
