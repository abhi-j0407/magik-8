// design-system.jsx — the design system showroom React app
// Each section has data-screenshot="<id>" so we can grab clean PNGs per panel.

const { useState, useEffect } = React;

/* ═══════════════════════════════════════════════════════════════════════
   1. HERO
   ═══════════════════════════════════════════════════════════════════════ */
function HeroSection() {
  return (
    <section className="ds-section ds-hero" data-screenshot="01-hero">
      <div className="ds-hero-grain" />
      <div className="ds-hero-vignette" />
      <div className="ds-hero-inner">
        <div className="ds-hero-meta">
          <span className="ds-eyebrow">design system · v2 · ritual locked</span>
        </div>
        <div className="ds-hero-wordmark">
          <span>magik</span>
          <span className="ds-hero-eight">8</span>
        </div>
        <div className="ds-hero-tag">ask · shake · know</div>
        <div className="ds-hero-statement">
          A faithful digital homage to the black-and-white fortune toy.
          <br/>Mobile-first PWA · cobalt ink · early-2000s micro-details · quiet chrome.
        </div>
        <div className="ds-hero-rule" />
        <div className="ds-hero-credits">
          <span>m8://oracle.system</span>
          <span className="ds-hero-dot">●</span>
          <span>shake → respond → share</span>
          <span className="ds-hero-dot">●</span>
          <span>single source of truth</span>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   2. BRAND PRINCIPLES
   ═══════════════════════════════════════════════════════════════════════ */
const PRINCIPLES = [
  {
    n: '01',
    title: 'the toy is the brand',
    body: 'The ball + triangle window must read as the physical fortune toy at thumbnail size. UI chrome is subordinate — never competes with the sphere.',
  },
  {
    n: '02',
    title: 'early-2000s in the details',
    body: 'Y2K personality lives in the wordmark (VT323), ASCII corner brackets, embossed shadows, HUD numerals. Never in loud background gradients.',
  },
  {
    n: '03',
    title: 'cobalt ink, not pastel sky',
    body: 'The fluid is deep saturated cobalt — almost black at depth, brilliant blue near the meniscus. Reject pastels, neons, "AI oracle" purples.',
  },
  {
    n: '04',
    title: 'motion sells the suspense',
    body: 'Idle float → shake wobble → ink rise → text fade. Each phase has one job. Reduced-motion never breaks the ritual — just compresses it.',
  },
];

function PrinciplesSection() {
  return (
    <section className="ds-section" data-screenshot="02-principles">
      <SectionHeader index="01" title="principles" subtitle="the four non-negotiables" />
      <div className="ds-principles">
        {PRINCIPLES.map((p) => (
          <article key={p.n} className="ds-principle">
            <div className="ds-principle-n">{p.n}</div>
            <h3 className="ds-principle-title">{p.title}</h3>
            <p className="ds-principle-body">{p.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   3. REFERENCES
   ═══════════════════════════════════════════════════════════════════════ */
const REFERENCES = [
  {
    name: 'billiard 8-ball (the pool ball)',
    swatch: 'sphere',
    steal: 'Off-center white field (≈42% diameter, sits at ~18–22% from top). Soft upper-left specular hotspot, NOT a ring. Subtle cool tint in the shadows — not pure black.',
    avoid: 'A perfectly smooth ball — we want a hint of plastic imperfection (grain overlay).',
  },
  {
    name: 'fortune-telling toy (category)',
    swatch: 'triangle',
    steal: 'Triangle window proportions (~38% of ball width, point upward, slightly inset). Cobalt-on-near-black contrast. Cramped, printed-on-die typography.',
    avoid: 'Mattel branding, exact toy logo, "Magic 8 Ball™" name.',
  },
  {
    name: 'cobalt fountain pen ink',
    swatch: 'ink',
    steal: 'Two-tone vertical gradient — near-black at depth, brilliant cobalt near the surface. A slight purple shift in deep volumes. A bright meniscus line where light catches the fluid surface.',
    avoid: 'Sky-blue, cyan, navy. Anything that reads "tropical."',
  },
  {
    name: 'Y2K UI artifacts',
    swatch: 'y2k',
    steal: 'Tahoma at 11–13px for chrome. VT323 wordmarks with 2–3-stop text-shadow stacks (faux-emboss). Monospaced HUD numerals. 1px chrome borders on dark surfaces. ASCII corner brackets ┌ ┐ └ ┘ on primary CTAs.',
    avoid: 'Aqua glassmorphism, Vista purple gradients, post-Y2K vaporwave neon.',
  },
  {
    name: 'oracle / fortune card typography',
    swatch: 'type',
    steal: 'CONDENSED, slightly compressed all-caps that reads as "stamped" inside a small window. Tight letter-spacing. Slight glow as if ink-printed.',
    avoid: 'Tarot mysticism, hand-drawn moons, third-eye iconography. We are a toy, not a divination deck.',
  },
];

function ReferencesSection() {
  return (
    <section className="ds-section" data-screenshot="03-references">
      <SectionHeader index="02" title="reference board" subtitle="what to steal, what to avoid" />
      <div className="ds-refs">
        {REFERENCES.map((r) => (
          <article key={r.name} className="ds-ref">
            <ReferenceSwatch kind={r.swatch} />
            <div className="ds-ref-body">
              <h3 className="ds-ref-name">{r.name}</h3>
              <div className="ds-ref-row">
                <span className="ds-ref-label ds-ref-label-steal">steal</span>
                <p>{r.steal}</p>
              </div>
              <div className="ds-ref-row">
                <span className="ds-ref-label ds-ref-label-avoid">avoid</span>
                <p>{r.avoid}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ReferenceSwatch({ kind }) {
  if (kind === 'sphere') {
    return (
      <div className="ds-ref-swatch">
        <div style={{ width: 140, height: 140 }}>
          <Sphere size={140} phase="idle" />
        </div>
      </div>
    );
  }
  if (kind === 'triangle') {
    return (
      <div className="ds-ref-swatch">
        <div style={{ width: 140, height: 121 }}>
          <AnswerTriangle phase="answered" answer="YES" />
        </div>
      </div>
    );
  }
  if (kind === 'ink') {
    return (
      <div className="ds-ref-swatch ds-ref-swatch-ink">
        <div className="ds-ref-ink-grad" />
        <span className="ds-ref-meniscus" />
      </div>
    );
  }
  if (kind === 'y2k') {
    return (
      <div className="ds-ref-swatch ds-ref-swatch-y2k">
        <span className="ds-y2k-bracket ds-y2k-tl">┌</span>
        <span className="ds-y2k-bracket ds-y2k-tr">┐</span>
        <span className="ds-y2k-bracket ds-y2k-bl">└</span>
        <span className="ds-y2k-bracket ds-y2k-br">┘</span>
        <div className="ds-y2k-text">m8://<span className="ds-y2k-amber">oracle</span></div>
      </div>
    );
  }
  if (kind === 'type') {
    return (
      <div className="ds-ref-swatch ds-ref-swatch-type">
        <div className="ds-type-spec">SIGNS POINT TO YES</div>
      </div>
    );
  }
  return null;
}

/* ═══════════════════════════════════════════════════════════════════════
   4. THE BALL — anatomy with callouts
   ═══════════════════════════════════════════════════════════════════════ */
function BallAnatomySection() {
  return (
    <section className="ds-section" data-screenshot="04-ball-anatomy">
      <SectionHeader index="03" title="the ball — UX-001" subtitle="anatomy & layer stack" />
      <div className="ds-anatomy">
        <div className="ds-anatomy-stage">
          <MagikBall phase="idle" size={420} />
        </div>
        <div className="ds-anatomy-callouts">
          <CalloutRow n="A" title="rim darkening" body="inset 0 0 30px rgba(0,0,0,.85) + warm rim shadow — sphere reads as plastic, not chrome." />
          <CalloutRow n="B" title="upper-left diffuse" body="radial blur 6px from oklch(34% .010 268). Suggests overhead diffuse light." />
          <CalloutRow n="C" title="hard specular" body="14% × 10% blurred dot at (22%, 12%). The 'wet plastic' hotspot — must NOT be a ring." />
          <CalloutRow n="D" title="warm bottom bounce" body="screen-blend ellipse at 95%y — ground reflection. oklch(22% .020 60) at 60% opacity." />
          <CalloutRow n="E" title="white field" body="42% diameter circle at top: 18%. Warm ivory (--m8-stripe) with subtle inset shadow for slight convex curvature." />
          <CalloutRow n="F" title="numeral 8" body="Helvetica/Arial Black 900 (NOT condensed). letter-spacing −0.02em. Same face as the real billiard ball." />
          <CalloutRow n="G" title="contact shadow" body="blurred 75%-wide ellipse 16px below ball. Separate div, NOT box-shadow." />
        </div>
      </div>
    </section>
  );
}

function CalloutRow({ n, title, body }) {
  return (
    <div className="ds-callout">
      <div className="ds-callout-n">{n}</div>
      <div className="ds-callout-body">
        <strong>{title}</strong>
        <span>{body}</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   5. THE TRIANGLE — anatomy
   ═══════════════════════════════════════════════════════════════════════ */
function TriangleAnatomySection() {
  return (
    <section className="ds-section" data-screenshot="05-triangle-anatomy">
      <SectionHeader index="04" title="the triangle — UX-002" subtitle="recessed cobalt cavity" />
      <div className="ds-anatomy">
        <div className="ds-anatomy-stage ds-anatomy-stage-tri">
          <div style={{ width: 320, height: 277, position: 'relative' }}>
            <AnswerTriangle phase="answered" answer="signs point to yes" />
          </div>
        </div>
        <div className="ds-anatomy-callouts">
          <CalloutRow n="A" title="bezel rim" body="Linear gradient from oklch(20% 0 270) → oklch(2% 0 0). Selling 'plastic ring inside the ball.'" />
          <CalloutRow n="B" title="cavity dark" body="Idle state shows --m8-cavity-dark (oklch 8% .04 265). Hints at depth even when empty." />
          <CalloutRow n="C" title="ink gradient" body="Vertical linear: --m8-fluid-hi (top) → --m8-fluid-mid → --m8-fluid-deep (bottom). Two-tone, never flat." />
          <CalloutRow n="D" title="meniscus highlight" body="Thin 0.6-unit line at ink surface, oklch(72% .11 240) at 55% opacity, gaussian-blurred 0.4. Sells fluid surface tension." />
          <CalloutRow n="E" title="recess overlay" body="Radial gradient (0,0,0,0) → (0,0,0,0.7). Darkens edges of cavity even with ink — feels inset." />
          <CalloutRow n="F" title="answer text" body="Oswald 600 condensed, --m8-text-answer (clamp 14–22px), tracking +0.015em, glow text-shadow." />
          <CalloutRow n="G" title="glass reflection" body="Faint ellipse near top — 6% white. Implies a clear plastic dome over the window." />
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   6. STATES — every ritual phase
   ═══════════════════════════════════════════════════════════════════════ */
function StatesSection() {
  const states = [
    { phase: 'idle',      label: 'idle',      caption: 'cavity dim · 8 field full opacity · idle float 4s' },
    { phase: 'shaking',   label: 'shaking',   caption: 'wobble ±8° · 400ms · ink not yet risen' },
    { phase: 'revealing', label: 'revealing', caption: 'cobalt rises 0→100% · 600ms ease-out · text staggered' },
    { phase: 'answered',  label: 'answered',  caption: 'answer settled · 8 field hidden · ready to ask again' },
  ];
  return (
    <section className="ds-section" data-screenshot="06-states">
      <SectionHeader index="05" title="ritual states" subtitle="phase machine · do not reorder" />
      <div className="ds-states">
        {states.map((s, i) => (
          <article key={s.phase} className="ds-state-card">
            <div className="ds-state-num">phase {String(i+1).padStart(2,'0')}</div>
            <div className="ds-state-ball">
              <MagikBall
                phase={s.phase}
                answer={s.phase === 'revealing' ? '...' : s.phase === 'answered' ? 'signs point to yes' : ''}
                size={220}
              />
            </div>
            <h3 className="ds-state-label">{s.label}</h3>
            <p className="ds-state-caption">{s.caption}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   7. COLOR TOKENS
   ═══════════════════════════════════════════════════════════════════════ */
const COLOR_GROUPS = [
  {
    group: 'stage / surface',
    tokens: [
      { name: '--m8-bg',         value: 'oklch(13% 0.008 270)', role: 'deep stage background' },
      { name: '--m8-bg-elev',    value: 'oklch(17% 0.008 270)', role: 'sheets, dialogs' },
      { name: '--m8-rule',       value: 'oklch(24% 0.008 270)', role: '1px dividers, chrome' },
      { name: '--m8-rule-hi',    value: 'oklch(34% 0.012 268)', role: 'hover / focus borders' },
    ],
  },
  {
    group: 'sphere',
    tokens: [
      { name: '--m8-sphere-rim',  value: 'oklch(4% 0 0)',        role: 'limb darkening (near-black)' },
      { name: '--m8-sphere-core', value: 'oklch(9% 0.004 270)',  role: 'main body' },
      { name: '--m8-sphere-mid',  value: 'oklch(15% 0.006 270)', role: 'mid-tone' },
      { name: '--m8-sphere-hi',   value: 'oklch(34% 0.010 268)', role: 'diffuse highlight' },
      { name: '--m8-sphere-spec', value: 'oklch(96% 0.010 90)',  role: 'specular hotspot' },
      { name: '--m8-sphere-warm', value: 'oklch(22% 0.020 60)',  role: 'warm bottom bounce' },
    ],
  },
  {
    group: 'stripe & numeral',
    tokens: [
      { name: '--m8-stripe',        value: 'oklch(95% 0.014 92)', role: 'warm ivory white field' },
      { name: '--m8-stripe-shadow', value: 'oklch(78% 0.020 90)', role: 'curvature shadow on white' },
      { name: '--m8-eight',         value: 'oklch(9% 0.004 270)', role: 'numeral black' },
    ],
  },
  {
    group: 'ink / triangle',
    tokens: [
      { name: '--m8-cavity-rim',     value: 'oklch(3% 0 0)',        role: 'bezel around window' },
      { name: '--m8-cavity-dark',    value: 'oklch(8% 0.040 265)',  role: 'deep cavity shadow' },
      { name: '--m8-fluid-deep',     value: 'oklch(18% 0.150 262)', role: 'ink at depth' },
      { name: '--m8-fluid-mid',      value: 'oklch(30% 0.170 258)', role: 'core cobalt' },
      { name: '--m8-fluid-hi',       value: 'oklch(46% 0.180 252)', role: 'surface highlight' },
      { name: '--m8-fluid-meniscus', value: 'oklch(72% 0.110 240)', role: 'top edge line' },
      { name: '--m8-answer-ink',     value: 'oklch(95% 0.014 92)',  role: 'answer text (warm ivory, ≥7:1 on cobalt)' },
    ],
  },
  {
    group: 'accent',
    tokens: [
      { name: '--m8-amber',     value: 'oklch(78% 0.135 78)', role: 'wordmark "8", easter egg, focus accent' },
      { name: '--m8-amber-dim', value: 'oklch(58% 0.100 78)', role: 'hover / dim state' },
    ],
  },
  {
    group: 'chrome',
    tokens: [
      { name: '--m8-chrome',      value: 'oklch(72% 0.005 270)', role: 'primary UI text' },
      { name: '--m8-chrome-dim',  value: 'oklch(54% 0.005 270)', role: 'secondary' },
      { name: '--m8-chrome-mute', value: 'oklch(40% 0.005 270)', role: 'tertiary, disabled' },
    ],
  },
];

function ColorSection() {
  return (
    <section className="ds-section" data-screenshot="07-colors">
      <SectionHeader index="06" title="color tokens" subtitle="oklch · semantic · WCAG-aware" />
      {COLOR_GROUPS.map((g) => (
        <div key={g.group} className="ds-color-group">
          <div className="ds-color-group-label">{g.group}</div>
          <div className="ds-color-grid">
            {g.tokens.map((t) => (
              <div key={t.name} className="ds-color-cell">
                <div className="ds-color-swatch" style={{ background: t.value }} />
                <div className="ds-color-info">
                  <code className="ds-color-name">{t.name}</code>
                  <div className="ds-color-val">{t.value}</div>
                  <div className="ds-color-role">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   8. TYPOGRAPHY
   ═══════════════════════════════════════════════════════════════════════ */
function TypeSection() {
  return (
    <section className="ds-section" data-screenshot="08-type">
      <SectionHeader index="07" title="typography" subtitle="four roles · no inter · no roboto" />
      <div className="ds-type-grid">
        <TypeSpec
          role="wordmark"
          family="VT323"
          stack='"VT323", "Courier New", ui-monospace'
          notes="terminal/pixel · text-shadow stack for faux-emboss · the '8' is amber · letter-spacing 0.04em"
          token="--m8-font-wordmark"
        >
          <span className="ds-type-sample ds-type-sample-wordmark">
            <span>magik</span><span className="ds-type-sample-eight">8</span>
          </span>
        </TypeSpec>

        <TypeSpec
          role="answer"
          family="Oswald 600"
          stack='"Oswald", "Bebas Neue", "Archivo Narrow"'
          notes="condensed · uppercase · tracking +0.015em · line-height 1.02 · text-wrap balance · subtle glow"
          token="--m8-font-answer"
        >
          <span className="ds-type-sample ds-type-sample-answer">
            SIGNS POINT TO YES
          </span>
        </TypeSpec>

        <TypeSpec
          role="ball numeral"
          family="Helvetica/Arial Black"
          stack='"Helvetica Neue", "Helvetica", "Arial Black"'
          notes="NOT condensed · weight 900 · letter-spacing −0.02em · same face as the actual billiard ball"
          token="--m8-font-numeral"
        >
          <span className="ds-type-sample ds-type-sample-numeral">8</span>
        </TypeSpec>

        <TypeSpec
          role="ui chrome"
          family="Tahoma / Verdana"
          stack='"Tahoma", "Verdana", "Geneva", system-ui'
          notes="11–13px · lowercase · letter-spacing 0.02em · quiet, era-appropriate, never bold over 700"
          token="--m8-font-ui"
        >
          <span className="ds-type-sample ds-type-sample-ui">
            tap to shake · classic pack · ask again
          </span>
        </TypeSpec>

        <TypeSpec
          role="HUD numerals"
          family="VT323"
          stack='"VT323", "Courier New", ui-monospace'
          notes="11–14px · uppercase · letter-spacing 0.12em · for session counters, status badges, micro-labels"
          token="--m8-font-hud"
        >
          <span className="ds-type-sample ds-type-sample-hud">
            SESH 007 / CLASSIC / READY
          </span>
        </TypeSpec>
      </div>

      <div className="ds-type-scale">
        <div className="ds-type-scale-label">type scale (mobile-first)</div>
        <table className="ds-table">
          <thead>
            <tr><th>token</th><th>size</th><th>where</th></tr>
          </thead>
          <tbody>
            <tr><td>--m8-text-hud</td><td>11px</td><td>HUD numerals, micro-labels</td></tr>
            <tr><td>--m8-text-ui-sm</td><td>11px</td><td>chip labels, captions</td></tr>
            <tr><td>--m8-text-ui</td><td>13px</td><td>body chrome, instructions</td></tr>
            <tr><td>--m8-text-ui-lg</td><td>15px</td><td>primary CTA label</td></tr>
            <tr><td>--m8-text-wordmark</td><td>22px</td><td>app header brand</td></tr>
            <tr><td>--m8-text-answer</td><td>clamp(14px, 4.4vw, 22px)</td><td>answer inside triangle</td></tr>
            <tr><td>--m8-text-eight</td><td>clamp(64px, 22vw, 124px)</td><td>numeral on ball</td></tr>
            <tr><td>--m8-text-wordmark-l</td><td>56px</td><td>share card hero</td></tr>
            <tr><td>--m8-text-answer-l</td><td>88px</td><td>share card answer</td></tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}

function TypeSpec({ role, family, stack, notes, token, children }) {
  return (
    <article className="ds-type-row">
      <div className="ds-type-meta">
        <div className="ds-type-role">{role}</div>
        <div className="ds-type-family">{family}</div>
        <code className="ds-type-token">{token}</code>
        <div className="ds-type-stack">{stack}</div>
        <div className="ds-type-notes">{notes}</div>
      </div>
      <div className="ds-type-sample-wrap">{children}</div>
    </article>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   9. COMPONENTS
   ═══════════════════════════════════════════════════════════════════════ */
function ComponentsSection() {
  return (
    <section className="ds-section" data-screenshot="09-components">
      <SectionHeader index="08" title="chrome components" subtitle="UX-003 thru UX-007" />

      <div className="ds-comp-grid">
        <ComponentCard id="UX-003" title="theme chips" caption="3 packs · selected chip gets amber dot + tinted border · disables during shake/reveal">
          <div className="ds-comp-stack">
            <div className="ds-comp-row-label">default</div>
            <ThemeChips selected="classic" />
            <div className="ds-comp-row-label">career selected</div>
            <ThemeChips selected="career" />
            <div className="ds-comp-row-label">disabled (during ritual)</div>
            <ThemeChips selected="classic" disabled />
          </div>
        </ComponentCard>

        <ComponentCard id="UX-004" title="shake CTA" caption="primary action · ASCII corner brackets · 44px min-height · amber on hover/focus">
          <div className="ds-comp-stack">
            <div className="ds-comp-row-label">idle</div>
            <ShakeCTA phase="idle" />
            <div className="ds-comp-row-label">consulting (busy)</div>
            <ShakeCTA phase="shaking" />
            <div className="ds-comp-row-label">answered</div>
            <ShakeCTA phase="answered" />
            <div className="ds-comp-row-label">needs permission (iOS)</div>
            <ShakeCTA phase="idle" needsPermission />
          </div>
        </ComponentCard>

        <ComponentCard id="UX-007" title="mute toggle" caption="36×36 icon button · top-right of header · sound icon ↔ muted slash icon">
          <div className="ds-comp-stack ds-comp-row">
            <MuteToggle muted={false} />
            <MuteToggle muted={true} />
          </div>
        </ComponentCard>

        <ComponentCard id="UX-005" title="permission sheet" caption="bottom-sheet on iOS · backdrop blur · rise animation · 'allow motion' uses the CTA component">
          <div className="ds-sheet-preview">
            <div className="ds-sheet-scrim-fake" />
            <div className="m8-sheet" style={{ position: 'relative', margin: 0, animation: 'none' }}>
              <div className="m8-sheet-handle" />
              <h2 className="m8-sheet-title">enable shake</h2>
              <p className="m8-sheet-body">
                Magik 8 uses motion to feel your shake.
                <br />Tap to allow — we never store sensor data.
              </p>
              <div className="m8-sheet-actions">
                <ShakeCTA phase="idle" />
                <button className="m8-link-btn">not now</button>
              </div>
            </div>
          </div>
        </ComponentCard>

        <ComponentCard id="UX-006" title="share sheet" caption="appears only when phase === 'answered' · cobalt button · ASCII upload icon · 'preparing…' busy state">
          <div className="ds-comp-stack ds-comp-row">
            <ShareSheet visible status="idle" />
          </div>
          <div className="ds-comp-stack ds-comp-row">
            <ShareSheet visible busy status="idle" />
          </div>
          <div className="ds-comp-stack ds-comp-row">
            <ShareSheet visible status="shared" />
          </div>
        </ComponentCard>

        <ComponentCard id="UX-008" title="HUD strip" caption="micro-chrome under header · VT323 monospace · session counter / pack / status badge">
          <div className="ds-hud-demo">
            <span>sesh</span>
            <span className="ds-hud-num">007</span>
            <span className="ds-hud-sep">/</span>
            <span className="ds-hud-num">classic</span>
            <span className="ds-hud-status ds-hud-status-ready">ready</span>
          </div>
          <div className="ds-hud-demo">
            <span>sesh</span>
            <span className="ds-hud-num">012</span>
            <span className="ds-hud-sep">/</span>
            <span className="ds-hud-num">career</span>
            <span className="ds-hud-status ds-hud-status-shaking">agitating</span>
          </div>
          <div className="ds-hud-demo">
            <span>sesh</span>
            <span className="ds-hud-num">025</span>
            <span className="ds-hud-sep">/</span>
            <span className="ds-hud-num">party</span>
            <span className="ds-hud-status ds-hud-status-settled">settled</span>
          </div>
        </ComponentCard>
      </div>
    </section>
  );
}

function ComponentCard({ id, title, caption, children }) {
  return (
    <article className="ds-comp">
      <header className="ds-comp-header">
        <code className="ds-comp-id">{id}</code>
        <h3 className="ds-comp-title">{title}</h3>
        <p className="ds-comp-caption">{caption}</p>
      </header>
      <div className="ds-comp-body">{children}</div>
    </article>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   10. MOTION
   ═══════════════════════════════════════════════════════════════════════ */
function MotionSection() {
  return (
    <section className="ds-section" data-screenshot="10-motion">
      <SectionHeader index="09" title="motion" subtitle="ritual-locked · do not invent new phases" />
      <table className="ds-table ds-motion-table">
        <thead>
          <tr>
            <th>phase</th><th>duration</th><th>easing</th><th>animates</th>
            <th>reduced-motion</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>idle</code></td>
            <td>4000ms loop</td>
            <td>ease-in-out</td>
            <td>translateY 0 → −6px → 0</td>
            <td>none (static)</td>
          </tr>
          <tr>
            <td><code>shaking</code></td>
            <td>400ms</td>
            <td>ease-in-out</td>
            <td>rotate −8° → +7° → −6° → +5° → 0°</td>
            <td>opacity 1 → 0.85 → 1 pulse</td>
          </tr>
          <tr>
            <td><code>revealing</code></td>
            <td>600ms</td>
            <td><code>--m8-ease-ink</code></td>
            <td>ink rect y: 83 → 4, height: 0 → 79</td>
            <td>0ms (instant)</td>
          </tr>
          <tr>
            <td><code>answered</code> (text fade)</td>
            <td>200ms, delay 400ms</td>
            <td>ease-out</td>
            <td>opacity 0 → 1</td>
            <td>0ms (instant)</td>
          </tr>
          <tr>
            <td>sheet rise</td>
            <td>280ms</td>
            <td><code>--m8-ease-toy</code> (.22,1,.36,1)</td>
            <td>translateY 24 → 0, opacity 0 → 1</td>
            <td>0ms (instant fade)</td>
          </tr>
          <tr>
            <td>scrim fade</td>
            <td>200ms</td>
            <td>ease-out</td>
            <td>opacity 0 → 1</td>
            <td>0ms (instant)</td>
          </tr>
        </tbody>
      </table>

      <div className="ds-motion-timeline">
        <div className="ds-mt-label">ritual timeline · 1 tap → settled answer</div>
        <div className="ds-mt-bar">
          <div className="ds-mt-seg ds-mt-seg-idle"><span>idle</span></div>
          <div className="ds-mt-seg ds-mt-seg-shake"><span>shake 400ms</span></div>
          <div className="ds-mt-seg ds-mt-seg-reveal"><span>reveal 600ms</span></div>
          <div className="ds-mt-seg ds-mt-seg-text"><span>text 200ms (delayed 400)</span></div>
          <div className="ds-mt-seg ds-mt-seg-answered"><span>answered ∞</span></div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   11. THEME ACCENTS
   ═══════════════════════════════════════════════════════════════════════ */
const THEME_ACCENTS = [
  {
    id: 'classic',
    label: 'classic',
    voice: 'canonical fortune toy phrases',
    accent: 'oklch(78% 0.135 78)',
    accentName: 'amber',
    chipBg: 'rgba(180, 130, 30, 0.06)',
  },
  {
    id: 'career',
    label: 'career coach',
    voice: 'workplace-appropriate, constructive',
    accent: 'oklch(70% 0.110 175)',
    accentName: 'eucalyptus',
    chipBg: 'rgba(60, 150, 130, 0.07)',
  },
  {
    id: 'party',
    label: 'party mode',
    voice: 'silly, chaotic, party energy',
    accent: 'oklch(72% 0.180 340)',
    accentName: 'fuchsia',
    chipBg: 'rgba(200, 60, 140, 0.07)',
  },
];

function ThemeAccentsSection() {
  return (
    <section className="ds-section" data-screenshot="11-themes">
      <SectionHeader index="10" title="theme accents" subtitle="three packs · tints the chip + share card only · never the ball" />
      <div className="ds-themes">
        {THEME_ACCENTS.map((t) => (
          <article key={t.id} className="ds-theme-card">
            <div className="ds-theme-swatch" style={{ background: t.accent }} />
            <div className="ds-theme-body">
              <h3 className="ds-theme-label">{t.label}</h3>
              <p className="ds-theme-voice">{t.voice}</p>
              <code className="ds-theme-accent">accent · {t.accentName}</code>
              <code className="ds-theme-accent-val">{t.accent}</code>
              <div className="ds-theme-chip-preview" style={{
                background: t.chipBg,
                borderColor: t.accent,
              }}>
                <span className="ds-theme-chip-dot" style={{ background: t.accent, boxShadow: `0 0 6px ${t.accent}` }} />
                {t.label}
              </div>
            </div>
          </article>
        ))}
      </div>
      <div className="ds-theme-note">
        <strong>Rule:</strong> theme accents only tint the <em>selected chip dot</em>, the <em>share card pack label</em>, and the <em>HUD pack indicator</em>. The ball, triangle, ink, and answer text remain canonical across all packs.
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   12. SHARE CARD (1080×1920 preview)
   ═══════════════════════════════════════════════════════════════════════ */
function ShareCardSection() {
  return (
    <section className="ds-section" data-screenshot="12-share-card">
      <SectionHeader index="11" title="share card" subtitle="1080×1920 · story export · feels like a photo of the toy moment" />
      <div className="ds-share-preview-wrap">
        <div className="ds-share-frame">
          <ShareCard answer="signs point to yes" themeLabel="classic" scale={0.32} />
        </div>
        <div className="ds-share-specs">
          <div className="ds-share-spec">
            <code>SHARE_CARD_WIDTH</code>
            <span>1080</span>
          </div>
          <div className="ds-share-spec">
            <code>SHARE_CARD_HEIGHT</code>
            <span>1920</span>
          </div>
          <div className="ds-share-spec">
            <code>device pixel ratio</code>
            <span>2 (capture)</span>
          </div>
          <div className="ds-share-spec">
            <code>format</code>
            <span>PNG via html-to-image</span>
          </div>
          <div className="ds-share-spec">
            <code>wordmark</code>
            <span>VT323 · 56px · amber 8</span>
          </div>
          <div className="ds-share-spec">
            <code>answer</code>
            <span>Oswald 600 · 88px · ivory + cobalt glow</span>
          </div>
          <div className="ds-share-spec">
            <code>background</code>
            <span>radial cobalt-fade · NOT solid · grain overlay 8%</span>
          </div>
          <div className="ds-share-spec">
            <code>corners</code>
            <span>ASCII brackets ┌ ┐ └ ┘ at 28px chrome-mute</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   13. LAYOUT (mobile-first wireframe)
   ═══════════════════════════════════════════════════════════════════════ */
function LayoutSection() {
  return (
    <section className="ds-section" data-screenshot="13-layout">
      <SectionHeader index="12" title="layout & safe areas" subtitle="single-screen mobile · no scroll · thumb-zone aware" />
      <div className="ds-layout-grid">
        <div className="ds-wire">
          <div className="ds-wire-phone">
            <div className="ds-wire-statusbar">status bar · env(safe-area-inset-top)</div>
            <div className="ds-wire-block ds-wire-header">
              <span>wordmark</span><span className="ds-wire-r">mute</span>
            </div>
            <div className="ds-wire-block ds-wire-hud">HUD strip · sesh / pack / status</div>
            <div className="ds-wire-block ds-wire-ball">
              <span>ball · min(70vh, 360px)</span>
              <span className="ds-wire-sub">center of stage · idle floats</span>
            </div>
            <div className="ds-wire-block ds-wire-instruction">instruction line · 13px · muted</div>
            <div className="ds-wire-block ds-wire-chips">theme chips · 32px min · horizontal</div>
            <div className="ds-wire-block ds-wire-cta">SHAKE CTA · 44px min · thumb zone</div>
            <div className="ds-wire-block ds-wire-share">share button (only when answered)</div>
            <div className="ds-wire-homebar">home indicator · env(safe-area-inset-bottom)</div>
          </div>
        </div>
        <div className="ds-layout-notes">
          <h4>safe areas</h4>
          <ul>
            <li><code>env(safe-area-inset-top)</code> &mdash; below dynamic island / notch</li>
            <li><code>env(safe-area-inset-bottom)</code> &mdash; above home indicator</li>
            <li>16–20px horizontal page padding</li>
          </ul>
          <h4>spacing scale</h4>
          <ul>
            <li>4px · micro (icon gap, HUD gaps)</li>
            <li>8px · tight (chip gap, sheet inner)</li>
            <li>14px · default (footer stack)</li>
            <li>20px · loose (page padding)</li>
            <li>28px · big (between hero + chrome)</li>
          </ul>
          <h4>thumb zones</h4>
          <ul>
            <li>Primary CTA: bottom third</li>
            <li>Theme chips: just above CTA (one row, scrollable)</li>
            <li>Mute: top-right corner (low-priority, secondary hand)</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   14. ASSETS
   ═══════════════════════════════════════════════════════════════════════ */
function AssetsSection() {
  return (
    <section className="ds-section" data-screenshot="14-assets">
      <SectionHeader index="13" title="asset inventory" subtitle="what is CSS/SVG · what is raster · what to source" />
      <table className="ds-table">
        <thead>
          <tr>
            <th>asset</th><th>format</th><th>size</th><th>path</th><th>source</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>sphere body</td><td>CSS gradients</td><td>—</td><td>component css</td><td>create (this doc)</td></tr>
          <tr><td>triangle window</td><td>inline SVG</td><td>—</td><td>component jsx</td><td>create (this doc)</td></tr>
          <tr><td>film grain tile</td><td>SVG → data URI</td><td>160×160 (tiled)</td><td>inline in <code>tokens.css</code></td><td>create (in doc)</td></tr>
          <tr><td>ASCII corner brackets</td><td>unicode <code>┌ ┐ └ ┘</code></td><td>text glyphs</td><td>component jsx</td><td>—</td></tr>
          <tr><td>mute / unmute icon</td><td>inline SVG</td><td>16×16</td><td>component jsx</td><td>create (this doc)</td></tr>
          <tr><td>share icon</td><td>inline SVG</td><td>14×14</td><td>component jsx</td><td>create (this doc)</td></tr>
          <tr><td>favicon</td><td>PNG</td><td>32×32</td><td><code>/public/favicon.png</code></td><td>generate from wordmark "8"</td></tr>
          <tr><td>PWA icon</td><td>PNG maskable</td><td>192, 512</td><td><code>/public/icons/</code></td><td>generate — ball silhouette</td></tr>
          <tr><td>SFX-01 shake_start</td><td>WAV/OGG</td><td>~300ms</td><td><code>/public/sfx/</code></td><td>source (royalty-free slosh)</td></tr>
          <tr><td>SFX-02 reveal</td><td>WAV/OGG</td><td>~400ms</td><td><code>/public/sfx/</code></td><td>source (soft triangle ping)</td></tr>
          <tr><td>SFX-03 easter_egg</td><td>WAV/OGG</td><td>~600ms</td><td><code>/public/sfx/</code></td><td>source (sparkle layer)</td></tr>
          <tr><td>font: VT323</td><td>Google Fonts</td><td>subset latin</td><td>preconnect + link</td><td>fonts.google.com/specimen/VT323</td></tr>
          <tr><td>font: Oswald</td><td>Google Fonts</td><td>500/600/700</td><td>preconnect + link</td><td>fonts.google.com/specimen/Oswald</td></tr>
        </tbody>
      </table>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   15. ANTI-PATTERNS
   ═══════════════════════════════════════════════════════════════════════ */
const ANTI_PATTERNS = [
  { do_text: 'oklch deep cobalt for the ink', dont: 'sky-blue, cyan, navy, neon' },
  { do_text: 'VT323 / Oswald / Tahoma stack', dont: 'Inter, Roboto, Space Grotesk, system-only' },
  { do_text: 'one warm amber accent, used sparingly', dont: 'purple gradients, candy pastels, rainbow chip colors' },
  { do_text: 'film grain + radial vignette on stage', dont: 'big gradient backdrops, glassmorphism panels' },
  { do_text: 'ASCII corner brackets on CTAs', dont: 'pill-shaped SaaS buttons with chevron arrows' },
  { do_text: 'theme accents only tint chip + share card', dont: 'reskinning the ball per theme — the ball IS the brand' },
  { do_text: 'answer text condensed, all-caps, glow', dont: 'lowercase body sans, soft-wrap unfussy paragraphs' },
  { do_text: 'idle float / shake / reveal — that is all', dont: 'inventing new phases (loading, thinking, processing, etc.)' },
];

function AntiPatternsSection() {
  return (
    <section className="ds-section" data-screenshot="15-anti-patterns">
      <SectionHeader index="14" title="anti-patterns checklist" subtitle="things that will break the spell" />
      <div className="ds-anti-grid">
        {ANTI_PATTERNS.map((p, i) => (
          <div key={i} className="ds-anti-row">
            <div className="ds-anti-do">
              <span className="ds-anti-tag ds-anti-tag-do">do</span>
              <span>{p.do_text}</span>
            </div>
            <div className="ds-anti-dont">
              <span className="ds-anti-tag ds-anti-tag-dont">don't</span>
              <span>{p.dont}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   16. HANDOFF (file touch list + prompts)
   ═══════════════════════════════════════════════════════════════════════ */
function HandoffSection() {
  return (
    <section className="ds-section" data-screenshot="16-handoff">
      <SectionHeader index="15" title="implementation handoff" subtitle="what to change in src/ · in order" />

      <div className="ds-handoff-step">
        <div className="ds-handoff-num">step 1</div>
        <h3>migrate tokens</h3>
        <p>
          Replace the contents of <code>src/index.css</code> with the canonical token block from
          <code> tokens.css</code> in this kit. Keep the existing <code>@import 'tailwindcss';</code> at top.
          All existing token names are <strong>renamed</strong> from <code>--magik-*</code> to <code>--m8-*</code>;
          run a project-wide find &amp; replace.
        </p>
        <div className="ds-prompt">
          <div className="ds-prompt-label">prompt for your AI coder</div>
          <pre>{`Open src/index.css. Replace its body with the design tokens in
prompts/01-tokens.md (paste the contents verbatim under @import 'tailwindcss').

Then perform a project-wide rename in src/**/*.tsx:
  --magik-bg               → --m8-bg
  --magik-sphere           → --m8-sphere-core
  --magik-sphere-highlight → --m8-sphere-hi
  --magik-stripe           → --m8-stripe
  --magik-eight            → --m8-eight
  --magik-fluid            → --m8-fluid-mid
  --magik-fluid-light      → --m8-fluid-hi
  --magik-answer-text      → --m8-answer-ink
  --magik-accent           → --m8-amber
  --magik-muted            → --m8-chrome-dim

Also rename:
  --font-ui     → --m8-font-ui
  --font-answer → --m8-font-answer

Add a new <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=VT323&family=Oswald:wght@500;600;700&display=swap"/>
to index.html, removing any Bebas/DM Sans imports.`}</pre>
        </div>
      </div>

      <div className="ds-handoff-step">
        <div className="ds-handoff-num">step 2</div>
        <h3>rebuild MagikBall + AnswerTriangle</h3>
        <p>
          Replace the JSX bodies in <code>src/components/MagikBall.tsx</code> and
          <code> src/components/AnswerTriangle.tsx</code>. Keep all
          <code>motion/react</code> hooks, the <code>useOracle</code> wiring, focus management, and the
          <code> useReducedMotion</code> branches — only the markup and styles change. Reference the anatomy
          callouts above (sections 03 + 04) for layer order.
        </p>
        <div className="ds-prompt">
          <div className="ds-prompt-label">prompt</div>
          <pre>{`See prompts/02-ball.md and prompts/03-triangle.md. Each contains the
target JSX + token references. Preserve:
  - motion.button wrapper
  - phase prop → animate variants
  - aria-label logic
  - reducedMotion fallbacks
  - useEffect for onAnimationDone (REVEAL_MS=600)
Only the inner DOM + className strings change.`}</pre>
        </div>
      </div>

      <div className="ds-handoff-step">
        <div className="ds-handoff-num">step 3</div>
        <h3>refresh chrome components</h3>
        <p>
          Update <code>ThemeChips.tsx</code>, <code>ShakeCTA.tsx</code>, <code>MuteToggle.tsx</code>,
          <code> PermissionSheet.tsx</code>, <code>ShareSheet.tsx</code>, and the App header in
          <code> App.tsx</code>. Add the wordmark + HUD strip. Reduce the visual weight of every chip and button.
        </p>
        <div className="ds-prompt">
          <div className="ds-prompt-label">prompt</div>
          <pre>{`See prompts/04-chrome.md. Apply the className + structure changes
described per component. The CTA gets ASCII corner brackets (Unicode
glyphs ┌ ┐ └ ┘ as <span> elements positioned absolutely at corners).
Wordmark goes in <header>: <Wordmark /> from the new file.

Add a new component src/components/Wordmark.tsx and another
src/components/HUDStrip.tsx — paste from prompts/04-chrome.md.`}</pre>
        </div>
      </div>

      <div className="ds-handoff-step">
        <div className="ds-handoff-num">step 4</div>
        <h3>redo share card</h3>
        <p>
          Replace the body of <code>src/components/ShareCard.tsx</code>. Layout becomes:
          wordmark (top) → ball cropped (center) → answer (large below) → footer HUD line.
          Add corner ASCII brackets and a grain SVG layer (also data-URI).
        </p>
        <div className="ds-prompt">
          <div className="ds-prompt-label">prompt</div>
          <pre>{`See prompts/05-share-card.md. The export size constants
SHARE_CARD_WIDTH/HEIGHT remain unchanged. The captureShareCard() helper
in lib/shareExport.ts does not need changes.`}</pre>
        </div>
      </div>

      <div className="ds-handoff-step">
        <div className="ds-handoff-num">step 5</div>
        <h3>motion polish</h3>
        <p>
          Tune the easing curves in your existing <code>motion/react</code> calls.
          Use <code>cubic-bezier(.22, 1, .36, 1)</code> (toy easing) for shake; <code>cubic-bezier(.16, .8, .3, 1)</code> (ink easing) for reveal. Durations match the existing constants.
        </p>
        <div className="ds-prompt">
          <div className="ds-prompt-label">prompt</div>
          <pre>{`See prompts/06-motion.md. Only the easing strings and a couple of
animate variants need updating — no new motion phases.`}</pre>
        </div>
      </div>

      <div className="ds-handoff-step">
        <div className="ds-handoff-num">step 6</div>
        <h3>QA</h3>
        <ul className="ds-handoff-checklist">
          <li>☐ Lighthouse mobile a11y &gt;= 95 (no regression)</li>
          <li>☐ <code>prefers-reduced-motion</code> still hides float + wobble; reveal becomes instant</li>
          <li>☐ Answer text on cobalt fluid &ge; 4.5:1 contrast (sample: oklch(95% .014 92) on oklch(30% .170 258) = 8.9:1 ✓)</li>
          <li>☐ Ball + triangle read as the toy at 64×64 favicon scale</li>
          <li>☐ Wordmark "8" is amber, visible at 22px on dark</li>
          <li>☐ Grain overlay does not block clicks (pointer-events: none)</li>
        </ul>
      </div>

      <div className="ds-handoff-files">
        <h3>file touch list</h3>
        <ul className="ds-file-list">
          <li><code>index.html</code> &mdash; font links (VT323, Oswald)</li>
          <li><code>src/index.css</code> &mdash; token migration + grain/vignette utilities</li>
          <li><code>src/App.tsx</code> &mdash; header wordmark + HUD strip + instruction copy tweaks</li>
          <li><code>src/components/MagikBall.tsx</code> &mdash; sphere layer stack</li>
          <li><code>src/components/AnswerTriangle.tsx</code> &mdash; SVG bezel + ink gradient + meniscus</li>
          <li><code>src/components/ThemeChips.tsx</code> &mdash; pill → ASCII-ish with amber dot</li>
          <li><code>src/components/ShakeCTA.tsx</code> &mdash; ASCII corner brackets + emboss</li>
          <li><code>src/components/MuteToggle.tsx</code> &mdash; SVG icons (drop the emoji)</li>
          <li><code>src/components/PermissionSheet.tsx</code> &mdash; bottom-sheet animation</li>
          <li><code>src/components/ShareSheet.tsx</code> &mdash; cobalt button + status row</li>
          <li><code>src/components/ShareCard.tsx</code> &mdash; new 1080×1920 layout</li>
          <li><strong>new:</strong> <code>src/components/Wordmark.tsx</code></li>
          <li><strong>new:</strong> <code>src/components/HUDStrip.tsx</code></li>
        </ul>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   Section header
   ═══════════════════════════════════════════════════════════════════════ */
function SectionHeader({ index, title, subtitle }) {
  return (
    <header className="ds-section-header">
      <div className="ds-section-eyebrow">
        <span className="ds-section-idx">{index}</span>
        <span className="ds-section-sep">/</span>
        <span className="ds-section-sub">{subtitle}</span>
      </div>
      <h2 className="ds-section-title">{title}</h2>
    </header>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   ROOT
   ═══════════════════════════════════════════════════════════════════════ */
function DesignSystem() {
  return (
    <div className="ds-root">
      <nav className="ds-nav">
        <span className="ds-nav-mark">m8</span>
        <span className="ds-nav-sep">·</span>
        <a href="#01-hero">hero</a>
        <a href="#02-principles">principles</a>
        <a href="#03-references">references</a>
        <a href="#04-ball-anatomy">ball</a>
        <a href="#05-triangle-anatomy">triangle</a>
        <a href="#06-states">states</a>
        <a href="#07-colors">color</a>
        <a href="#08-type">type</a>
        <a href="#09-components">components</a>
        <a href="#10-motion">motion</a>
        <a href="#11-themes">themes</a>
        <a href="#12-share-card">share</a>
        <a href="#13-layout">layout</a>
        <a href="#14-assets">assets</a>
        <a href="#15-anti-patterns">anti</a>
        <a href="#16-handoff">handoff</a>
        <span className="ds-nav-spacer" />
        <a className="ds-nav-link" href="prototype.html">⌕ live prototype</a>
      </nav>
      <HeroSection />
      <PrinciplesSection />
      <ReferencesSection />
      <BallAnatomySection />
      <TriangleAnatomySection />
      <StatesSection />
      <ColorSection />
      <TypeSection />
      <ComponentsSection />
      <MotionSection />
      <ThemeAccentsSection />
      <ShareCardSection />
      <LayoutSection />
      <AssetsSection />
      <AntiPatternsSection />
      <HandoffSection />
      <footer className="ds-footer">
        <span className="ds-footer-mark">magik 8</span>
        <span className="ds-footer-sep">·</span>
        <span>design system v2</span>
        <span className="ds-footer-sep">·</span>
        <span>oracle-ritual-locked</span>
        <span className="ds-footer-sep">·</span>
        <span>do not feed after midnight</span>
      </footer>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<DesignSystem />);
