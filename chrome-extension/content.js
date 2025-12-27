// Content script for Chrome extension: injects 'Guide me' popup on text selection

(function() {
  let popup = null;
  let lastSelection = '';
  let justClicked = false;

  function removePopup() {
    if (popup) {
      popup.remove();
      popup = null;
    }
  }

  document.addEventListener('mouseup', function(e) {
    if (justClicked) {
      justClicked = false;
      return;
    }
    removePopup();
    const selection = window.getSelection();
    const text = selection ? selection.toString().trim() : '';
    if (text.length > 0 && text !== lastSelection) {
      lastSelection = text;
      popup = document.createElement('div');
      popup.textContent = 'Create a Guide';
      popup.style.position = 'absolute';
      popup.style.top = `${e.pageY + 10}px`;
      popup.style.left = `${e.pageX + 10}px`;
      popup.style.background = '#fef9c3'; // light yellow
      popup.style.color = '#333';
      popup.style.padding = '14px 28px'; // larger
      popup.style.borderRadius = '14px';
      popup.style.boxShadow = '0 4px 16px rgba(250,224,83,0.18)';
      popup.style.cursor = 'pointer';
      popup.style.zIndex = 999999;
      popup.style.fontWeight = 'bold';
      popup.style.userSelect = 'none';
      popup.style.fontFamily = 'Segoe UI, Arial, Helvetica, sans-serif'; // professional modern font
      popup.style.fontSize = '1.25em';
      popup.addEventListener('mousedown', function(ev) {
        ev.stopPropagation();
        ev.preventDefault();
        justClicked = true;
        // Remove the main popup
        removePopup();
        // Show up to three option bubbles for different How-to guide versions
        const options = [
          'Turn this Into a Guide',
          'Turn this into a Blog Post'
        ];
        const optionBubbles = [];
        options.forEach((option, idx) => {
          const opt = document.createElement('div');
          opt.textContent = option;
          opt.style.position = 'absolute';
          opt.style.top = `${e.pageY + 10 + idx * 56}px`;
          opt.style.left = `${e.pageX + 10}px`;
            opt.style.background = '#fef9c3'; // light yellow
            opt.style.color = '#333';
            opt.style.padding = '14px 28px'; // larger
            opt.style.borderRadius = '14px';
            opt.style.boxShadow = '0 4px 16px rgba(250,224,83,0.12)';
            opt.style.cursor = 'pointer';
            opt.style.zIndex = 999999;
            opt.style.fontWeight = 'bold';
            opt.style.userSelect = 'none';
            opt.style.border = '2px solid #fef9c3';
            opt.style.fontFamily = 'Segoe UI, Arial, Helvetica, sans-serif'; // professional modern font
            opt.style.fontSize = '1.15em';
          opt.addEventListener('mousedown', function(ev2) {
            ev2.stopPropagation();
            ev2.preventDefault();
            console.log('Option clicked:', option, 'Selected text:', text);
            // Send the selected option and highlighted text to the background script
            chrome.runtime.sendMessage({ type: 'VERBSHIFT_GUIDE_ME_OPTION', text, option }, function(response) {
              try {
                  // If extension context is invalidated, catch and ignore the error
                  if (chrome.runtime.lastError) {
                    // Show a temporary error popup to the user
                    const errorPopup = document.createElement('div');
                    errorPopup.textContent = 'Extension error: Please reload the page.';
                    errorPopup.style.position = 'fixed';
                    errorPopup.style.bottom = '32px';
                    errorPopup.style.right = '32px';
                    errorPopup.style.background = '#f87171';
                    errorPopup.style.color = '#fff';
                    errorPopup.style.padding = '12px 24px';
                    errorPopup.style.borderRadius = '10px';
                    errorPopup.style.boxShadow = '0 2px 8px rgba(0,0,0,0.18)';
                    errorPopup.style.zIndex = 999999;
                    errorPopup.style.fontWeight = 'bold';
                    errorPopup.style.fontFamily = 'Segoe UI, Arial, Helvetica, sans-serif'; // professional modern font
                    errorPopup.style.fontSize = '1.1em';
                    document.body.appendChild(errorPopup);
                    setTimeout(() => errorPopup.remove(), 3500);
                    console.warn('Extension context invalidated:', chrome.runtime.lastError.message);
                    return;
                  }
                  // Handle response if needed
              } catch (e) {
                // Ignore context invalidation errors during development (Manifest V3 service worker reload)
                // This is normal and safe to suppress
                console.warn('Extension context invalidated:', e);
              }
            });
            optionBubbles.forEach(b => b.remove());
          });
          document.body.appendChild(opt);
          optionBubbles.push(opt);
        });
        // Remove option bubbles if user clicks elsewhere
        setTimeout(() => {
          document.addEventListener('mousedown', function handler(e2) {
            optionBubbles.forEach(b => b.remove());
            document.removeEventListener('mousedown', handler);
          });
        }, 0);
      });
      document.body.appendChild(popup);
    }
  });

  document.addEventListener('mousedown', function(e) {
    if (popup && !popup.contains(e.target)) {
      removePopup();
    }
  });
})();
