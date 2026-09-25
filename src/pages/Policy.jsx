import React from 'react';
import { useContent } from '../context/ContentContext.jsx';
import { PageHero } from '../components/PageHero.jsx';
import Seo from '../components/Seo.jsx';
import NotFound from './NotFound.jsx';

// ============================================================================
// The old footer linked "Terms and Conditions", "Refund Policy", "Shipping
// Policy" and "Privacy Policy" — all four pointed at /contact. For a business
// that takes orders and collects customer contact details, missing policies
// are a compliance gap as well as a trust problem, and Indian payment gateways
// ask for them before approving a merchant account.
//
// THESE ARE STARTING TEMPLATES, NOT LEGAL ADVICE. Fill in every [BRACKET],
// make them match what you actually do, and have someone qualified review them
// before launch — especially the refund and shipping terms, which are the ones
// customers will hold you to.
// ============================================================================

function buildPolicies(site, fullAddress) {
  const contactBlock = {
  heading: 'Contact us about this policy',
  paras: [
    `${site.name}, ${fullAddress.join(', ')}.`,
    `Email ${site.email} or call ${site.phoneDisplay}.`
  ]
};

  const POLICIES = {
  'privacy-policy': {
    title: 'Privacy Policy',
    intro: `How ${site.name} handles the information you share with us.`,
    updated: '[DATE]',
    sections: [
      {
        heading: 'What we collect',
        paras: [
          'When you send an enquiry through this website, WhatsApp, email or phone, we collect the name, phone number, email address and enquiry details you choose to give us.',
          'This website does not require an account, and we do not collect payment information through it.'
        ]
      },
      {
        heading: 'Why we collect it',
        paras: [
          'We use your details for one purpose: to answer your enquiry, quote for it, and arrange supply or service. We may contact you afterwards about that order.',
          'We do not sell, rent or trade your information to anyone.'
        ]
      },
      {
        heading: 'Where it is stored',
        paras: [
          'Enquiries reach us by email and WhatsApp and are held on our business systems. Your plant enquiry list is stored only in your own browser — it never leaves your device until you choose to send it to us.',
          '[If you add analytics, an email marketing tool or a CRM, list them here.]'
        ]
      },
      {
        heading: 'Your choices',
        paras: [
          `Ask us at ${site.email} to see, correct or delete the details we hold about you and we will act on it.`,
          'You can clear your enquiry list at any time from the enquiry drawer, or by clearing your browser data.'
        ]
      },
      contactBlock
    ]
  },

  terms: {
    title: 'Terms & Conditions',
    intro: `The terms on which ${site.name} supplies plants and services.`,
    updated: '[DATE]',
    sections: [
      {
        heading: 'About these terms',
        paras: [
          `This website is operated by ${site.name}, ${fullAddress.join(', ')}. By using the site or placing an order you accept these terms.`
        ]
      },
      {
        heading: 'Prices and quotations',
        paras: [
          'Prices shown on this website are indicative starting prices per sapling. The final price depends on species, size, quantity, season and delivery location, and is confirmed in a written quotation before supply.',
          'A quotation is valid for [NUMBER] days from the date it is issued.'
        ]
      },
      {
        heading: 'Orders and payment',
        paras: [
          'An order is confirmed when we acknowledge it in writing and receive the agreed advance. Payment terms are [e.g. 50% advance, balance before dispatch].',
          '[State accepted payment methods and your GST details here.]'
        ]
      },
      {
        heading: 'Availability and substitution',
        paras: [
          'Nursery stock is living material and availability changes with the season. If a species or size is unavailable we will tell you before dispatch and offer an alternative or refund any advance for that item.'
        ]
      },
      {
        heading: 'Plant survival',
        paras: [
          'Plants are living things whose survival depends heavily on planting, watering, soil and aftercare at your site, which are outside our control. We guarantee the condition of planting material at the point of dispatch or handover. [State any establishment guarantee you actually offer, or say plainly that none is offered.]'
        ]
      },
      {
        heading: 'Governing law',
        paras: [
          `These terms are governed by the laws of India, and disputes are subject to the jurisdiction of the courts at ${site.address.city}, ${site.address.state}.`
        ]
      },
      contactBlock
    ]
  },

  'shipping-policy': {
    title: 'Shipping & Delivery Policy',
    intro: 'How saplings and plants reach you.',
    updated: '[DATE]',
    sections: [
      {
        heading: 'Where we deliver',
        paras: [
          'We deliver across India. Bulk and institutional consignments go by road transport; the mode is agreed with you at the time of quotation.'
        ]
      },
      {
        heading: 'Timelines',
        paras: [
          'Dispatch usually happens within [NUMBER] working days of a confirmed order, subject to stock and season. Transit time depends on destination — typically [NUMBER] days within Tamil Nadu and [NUMBER] days elsewhere in India.',
          'Planting seasons and weather can affect timelines. We will tell you if a delay is likely rather than let a date pass quietly.'
        ]
      },
      {
        heading: 'Charges',
        paras: [
          'Delivery is charged separately and quoted with the order, based on quantity, packing type and destination. [Add any free-delivery threshold here.]'
        ]
      },
      {
        heading: 'On arrival',
        paras: [
          'Please inspect the consignment on delivery and tell us within [NUMBER] hours if anything has arrived damaged, with photographs. Living material deteriorates quickly, so prompt reporting is what allows us to help.'
        ]
      },
      contactBlock
    ]
  },

  'refund-policy': {
    title: 'Refund & Replacement Policy',
    intro: 'What happens if something is not right.',
    updated: '[DATE]',
    sections: [
      {
        heading: 'Damaged or incorrect consignments',
        paras: [
          'If plants arrive damaged, or the species or quantity does not match your confirmed order, tell us within [NUMBER] hours of delivery with photographs. We will replace the affected material in the next suitable dispatch, or refund it — your choice.'
        ]
      },
      {
        heading: 'Cancellations',
        paras: [
          'Orders can be cancelled before dispatch. [State what portion of any advance is refundable, and any deduction for material already reserved or packed.]'
        ]
      },
      {
        heading: 'What is not covered',
        paras: [
          'We cannot refund plant losses that follow from planting, watering, soil, pest management or weather at your site once the consignment has been accepted in good condition.',
          'We are glad to advise on aftercare at any point — ask us before a problem gets worse rather than after.'
        ]
      },
      {
        heading: 'How refunds are made',
        paras: [
          'Approved refunds go back to the original payment method within [NUMBER] working days of agreement.'
        ]
      },
      contactBlock
    ]
  }
};

  return POLICIES;
}

export default function Policy({ slug }) {
  const { site, fullAddress } = useContent();
  const POLICIES = buildPolicies(site, fullAddress);
  const policy = POLICIES[slug];
  if (!policy) return <NotFound />;

  return (
    <main>
      <Seo title={policy.title} description={policy.intro} />
      <PageHero eyebrow="Customer care" title={policy.title} copy={policy.intro} />

      <section className="policy-page container">
        <p className="policy-updated">Last updated: {policy.updated}</p>
        {policy.sections.map(section => (
          <section key={section.heading} className="policy-section">
            <h2>{section.heading}</h2>
            {section.paras.map((p, i) => <p key={i}>{p}</p>)}
          </section>
        ))}
      </section>
    </main>
  );
}
