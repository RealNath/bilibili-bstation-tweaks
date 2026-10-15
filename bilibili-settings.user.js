// ==UserScript==
// @name         Bilibili.tv Watermark Hider, Subtitles Hider and Cycle
// @name:id      Sembunyikan Watermark dan Subtitle Bilibili.tv
// @namespace    https://github.com/RealNath
// @version      1.1
// @description  Hide bilibili.tv watermark, toggle show/hide subtitles, switch between languages using a shortcut.
// @description:id Sembunyikan watermark atau subtitle bilibili. Bisa ganti bahasa pakai shortcut juga.
// @author       RealNath
// @match        https://www.bilibili.tv/play/*
// @match        https://www.bilibili.tv/*/play/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/600322/Bilibilitv%20Watermark%20Hider%2C%20Subtitles%20Hider%20and%20Cycle.user.js
// @updateURL https://update.greasyfork.org/scripts/600322/Bilibilitv%20Watermark%20Hider%2C%20Subtitles%20Hider%20and%20Cycle.meta.js
// ==/UserScript==

const HIDE_WATERMARK = true; // "true" or "false"
const TOGGLE_SUB_SHORTCUT = 'c';
const CYCLE_SUB_SHORTCUT = 'v';

// How many seconds to skip forward or go backward
const SEEK_STEP = 5; // seconds

// How many milliseconds should popup appears
const POPUP_DURATION = 500; // milliseconds

(function() {
    'use strict';

    const style = document.createElement('style');
    let cssText = `
    body.bili-subs-hidden .player-mobile-ass-subtitle,
    body.bili-subs-hidden .player-mobile-subtitle {
        display: none !important;
    }
    `;
    if (HIDE_WATERMARK) { cssText += `.ip-watermark { display: none !important; }`; }
    style.textContent = cssText;
    document.head.appendChild(style);

    // popup text
    const popup = document.createElement('div');
    popup.style.cssText = `
    position: absolute;
    inset: 0; margin: auto; width: max-content; height: max-content;
    color: white; font-size: 20px;
    background: rgba(0, 0, 0, 0.75); padding: 8px 16px; border-radius: 4px;
    z-index: 999999;
    pointer-events: none;
    `;

    let popupTimeout;

    function showPopup(text) {
        // Target the innermost UI container so it stays above the video
        const container = document.querySelector('.player-mobile-display') ||
        document.getElementById('bilibiliPlayer') ||
        document.body;

        if (popup.parentNode !== container) {
            container.appendChild(popup);
        }

        popup.textContent = `${text}`;
        popup.style.opacity = '1';

        if (popupTimeout) {
            clearTimeout(popupTimeout);
        }

        popupTimeout = setTimeout(() => {
            popup.style.opacity = '0';
        }, POPUP_DURATION);
    }

    // Replicating bilibili's native seek toast:
    // <div class="ip-toast ip-toast--right ip-toast--ttb">
    //     <img src="//p.bstarstatic.com/fe-lib/images/web/forward.png">
    //     <span>10s</span>
    // </div>
    let toastTimeout;
    function showNativeSeekToast(isBackward, step) {
        const container = document.querySelector('.player-mobile-display') ||
        document.getElementById('bilibiliPlayer');
        if (!container) return;

        // Remove old toast if video seeking before the toast is gone
        let oldToast = document.getElementById('custom-seek-toast');
        if (oldToast) oldToast.remove();
        if (toastTimeout) clearTimeout(toastTimeout);

        // Reconstructing the native toast
        const seekToast = document.createElement('div');
        seekToast.id = 'custom-seek-toast';
        seekToast.className = `ip-toast ${isBackward ? 'ip-toast--left' : 'ip-toast--right'} ip-toast--ttb`;

        const iconStyle = isBackward ? "transform: rotate(180deg);" : "";
        seekToast.innerHTML = `
        <img src="//p.bstarstatic.com/fe-lib/images/web/forward.png" style="${iconStyle}">
        <span>${step}s</span>
        `;

        container.appendChild(seekToast);

        toastTimeout = setTimeout(() => {
            if (seekToast.parentNode) seekToast.remove();
        }, 400);
    }

    window.addEventListener('keydown', function(e) {
        let isSubHidden = document.body.classList.contains('bili-subs-hidden');
        const tag = e.target.tagName.toLowerCase();
        if (tag === 'input' || tag === 'textarea' || e.target.isContentEditable) { return; }

        // Toggle show/hide subtitles
        if (e.key.toLowerCase() === TOGGLE_SUB_SHORTCUT && !e.ctrlKey && !e.altKey && !e.metaKey) {
            e.preventDefault();

            document.body.classList.toggle('bili-subs-hidden');

            showPopup(`Subtitles: ${isSubHidden ? 'On' : 'Off'}`);
            return;
        }

        // Cycle subtitles forward/backward
        if (e.key.toLowerCase() === CYCLE_SUB_SHORTCUT && !e.ctrlKey && !e.altKey && !e.metaKey) {
            e.preventDefault();

            let items = Array.from(document.querySelectorAll(
                '.ip-subtitle .ip-subtitle--item:not(.ip-subtitle--item__feedback)'
            ));
            if (items.length === 0) {
                items = Array.from(document.querySelectorAll(
                    '.ip-subtitle-mobile-dialog__content .ip-subtitle-mobile--item:not(.ip-subtitle-mobile--item-dialog-feedback)'
                ));
            }

            if (items.length === 0) return;

            let activeIndex = items.findIndex(item => item.classList.contains('active'));
            if (activeIndex === -1) activeIndex = 0;

            let nextIndex = e.shiftKey
            ? (activeIndex - 1 + items.length) % items.length
            : (activeIndex + 1) % items.length;

            const targetItem = items[nextIndex];
            targetItem.click();

            const langText = targetItem.textContent.trim();
            showPopup(`Subtitle: ${langText}${isSubHidden ? ' (hidden)' : ''}`);
        }

        // Video seek
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            const video = document.querySelector('.player-mobile-video-wrap video');
            if (video) {
                e.preventDefault();
                e.stopImmediatePropagation(); // stops Bilibili's seek listener

                const isBackward = e.key === 'ArrowLeft';
                video.currentTime += isBackward ? -SEEK_STEP : SEEK_STEP;

                showNativeSeekToast(isBackward, SEEK_STEP);
                return;
            }
        }
    });
})();
