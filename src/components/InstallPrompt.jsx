import React, { useEffect, useState } from 'react';
import { IconClose, IconPlus } from './Icons.jsx';
import { site } from '../data/site.js';

const DISMISS_KEY = 'gn-install-dismissed';

// "Add to home screen" banner. Once installed, the site opens full-screen with
// no browser chrome and its own icon in the app drawer — indistinguishable
// from a native app for most customers, with none of the Play Store overhead.
export default function InstallPrompt() {
  const [deferred, setDeferred] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Already installed, or dismissed before — stay out of the way.
    if (window.matchMedia('(display-mode: standalone)').matches) return undefined;
    try { if (localStorage.getItem(DISMISS_KEY)) return undefined; } catch { /* ignore */ }

    const onPrompt = e => {
      e.preventDefault();
      setDeferred(e);
      // Wait a few seconds so it never interrupts the first impression.
      window.setTimeout(() => setVisible(true), 6000);
    };

    window.addEventListener('beforeinstallprompt', onPrompt);
    return () => window.removeEventListener('beforeinstallprompt', onPrompt);
  }, []);

  const dismiss = () => {
    setVisible(false);
    try { localStorage.setItem(DISMISS_KEY, '1'); } catch { /* ignore */ }
  };

  const install = async () => {
    if (!deferred) return;
    setVisible(false);
    deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
    try { localStorage.setItem(DISMISS_KEY, '1'); } catch { /* ignore */ }
  };

  if (!visible || !deferred) return null;

  return (
    <div className="install-prompt" role="dialog" aria-label="Install app">
      <img src="/brand/logo.png" alt="" width="42" height="42" />
      <div className="install-prompt-text">
        <strong>Install {site.name}</strong>
        <small>Browse plants offline, straight from your home screen</small>
      </div>
      <button type="button" className="install-prompt-btn" onClick={install}>
        <IconPlus size={14} /> Install
      </button>
      <button type="button" className="install-prompt-close" onClick={dismiss} aria-label="Not now">
        <IconClose size={16} />
      </button>
    </div>
  );
}
