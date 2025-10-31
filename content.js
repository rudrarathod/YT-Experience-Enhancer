// Constants
const MINIPLAYER_ACTIVATION_DELAY = 100; // milliseconds to wait before restoring playback rate

// Function to simulate "i" keydown
function simulateIKey() {
    const video = document.querySelector('video');
    // Store the current playback rate before entering miniplayer
    const currentRate = video ? video.playbackRate : 1;
    
    const event = new KeyboardEvent('keydown', {
        key: 'i',
        code: 'KeyI',
        keyCode: 73,
        which: 73,
        bubbles: true,
        cancelable: true
    });
    document.dispatchEvent(event);
    
    // Restore the playback rate after a short delay to ensure miniplayer has been activated
    if (video) {
        setTimeout(() => {
            video.playbackRate = currentRate;
        }, MINIPLAYER_ACTIVATION_DELAY);
    }
}

// Function to toggle picture-in-picture mode
function togglePictureInPicture() {
    const video = document.querySelector('video');
    if (!video) return;

    if (document.pictureInPictureElement) {
        document.exitPictureInPicture().catch(console.error);
    } else if (document.pictureInPictureEnabled) {
        video.requestPictureInPicture().catch(console.error);
    }
}

// Function to add click listener to a miniplayer button
function attachMiniplayerListener(button) {
    if (!button.__listenerAttached) { // prevent multiple listeners
        button.addEventListener('click', simulateIKey);
        button.style.display = 'inline-flex'; // ensure visible
        button.style.alignItems = 'center'; // center icon vertically
        button.style.justifyContent = 'center'; // center icon horizontally
        button.__listenerAttached = true;
    }
}

// Function to add click listener to a picture-in-picture button
function attachPipListener(button) {
    if (!button.__pipListenerAttached) { // prevent multiple listeners
        button.addEventListener('click', togglePictureInPicture);
        button.style.display = 'inline-flex'; // ensure visible
        button.style.alignItems = 'center'; // center icon vertically
        button.style.justifyContent = 'center'; // center icon horizontally
        button.__pipListenerAttached = true;
    }
}

// Function to ensure the picture-in-picture button exists and attach listener
function ensurePipButton() {
    let pipButton = document.querySelector('.custom-yt-pip-button');

    if (!pipButton) {
        // Create the PiP button if it doesn't exist
        pipButton = document.createElement('button');
        pipButton.className = 'custom-yt-pip-button ytp-button';
        pipButton.setAttribute('data-priority', '6');
        pipButton.setAttribute('title', 'Picture in Picture');
        pipButton.setAttribute('data-tooltip-title', 'Picture in Picture');
        pipButton.setAttribute('data-title-no-tooltip', 'Picture in Picture');
        pipButton.setAttribute('aria-label', 'Picture in Picture');
        pipButton.innerHTML = `
            <svg class="custom-yt-pip-button-icon" height="100%" version="1.1" viewBox="0 0 36 36" width="100%" fill-opacity="1" style="display: block;">
                <use class="ytp-svg-shadow" xlink:href="#custom-pip-id"></use>
                <path d="M23.6897 25.4348V14.4626C23.6897 13.6017 23.0069 12.913 22.1724 12.913H8.51724C7.68276 12.913 7 13.6017 7 14.4626V25.4348C7 26.2957 7.68276 27 8.51724 27H22.1724C23.0069 27 23.6897 26.2957 23.6897 25.4348Z" fill="#fff" id="custom-pip-id"/>
                <path d="M27.4828 9C28.3172 9 29 9.68906 29 10.5499V21.5217C29 22.3826 28.3172 23.087 27.4828 23.087H25V21.3158H27.24V10.8947H13.8276V12H12.3103V10.5499C12.3103 9.68906 12.9931 9 13.8276 9H27.4828Z" fill="#fff"/>
            </svg>
        `;

        // Find the best insertion point for the PiP button
        const rightControls = document.querySelector('.ytp-right-controls');
        const settingsButton = document.querySelector('.ytp-settings-button');
        const fullscreenButton = document.querySelector('.ytp-fullscreen-button');

        if (settingsButton && settingsButton.parentNode) {
            // Insert before the settings button
            settingsButton.parentNode.insertBefore(pipButton, settingsButton);
        } else if (fullscreenButton && fullscreenButton.parentNode) {
            // Insert before the fullscreen button as fallback
            fullscreenButton.parentNode.insertBefore(pipButton, fullscreenButton);
        } else if (rightControls) {
            // Insert at the beginning of right controls as last resort
            rightControls.insertBefore(pipButton, rightControls.firstChild);
        }
    }

    attachPipListener(pipButton);
}

// Function to ensure the button exists and attach listener
function ensureMiniplayerButton() {
    let button = document.querySelector('.ytp-miniplayer-button');

    if (!button) {
        // Create the button if it doesn't exist
        button = document.createElement('button');
        button.className = 'ytp-miniplayer-button ytp-button';
        button.setAttribute('title', 'Miniplayer');
        button.setAttribute('aria-keyshortcuts', 'i');
        button.setAttribute('data-priority', '7');
        button.setAttribute('data-tooltip-target-id', 'ytp-miniplayer-button');
        button.setAttribute('data-title-no-tooltip', 'Miniplayer');
        button.setAttribute('aria-label', 'Miniplayer keyboard shortcut i');
        button.setAttribute('data-tooltip-title', 'Miniplayer (i)');
        button.innerHTML = `
            <svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%" style="display: block;">
                <use class="ytp-svg-shadow" xlink:href="#ytp-id-20"></use>
                <path d="M25,17 L17,17 L17,23 L25,23 L25,17 L25,17 Z M29,25 L29,10.98 C29,9.88 28.1,9 27,9 L9,9 C7.9,9 7,9.88 7,10.98 L7,25 C7,26.1 7.9,27 9,27 L27,27 C28.1,27 29,26.1 29,25 L29,25 Z M27,25.02 L9,25.02 L9,10.97 L27,10.97 L27,25.02 L27,25.02 Z" fill="#fff" id="ytp-id-20"></path>
            </svg>
        `;

        const sizeButton = document.querySelector('.ytp-settings-button');
        if (sizeButton && sizeButton.parentNode) {
            sizeButton.parentNode.insertBefore(button, sizeButton.nextSibling);
        } else {
            // fallback: add to right controls if size button not found
            const container = document.querySelector('.ytp-right-controls');
            if (container) container.insertBefore(button, container.firstChild);
        }
    }

    attachMiniplayerListener(button);
}


// --- Feature toggles from popup ---
// --- Button Labels Overlay ---
const BTN_LABELS_KEY = 'show-btn-labels';

function showButtonLabels() {
    // Remove any existing labels
    document.querySelectorAll('.ytp-btn-label').forEach(e => e.remove());
    // Only show for custom buttons
    const btns = [
        { sel: '.ytp-miniplayer-button', label: 'Miniplayer' },
        { sel: '.custom-yt-pip-button', label: 'PiP' },
        { sel: '.ytp-speed-changer-button', label: 'Speed' },
        { sel: '.ytp-google-lens-button', label: 'Google Lens' }
    ];
    btns.forEach(({ sel, label }) => {
        document.querySelectorAll(sel).forEach(btn => {
            if (!btn.querySelector('.ytp-btn-label')) {
                const div = document.createElement('div');
                div.className = 'ytp-btn-label';
                div.textContent = label;
                div.style.position = 'absolute';
                div.style.left = '50%';
                div.style.top = '-1.7em';
                div.style.transform = 'translateX(-50%)';
                div.style.background = 'rgba(0,0,0,0.85)';
                div.style.color = '#fff';
                div.style.fontSize = '0.85em';
                div.style.padding = '0.15em 0.7em';
                div.style.borderRadius = '0.7em';
                div.style.pointerEvents = 'none';
                div.style.whiteSpace = 'nowrap';
                div.style.zIndex = '10000';
                div.style.fontWeight = '500';
                div.style.letterSpacing = '0.01em';
                div.style.boxShadow = '0 2px 8px rgba(0,0,0,0.18)';
                div.style.marginBottom = '0.5em';
                btn.style.position = 'relative';
                btn.appendChild(div);
            }
        });
    });
}

function hideButtonLabels() {
    document.querySelectorAll('.ytp-btn-label').forEach(e => e.remove());
}
// Listen for button label toggle and update in real time
function updateButtonLabelsFromStorage() {
    chrome.storage.sync.get([BTN_LABELS_KEY], (result) => {
        if (result[BTN_LABELS_KEY]) {
            showButtonLabels();
        } else {
            hideButtonLabels();
        }
    });
}

// Observe DOM changes to re-apply labels if needed
let btnLabelObserver = new MutationObserver(() => {
    chrome.storage.sync.get([BTN_LABELS_KEY], (result) => {
        if (result[BTN_LABELS_KEY]) showButtonLabels();
    });
});
// Listen for changes from popup and apply all toggles live
chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'sync') {
        if (changes[BTN_LABELS_KEY]) {
            if (changes[BTN_LABELS_KEY].newValue) {
                showButtonLabels();
            } else {
                hideButtonLabels();
            }
        }
    }
});

const FEATURE_KEYS = {
    miniplayer: 'feature-miniplayer',
    pip: 'feature-pip',
    gesture: 'feature-gesture',
    speed: 'feature-speed',
    lens: 'feature-lens'
};

// --- Google Lens Button ---
function ensureLensButton() {
    let lensBtn = document.querySelector('.ytp-google-lens-button');
    if (!lensBtn) {
        lensBtn = document.createElement('button');
    lensBtn.className = 'ytp-google-lens-button ytp-button';
        lensBtn.setAttribute('data-priority', '9');
        lensBtn.setAttribute('title', 'Search this frame with Google Lens');
        lensBtn.setAttribute('aria-label', 'Search this frame with Google Lens');
        lensBtn.setAttribute('data-tooltip-title', 'Search this frame with Google Lens');
        lensBtn.setAttribute('data-title-no-tooltip', 'Google Lens');
        lensBtn.innerHTML = `
            <svg width="100%" height="100%" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: block;">
                <path d="M18 21.4444C17.0741 21.4444 16.287 21.1204 15.6389 20.4722C14.9907 19.8241 14.6667 19.037 14.6667 18.1111C14.6667 17.1852 14.9907 16.3981 15.6389 15.75C16.287 15.1019 17.0741 14.7778 18 14.7778C18.9259 14.7778 19.713 15.1019 20.3611 15.75C21.0093 16.3981 21.3333 17.1852 21.3333 18.1111C21.3333 19.037 21.0093 19.8241 20.3611 20.4722C19.713 21.1204 18.9259 21.4444 18 21.4444ZM24.6667 25.8889C24.0556 25.8889 23.5324 25.6713 23.0972 25.2361C22.662 24.8009 22.4444 24.2778 22.4444 23.6667C22.4444 23.0556 22.662 22.5324 23.0972 22.0972C23.5324 21.662 24.0556 21.4444 24.6667 21.4444C25.2778 21.4444 25.8009 21.662 26.2361 22.0972C26.6713 22.5324 26.8889 23.0556 26.8889 23.6667C26.8889 24.2778 26.6713 24.8009 26.2361 25.2361C25.8009 25.6713 25.2778 25.8889 24.6667 25.8889ZM12.4444 27C11.2222 27 10.1759 26.5648 9.30556 25.6944C8.43519 24.8241 8 23.7778 8 22.5556V20.3333H10.2222V22.5556C10.2222 23.1667 10.4398 23.6898 10.875 24.125C11.3102 24.5602 11.8333 24.7778 12.4444 24.7778H18V27H12.4444ZM25.7778 18.1111V13.6667C25.7778 13.0556 25.5602 12.5324 25.125 12.0972C24.6898 11.662 24.1667 11.4444 23.5556 11.4444H12.4444C11.8333 11.4444 11.3102 11.662 10.875 12.0972C10.4398 12.5324 10.2222 13.0556 10.2222 13.6667V17H8V13.6667C8 12.4444 8.43519 11.3981 9.30556 10.5278C10.1759 9.65741 11.2222 9.22222 12.4444 9.22222H14.6667L15.7778 7H20.2222L21.3333 9.22222H23.5556C24.7778 9.22222 25.8241 9.65741 26.6944 10.5278C27.5648 11.3981 28 12.4444 28 13.6667V18.1111H25.7778Z" fill="white"/>
            </svg>
        `;
        lensBtn.addEventListener('click', openCurrentFrameInLens);
        // Insert after PiP and before settings button for best alignment
        const pipButton = document.querySelector('.custom-yt-pip-button');
        const settingsButton = document.querySelector('.ytp-settings-button');
        if (pipButton && pipButton.parentNode) {
            pipButton.parentNode.insertBefore(lensBtn, settingsButton || pipButton.nextSibling);
        } else if (settingsButton && settingsButton.parentNode) {
            settingsButton.parentNode.insertBefore(lensBtn, settingsButton);
        } else {
            const rightControls = document.querySelector('.ytp-right-controls');
            if (rightControls) rightControls.appendChild(lensBtn);
        }
    }
}

function removeLensButton() {
    const lensBtn = document.querySelector('.ytp-google-lens-button');
    if (lensBtn) lensBtn.remove();
}

function openCurrentFrameInLens() {
    const video = document.querySelector('video');
    if (!video) return;
    video.pause(); // Pause the video when using Google Lens
    // Draw current frame to canvas
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(blob => {
        if (!blob) return;
        // Create a file and form data
        const file = new File([blob], 'frame.png', { type: 'image/png' });
        // Create a temporary form and submit to a new tab
        const url = 'https://lens.google.com/upload';
        const tempForm = document.createElement('form');
        tempForm.action = url;
        tempForm.method = 'POST';
        tempForm.enctype = 'multipart/form-data';
        tempForm.target = '_blank';
        tempForm.style.display = 'none';
        // Add the file input
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.name = 'encoded_image';
        // Use DataTransfer to set the file
        const dt = new DataTransfer();
        dt.items.add(file);
        fileInput.files = dt.files;
        tempForm.appendChild(fileInput);
        document.body.appendChild(tempForm);
        tempForm.submit();
        setTimeout(() => tempForm.remove(), 1000);
    }, 'image/png');
}

// --- Speed Changer Button ---
const SPEED_MODES = [0.5, 0.75, 1, 1.5, 2];
const SPEED_ICONS = {
    0.5: `<svg width="36" height="36" viewBox="0 0 36 36" style="display: block;"><text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" font-size="16" fill="#fff" font-family="Arial">0.5x</text></svg>`,
    0.75: `<svg width="36" height="36" viewBox="0 0 36 36" style="display: block;"><text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" font-size="16" fill="#fff" font-family="Arial">.75x</text></svg>`,
    1: `<svg width="36" height="36" viewBox="0 0 36 36" style="display: block;"><text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" font-size="16" fill="#fff" font-family="Arial">1x</text></svg>`,
    1.5: `<svg width="36" height="36" viewBox="0 0 36 36" style="display: block;"><text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" font-size="16" fill="#fff" font-family="Arial">1.5x</text></svg>`,
    2: `<svg width="36" height="36" viewBox="0 0 36 36" style="display: block;"><text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" font-size="16" fill="#fff" font-family="Arial">2x</text></svg>`
};

// Pre-compute modified speed icons for better performance
const SPEED_ICONS_RESPONSIVE = {};
Object.keys(SPEED_ICONS).forEach(key => {
    SPEED_ICONS_RESPONSIVE[key] = SPEED_ICONS[key].replace('width="36"', 'width="100%"').replace('height="36"', 'height="100%"');
});

function ensureSpeedButton() {
    let speedBtn = document.querySelector('.ytp-speed-changer-button');
    if (!speedBtn) {
        speedBtn = document.createElement('button');
    speedBtn.className = 'ytp-speed-changer-button ytp-button';
        speedBtn.setAttribute('data-priority', '8');
        speedBtn.setAttribute('title', 'Playback Speed');
        speedBtn.setAttribute('aria-label', 'Playback Speed');
        speedBtn.setAttribute('data-tooltip-title', 'Playback Speed');
        speedBtn.setAttribute('data-title-no-tooltip', 'Playback Speed');
    // Use pre-computed responsive icon
    speedBtn.innerHTML = SPEED_ICONS_RESPONSIVE[1];
        speedBtn.__speedIndex = 2; // default to 1x
        speedBtn.addEventListener('click', function() {
            this.__speedIndex = (this.__speedIndex + 1) % SPEED_MODES.length;
            const speed = SPEED_MODES[this.__speedIndex];
            setVideoSpeed(speed);
            this.innerHTML = SPEED_ICONS_RESPONSIVE[speed];
            this.setAttribute('title', `Speed: ${speed}x`);
            this.setAttribute('aria-label', `Speed: ${speed}x`);
            this.setAttribute('data-tooltip-title', `Speed: ${speed}x`);
        });
        // Insert before settings button if possible
        const settingsButton = document.querySelector('.ytp-settings-button');
        if (settingsButton && settingsButton.parentNode) {
            settingsButton.parentNode.insertBefore(speedBtn, settingsButton);
        } else {
            const rightControls = document.querySelector('.ytp-right-controls');
            if (rightControls) rightControls.insertBefore(speedBtn, rightControls.firstChild);
        }
    }
    // Set initial speed and icon
    setVideoSpeed(SPEED_MODES[speedBtn.__speedIndex || 2]);
    speedBtn.innerHTML = SPEED_ICONS_RESPONSIVE[SPEED_MODES[speedBtn.__speedIndex || 2]];
}

function setVideoSpeed(speed) {
    const video = document.querySelector('video');
    if (video) video.playbackRate = speed;
}


function runFeatureSetup() {
    chrome.storage.sync.get([
        FEATURE_KEYS.miniplayer,
        FEATURE_KEYS.pip,
        FEATURE_KEYS.gesture,
        FEATURE_KEYS.speed,
        FEATURE_KEYS.lens
    ], (result) => {
        // Default: all features ON if not set
        const enableMiniplayer = result[FEATURE_KEYS.miniplayer] !== false;
        const enablePip = result[FEATURE_KEYS.pip] !== false;
        const enableGesture = result[FEATURE_KEYS.gesture] !== false;
        const enableSpeed = result[FEATURE_KEYS.speed] !== false;
        const enableLens = result[FEATURE_KEYS.lens] !== false;

        // Miniplayer
        const miniBtn = document.querySelector('.ytp-miniplayer-button');
        if (enableMiniplayer) {
            ensureMiniplayerButton();
        } else if (miniBtn) {
            miniBtn.remove();
        }

        // PiP
        const pipBtn = document.querySelector('.custom-yt-pip-button');
        if (enablePip) {
            ensurePipButton();
        } else if (pipBtn) {
            pipBtn.remove();
        }

        // Speed Changer
        const speedBtn = document.querySelector('.ytp-speed-changer-button');
        if (enableSpeed) {
            ensureSpeedButton();
        } else if (speedBtn) {
            speedBtn.remove();
            setVideoSpeed(1); // reset speed
        }

        // Google Lens
        const lensBtn = document.querySelector('.ytp-google-lens-button');
        if (enableLens) {
            ensureLensButton();
        } else if (lensBtn) {
            lensBtn.remove();
        }

        // Gesture Controls
        const video = document.querySelector('video');
        if (video) {
            video.removeEventListener('wheel', handleVideoWheel, { passive: false });
            video.onwheel = null;
        }
        gestureObserver.disconnect();
        if (enableGesture) {
            setupGestureControls();
            gestureObserver.observe(document.body, { childList: true, subtree: true });
        }

        // Observe DOM changes for enabled features only
        observer.disconnect();
        observer = new MutationObserver(() => {
            if (enablePip) {
                const pipButton = document.querySelector('.custom-yt-pip-button');
                if (pipButton) attachPipListener(pipButton);
            }
            if (enableMiniplayer) {
                const miniButton = document.querySelector('.ytp-miniplayer-button');
                if (miniButton) attachMiniplayerListener(miniButton);
            }
            if (enableSpeed) {
                const speedBtn = document.querySelector('.ytp-speed-changer-button');
                if (!speedBtn) ensureSpeedButton();
            }
            if (enableLens) {
                const lensBtn = document.querySelector('.ytp-google-lens-button');
                if (!lensBtn) ensureLensButton();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    });
}

// Listen for YouTube navigation events (single-page navigation)
window.addEventListener('yt-navigate-finish', runFeatureSetup);

// Initial run

// Overlay for gesture/safe area visualization
const GESTURE_OVERLAY_ID = 'yt-gesture-area-visual-overlay';
const GESTURE_LABEL_CLASS = 'yt-gesture-area-label';

function createGestureAreaOverlay() {
    // Remove if already exists
    removeGestureAreaOverlay();
    const video = document.querySelector('video');
    if (!video) return;
    const rect = video.getBoundingClientRect();
    const overlay = document.createElement('div');
    overlay.id = GESTURE_OVERLAY_ID;
    overlay.style.position = 'absolute';
    overlay.style.left = 0;
    overlay.style.top = 0;
    overlay.style.width = video.offsetWidth + 'px';
    overlay.style.height = video.offsetHeight + 'px';
    overlay.style.pointerEvents = 'none';
    overlay.style.zIndex = '999998';
    overlay.style.display = 'flex';
    overlay.style.flexDirection = 'row';
    overlay.style.transition = 'opacity 0.2s';

    // Parent must be relative
    video.parentElement.style.position = 'relative';
    video.parentElement.appendChild(overlay);

    // Left (brightness)
    const left = document.createElement('div');
    left.style.flex = '0 0 30%';
    left.style.background = 'rgba(255,255,0,0.13)';
    left.style.borderRight = '2px solid rgba(255,255,0,0.3)';
    left.style.height = '100%';
    left.style.position = 'relative';
    // Label
    const leftLabel = document.createElement('div');
    leftLabel.className = GESTURE_LABEL_CLASS;
    leftLabel.textContent = 'Brightness';
    leftLabel.style.position = 'absolute';
    leftLabel.style.left = '50%';
    leftLabel.style.top = '10%';
    leftLabel.style.transform = 'translate(-50%, 0)';
    leftLabel.style.background = 'rgba(0,0,0,0.7)';
    leftLabel.style.color = '#fff';
    leftLabel.style.fontSize = '1.1em';
    leftLabel.style.padding = '0.2em 0.8em';
    leftLabel.style.borderRadius = '0.7em';
    leftLabel.style.pointerEvents = 'none';
    left.appendChild(leftLabel);

    // Center (safe)
    const center = document.createElement('div');
    center.style.flex = '0 0 40%';
    center.style.background = 'rgba(0,255,0,0.10)';
    center.style.height = '100%';
    center.style.position = 'relative';
    // Label
    const centerLabel = document.createElement('div');
    centerLabel.className = GESTURE_LABEL_CLASS;
    centerLabel.textContent = 'Safe Area';
    centerLabel.style.position = 'absolute';
    centerLabel.style.left = '50%';
    centerLabel.style.top = '10%';
    centerLabel.style.transform = 'translate(-50%, 0)';
    centerLabel.style.background = 'rgba(0,0,0,0.7)';
    centerLabel.style.color = '#fff';
    centerLabel.style.fontSize = '1.1em';
    centerLabel.style.padding = '0.2em 0.8em';
    centerLabel.style.borderRadius = '0.7em';
    centerLabel.style.pointerEvents = 'none';
    center.appendChild(centerLabel);

    // Right (volume)
    const right = document.createElement('div');
    right.style.flex = '0 0 30%';
    right.style.background = 'rgba(0,128,255,0.13)';
    right.style.borderLeft = '2px solid rgba(0,128,255,0.3)';
    right.style.height = '100%';
    right.style.position = 'relative';
    // Label
    const rightLabel = document.createElement('div');
    rightLabel.className = GESTURE_LABEL_CLASS;
    rightLabel.textContent = 'Volume';
    rightLabel.style.position = 'absolute';
    rightLabel.style.left = '50%';
    rightLabel.style.top = '10%';
    rightLabel.style.transform = 'translate(-50%, 0)';
    rightLabel.style.background = 'rgba(0,0,0,0.7)';
    rightLabel.style.color = '#fff';
    rightLabel.style.fontSize = '1.1em';
    rightLabel.style.padding = '0.2em 0.8em';
    rightLabel.style.borderRadius = '0.7em';
    rightLabel.style.pointerEvents = 'none';
    right.appendChild(rightLabel);

    overlay.appendChild(left);
    overlay.appendChild(center);
    overlay.appendChild(right);
}

function removeGestureAreaOverlay() {
    const overlay = document.getElementById(GESTURE_OVERLAY_ID);
    if (overlay && overlay.parentElement) {
        overlay.parentElement.removeChild(overlay);
    }
}

// Listen for overlay setting and update overlay
function updateGestureAreaOverlay() {
    chrome.storage.sync.get(['show-gesture-overlay'], (result) => {
        if (result['show-gesture-overlay']) {
            createGestureAreaOverlay();
        } else {
            removeGestureAreaOverlay();
        }
    });
}

// Listen for changes from popup and apply all toggles live
chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'sync') {
        // Overlay toggle
        if (changes['show-gesture-overlay']) {
            updateGestureAreaOverlay();
        }
        // Feature toggles: miniplayer, pip, gesture, speed, lens
        const featureKeys = ['feature-miniplayer', 'feature-pip', 'feature-gesture', 'feature-speed', 'feature-lens'];
        if (featureKeys.some(key => changes[key])) {
            runFeatureSetup();
        }
        // Sensitivity change: no need to re-setup, handled on next gesture
    }
});

// On navigation or initial load, update overlay and features
window.addEventListener('yt-navigate-finish', () => {
    updateGestureAreaOverlay();
    runFeatureSetup();
    updateButtonLabelsFromStorage();
});

// On initial load
updateGestureAreaOverlay();
runFeatureSetup();
updateButtonLabelsFromStorage();
btnLabelObserver.observe(document.body, { childList: true, subtree: true });

// Observe DOM changes in case YouTube recreates the buttons (observer is now managed in runFeatureSetup)
let observer = new MutationObserver(() => {});

// --- Gesture controls for brightness and volume ---

// Web Audio API setup for volume boost
let audioCtx, sourceNode, gainNode, lastVideo;
function setupWebAudio(video) {
    if (!window.AudioContext) return;
    if (lastVideo === video && gainNode) return; // already set up for this video
    if (audioCtx) {
        try { audioCtx.close(); } catch { }
        audioCtx = null;
        sourceNode = null;
        gainNode = null;
    }
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    sourceNode = audioCtx.createMediaElementSource(video);
    gainNode = audioCtx.createGain();
    sourceNode.connect(gainNode).connect(audioCtx.destination);
    lastVideo = video;
}

function handleVideoWheel(e) {
    const video = e.currentTarget;
    const rect = video.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const leftZone = width * 0.3;
    const rightZone = width * 0.7;

    // Safe space in the center 40%
    if (x > leftZone && x < rightZone) return;

    // Get sensitivity from storage (sync, fallback to 5)
    chrome.storage.sync.get(['gesture-sensitivity'], (result) => {
        const step = (parseFloat(result['gesture-sensitivity']) || 5) / 100;
        if (x <= leftZone) {
            // Adjust brightness (scroll up = increase, down = decrease)
            e.preventDefault();
            let current = parseFloat(video.style.filter?.match(/brightness\(([^)]+)\)/)?.[1] || 1);
            if (isNaN(current)) current = 1;
            let next = current + (e.deltaY < 0 ? step : -step); // up = increase
            next = Math.max(0.1, Math.min(1, next)); // cap at 100%
            video.style.filter = `brightness(${next})`;
            showOverlay(`Brightness: ${Math.round(next * 100)}%`);
        } else if (x >= rightZone) {
            // Adjust volume (scroll up = increase, down = decrease)
            e.preventDefault();
            // Use Web Audio API for true boost
            if (gainNode) {
                let next = gainNode.gain.value + (e.deltaY < 0 ? step : -step); // up = increase
                next = Math.max(0, Math.min(2, next)); // cap at 200%
                gainNode.gain.value = next;
                // Keep video.volume at 1 for max input to gain
                video.volume = 1;
                showOverlay(`Volume: ${Math.round(next * 100)}%`);
            } else {
                // fallback: normal volume
                let next = video.volume + (e.deltaY < 0 ? step : -step);
                next = Math.max(0, Math.min(1, next));
                video.volume = next;
                showOverlay(`Volume: ${Math.round(next * 100)}%`);
            }
        }
    });
}

// Overlay for showing brightness/volume percentage
let overlayTimeout;
function showOverlay(text) {
    const video = document.querySelector('video');
    if (!video) return;
    let overlay = document.getElementById('yt-gesture-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'yt-gesture-overlay';
        overlay.style.position = 'absolute';
        overlay.style.left = '50%';
        overlay.style.top = '5%';
        overlay.style.marginTop = '16px';
        overlay.style.transform = 'translate(-50%, 0)';
        overlay.style.background = 'rgba(0,0,0,0.7)';
        overlay.style.color = '#fff';
        overlay.style.fontSize = '2rem';
        overlay.style.padding = '0.5em 1.5em';
        overlay.style.borderRadius = '1em';
        overlay.style.zIndex = '999999';
        overlay.style.pointerEvents = 'none';
        video.parentElement.style.position = 'relative';
        video.parentElement.appendChild(overlay);
    }
    overlay.textContent = text;
    overlay.style.display = 'block';
    clearTimeout(overlayTimeout);
    overlayTimeout = setTimeout(() => {
        overlay.style.display = 'none';
    }, 800);
}

// --- Gesture controls for brightness and volume ---
function setupGestureControls() {
    const video = document.querySelector('video');
    if (!video) return;

    setupWebAudio(video);

    // Remove any previous listeners to avoid duplicates
    video.removeEventListener('wheel', handleVideoWheel, { passive: false });
    video.addEventListener('wheel', handleVideoWheel, { passive: false });
    // Only prevent page scroll in gesture zones (left/right), allow in safe area
    video.onwheel = function(e) {
        const rect = video.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const width = rect.width;
        const leftZone = width * 0.3;
        const rightZone = width * 0.7;
        if (x <= leftZone || x >= rightZone) {
            if (e.cancelable) e.preventDefault();
        }
    };
}

// Gesture observer is now managed in runFeatureSetup
let gestureObserver = new MutationObserver(setupGestureControls);