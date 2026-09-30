# ---- Password Strength Indicator ----
# A mini web project built with HTML5, CSS3 and vanilla JavaScript.
# No frameworks, no libraries, no backend.

A responsive password strength meter that analyzes your password in real
time and tells you exactly how strong it is.

## Features

- Live strength meter that updates on every keystroke
- 5-segment strength bar (red → orange → yellow → light green → green)
- Eye icon to show / hide the password
- Checklist of the five password requirements with animated green ticks
- Colour-coded feedback messages on submit
- Fully responsive (desktop, laptop, tablet, mobile)

## Strength rules

The score is simply the number of satisfied requirements:

| Conditions met | Strength  | Colour       |
| -------------- | --------- | ------------ |
| 0 (empty field) | Enter a password | grey   |
| 1              | Very Weak  | red          |
| 2              | Weak       | orange       |
| 3              | Medium     | yellow       |
| 4              | Strong     | light green  |
| 5              | Very Strong| green        |

The five conditions are: at least 8 characters, one uppercase letter,
one lowercase letter, one number, and one special character.

## Tech

HTML5 · CSS3 · Vanilla JavaScript — nothing else. No build step, no
dependencies, no backend.

## Getting started

Clone the repo and open `index.html` in any browser:

```bash
git clone https://github.com/jai0905/password-strength-indicator.git
```

Then just double-click `index.html`. That's it.

## Project structure

```
.
├── index.html   # markup, inline SVG icons
├── style.css    # theme, layout, animations, media queries
├── script.js    # strength logic, show/hide, submit handling
└── README.md
```

## How the logic works

Each requirement is a rule object with a test function. On every `input`
event the rules are evaluated and the number of passes becomes the
strength *level* (0–5). That level sets a `data-level` attribute on the
strength section, which swaps a CSS variable (`--strength-color`) used by
both the bar segments and the strength text, and it adds `.is-filled` to
the first N segments of the 5-segment bar.