// Constants & Helpers
const QS = (s) => document.querySelector(s);
const CE = (t) => document.createElement(t);
const QSA = (s) => document.querySelectorAll(s);
const BTN_CLASS = 'ytp-button custom-yt-btn';
const FEATURE_KEYS = { miniplayer: 'feature-miniplayer', pip: 'feature-pip', gesture: 'feature-gesture', speed: 'feature-speed', lens: 'feature-lens' };
const BTN_LABELS_KEY = 'show-btn-labels';
const GESTURE_OVERLAY_ID = 'yt-gesture-area-visual-overlay';

// SVGs
const SVGS = {
    pip: `<svg height="100%" viewBox="0 0 36 36" width="100%"><use class="ytp-svg-shadow" xlink:href="#custom-pip-id"></use><path d="M23.6897 25.4348V14.4626C23.6897 13.6017 23.0069 12.913 22.1724 12.913H8.51724C7.68276 12.913 7 13.6017 7 14.4626V25.4348C7 26.2957 7.68276 27 8.51724 27H22.1724C23.0069 27 23.6897 26.2957 23.6897 25.4348Z" fill="#fff" id="custom-pip-id"/><path d="M27.4828 9C28.3172 9 29 9.68906 29 10.5499V21.5217C29 22.3826 28.3172 23.087 27.4828 23.087H25V21.3158H27.24V10.8947H13.8276V12H12.3103V10.5499C12.3103 9.68906 12.9931 9 13.8276 9H27.4828Z" fill="#fff"/></svg>`,
    mini: `<svg height="100%" viewBox="0 0 36 36" width="100%"><use class="ytp-svg-shadow" xlink:href="#ytp-id-20"></use><path d="M25,17 L17,17 L17,23 L25,23 L25,17 L25,17 Z M29,25 L29,10.98 C29,9.88 28.1,9 27,9 L9,9 C7.9,9 7,9.88 7,10.98 L7,25 C7,26.1 7.9,27 9,27 L27,27 C28.1,27 29,26.1 29,25 L29,25 Z M27,25.02 L9,25.02 L9,10.97 L27,10.97 L27,25.02 L27,25.02 Z" fill="#fff" id="ytp-id-20"></path></svg>`,
    lens: `<svg width="100%" height="100%" viewBox="0 0 36 36" fill="none"><path d="M18 21.4444C17.0741 21.4444 16.287 21.1204 15.6389 20.4722C14.9907 19.8241 14.6667 19.037 14.6667 18.1111C14.6667 17.1852 14.9907 16.3981 15.6389 15.75C16.287 15.1019 17.0741 14.7778 18 14.7778C18.9259 14.7778 19.713 15.1019 20.3611 15.75C21.0093 16.3981 21.3333 17.1852 21.3333 18.1111C21.3333 19.037 21.0093 19.8241 20.3611 20.4722C19.713 21.1204 18.9259 21.4444 18 21.4444ZM24.6667 25.8889C24.0556 25.8889 23.5324 25.6713 23.0972 25.2361C22.662 24.8009 22.4444 24.2778 22.4444 23.6667C22.4444 23.0556 22.662 22.5324 23.0972 22.0972C23.5324 21.662 24.0556 21.4444 24.6667 21.4444C25.2778 21.4444 25.8009 21.662 26.2361 22.0972C26.6713 22.5324 26.8889 23.0556 26.8889 23.6667C26.8889 24.2778 26.6713 24.8009 26.2361 25.2361C25.8009 25.6713 25.2778 25.8889 24.6667 25.8889ZM12.4444 27C11.2222 27 10.1759 26.5648 9.30556 25.6944C8.43519 24.8241 8 23.7778 8 22.5556V20.3333H10.2222V22.5556C10.2222 23.1667 10.4398 23.6898 10.875 24.125C11.3102 24.5602 11.8333 24.7778 12.4444 24.7778H18V27H12.4444ZM25.7778 18.1111V13.6667C25.7778 13.0556 25.5602 12.5324 25.125 12.0972C24.6898 11.662 24.1667 11.4444 23.5556 11.4444H12.4444C11.8333 11.4444 11.3102 11.662 10.875 12.0972C10.4398 12.5324 10.2222 13.0556 10.2222 13.6667V17H8V13.6667C8 12.4444 8.43519 11.3981 9.30556 10.5278C10.1759 9.65741 11.2222 9.22222 12.4444 9.22222H14.6667L15.7778 7H20.2222L21.3333 9.22222H23.5556C24.7778 9.22222 25.8241 9.65741 26.6944 10.5278C27.5648 11.3981 28 12.4444 28 13.6667V18.1111H25.7778Z" fill="white"/></svg>`
};
const getSpeedIcon = (t) => `<svg width="100%" height="100%" viewBox="0 0 36 36"><text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" font-size="16" fill="#fff" font-family="Arial">${t}x</text></svg>`;

// Helper to create buttons
function createBtn({ cls, title, html, onClick, priority }) {
    const btn = CE('button');
    btn.className = `${BTN_CLASS} ${cls}`;
    btn.title = btn.ariaLabel = title;
    if (priority) btn.dataset.priority = priority;
    btn.innerHTML = html;
    if (onClick) btn.addEventListener('click', onClick);
    return btn;
}

// Helper to insert buttons
function insertBtn(btn, refSelector, position = 'before') {
    const ref = QS(refSelector);
    if (ref && ref.parentNode) {
        position === 'before' ? ref.parentNode.insertBefore(btn, ref) : ref.parentNode.insertBefore(btn, ref.nextSibling);
    } else {
        const rc = QS('.ytp-right-controls');
        if (rc) rc.insertBefore(btn, rc.firstChild);
    }
}

// Feature: PiP
function togglePiP() {
    const v = QS('video');
    if (!v) return;
    document.pictureInPictureElement ? document.exitPictureInPicture() : v.requestPictureInPicture();
}
function ensurePiP() {
    if (QS('.custom-yt-pip-button')) return;
    const btn = createBtn({ cls: 'custom-yt-pip-button', title: 'Picture in Picture', html: SVGS.pip, onClick: togglePiP, priority: '6' });
    insertBtn(btn, '.ytp-settings-button');
}

// Feature: Miniplayer
function ensureMini() {
    if (QS('.ytp-miniplayer-button')) return;
    const btn = createBtn({ cls: 'ytp-miniplayer-button', title: 'Miniplayer (i)', html: SVGS.mini, onClick: () => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'i', keyCode: 73, bubbles: true })), priority: '7' });
    insertBtn(btn, '.ytp-settings-button', 'after');
}

// Feature: Lens
function ensureLens() {
    if (QS('.ytp-google-lens-button')) return;
    const btn = createBtn({ cls: 'ytp-google-lens-button', title: 'Google Lens', html: SVGS.lens, onClick: openLens, priority: '9' });
    const pip = QS('.custom-yt-pip-button');
    if (pip && pip.parentNode) pip.parentNode.insertBefore(btn, pip.nextSibling);
    else insertBtn(btn, '.ytp-settings-button');
}
function openLens() {
    const v = QS('video');
    if (!v) return;
    v.pause();
    const c = CE('canvas');
    c.width = v.videoWidth; c.height = v.videoHeight;
    c.getContext('2d').drawImage(v, 0, 0);
    c.toBlob(b => {
        const f = new File([b], 'f.png', { type: 'image/png' });
        const dt = new DataTransfer(); dt.items.add(f);
        const form = CE('form'); form.action = 'https://lens.google.com/upload'; form.method = 'POST'; form.enctype = 'multipart/form-data'; form.target = '_blank'; form.style.display = 'none';
        const inp = CE('input'); inp.type = 'file'; inp.name = 'encoded_image'; inp.files = dt.files;
        form.append(inp); document.body.append(form); form.submit(); setTimeout(() => form.remove(), 1000);
    });
}

// Feature: Speed
const SPEEDS = [0.5, 0.75, 1, 1.5, 2];
function ensureSpeed() {
    if (QS('.ytp-speed-changer-button')) return;
    const btn = createBtn({ cls: 'ytp-speed-changer-button', title: 'Speed', html: getSpeedIcon(1), priority: '8' });
    
    const updateState = () => {
        const v = QS('video');
        if (!v) return;
        const s = v.playbackRate;
        btn.innerHTML = getSpeedIcon(s);
        btn.title = `Speed: ${s}x`;
        // Find closest index for cycling
        const idx = SPEEDS.indexOf(s);
        btn.__idx = idx !== -1 ? idx : 2;
    };

    btn.onclick = function() {
        const v = QS('video'); if (!v) return;
        this.__idx = (this.__idx + 1) % SPEEDS.length;
        v.playbackRate = SPEEDS[this.__idx];
    };

    insertBtn(btn, '.ytp-settings-button');
    
    // Sync with current state and listen for changes
    updateState();
    QS('video')?.addEventListener('ratechange', updateState);
}

// Feature: Labels
function updateLabels() {
    if (!config[BTN_LABELS_KEY]) { QSA('.ytp-btn-label').forEach(e => e.remove()); return; }
    const map = { '.ytp-miniplayer-button': 'Miniplayer', '.custom-yt-pip-button': 'PiP', '.ytp-speed-changer-button': 'Speed', '.ytp-google-lens-button': 'Lens' };
    Object.entries(map).forEach(([sel, txt]) => {
        QSA(sel).forEach(b => {
            if (b.querySelector('.ytp-btn-label')) return;
            const l = CE('div'); l.className = 'ytp-btn-label'; l.textContent = txt;
            Object.assign(l.style, { position: 'absolute', left: '50%', top: '-1.7em', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.85)', color: '#fff', padding: '0.15em 0.7em', borderRadius: '0.7em', pointerEvents: 'none', whiteSpace: 'nowrap', zIndex: '10000' });
            b.style.position = 'relative'; b.append(l);
        });
    });
}

// Feature: Gesture
let audioCtx, gainNode;
function setupAudio(v) {
    if (!window.AudioContext || gainNode) return;
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const src = audioCtx.createMediaElementSource(v);
    gainNode = audioCtx.createGain();
    src.connect(gainNode).connect(audioCtx.destination);
}
function handleWheel(e) {
    const v = e.currentTarget;
    const rect = v.getBoundingClientRect();
    const x = e.clientX - rect.left, w = rect.width;
    if (x > w * 0.3 && x < w * 0.7) return;
    
    const step = (parseFloat(config['gesture-sensitivity']) || 5) / 100;
    e.preventDefault();
    const isVol = x >= w * 0.7;
    const delta = e.deltaY < 0 ? step : -step;
    
    if (isVol) {
        setupAudio(v);
        if (gainNode) {
            gainNode.gain.value = Math.max(0, Math.min(2, gainNode.gain.value + delta));
            v.volume = 1;
            showOverlay(`Volume: ${Math.round(gainNode.gain.value * 100)}%`);
        } else {
            v.volume = Math.max(0, Math.min(1, v.volume + delta));
            showOverlay(`Volume: ${Math.round(v.volume * 100)}%`);
        }
    } else {
        let b = parseFloat(v.style.filter?.match(/brightness\(([^)]+)\)/)?.[1] || 1);
        b = Math.max(0.1, Math.min(1, b + delta));
        v.style.filter = `brightness(${b})`;
        showOverlay(`Brightness: ${Math.round(b * 100)}%`);
    }
}
let ovTimeout;
function showOverlay(txt) {
    let ov = document.getElementById('yt-gesture-overlay');
    if (!ov) {
        ov = CE('div'); ov.id = 'yt-gesture-overlay';
        Object.assign(ov.style, { position: 'absolute', left: '50%', top: '5%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: '2rem', padding: '0.5em 1.5em', borderRadius: '1em', zIndex: '999999', pointerEvents: 'none' });
        QS('video').parentElement.append(ov);
    }
    ov.textContent = txt; ov.style.display = 'block';
    clearTimeout(ovTimeout); ovTimeout = setTimeout(() => ov.style.display = 'none', 800);
}
function updateGestureOverlay() {
    const old = document.getElementById(GESTURE_OVERLAY_ID);
    if (!config['show-gesture-overlay']) {
        if (old) old.remove();
        return;
    }
    if (old) return; // Already exists

    const v = QS('video'); if (!v) return;
    const ov = CE('div'); ov.id = GESTURE_OVERLAY_ID;
    Object.assign(ov.style, { position: 'absolute', left: 0, top: 0, width: v.offsetWidth + 'px', height: v.offsetHeight + 'px', pointerEvents: 'none', zIndex: '999998', display: 'flex' });
    const mkDiv = (flex, bg, txt, border) => {
        const d = CE('div'); Object.assign(d.style, { flex, background: bg, position: 'relative', borderRight: border ? '2px solid rgba(255,255,0,0.3)' : '', borderLeft: !border && flex === '0 0 30%' ? '2px solid rgba(0,128,255,0.3)' : '' });
        const l = CE('div'); l.textContent = txt;
        Object.assign(l.style, { position: 'absolute', left: '50%', top: '10%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.7)', color: '#fff', padding: '0.2em 0.8em', borderRadius: '0.7em' });
        d.append(l); return d;
    };
    ov.append(mkDiv('0 0 30%', 'rgba(255,255,0,0.13)', 'Brightness', true), mkDiv('0 0 40%', 'rgba(0,255,0,0.10)', 'Safe Area'), mkDiv('0 0 30%', 'rgba(0,128,255,0.13)', 'Volume'));
    v.parentElement.style.position = 'relative'; v.parentElement.append(ov);
}

// Main Setup
let config = {};
function applyFeatures() {
    const on = (k) => config[FEATURE_KEYS[k]] !== false;
    
    on('miniplayer') ? ensureMini() : QS('.ytp-miniplayer-button')?.remove();
    on('pip') ? ensurePiP() : QS('.custom-yt-pip-button')?.remove();
    on('speed') ? ensureSpeed() : QS('.ytp-speed-changer-button')?.remove();
    on('lens') ? ensureLens() : QS('.ytp-google-lens-button')?.remove();

    const v = QS('video');
    if (v) {
        v.removeEventListener('wheel', handleWheel);
        if (on('gesture')) {
            v.addEventListener('wheel', handleWheel, { passive: false });
            v.onwheel = e => {
                const x = e.clientX - v.getBoundingClientRect().left;
                if (x <= v.offsetWidth * 0.3 || x >= v.offsetWidth * 0.7) e.preventDefault();
            };
        } else {
            v.onwheel = null;
        }
    }
    updateLabels();
    updateGestureOverlay();
}

function loadConfig() {
    chrome.storage.sync.get(null, r => { config = r; applyFeatures(); });
}

// Observers & Events
const obs = new MutationObserver(applyFeatures);
obs.observe(document.body, { childList: true, subtree: true });

window.addEventListener('yt-navigate-finish', loadConfig);
chrome.storage.onChanged.addListener(loadConfig);

// Init
loadConfig();

// Styles
const style = CE('style');
style.textContent = `.custom-yt-btn svg, .custom-yt-btn img { width: auto !important; height: auto !important; display: inline-block; pointer-events: none; transform: scale(1.5); transform-origin: center; }`;
document.head.append(style);