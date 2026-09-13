import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import SmartImage from './SmartImage.jsx';
import Reveal from './Reveal.jsx';
import { IconLeaf } from './Icons.jsx';

// The seed-sourcing story — the strongest differentiator the nursery has.
// Anyone can sell a sapling; very few can tell you which tree it came from.
//
// Laid out as a true full-bleed 50/50 split: video fills the left half edge to
// edge, story fills the right. No container, no gutters between the halves.
//
// The video is deliberately NOT autoplayed and NOT preloaded: it is 17 MB,
// and pushing that down a mobile connection before someone has decided they
// want to watch is the fastest way to lose them. It loads only on play.
//
// It is shot vertically at 402x720, so it is presented in a reel-shaped frame
// at close to its native width rather than stretched across the half-panel.
// Blowing a 402 px wide source up to a 700 px wide box is what made it look
// soft — no amount of re-encoding fixes an upscale, only not doing it does.
export default function CptSeeds() {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const play = () => {
    setPlaying(true);
    window.requestAnimationFrame(() => {
      videoRef.current?.play().catch(() => { /* native controls remain available */ });
    });
  };

  return (
    <section className="cpt-section" aria-labelledby="cpt-heading">
      <div className="cpt-media">
        {playing ? (
          <video
            ref={videoRef}
            controls
            playsInline
            preload="metadata"
            poster="/media/seed-expedition-poster.jpg"
          >
            <source src="/media/seed-expedition.mp4" type="video/mp4" />
            Your browser cannot play this video.
          </video>
        ) : (
          <button type="button" className="cpt-video-cover" onClick={play}>
            <img src="/media/seed-expedition-poster.jpg" alt="" loading="lazy" decoding="async" />
            <span className="cpt-play" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor">
                <path d="M8 5.5v13l11-6.5-11-6.5Z" />
              </svg>
            </span>
            <span className="cpt-video-label">
              <strong>விதை தேடிய பயணம்</strong>
              Watch: the seed expedition to Africa — finding and measuring the mother trees
            </span>
            <span className="sr-only">Play the video about our seed sourcing expedition</span>
          </button>
        )}
      </div>

      <Reveal as="div" className="cpt-copy">
        <div className="cpt-copy-inner">
          <span className="eyebrow">How we source our seed</span>
          <h2 id="cpt-heading">Every plant starts with a better mother tree</h2>

          <p>
            At Ganesh Nursery we select seed only from elite mother trees that are at
            least 35 years old, and sometimes more than 100. These are known as
            <strong> CPT — Candidate Plus Trees</strong>, identified specifically for
            their superior growth, resilience and health.
          </p>
          <p>
            We travel to find them, often deep in forests, working closely with local
            tribal communities to source seed that produces naturally vigorous,
            fault-free plants. It is slower and more expensive than buying seed on the
            open market. It is also why our saplings establish well and keep growing
            straight decades later.
          </p>

          <ul className="cpt-points">
            <li><IconLeaf size={15} /> Seed from 35+ year mother trees</li>
            <li><IconLeaf size={15} /> Some sourced from 100+ year old giants</li>
            <li><IconLeaf size={15} /> Collected with local tribal communities</li>
          </ul>

          <div className="cpt-figure">
            <SmartImage
              src="/brand/cpt-seeds.jpg"
              alt="CPT Seeds — Candidate Plus Trees, 35+ year mother trees and 100+ year old giants"
              ratio="1000 / 660"
            />
          </div>

          <Link className="btn primary" to="/plants">See what we grow from them</Link>
        </div>
      </Reveal>
    </section>
  );
}
