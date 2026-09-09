import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { site, yearsInBusiness } from '../data/site.js';
import { IconPlus, IconMinus } from './Icons.jsx';
import Reveal from './Reveal.jsx';

// Google rewards pages that answer the question someone actually typed. These
// answers are written around the terms customers search for locally — "best
// nursery in Thanjavur", "affordable plants", "macadamia" — while still being
// genuinely useful to read. The matching FAQPage schema is emitted by Home.jsx,
// which can win an expanded result in the search listing.
export const faqs = [
  {
    q: `What makes Ganesh Nursery the best nursery in Thanjavur?`,
    a: `We have been raising saplings in Thanjavur since ${site.foundedYear} — ${yearsInBusiness} years of doing one thing. We supply the Forest Department of Tamil Nadu, Central Government institutions, universities and large farms, alongside home gardeners buying a single plant. What sets us apart is species advice: we will tell you honestly if a tree is wrong for your soil rather than sell it to you.`
  },
  {
    q: `Where is your nursery located in Thanjavur?`,
    a: `Our nursery is at ${site.address.line1}, ${site.address.line2}, ${site.address.city}, ${site.address.state} ${site.address.postalCode}. We are open ${site.openingHours}. Call ${site.phoneDisplay} before visiting if you want a specific species held aside for you.`
  },
  {
    q: `Do you sell affordable plants in Thanjavur?`,
    a: `Yes. Prices on this site start from ₹140 for indoor plants and ₹160 for flowering varieties, and we are a wholesale nursery, so bulk and institutional rates are considerably lower than retail. Tell us your quantity and we will quote properly rather than making you guess.`
  },
  {
    q: `Do you have macadamia nut saplings in Thanjavur?`,
    a: `Yes, we supply grafted macadamia (Macadamia integrifolia) saplings. Macadamia is a high-value orchard crop that needs deep, free-draining soil and wind protection, and grafted trees generally begin bearing in their fourth to sixth year. We supply grafted stock rather than seedlings because seedling macadamia is slow and unpredictable in nut quality. Talk to us about your site before committing land to it.`
  },
  {
    q: `Which timber trees do you supply?`,
    a: `Teak, Indian rosewood, mahogany, African blackwood and other timber species, plus natives like neem and pongamia. We are one of the oldest timber nurseries in the region and have raised crores of saplings across hundreds of varieties. Timber is a long-horizon crop, so we will walk you through spacing, intercropping and realistic timelines before you buy.`
  },
  {
    q: `Do you deliver outside Thanjavur?`,
    a: `Yes — we deliver across India, and bulk consignments go by road transport arranged at the time of quotation. Delivery is quoted separately based on quantity, packing and destination.`
  },
  {
    q: `Can I order a small quantity, or is it wholesale only?`,
    a: `Both. We supply single plants to home gardeners and thousands of saplings to plantations and government projects. Add whatever you want to the enquiry list on this site and send it to us on WhatsApp — there is no minimum.`
  }
];

export default function Faq() {
  const [open, setOpen] = useState(0);

  return (
    <section className="faq-section container" aria-labelledby="faq-heading">
      <Reveal as="div" className="section-head">
        <div>
          <span className="eyebrow">Common questions</span>
          <h2 id="faq-heading">Buying plants in Thanjavur — what people ask us</h2>
        </div>
      </Reveal>

      <div className="faq-list">
        {faqs.map((item, i) => {
          const isOpen = open === i;
          return (
            <Reveal as="div" delay={Math.min(i, 4) * 40} className={isOpen ? 'faq-item open' : 'faq-item'} key={item.q}>
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
            </Reveal>
          );
        })}
      </div>

      <p className="faq-foot">
        Still deciding? <Link className="text-link" to="/contact">Ask us directly<span aria-hidden="true"> →</span></Link>
      </p>
    </section>
  );
}
