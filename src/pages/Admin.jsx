import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo.jsx';
import { useContent } from '../context/ContentContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { uploadPhoto, isDataUrl, isRemotePhoto } from '../lib/photos.js';
import { cdnThumb } from '../lib/cloudinary.js';
import {
  IconClose, IconPlus, IconMinus, IconCheck, IconLeaf, IconSearch,
  IconChevronLeft, IconChevronRight, IconPin, IconSun, IconImage
} from '../components/Icons.jsx';
import useBackToClose from '../hooks/useBackToClose.js';

// ============================================================================
// ADMIN PANEL
//
// This panel now edits the live site. Press Save and every visitor sees the
// change on their next page load — no file to download, no commit, no deploy.
//
// WHAT CHANGED, AND WHY IT MATTERS
//
//   Login    Checked on the server. The old passphrase was compared inside
//            the downloaded bundle, so anyone could read it. That was
//            tolerable only because the panel could not change what the public
//            saw. Now it can, so the lock had to become real.
//
//   Saving   Writes go through /api to Postgres, and the server re-checks the
//            session on every one. Getting past this screen is not enough on
//            its own.
//
//   Photos   Resized here, uploaded to Cloudinary, referenced by URL. This is
//            the fix for "I added a photo on my phone and it wasn't on the
//            laptop": the photo now lives in one place both devices read from,
//            and Cloudinary serves each visitor the size their screen needs.
//
// If the database is unreachable the panel says so plainly rather than
// pretending a save worked. The public site, meanwhile, keeps serving the
// catalogue it shipped with — see ContentContext.
// ============================================================================

// A plant carries up to 5 photos (1 main + 4 supporting); an individual size
// carries up to 3, which is plenty to show one height from a couple of angles.
const PLANT_MAX_IMAGES = 5;
const VARIANT_MAX_IMAGES = 3;

const BLANK_VARIANT = { size: '', age: '', bag: '', cost: 0, offer: null, note: '', images: [] };

/* ─────────────────────────── image strip ─────────────────────────── */

/* Preview, add, reorder, remove. Used for both the plant gallery and each
   individual size. Adding a photo uploads it immediately — by the time the
   thumbnail appears the file is already on Cloudinary, so a save that fails
   later cannot leave a broken image behind. */
function ImageStrip({ images, onChange, max, label, hint, folder }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const list = Array.isArray(images) ? images : [];
  const full = list.length >= max;
  const localOnly = list.filter(isDataUrl).length;

  const addFiles = async files => {
    const room = max - list.length;
    if (room <= 0) return;
    setBusy(true);
    setError('');

    const added = [];
    for (const file of Array.from(files).slice(0, room)) {
      try {
        const { src } = await uploadPhoto(file, { folder });
        added.push(src);
      } catch (err) {
        // A failed upload still hands back the compressed image, so the photo
        // is not lost — it just lives in this browser until it can be retried.
        if (err.fallback) added.push(err.fallback);
        setError(err.message);
      }
    }

    if (added.length) onChange([...list, ...added]);
    setBusy(false);
    if (inputRef.current) inputRef.current.value = '';
  };

  // Unlinks the photo from the plant. The file itself stays in the Cloudinary
  // library — deleting needs an API secret, which has no business being in a
  // browser bundle. See the note in photos.js.
  const removeAt = i => onChange(list.filter((_, j) => j !== i));

  const move = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= list.length) return;
    const next = [...list];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div className="img-strip">
      {label && <span className="img-strip-label">{label}</span>}
      {hint && <p className="admin-hint img-strip-hint">{hint}</p>}

      <ul className="img-strip-list">
        {list.map((src, i) => (
          <li key={`${i}-${src.slice(0, 32)}`} className={i === 0 ? 'img-tile is-primary' : 'img-tile'}>
            <img src={cdnThumb(src)} alt="" loading="lazy" />
            {i === 0 && <span className="img-tile-flag">Main</span>}
            {isDataUrl(src) && <span className="img-tile-warn" title="Not uploaded — visible only in this browser">!</span>}
            <div className="img-tile-tools">
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move earlier">
                <IconChevronLeft size={13} />
              </button>
              <button type="button" onClick={() => move(i, 1)} disabled={i === list.length - 1} aria-label="Move later">
                <IconChevronRight size={13} />
              </button>
              <button type="button" className="img-tile-del" onClick={() => removeAt(i)} aria-label="Remove photo">
                <IconClose size={13} />
              </button>
            </div>
          </li>
        ))}

        {!full && (
          <li className="img-tile img-tile-add">
            <button type="button" onClick={() => inputRef.current?.click()} disabled={busy}>
              {busy ? <span className="img-spin" aria-hidden="true" /> : <IconPlus size={20} />}
              <span>{busy ? 'Uploading…' : 'Add photo'}</span>
            </button>
          </li>
        )}
      </ul>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        onChange={e => e.target.files?.length && addFiles(e.target.files)}
      />

      <div className="img-strip-foot">
        <span>{list.length} of {max}</span>
        {localOnly > 0 && (
          <span className="img-strip-warn">
            {localOnly} photo{localOnly === 1 ? '' : 's'} could not be uploaded — visible only in this browser.
          </span>
        )}
      </div>
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}

function blankPlant() {
  return {
    // A temporary id, only so React has a key. The database assigns the real
    // one on save.
    id: `new-${Date.now()}`,
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
    highlights: [],
    planting: '',
    care: '',
    uses: '',
    notice: '',
    images: [],
    variants: [{ ...BLANK_VARIANT }]
  };
}

const slugify = s => s.toLowerCase().trim()
  .replace(/[^a-z0-9\s-]/g, '')
  .replace(/\s+/g, '-')
  .replace(/-+/g, '-');

/* ─────────────────────────── login ─────────────────────────── */

function Login() {
  const { signIn, unavailable } = useAuth();
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async e => {
    e.preventDefault();
    if (busy || !password) return;
    setBusy(true);
    setError('');
    try {
      await signIn(password);
      // Nothing to do on success: the session change re-renders the panel.
    } catch (err) {
      setError(err.message);
      setPassword('');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="admin-login">
      <form className="admin-login-card" onSubmit={submit}>
        <span className="admin-logo" aria-hidden="true"><IconLeaf size={22} /></span>
        <h1>Nursery admin</h1>
        <p>Sign in to edit the live site.</p>

        {unavailable && (
          <div className="admin-banner warn">{unavailable}</div>
        )}

        <label htmlFor="admin-pass">
          Password
          <input
            id="admin-pass"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={e => { setPassword(e.target.value); setError(''); }}
            aria-invalid={!!error}
            aria-describedby={error ? 'admin-pass-err' : undefined}
          />
          {error && <span className="field-error" id="admin-pass-err">{error}</span>}
        </label>

        <button className="btn primary" type="submit" disabled={busy || !password}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>

        <p className="admin-login-note">
          Your password is checked on the server and never travels back to this
          page. Anyone who has it can change what the public sees, so keep it to
          yourself. To change it, edit <code>ADMIN_PASSWORD</code> in your
          hosting settings and redeploy — that signs everyone out too.
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
  const [state, setState] = useState('idle'); // idle | saving | saved | error
  const [error, setError] = useState('');

  // If another device saves while this tab is open, take the new values rather
  // than silently holding a stale form that would overwrite them.
  useEffect(() => { setForm({ ...site, address: { ...site.address } }); }, [site]);

  const set = (key, val) => { setForm(f => ({ ...f, [key]: val })); setState('idle'); };
  const setAddr = (key, val) => {
    setForm(f => ({ ...f, address: { ...f.address, [key]: val } }));
    setState('idle');
  };

  const submit = async e => {
    e.preventDefault();
    setState('saving');
    setError('');
    try {
      await saveSite({
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
      setState('saved');
    } catch (err) {
      setState('error');
      setError(err.message || 'Could not save.');
    }
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
        <button className="btn primary" type="submit" disabled={state === 'saving'}>
          {state === 'saving' ? 'Saving…' : 'Save details'}
        </button>
        {state === 'saved' && <span className="admin-saved"><IconCheck size={14} /> Saved — live now</span>}
      </div>
      {state === 'error' && <div className="form-note error">{error}</div>}
    </form>
  );
}

/* ─────────────────────────── plant editor ─────────────────────────── */

function VariantRow({ v, index, onChange, onRemove, canRemove, folder }) {
  const shots = Array.isArray(v.images) ? v.images : [];
  // Collapsed by default: an eight-size plant with every strip open would be
  // an unusable wall of thumbnails on a phone.
  const [open, setOpen] = useState(shots.length > 0 && shots.length <= 2);

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

      {/* Photos for THIS height. When a customer picks 4 ft on the product
          page, these lead the gallery — so they see the tree they are
          actually buying rather than a generic shot of the species. */}
      <div className="admin-variant-photos">
        <button
          type="button"
          className="admin-variant-photo-toggle"
          onClick={() => setOpen(o => !o)}
          aria-expanded={open}
        >
          <span>
            <IconImage size={15} />
            Photos of the {v.size?.trim() || 'this'} plant
          </span>
          <span className="admin-variant-photo-count">
            {shots.length > 0 && <strong>{shots.length}</strong>}
            {open ? <IconMinus size={14} /> : <IconPlus size={14} />}
          </span>
        </button>

        {!open && shots.length > 0 && (
          <div className="admin-variant-peek">
            {shots.slice(0, 4).map((src, i) => <img key={i} src={cdnThumb(src)} alt="" loading="lazy" />)}
          </div>
        )}

        {open && (
          <ImageStrip
            images={shots}
            max={VARIANT_MAX_IMAGES}
            folder={`${folder}-${slugify(v.size || String(index + 1))}`}
            onChange={next => onChange({ ...v, images: next })}
            hint="Shown first when someone chooses this height. Leave empty to fall back to the plant's own photos."
          />
        )}
      </div>
    </div>
  );
}

function PlantEditor({ plant, onSave, onCancel, onDelete }) {
  const [form, setForm] = useState(() => ({
    ...plant,
    // Accept an older override that stored one `image` string.
    images: plant.images?.length ? [...plant.images] : (plant.image ? [plant.image] : []),
    variants: plant.variants?.length
      ? plant.variants.map(v => ({ ...v, images: Array.isArray(v.images) ? [...v.images] : [] }))
      : [{ ...BLANK_VARIANT }]
  }));
  const [pathInput, setPathInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const folder = slugify(form.slug || form.name || 'plant');

  const addPath = () => {
    const path = pathInput.trim();
    if (!path) return;
    const current = form.images || [];
    if (current.length >= PLANT_MAX_IMAGES || current.includes(path)) { setPathInput(''); return; }
    set('images', [...current, path]);
    setPathInput('');
  };

  const setVariant = (i, next) => setForm(f => ({
    ...f,
    variants: f.variants.map((v, j) => (j === i ? next : v))
  }));

  const addVariant = () => setForm(f => ({ ...f, variants: [...f.variants, { ...BLANK_VARIANT }] }));
  const removeVariant = i => setForm(f => ({ ...f, variants: f.variants.filter((_, j) => j !== i) }));

  const valid = form.name.trim() && form.variants.some(v => v.cost > 0);

  const submit = async e => {
    e.preventDefault();
    if (!valid || saving) return;
    setSaving(true);
    setError('');
    const slug = form.slug?.trim() ? slugify(form.slug) : slugify(form.name);
    try {
      await onSave({
        ...form,
        slug,
        name: form.name.trim(),
        images: (form.images || []).slice(0, PLANT_MAX_IMAGES),
        variants: form.variants
          .filter(v => v.size.trim() || v.cost > 0)
          .map(v => ({ ...v, images: (v.images || []).slice(0, VARIANT_MAX_IMAGES) }))
      });
    } catch (err) {
      setError(err.message || 'Could not save this plant.');
      setSaving(false);
    }
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
        <button type="button" className="admin-bar-save" onClick={submit} disabled={!valid || saving}>
          {saving ? 'Saving…' : 'Save'}
        </button>
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
          <small className="admin-hint">The opening paragraph on the product page.</small>
        </label>

        <label className="admin-wide">
          Key points
          <textarea
            rows="3"
            value={(form.highlights || []).join('\n')}
            onChange={e => set('highlights', e.target.value.split('\n').map(l => l.trim()).filter(Boolean))}
            placeholder={'One per line\nFastest height gain of any timber we grow\nEight sizes in stock'}
          />
          <small className="admin-hint">One per line. Shown as a ticked list under the description.</small>
        </label>

        <h3>Growing guide</h3>
        <p className="admin-hint">
          These three fill the “What to know before you plant” section. Leave any
          blank and that card is simply not shown.
        </p>
        <label className="admin-wide">
          Planting
          <textarea rows="3" value={form.planting || ''} onChange={e => set('planting', e.target.value)} placeholder="Spacing, pit size, when to plant…" />
        </label>
        <label className="admin-wide">
          Care
          <textarea rows="3" value={form.care || ''} onChange={e => set('care', e.target.value)} placeholder="Watering, weeding, pruning…" />
        </label>
        <label className="admin-wide">
          Uses and market
          <textarea rows="3" value={form.uses || ''} onChange={e => set('uses', e.target.value)} placeholder="What the timber or fruit is used for…" />
        </label>
        <label className="admin-wide">
          Important notice
          <textarea rows="2" value={form.notice || ''} onChange={e => set('notice', e.target.value)} placeholder="e.g. sandalwood needs a host plant" />
          <small className="admin-hint">Highlighted on the product page. Use it for anything a buyer must know.</small>
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
              folder={folder}
              onChange={next => setVariant(i, next)}
              onRemove={() => removeVariant(i)}
              canRemove={form.variants.length > 1}
            />
          ))}
        </div>
        <button type="button" className="small-btn" onClick={addVariant}><IconPlus size={13} /> Add a size</button>

        <h3>Photos</h3>
        <ImageStrip
          images={form.images || []}
          max={PLANT_MAX_IMAGES}
          folder={folder}
          onChange={next => set('images', next)}
          hint="The first photo is the main one shown on the catalogue card. Add up to four more angles. Photos are resized and uploaded as you add them, so you can shoot straight from your phone and they appear on every device."
        />

        <div className="admin-path-add">
          <label>
            …or add a photo already in /public
            <div className="admin-path-row">
              <input
                value={pathInput}
                onChange={e => setPathInput(e.target.value)}
                placeholder="/plants/nilambur-teak.jpg"
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addPath(); } }}
              />
              <button type="button" className="small-btn" onClick={addPath} disabled={!pathInput.trim()}>Add</button>
            </div>
            <small className="admin-hint">
              For the photos that shipped with the site. Anything you upload
              above goes to the photo store instead and needs nothing typed.
            </small>
          </label>
        </div>

        {onDelete && (
          <div className="admin-danger-zone">
            <button type="button" className="admin-delete" onClick={onDelete}>Delete this plant</button>
          </div>
        )}
        {!valid && <p className="admin-hint">A name and at least one size with a price are needed before saving.</p>}
        {error && <div className="form-note error">{error}</div>}
      </div>

      <div className="admin-sticky-actions">
        <button className="btn ghost" type="button" onClick={onCancel}>Cancel</button>
        <button className="btn primary" type="submit" disabled={!valid || saving}>
          {saving ? 'Saving…' : 'Save plant'}
        </button>
      </div>
    </form>
  );
}

function PlantsAdmin() {
  const { plants, upsertPlant, deletePlant, isLive } = useContent();
  const [editing, setEditing] = useState(null);
  const [query, setQuery] = useState('');
  const [flash, setFlash] = useState('');
  const [error, setError] = useState('');

  // Android Back closes the editor and returns to the list, rather than
  // dropping you out of the admin panel altogether.
  useBackToClose(!!editing, () => setEditing(null));

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return plants;
    return plants.filter(p => `${p.name} ${p.tamil} ${p.botanical} ${p.category}`.toLowerCase().includes(q));
  }, [plants, query]);

  const save = async p => {
    const saved = await upsertPlant(p);   // throws; the editor shows the message
    setEditing(null);
    setError('');
    setFlash(`${saved.name} saved. It is live now.`);
  };

  const remove = async () => {
    if (!window.confirm(`Delete ${editing.name}? This removes it from the live site and cannot be undone.`)) return;
    try {
      await deletePlant(editing.id);
      setEditing(null);
      setFlash(`${editing.name} deleted.`);
    } catch (err) {
      setError(err.message || 'Could not delete that plant.');
    }
  };

  if (editing) {
    return (
      <PlantEditor
        plant={editing}
        onSave={save}
        onCancel={() => setEditing(null)}
        onDelete={plants.some(p => String(p.id) === String(editing.id)) ? remove : undefined}
      />
    );
  }

  return (
    <div className="admin-form">
      <div className="admin-editor-head">
        <h2>Plants <span className="admin-count">{plants.length}</span></h2>
        <button className="btn primary" type="button" onClick={() => setEditing(blankPlant())}>
          <IconPlus size={15} /> Add plant
        </button>
      </div>

      {!isLive && (
        <div className="admin-banner warn">
          Not connected to the database, so nothing saved here will reach the
          site. Check the Database tab.
        </div>
      )}
      {flash && <div className="form-note success">{flash}</div>}
      {error && <div className="form-note error">{error}</div>}

      <div className="search-field admin-search">
        <IconSearch size={15} />
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search plants…" aria-label="Search plants" />
      </div>

      <ul className="admin-list">
        {filtered.map(p => (
          <li key={p.id}>
            <button type="button" className="admin-row" onClick={() => { setEditing(p); setFlash(''); }}>
              <span className="admin-row-img">
                {p.image ? <img src={cdnThumb(p.image)} alt="" loading="lazy" /> : <IconLeaf size={16} />}
              </span>
              <span className="admin-row-main">
                <strong>{p.name}</strong>
                <small>
                  {p.botanical} · {p.category} · {p.sizeCount} size{p.sizeCount === 1 ? '' : 's'}
                  {' · '}
                  <span className={p.images?.length ? undefined : 'admin-row-warn'}>
                    {p.images?.length || 0} photo{p.images?.length === 1 ? '' : 's'}
                  </span>
                </small>
              </span>
              <span className="admin-row-price">
                {Number.isFinite(p.price) ? `₹${p.price.toLocaleString('en-IN')}` : 'On request'}
              </span>
            </button>
          </li>
        ))}
        {filtered.length === 0 && <li className="admin-empty">Nothing matches “{query}”.</li>}
      </ul>
    </div>
  );
}

/* ─────────────────────────── database ─────────────────────────── */

/* This replaces the old Publish tab. There is nothing left to publish — a save
   is live the moment it succeeds — so what is useful here instead is an honest
   answer to "is this thing actually connected, and where did my photo go?" */
function Database() {
  const { plants, source, lastError, refresh } = useContent();
  const [busy, setBusy] = useState(false);

  const stats = useMemo(() => {
    const all = plants.flatMap(p => [...(p.images || []), ...(p.variants || []).flatMap(v => v.images || [])]);
    return {
      sizes: plants.reduce((n, p) => n + (p.variants?.length || 0), 0),
      photos: all.length,
      uploaded: all.filter(isRemotePhoto).length,
      local: all.filter(isDataUrl).length,
      missing: plants.filter(p => !(p.images || []).length).length
    };
  }, [plants]);

  const reload = async () => {
    setBusy(true);
    await refresh();
    setBusy(false);
  };

  const status = {
    live: ['ok', 'Connected. Every save here is on the live site immediately.'],
    loading: ['', 'Connecting…'],
    offline: ['warn', 'The database could not be reached. Visitors are seeing the catalogue the site shipped with, and saves will fail until it is back.']
  }[source] || ['', ''];

  return (
    <div className="admin-form">
      <h2>Database</h2>

      <div className={status[0] ? `admin-banner ${status[0]}` : 'admin-banner'}>{status[1]}</div>
      {lastError && <div className="form-note error">{lastError}</div>}

      <ul className="publish-stats">
        <li><strong>{plants.length}</strong><small>Plants</small></li>
        <li><strong>{stats.sizes}</strong><small>Sizes and prices</small></li>
        <li><strong>{stats.photos}</strong><small>Photos in use</small></li>
        <li><strong>{stats.uploaded}</strong><small>Uploaded by you</small></li>
      </ul>

      {stats.local > 0 && (
        <div className="admin-banner warn">
          {stats.local} photo{stats.local === 1 ? '' : 's'} did not reach
          Cloudinary and {stats.local === 1 ? 'exists' : 'exist'} only in this
          browser — nobody else can see {stats.local === 1 ? 'it' : 'them'}. Open
          the plant, remove the photo marked with a warning and add it again.
        </div>
      )}

      {stats.missing > 0 && (
        <div className="admin-banner">
          {stats.missing} plant{stats.missing === 1 ? ' has' : 's have'} no photo
          yet. Those show a leaf placeholder on the catalogue, which sells far
          less than a real picture of the tree.
        </div>
      )}

      <h3>How saving works now</h3>
      <p className="admin-hint">
        Text and prices go to the database. Photos are resized on your phone,
        uploaded to Cloudinary and delivered from there — each visitor is
        automatically served the size and format their screen and browser
        handle best, which is why the catalogue stays fast on a 4G connection.
        Both are shared, so a change made on your phone is on your laptop, on
        your staff's phones and on every customer's screen the moment it saves.
        Nothing to download, commit or deploy.
      </p>

      <h3>Refresh</h3>
      <p className="admin-hint">
        Pulls the latest rows again. Worth doing if someone else has been editing
        at the same time.
      </p>
      <button className="btn ghost" type="button" onClick={reload} disabled={busy}>
        {busy ? 'Refreshing…' : 'Refresh from the database'}
      </button>

      <h3>Backups</h3>
      <p className="admin-hint">
        Neon keeps a rolling history of the database and can restore it to any
        moment in the last few days — Neon dashboard → Branches → Restore.
        Cloudinary holds the photos separately and neither covers the other, so
        keep the original shots on your phone or a hard disk as well.
      </p>

      <h3>The password</h3>
      <p className="admin-hint">
        One password opens this panel, and it lives in your hosting settings
        rather than in the site. To change it: Vercel → Settings → Environment
        Variables → <code>ADMIN_PASSWORD</code> → redeploy. Everyone signed in
        anywhere is signed out at the same time, which is what you want if it
        has been shared with someone who no longer needs it.
      </p>

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
  ['database', 'Database']
];

const TAB_ICONS = {
  plants: IconLeaf,
  site: IconPin,
  appearance: IconSun,
  database: IconImage
};

export default function Admin() {
  const { isSignedIn, checking, signOut } = useAuth();
  const { source } = useContent();
  const [tab, setTab] = useState('plants');

  // A dot on the Database tab when something is wrong, so a failed connection
  // is noticed before a save is attempted rather than after.
  const trouble = source === 'offline' || source === 'static';

  const out = useCallback(() => { signOut(); }, [signOut]);

  if (checking) {
    return (
      <main className="admin-login">
        <Seo title="Admin" description="Site administration." noindex />
        <div className="admin-login-card">
          <span className="admin-logo" aria-hidden="true"><IconLeaf size={22} /></span>
          <p>Checking your sign-in…</p>
        </div>
      </main>
    );
  }

  if (!isSignedIn) {
    return (
      <>
        <Seo title="Admin" description="Site administration." noindex />
        <Login />
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
            <button type="button" className="small-btn" onClick={out}>Sign out</button>
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
            {id === 'database' && trouble && <span className="admin-dot" aria-label="connection problem" />}
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
                {id === 'database' && trouble && <span className="admin-bnav-dot" />}
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
        {tab === 'database' && <Database />}
      </div>
    </main>
  );
}
