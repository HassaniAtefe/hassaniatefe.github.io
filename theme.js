// Loads data/theme.json and applies it as CSS custom properties on :root,
// so editing that one file re-themes every page. Runs on every page; if the
// fetch fails, each page's own hardcoded defaults (in its <style> block)
// still apply unchanged.
(function () {
  fetch('data/theme.json')
    .then(function (r) { return r.json(); })
    .then(function (theme) {
      var c = (theme && theme.colors) || {};
      var f = (theme && theme.fonts) || {};

      // bg/surface/text are also overridden by html[data-theme="dark"] in
      // each page's own <style> block. The page re-fetches its own HTML
      // asynchronously (for the dc-runtime's own hot-reload plumbing),
      // which races this fetch - whichever <style> tag lands in <head>
      // last wins at equal specificity, and that race isn't something to
      // depend on. So this uses !important, scoped to :not([data-theme=
      // "dark"]) - it simply doesn't match at all while dark mode is on
      // (selector matching is live, so this also reacts correctly if dark
      // mode is toggled after load), leaving the dark-mode rule untouched
      // instead of trying to out-specificity or out-order it.
      var themable = [];
      if (c.background) themable.push('--color-bg:' + c.background + ' !important');
      if (c.surface) themable.push('--color-surface:' + c.surface + ' !important');
      if (c.text) themable.push('--color-text:' + c.text + ' !important');

      // accent/accent2/hover/fonts don't change with dark mode, so plain
      // :root + !important is fine - no light/dark distinction needed.
      var forced = [];
      if (c.accent) forced.push('--color-accent:' + c.accent + ' !important');
      if (c.accent2) forced.push('--color-accent-2:' + c.accent2 + ' !important');
      if (c.hover) forced.push('--color-hover:' + c.hover + ' !important');
      if (f.heading) forced.push('--font-heading:' + f.heading + ' !important');
      if (f.headingWeight) forced.push('--font-heading-weight:' + f.headingWeight + ' !important');
      if (f.body) forced.push('--font-body:' + f.body + ' !important');

      var css = '';
      if (themable.length) css += 'html:not([data-theme="dark"]) {' + themable.join(';') + ';}';
      if (forced.length) css += ':root {' + forced.join(';') + ';}';
      if (f.baseSize) css += 'body {font-size:' + f.baseSize + ' !important;}';
      if (!css) return;

      var style = document.createElement('style');
      style.textContent = css;
      document.head.appendChild(style);
    })
    .catch(function (err) {
      console.warn('theme.js: could not load data/theme.json, using page defaults', err);
    });
})();
