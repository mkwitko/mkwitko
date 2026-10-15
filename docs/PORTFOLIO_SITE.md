# Personal portfolio site (GitHub Pages)

This folder contains a lightweight, responsive engineering portfolio site in English. It is static HTML/CSS with a small optional JavaScript filter, no third-party fonts, no analytics, and no backend dependencies.

## Enable publication (repository owner)

1. Visit **https://github.com/mkwitko/mkwitko/settings/pages**.
2. Under **Build and deployment → Source**, select **Deploy from a branch**.
3. Select **main** and **/docs**, then click **Save**.
4. When GitHub reports a successful deployment, check **https://mkwitko.github.io/mkwitko/** from a logged-out browser.
5. Only after verifying the live site, add its URL to the GitHub profile's Website field and optionally link it in the profile README.

**The site is not live just because the files exist on main.** Enabling GitHub Pages is a separate repository setting.

## Maintainability

- Edit `index.html` for content and project links.
- Edit `assets/portfolio.css` for responsive styling and design tokens.
- Edit `assets/portfolio.js` for the category filter.
- Project 'visuals' are abstract CSS diagrams, **not claimed screenshots**.
- No CV PDFs are published in this site yet because a final personal information and claim review is still pending.

## Accessibility and verification

- All primary content and links are readable without JavaScript.
- Skip link, descriptive link labels, keyboard focus visibility, semantic headings, aria-pressed controls and reduced-motion support are included.
- Before presenting this site as finished, run Lighthouse (mobile), keyboard navigation, WAVE or axe, and verify all links and layout in Chrome/Firefox/Safari.
- Consider adding actual anonymized screenshots only after running apps and reviewing rights/privacy.

## Content sourcing

Statements reference existing CVs and the following publicly inspectable sources: `udv-shop`, `udv-shop-api`, `finance-app`, `lunajoy-front`. A 3s→150ms career achievement appears in the resume, **not** as a benchmark independently derived from these GitHub projects.

## Pages URL caution

The publication URL above is the conventional GitHub Pages URL, not an assertion that the site is already enabled or reachable.
