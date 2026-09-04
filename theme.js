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
      // each page's own <style> block. No !important here, so this plain
      // :root rule still loses to that more-specific dark-mode selector -
      // it only needs to beat the page's own plain :root, which it does by
      // coming later in the document.
      var themable = [];
      if (c.background) themable.push('--color-bg:' + c.background);
      if (c.surface) themable.push('--color-surface:' + c.surface);
      if (c.text) themable.push('--color-text:' + c.text);

      // accent/accent2/fonts don't change with dark mode, so !important is
      // safe here and guarantees they win regardless of load timing.
      var forced = [];
      if (c.accent) forced.push('--color-accent:' + c.accent + ' !important');
      if (c.accent2) forced.push('--color-accent-2:' + c.accent2 + ' !important');
      if (f.heading) forced.push('--font-heading:' + f.heading + ' !important');
      if (f.headingWeight) forced.push('--font-heading-weight:' + f.headingWeight + ' !important');
      if (f.body) forced.push('--font-body:' + f.body + ' !important');

      var css = '';
      if (themable.length) css += ':root {' + themable.join(';') + ';}';
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
