import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { site, yearsInBusiness } from '../data/site.js';
import { IconPlus, IconMinus } from './Icons.jsx';
import SmartImage from './SmartImage.jsx';
import Reveal from './Reveal.jsx';

// Google rewards pages that answer the question someone actually typed. These
// answers are written around the terms customers search for locally — "best
// nursery in Thanjavur", "affordable plants", "macadamia" — while still being
// genuinely useful to read. The matching FAQPage schema is emitted by Home.jsx,
// which can win an expanded result in the search listing.
export const faqs = [
  {
    q: 'Why should I choose Ganesh Nursery?',
    a: `We have raised saplings in ${site.address.city} since ${site.foundedYear} — ${yearsInBusiness} years of doing one thing. Our plants come from elite mother trees, so they establish with strong roots and high survival rates. We supply the Forest Department of Tamil Nadu, Central Government institutions, universities and large farms, alongside home gardeners buying a single plant. What sets us apart is honest species advice: we will tell you if a tree is wrong for your soil rather than sell it to you.`
  },
  {
    q: 'What kind of nursery plants do you provide?',
    a: 'Timber saplings — sandalwood, red sandal, karungali (Ceylon ebony), rosewood and khaya senegalensis — plus fruit trees including Koyya L49 guava and grafted macadamia. Hundreds of varieties in all, and we regularly source species that are not listed on this site, so ask if you do not see what you need.'
  },
  {
    q: 'Where is your nursery located in Thanjavur?',
    a: `Our nursery is at ${site.address.line1}, ${site.address.line2}, ${site.address.city}, ${site.address.state} ${site.address.postalCode}. We are open ${site.openingHours}. Call ${site.phoneDisplay} before visiting if you want a specific species held aside for you.`
  },
  {
    q: 'Do you sell affordable plants in Thanjavur?',
    a: 'Yes. Every listing shows a starting price alongside the usual price, and we are a wholesale nursery, so bulk and institutional rates are considerably lower than retail. A few items are quoted on request because the price moves with size and season. Tell us your quantity and we will quote properly rather than making you guess.'
  },
  {
    q: 'Do you have macadamia nut saplings in Thanjavur?',
    a: 'Yes, we supply grafted macadamia (Macadamia integrifolia) saplings. Macadamia is a high-value orchard crop that needs deep, free-draining soil and wind protection, and grafted trees generally begin bearing in their fourth to sixth year. We supply grafted stock rather than seedlings because seedling macadamia is slow and unpredictable in nut quality. Talk to us about your site before committing land to it.'
  },
  {
    q: 'Do you deliver outside Thanjavur?',
    a: 'Yes — we deliver across India, and bulk consignments go by road transport arranged at the time of quotation. Delivery is quoted separately based on quantity, packing and destination.'
  },
  {
    q: 'Can I order a small quantity, or is it wholesale only?',
    a: 'Both. We supply single plants to home gardeners and thousands of saplings to plantations and government projects. Add whatever you want to the enquiry list on this site and send it to us on WhatsApp — there is no minimum.'
  }
];

export default function Faq() {
  const [open, setOpen] = useState(0);

  return (
    <section className="faq-section" aria-labelledby="faq-heading">
      <div className="container faq-grid">
        <Reveal as="div" className="faq-media">
          <div className="faq-photo">
            <SmartImage
              src="/brand/nursery-worker.jpg"
              alt="A Ganesh Nursery grower tending trays of tree saplings under shade netting"
              ratio="4 / 3"
            />
          </div>
          <Link className="faq-photo-badge" to="/contact">
            Let&apos;s beautify your garden together
          </Link>
        </Reveal>

        <Reveal as="div" delay={90} className="faq-body">
          <span className="eyebrow">Questions &amp; answers</span>
          <h2 id="faq-heading">Buying plants in Thanjavur — what people ask us</h2>
          <p className="faq-intro">
            Common questions about our plants, our services and the care behind them.
          </p>

          <div className="faq-list">
            {faqs.map((item, i) => {
              const isOpen = open === i;
              return (
                <div className={isOpen ? 'faq-item open' : 'faq-item'} key={item.q}>
                  <h3>
                    <button
                      type="button"
                      className="faq-q"
                      onClick={() => setOpen(isOpen ? -1 : i)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-a-${i}`}
                    >
                      <span>{item.q}</span>
                      {isOpen ? <IconMinus size={16} /> : <IconPlus size={16} />}
                    </button>
                  </h3>
                  {isOpen && <div className="faq-a" id={`faq-a-${i}`}><p>{item.a}</p></div>}
                </div>
              );
            })}
          </div>

          <p className="faq-foot">
            Still deciding? <Link className="text-link" to="/contact">Ask us directly<span aria-hidden="true"> →</span></Link>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
