// ==UserScript==
// @name         Bilibili.tv Watermark Hider, Subtitles Hider and Cycle
// @name:id      Sembunyikan Watermark dan Subtitle Bilibili.tv
// @namespace    https://github.com/RealNath
// @version      1.0
// @description  Hide bilibili.tv watermark, toggle show/hide subtitles, switch between languages using a shortcut.
// @description:id Sembunyikan watermark atau subtitle bilibili. Bisa ganti bahasa pakai shortcut juga.
// @author       RealNath
// @match        https://www.bilibili.tv/play/*
// @match        https://www.bilibili.tv/*/play/*
// @grant        none
// @license MIT
// ==/UserScript==

const HIDE_WATERMARK = true
const TOGGLE_SUB_SHORTCUT = 'c';
const CYCLE_SUB_SHORTCUT = 'v';
const POPUP_DURATION = 500;

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

        // Cycle subtitles forward/backward with 'Shift+v'
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
    });
})();
