import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo.jsx';
import { useContent } from '../context/ContentContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import {
  IconClose, IconPlus, IconCheck, IconLeaf, IconSearch,
  IconChevronLeft, IconBasket, IconPin, IconSun
} from '../components/Icons.jsx';
import useBackToClose from '../hooks/useBackToClose.js';

// ============================================================================
// ADMIN PANEL
//
// ⚠️  READ THIS BEFORE RELYING ON THE LOGIN
//
// This is a static site with no server. The passphrase check below runs in the
// visitor's own browser, which means the check itself is in the JavaScript
// bundle that anyone can download. It is a lock on a door, not a wall: it
// stops a curious visitor wandering in, and it will not stop anyone who knows
// how to open developer tools.
//
// It is safe for what it does here, because the panel cannot damage anything
// a stranger could reach — every edit is written to the editor's own browser
// and publishing requires committing a file to the repository. Nobody can
// change what the public sees through this screen.
//
// If you later want genuine accounts and live editing, that needs a backend.
// See "Going further" in the README.
//
// Set your own passphrase in .env:  VITE_ADMIN_PASSPHRASE=something-long
// ============================================================================

const PASSPHRASE = import.meta.env?.VITE_ADMIN_PASSPHRASE || 'ganesh-admin';
const SESSION_KEY = 'ganesh-admin-session';

const BLANK_VARIANT = { size: '', age: '', bag: '', cost: 0, offer: null, note: '' };

function blankPlant(nextId) {
  return {
    id: nextId,
    slug: '',
    name: '',
    tamil: '',
    botanical: '',
    category: 'Timber',
    seedSource: '',
    motherTree: '',
    light: 'Full sun',
    water: 'Moderate',
    soil: 'Well-drained',
    popular: false,
    description: '',
    image: null,
    variants: [{ ...BLANK_VARIANT }]
  };
}

const slugify = s => s.toLowerCase().trim()
  .replace(/[^a-z0-9\s-]/g, '')
  .replace(/\s+/g, '-')
  .replace(/-+/g, '-');

/* ─────────────────────────── login gate ─────────────────────────── */

function Login({ onUnlock }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const submit = e => {
    e.preventDefault();
    if (value === PASSPHRASE) {
      try { sessionStorage.setItem(SESSION_KEY, '1'); } catch { /* ignore */ }
      onUnlock();
    } else {
      setError('That passphrase is not right.');
      setValue('');
    }
  };

  return (
    <main className="admin-login">
      <form className="admin-login-card" onSubmit={submit}>
        <span className="admin-logo" aria-hidden="true"><IconLeaf size={22} /></span>
        <h1>Nursery admin</h1>
        <p>Sign in to edit the site content.</p>

        <label htmlFor="admin-pass">
          Passphrase
          <input
            id="admin-pass"
            type="password"
            value={value}
            autoComplete="current-password"
            onChange={e => { setValue(e.target.value); setError(''); }}
            aria-invalid={!!error}
            aria-describedby={error ? 'admin-pass-err' : undefined}
          />
          {error && <span className="field-error" id="admin-pass-err">{error}</span>}
        </label>

        <button className="btn primary" type="submit">Sign in</button>

        <p className="admin-login-note">
          This gate runs in your browser, so treat it as a latch rather than a
          lock. Your edits are saved to this browser only and stay private
          until you publish them.
        </p>
        <Link className="text-link" to="/">Back to the site<span aria-hidden="true"> →</span></Link>
      </form>
    </main>
  );
}

/* ─────────────────────────── site settings ─────────────────────────── */

function SiteSettings() {
  const { site, saveSite } = useContent();
  const [form, setForm] = useState(() => ({ ...site, address: { ...site.address } }));
  const [saved, setSaved] = useState(false);

  const set = (key, val) => { setForm(f => ({ ...f, [key]: val })); setSaved(false); };
  const setAddr = (key, val) => {
    setForm(f => ({ ...f, address: { ...f.address, [key]: val } }));
    setSaved(false);
  };

  const submit = e => {
    e.preventDefault();
    saveSite({
      name: form.name,
      tagline: form.tagline,
      foundedYear: Number(form.foundedYear) || site.foundedYear,
      phoneDisplay: form.phoneDisplay,
      phoneE164: form.phoneE164,
      whatsapp: form.whatsapp,
      phoneAltDisplay: form.phoneAltDisplay,
      phoneAltE164: form.phoneAltE164,
      email: form.email,
      proprietor: form.proprietor,
      openingHours: form.openingHours,
      priceValidityNote: form.priceValidityNote,
      mapsQuery: form.mapsQuery,
      address: form.address,
      social: form.social
    });
    setSaved(true);
  };

  const years = new Date().getFullYear() - (Number(form.foundedYear) || site.foundedYear);

  return (
    <form className="admin-form" onSubmit={submit}>
      <h2>Nursery details</h2>
      <p className="admin-hint">
        These feed the header, footer, contact page, every WhatsApp link and the
        structured data Google reads. Change once, it updates everywhere.
      </p>

      <div className="admin-grid">
        <label>Business name<input value={form.name} onChange={e => set('name', e.target.value)} /></label>
        <label>Tagline<input value={form.tagline} onChange={e => set('tagline', e.target.value)} /></label>
        <label>Proprietor<input value={form.proprietor || ''} onChange={e => set('proprietor', e.target.value)} /></label>
        <label>
          Founded year
          <input type="number" min="1800" max={new Date().getFullYear()} value={form.foundedYear} onChange={e => set('foundedYear', e.target.value)} />
          {/* Years of experience is computed, never typed — so "46+ years"
              can't quietly go stale next January. */}
          <small className="admin-computed">Shows as <strong>{years}+ years of experience</strong> across the site</small>
        </label>
      </div>

      <h3>Contact</h3>
      <div className="admin-grid">
        <label>Phone (display)<input value={form.phoneDisplay} onChange={e => set('phoneDisplay', e.target.value)} /></label>
        <label>Phone (dial format)<input value={form.phoneE164} onChange={e => set('phoneE164', e.target.value)} placeholder="+919943119955" /></label>
        <label>WhatsApp number<input value={form.whatsapp} onChange={e => set('whatsapp', e.target.value)} placeholder="919943119955" /></label>
        <label>Second phone (display)<input value={form.phoneAltDisplay || ''} onChange={e => set('phoneAltDisplay', e.target.value)} /></label>
        <label>Second phone (dial)<input value={form.phoneAltE164 || ''} onChange={e => set('phoneAltE164', e.target.value)} /></label>
        <label>Email<input type="email" value={form.email} onChange={e => set('email', e.target.value)} /></label>
        <label>Opening hours<input value={form.openingHours} onChange={e => set('openingHours', e.target.value)} /></label>
      </div>

      <h3>Address</h3>
      <div className="admin-grid">
        <label>Line 1<input value={form.address.line1} onChange={e => setAddr('line1', e.target.value)} /></label>
        <label>Line 2<input value={form.address.line2} onChange={e => setAddr('line2', e.target.value)} /></label>
        <label>City / district<input value={form.address.city} onChange={e => setAddr('city', e.target.value)} /></label>
        <label>State<input value={form.address.state} onChange={e => setAddr('state', e.target.value)} /></label>
        <label>PIN code<input value={form.address.postalCode} onChange={e => setAddr('postalCode', e.target.value)} /></label>
        <label>Google Maps search<input value={form.mapsQuery} onChange={e => set('mapsQuery', e.target.value)} /></label>
      </div>

      <h3>Pricing note</h3>
      <label className="admin-wide">
        Shown under every size table
        <input value={form.priceValidityNote || ''} onChange={e => set('priceValidityNote', e.target.value)} />
      </label>

      <div className="admin-actions">
        <button className="btn primary" type="submit">Save details</button>
        {saved && <span className="admin-saved"><IconCheck size={14} /> Saved to this browser</span>}
      </div>
    </form>
  );
}

/* ─────────────────────────── plant editor ─────────────────────────── */

function VariantRow({ v, index, onChange, onRemove, canRemove }) {
  return (
    <div className="admin-variant">
      <div className="admin-variant-head">
        <span>Size {index + 1}</span>
        <button type="button" className="admin-variant-del" onClick={onRemove} disabled={!canRemove} aria-label={`Remove size ${index + 1}`}>
          <IconClose size={15} />
        </button>
      </div>
      <div className="admin-variant-fields">
      <label>Height<input value={v.size} onChange={e => onChange({ ...v, size: e.target.value })} placeholder="5 ft" /></label>
      <label>Age<input value={v.age || ''} onChange={e => onChange({ ...v, age: e.target.value })} placeholder="1.5 years" /></label>
      <label>Bag<input value={v.bag || ''} onChange={e => onChange({ ...v, bag: e.target.value })} placeholder="4 kg" /></label>
      <label>Price ₹<input type="number" min="0" value={v.cost} onChange={e => onChange({ ...v, cost: Number(e.target.value) || 0 })} /></label>
      <label>Offer ₹<input type="number" min="0" value={v.offer ?? ''} onChange={e => onChange({ ...v, offer: e.target.value === '' ? null : Number(e.target.value) })} placeholder="—" /></label>
      <label>Note<input value={v.note || ''} onChange={e => onChange({ ...v, note: e.target.value })} placeholder="Strong stem" /></label>
      </div>
    </div>
  );
}

function PlantEditor({ plant, onSave, onCancel, onDelete }) {
  const [form, setForm] = useState(() => ({
    ...plant,
    variants: plant.variants?.length ? plant.variants.map(v => ({ ...v })) : [{ ...BLANK_VARIANT }]
  }));
  const [imgError, setImgError] = useState('');
  const fileRef = useRef(null);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const setVariant = (i, next) => setForm(f => ({
    ...f,
    variants: f.variants.map((v, j) => (j === i ? next : v))
  }));

  const addVariant = () => setForm(f => ({ ...f, variants: [...f.variants, { ...BLANK_VARIANT }] }));
  const removeVariant = i => setForm(f => ({ ...f, variants: f.variants.filter((_, j) => j !== i) }));

  // Photos are read straight into the page as a data URL. That keeps the panel
  // working with no upload server, but a big file would bloat the saved JSON,
  // so anything over ~600 KB is refused with an explanation rather than
  // silently making the site slow.
  const onFile = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { setImgError('That is not an image file.'); return; }
    if (file.size > 600 * 1024) {
      setImgError(`That image is ${(file.size / 1024 / 1024).toFixed(1)} MB. Keep it under 600 KB, or add it to /public/plants/ and type the path below instead.`);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => { set('image', reader.result); setImgError(''); };
    reader.onerror = () => setImgError('Could not read that file.');
    reader.readAsDataURL(file);
  };

  const valid = form.name.trim() && form.variants.some(v => v.cost > 0);

  const submit = e => {
    e.preventDefault();
    if (!valid) return;
    const slug = form.slug?.trim() ? slugify(form.slug) : slugify(form.name);
    onSave({
      ...form,
      slug,
      name: form.name.trim(),
      variants: form.variants.filter(v => v.size.trim() || v.cost > 0)
    });
  };

  return (
    <form className="admin-form admin-editor" onSubmit={submit}>
      {/* On a phone the editor takes the whole screen with its own bar, the
          way a native app pushes a detail view — a form squeezed under the
          site header with the save button miles below the fold is the single
          most website-ish thing an admin panel can do. */}
      <div className="admin-editor-bar">
        <button type="button" className="admin-back" onClick={onCancel} aria-label="Back to the plant list">
          <IconChevronLeft size={20} />
        </button>
        <span className="admin-editor-title">{plant.name || 'New plant'}</span>
        <button type="button" className="admin-bar-save" onClick={submit} disabled={!valid}>Save</button>
      </div>

      <div className="admin-editor-body">

      <div className="admin-grid">
        <label>Name *<input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Nilambur Teak" /></label>
        <label>Tamil name<input lang="ta" value={form.tamil || ''} onChange={e => set('tamil', e.target.value)} placeholder="நிலம்பூர் தேக்கு" /></label>
        <label>Botanical name<input value={form.botanical || ''} onChange={e => set('botanical', e.target.value)} placeholder="Tectona grandis" /></label>
        <label>
          Category
          <select value={form.category} onChange={e => set('category', e.target.value)}>
            <option>Timber</option>
            <option>Fruit</option>
          </select>
        </label>
        <label>URL slug<input value={form.slug || ''} onChange={e => set('slug', e.target.value)} placeholder="auto from name" /></label>
        <label className="admin-check">
          <input type="checkbox" checked={!!form.popular} onChange={e => set('popular', e.target.checked)} />
          <span>Show a “Popular” badge</span>
        </label>
      </div>

      <h3>Growing conditions</h3>
      <div className="admin-grid">
        <label>Light<input value={form.light || ''} onChange={e => set('light', e.target.value)} /></label>
        <label>Water<input value={form.water || ''} onChange={e => set('water', e.target.value)} /></label>
        <label>Soil<input value={form.soil || ''} onChange={e => set('soil', e.target.value)} /></label>
        <label>Seed source<input value={form.seedSource || ''} onChange={e => set('seedSource', e.target.value)} placeholder="Marayur" /></label>
        <label>Mother tree<input value={form.motherTree || ''} onChange={e => set('motherTree', e.target.value)} placeholder="35-year CPT trees" /></label>
      </div>

      <label className="admin-wide">
        Description
        <textarea rows="4" value={form.description || ''} onChange={e => set('description', e.target.value)} />
      </label>

      <h3>Sizes and prices</h3>
      <p className="admin-hint">
        One row per height you sell. The lowest price becomes the “from” figure
        on the catalogue card. Leave Offer empty when there is no discount.
      </p>
      <div className="admin-variants">
        {form.variants.map((v, i) => (
          <VariantRow
            key={i}
            v={v}
            index={i}
            onChange={next => setVariant(i, next)}
            onRemove={() => removeVariant(i)}
            canRemove={form.variants.length > 1}
          />
        ))}
      </div>
      <button type="button" className="small-btn" onClick={addVariant}><IconPlus size={13} /> Add a size</button>

      <h3>Photo</h3>
      <div className="admin-photo">
        <div className="admin-photo-preview">
          {form.image
            ? <img src={form.image} alt="" />
            : <span className="admin-photo-empty"><IconLeaf size={22} /> No photo</span>}
        </div>
        <div className="admin-photo-controls">
          <input ref={fileRef} type="file" accept="image/*" onChange={onFile} />
          <label className="admin-wide">
            …or a path in /public
            <input value={typeof form.image === 'string' && !form.image.startsWith('data:') ? form.image : ''} onChange={e => set('image', e.target.value || null)} placeholder="/plants/teak.jpg" />
          </label>
          {form.image && (
            <button type="button" className="small-btn" onClick={() => { set('image', null); if (fileRef.current) fileRef.current.value = ''; }}>
              Remove photo
            </button>
          )}
          {imgError && <span className="field-error">{imgError}</span>}
        </div>
      </div>

        {onDelete && (
          <div className="admin-danger-zone">
            <button type="button" className="admin-delete" onClick={onDelete}>Delete this plant</button>
          </div>
        )}
        {!valid && <p className="admin-hint">A name and at least one size with a price are needed before saving.</p>}
      </div>

      <div className="admin-sticky-actions">
        <button className="btn ghost" type="button" onClick={onCancel}>Cancel</button>
        <button className="btn primary" type="submit" disabled={!valid}>Save plant</button>
      </div>
    </form>
  );
}

function PlantsAdmin() {
  const { plants, upsertPlant, deletePlant } = useContent();
  const [editing, setEditing] = useState(null);
  const [query, setQuery] = useState('');

  // Android Back closes the editor and returns to the list, rather than
  // dropping you out of the admin panel altogether.
  useBackToClose(!!editing, () => setEditing(null));

  const nextId = useMemo(
    () => Math.max(0, ...plants.map(p => Number(String(p.id).split('-')[0]) || 0)) + 1,
    [plants]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return plants;
    return plants.filter(p => `${p.name} ${p.tamil} ${p.botanical} ${p.category}`.toLowerCase().includes(q));
  }, [plants, query]);

  if (editing) {
    return (
      <PlantEditor
        plant={editing}
        onSave={p => { upsertPlant(p); setEditing(null); }}
        onCancel={() => setEditing(null)}
        onDelete={plants.some(p => String(p.id) === String(editing.id))
          ? () => {
            if (window.confirm(`Delete ${editing.name}? This cannot be undone from here.`)) {
              deletePlant(editing.id);
              setEditing(null);
            }
          }
          : undefined}
      />
    );
  }

  return (
    <div className="admin-form">
      <div className="admin-editor-head">
        <h2>Plants <span className="admin-count">{plants.length}</span></h2>
        <button className="btn primary" type="button" onClick={() => setEditing(blankPlant(nextId))}>
          <IconPlus size={15} /> Add plant
        </button>
      </div>

      <div className="search-field admin-search">
        <IconSearch size={15} />
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search plants…" aria-label="Search plants" />
      </div>

      <ul className="admin-list">
        {filtered.map(p => (
          <li key={p.id}>
            <button type="button" className="admin-row" onClick={() => setEditing(p)}>
              <span className="admin-row-img">
                {p.image ? <img src={p.image} alt="" /> : <IconLeaf size={16} />}
              </span>
              <span className="admin-row-main">
                <strong>{p.name}</strong>
                <small>{p.botanical} · {p.category} · {p.sizeCount} size{p.sizeCount === 1 ? '' : 's'}</small>
              </span>
              <span className="admin-row-price">₹{p.price?.toLocaleString('en-IN')}</span>
            </button>
          </li>
        ))}
        {filtered.length === 0 && <li className="admin-empty">Nothing matches “{query}”.</li>}
      </ul>
    </div>
  );
}

/* ─────────────────────────── publish ─────────────────────────── */

function Publish() {
  const { exportJson, importJson, resetAll, hasLocalEdits } = useContent();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const download = () => {
    const blob = new Blob([exportJson()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'content-override.json';
    a.click();
    URL.revokeObjectURL(url);
    setMessage('Downloaded. Replace src/data/content-override.json with this file and redeploy.');
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(exportJson());
      setMessage('Copied to the clipboard.');
    } catch {
      setError('Could not reach the clipboard — use Download instead.');
    }
  };

  const onFile = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try { importJson(String(reader.result)); setMessage('Loaded.'); setError(''); }
      catch (err) { setError(`That file could not be read: ${err.message}`); }
    };
    reader.readAsText(file);
  };

  return (
    <div className="admin-form">
      <h2>Publish your changes</h2>

      <div className={hasLocalEdits ? 'admin-banner warn' : 'admin-banner'}>
        {hasLocalEdits
          ? 'You have unpublished edits. They are saved in this browser only — visitors still see the published version.'
          : 'No unpublished edits. What you see matches what visitors see.'}
      </div>

      <p className="admin-hint">
        This site has no server, so edits cannot go live by themselves. To
        publish: download the file below, drop it into
        <code> src/data/content-override.json</code>, then commit and push. Your
        host rebuilds and everyone sees the change.
      </p>

      <div className="admin-actions">
        <button className="btn primary" type="button" onClick={download}>Download content file</button>
        <button className="btn ghost" type="button" onClick={copy}>Copy as JSON</button>
      </div>

      <h3>Restore from a file</h3>
      <input type="file" accept="application/json" onChange={onFile} />

      <h3>Start over</h3>
      <p className="admin-hint">Discards every edit in this browser and returns to the published content.</p>
      <button
        type="button"
        className="admin-delete"
        onClick={() => { if (window.confirm('Discard all local edits?')) { resetAll(); setMessage('Reset to published content.'); } }}
      >
        Discard local edits
      </button>

      {message && <div className="form-note success">{message}</div>}
      {error && <div className="form-note error">{error}</div>}
    </div>
  );
}

/* ─────────────────────────── appearance ─────────────────────────── */

function Appearance() {
  const { preference, resolved, setTheme } = useTheme();
  const options = [
    ['light', 'Light', 'Ivory and forest green — the default.'],
    ['dark', 'Dark', 'Easier on the eyes at night and on low battery.'],
    ['system', 'Match device', 'Follows the phone or computer setting automatically.']
  ];

  return (
    <div className="admin-form">
      <h2>Appearance</h2>
      <p className="admin-hint">
        This sets the theme for your own browsing. Visitors get “match device”
        by default and can switch it themselves from the header.
      </p>
      <div className="admin-themes">
        {options.map(([value, label, note]) => (
          <button
            key={value}
            type="button"
            className={preference === value ? 'admin-theme is-active' : 'admin-theme'}
            onClick={() => setTheme(value)}
            aria-pressed={preference === value}
          >
            <span className={`admin-theme-swatch is-${value}`} aria-hidden="true" />
            <strong>{label}</strong>
            <small>{note}</small>
            {preference === value && <span className="admin-theme-tick"><IconCheck size={13} /></span>}
          </button>
        ))}
      </div>
      <p className="admin-hint">Currently showing: <strong>{resolved}</strong></p>
    </div>
  );
}

/* ─────────────────────────── shell ─────────────────────────── */

const TABS = [
  ['plants', 'Plants'],
  ['site', 'Details'],
  ['appearance', 'Theme'],
  ['publish', 'Publish']
];

const TAB_ICONS = {
  plants: IconLeaf,
  site: IconPin,
  appearance: IconSun,
  publish: IconBasket
};

export default function Admin() {
  const [unlocked, setUnlocked] = useState(() => {
    try { return sessionStorage.getItem(SESSION_KEY) === '1'; } catch { return false; }
  });
  const [tab, setTab] = useState('plants');
  const { hasLocalEdits } = useContent();

  // Warn before closing the tab with edits that have not been downloaded —
  // they live in this browser and are easy to lose track of.
  useEffect(() => {
    if (!unlocked || !hasLocalEdits) return undefined;
    const warn = e => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [unlocked, hasLocalEdits]);

  const signOut = useCallback(() => {
    try { sessionStorage.removeItem(SESSION_KEY); } catch { /* ignore */ }
    setUnlocked(false);
  }, []);

  if (!unlocked) {
    return (
      <>
        <Seo title="Admin" description="Site administration." noindex />
        <Login onUnlock={() => setUnlocked(true)} />
      </>
    );
  }

  return (
    <main className="admin">
      <Seo title="Admin" description="Site administration." noindex />

      <header className="admin-head">
        <div className="container admin-head-inner">
          <div>
            <span className="eyebrow">Ganesh Nursery</span>
            <h1>Site admin</h1>
          </div>
          <div className="admin-head-actions">
            <Link className="small-btn" to="/">View site</Link>
            <button type="button" className="small-btn" onClick={signOut}>Sign out</button>
          </div>
        </div>
      </header>

      <nav className="admin-tabs container" aria-label="Admin sections">
        {TABS.map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={tab === id ? 'admin-tab is-active' : 'admin-tab'}
            onClick={() => setTab(id)}
            aria-current={tab === id}
          >
            {label}
            {id === 'publish' && hasLocalEdits && <span className="admin-dot" aria-label="unpublished changes" />}
          </button>
        ))}
      </nav>

      {/* Phone-only tab bar. Same sections, but under the thumb instead of at
          the top of a long scrolling page. */}
      <nav className="admin-bottom-nav" aria-label="Admin sections">
        {TABS.map(([id, label]) => {
          const Icon = TAB_ICONS[id];
          return (
            <button
              key={id}
              type="button"
              className={tab === id ? 'admin-bnav-item is-active' : 'admin-bnav-item'}
              onClick={() => setTab(id)}
              aria-current={tab === id}
            >
              <span className="admin-bnav-icon">
                <Icon size={20} />
                {id === 'publish' && hasLocalEdits && <span className="admin-bnav-dot" />}
              </span>
              <span>{label}</span>
            </button>
          );
        })}
      </nav>

      <div className="container admin-body">
        {tab === 'plants' && <PlantsAdmin />}
        {tab === 'site' && <SiteSettings />}
        {tab === 'appearance' && <Appearance />}
        {tab === 'publish' && <Publish />}
      </div>
    </main>
  );
}
