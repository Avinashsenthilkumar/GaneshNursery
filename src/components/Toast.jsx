import React from 'react';
import { useEnquiry } from '../context/EnquiryContext.jsx';
import { IconCheck } from './Icons.jsx';

export default function Toast() {
  const { toast, openDrawer, dismissToast } = useEnquiry();
  if (!toast) return null;

  return (
    <div className="toast" role="status" aria-live="polite">
      <span className="toast-icon"><IconCheck size={14} /></span>
      <span className="toast-text">{toast.message}</span>
      <button type="button" className="toast-action" onClick={() => { dismissToast(); openDrawer(); }}>
        View list
      </button>
    </div>
  );
}
