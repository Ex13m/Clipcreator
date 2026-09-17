// Optional overrides for dump.mjs. Everything here is merged over the built-in defaults.
// Fill this in after the first auto run if some state was missed or something must be skipped.
export default {
  // Extra CSS selector(s) that should be treated as openable controls (tabs, selects, accordions).
  extraCandidates: '',

  // CSS selectors to never click (in addition to the text-based deny list).
  skip: [],

  // Regex for button/trigger text that must never be clicked (write / destructive actions).
  // Tabs ([role=tab]) are exempt because switching a tab never sends anything.
  denyText: null, // null = built-in default

  // Selector that appears once a track is rendered (used to wait after loading a track).
  trackReady: 'audio, canvas, wave, [class*="wave" i], [class*="timeline" i], [class*="duration" i]',

  // Hand-written states (used when auto-discovery cannot reach a state).
  // steps: [{ click: 'css', text: 'optional visible text' }, { press: 'Escape' }, { wait: 800 }, { hover: 'css' }]
  extraStates: [
    // { name: 'tab-style__open-font', from: 'empty', kind: 'popup', steps: [{ click: '[role=tab]', text: 'Style' }, { click: '[role=combobox]', text: 'Font' }] },
  ],
};
