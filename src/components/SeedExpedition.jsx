import React, { useRef, useState } from 'react';
import Reveal from './Reveal.jsx';
import { IconLeaf } from './Icons.jsx';

// Footage from the seed-collection trips — the part of the business nobody can
// copy by buying stock from a wholesaler. Shot vertically on a phone in the
// field, so it is presented as a portrait reel rather than stretched into a
// landscape frame it was never filmed for.
//
// Like the CPT section, the file is NOT autoplayed and NOT preloaded: it is
// 17 MB, and sending that down a mobile connection before someone has decided
// they want to watch is the fastest way to lose them. It loads only on play.
export default function SeedExpedition() {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const play = () => {
    setPlaying(true);
    window.requestAnimationFrame(() => {
      const el = videoRef.current;
      if (el && el.play) el.play().catch(() => { /* native controls remain available */ });
    });
  };

  return (
    <section className="expedition container" aria-labelledby="expedition-heading">
      <Reveal as="div" className="expedition-media">
        <div className="expedition-frame">
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
            <button type="button" className="expedition-cover" onClick={play}>
              <img src="/media/seed-expedition-poster.jpg" alt="" loading="lazy" decoding="async" />
              <span className="expedition-play" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor">
                  <path d="M8 5.5v13l11-6.5-11-6.5Z" />
                </svg>
              </span>
              <span className="expedition-cover-label">
                Watch: collecting seed in the field · 2 min
              </span>
              <span className="sr-only">Play the seed collection video</span>
            </button>
          )}
        </div>
      </Reveal>

      <Reveal as="div" delay={90} className="expedition-copy">
        <span className="eyebrow">From the field</span>
        <h2 id="expedition-heading">We go and get the seed ourselves</h2>

        <p>
          Most nurseries buy seed on the open market, where nobody can tell you which
          tree it fell from. We do it the slow way: travelling to the forests where the
          best mother trees stand, identifying them on the ground, and collecting from
          those trees specifically.
        </p>
        <p>
          It means long trips, local permissions and working alongside the communities
          who know the forest. That effort never shows up in a photograph of a sapling —
          which is exactly why we filmed it.
        </p>

        <ul className="cpt-points">
          <li><IconLeaf size={15} /> Seed collected at source, not bought in</li>
          <li><IconLeaf size={15} /> Mother trees identified in the field</li>
          <li><IconLeaf size={15} /> Collected with local communities</li>
        </ul>
      </Reveal>
    </section>
  );
}
