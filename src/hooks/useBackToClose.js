import { useEffect, useRef } from 'react';

/**
 * Makes the hardware Back button (and the Android back-swipe gesture) close an
 * open overlay instead of navigating to the previous page.
 *
 * This is the single largest difference between a website and an app on
 * Android. Without it, a customer who opens the enquiry sheet and presses Back
 * — the natural way to dismiss a sheet on a phone — gets thrown off the page
 * they were reading, and their place in the catalogue is lost. Every native
 * app closes the sheet instead.
 *
 * How it works: when the overlay opens we push a throwaway history entry.
 * Pressing Back pops that entry rather than leaving the page, and the popstate
 * handler closes the overlay. If the overlay is closed by its own button
 * instead, we remove the entry again so Back does not need pressing twice.
 *
 * @param {boolean}  isOpen  whether the overlay is currently open
 * @param {Function} onClose called when Back is pressed while it is open
 */
export default function useBackToClose(isOpen, onClose) {
  const pushedRef = useRef(false);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    if (!isOpen) return undefined;

    window.history.pushState({ overlay: true }, '');
    pushedRef.current = true;

    const onPop = () => {
      // The entry we added has just been popped, so there is nothing left to
      // clean up — only close the overlay.
      pushedRef.current = false;
      closeRef.current?.();
    };

    window.addEventListener('popstate', onPop);

    return () => {
      window.removeEventListener('popstate', onPop);
      // Closed some other way (X button, overlay tap, Escape). Our history
      // entry is still on the stack, so remove it — otherwise the next Back
      // press would appear to do nothing.
      if (pushedRef.current) {
        pushedRef.current = false;
        window.history.back();
      }
    };
  }, [isOpen]);
}
