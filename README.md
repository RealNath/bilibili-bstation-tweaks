![README English](https://img.shields.io/badge/README_(English)-black?logo=readme&logoColor=fff)
[![README Indonesia](https://img.shields.io/badge/README_(Bahasa_Indonesia)-red?logo=readme&logoColor=fff)](README.id.md)

# Bilibili.tv (Bstation) Tweaks

This is a userscript to tweak some settings in bilibili, because they don't provide any settings for you to change for some reason.

## Features (so far)

* Hide watermark
* Toggle hiding/showing subtitles
    * yes, such a basic stuff is missing from the site 🙂
* Cycle/switch between subtitle languages
* Change video seek time (the original was 10 seconds)

## Shortcuts

These shortcuts and watermark hide/show can be changed on the top of the code, but the default is:
* `c`: toggle between hiding/showing subtitles
* `v`: switch to the next subtitle language in the list (and back to the first from last)
* `shift+v`: switch to the previous subtitle language in the list (and back to the last from first)

## Installation

Note: as this is a userscript, it only works for the web version of bilibili.tv. Mobile app is unsupported.

1. Install Tampermonkey
2. Install the userscript from one of these URLs:
    * GitHub: https://raw.githubusercontent.com/RealNath/bilibili-bstation-tweaks/refs/heads/main/bilibili-settings.user.js
    * Greasy Fork: https://greasyfork.org/en/scripts/600322
