// magik8-ball.jsx — UX-001/002 MagikBall + AnswerTriangle (v3)
//
// What's new vs v2:
//   • renderer prop: "css" (CSS Pro stack) | "3d" (Three.js PBR sphere)
//   • triangle now CROSS-FADES in with the ink during reveal — no idle peek behind the "8"
//   • answer text auto-fits inside the triangle (binary search 11→22px)
//   • ink rise uses transform:scaleY from bottom (reliable across browsers) with a settle bob
//   • meniscus wave drifts subtly after the rise
//
// Usage:
//   <MagikBall phase="idle|shaking|revealing|answered" answer="..." size={320} renderer="css" />

const { useEffect, useLayoutEffect, useRef, useState } = React;

// ─────────────────────────────────────────────────────────────────────────
// CSS PRO SPHERE — gradient stack with animated specular drift
// ─────────────────────────────────────────────────────────────────────────
function CssSphere({ phase }) {
  return (
    <div className={`m8-sphere m8-sphere-pro m8-sphere-${phase}`}>
      <div className="m8-sphere-base" />
      <div className="m8-sphere-bounce" />
      <div className="m8-sphere-shadow-side" />
      <div className="m8-sphere-rim" />
      <div className="m8-sphere-fresnel" />
      <div className="m8-sphere-diffuse" />
      <div className="m8-sphere-spec" />
      <div className="m8-sphere-spec-mini" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// THREE.JS SPHERE — real PBR plastic with clearcoat
// ─────────────────────────────────────────────────────────────────────────
function loadThree() {
  if (window.THREE) return Promise.resolve(window.THREE);
  if (window.__threeLoading) return window.__threeLoading;
  window.__threeLoading = new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://unpkg.com/three@0.160.0/build/three.min.js';
    s.crossOrigin = 'anonymous';
    s.onload = () => resolve(window.THREE);
    s.onerror = reject;
    document.head.appendChild(s);
  });
  return window.__threeLoading;
}

function ThreeSphere({ size, phase }) {
  const hostRef = useRef(null);
  const stateRef = useRef({ phase });
  const [ready, setReady] = useState(false);

  useEffect(() => { stateRef.current.phase = phase; }, [phase]);

  useEffect(() => {
    let cancelled = false;
    let dispose = null;
    (async () => {
      try {
        const THREE = await loadThree();
        if (cancelled || !hostRef.current) return;
        const host = hostRef.current;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, premultipliedAlpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.setSize(size, size, false);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.15;
        renderer.domElement.style.display = 'block';
        renderer.domElement.style.width = '100%';
        renderer.domElement.style.height = '100%';
        host.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        const cam = new THREE.PerspectiveCamera(26, 1, 0.1, 100);
        cam.position.set(0, 0, 4.2);

        // Lights — warm key from upper-left, cool fill from right, warm rim from below-behind
        scene.add(new THREE.AmbientLight(0x1a1a22, 1.0));
        const key = new THREE.DirectionalLight(0xfff0d4, 2.0);
        key.position.set(-1.6, 1.9, 1.8);
        scene.add(key);
        const fill = new THREE.PointLight(0x4670b0, 0.55, 10);
        fill.position.set(2.6, -0.6, 1.8);
        scene.add(fill);
        const rim = new THREE.DirectionalLight(0xc88a4a, 0.65);
        rim.position.set(0.4, -0.8, -2.2);
        scene.add(rim);
        const top = new THREE.PointLight(0xffffff, 0.15, 8);
        top.position.set(-0.3, 3.0, 0.8);
        scene.add(top);

        const geo = new THREE.SphereGeometry(1, 128, 128);
        const mat = new THREE.MeshPhysicalMaterial({
          color: 0x07080c,
          roughness: 0.24,
          metalness: 0.0,
          clearcoat: 1.0,
          clearcoatRoughness: 0.05,
          reflectivity: 0.6,
          sheen: 0.4,
          sheenColor: new THREE.Color(0x5a78a8),
          sheenRoughness: 0.4,
        });
        const ball = new THREE.Mesh(geo, mat);
        scene.add(ball);

        // Subtle ground contact reflection — a dim disk below
        const contactGeo = new THREE.CircleGeometry(0.9, 64);
        const contactMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.0 });
        const contact = new THREE.Mesh(contactGeo, contactMat);
        contact.rotation.x = -Math.PI / 2;
        contact.position.y = -1.05;
        scene.add(contact);

        setReady(true);

        let raf;
        const t0 = performance.now();
        let lastPhase = stateRef.current.phase;
        let phaseStart = 0;

        const tick = () => {
          if (cancelled) return;
          const t = (performance.now() - t0) / 1000;
          const p = stateRef.current.phase;
          if (p !== lastPhase) {
            phaseStart = t;
            lastPhase = p;
          }
          const dt = t - phaseStart;

          if (p === 'idle') {
            ball.position.x *= 0.92;
            ball.position.y = Math.sin(t * 0.9) * 0.045;
            ball.rotation.z *= 0.9;
            ball.rotation.y += (Math.sin(t * 0.42) * 0.10 - ball.rotation.y) * 0.05;
            ball.rotation.x += (Math.cos(t * 0.34) * 0.05 - ball.rotation.x) * 0.05;
          } else if (p === 'shaking') {
            const damp = Math.exp(-dt * 0.4);
            ball.position.y = Math.sin(dt * 30) * 0.045 * damp;
            ball.position.x = Math.cos(dt * 27) * 0.035 * damp;
            ball.rotation.z = Math.sin(dt * 28) * 0.30 * damp;
            ball.rotation.x = Math.cos(dt * 24) * 0.16 * damp;
            ball.rotation.y = Math.sin(dt * 20) * 0.20 * damp;
          } else {
            // revealing / answered — settle toward gentle drift
            ball.position.x *= 0.9;
            ball.position.y *= 0.9;
            ball.rotation.z *= 0.9;
            ball.rotation.x *= 0.9;
            ball.rotation.y += (Math.sin(t * 0.18) * 0.05 - ball.rotation.y) * 0.04;
          }
          renderer.render(scene, cam);
          raf = requestAnimationFrame(tick);
        };
        tick();

        dispose = () => {
          cancelAnimationFrame(raf);
          geo.dispose(); mat.dispose(); contactGeo.dispose(); contactMat.dispose();
          renderer.dispose();
          if (host.contains(renderer.domElement)) host.removeChild(renderer.domElement);
        };
      } catch (e) {
        console.error('[m8] three.js failed to load', e);
      }
    })();
    return () => { cancelled = true; if (dispose) dispose(); };
  }, [size]);

  return (
    <div ref={hostRef} className={`m8-sphere m8-sphere-3d ${ready ? 'is-ready' : ''}`} aria-hidden="true" />
  );
}

// ─────────────────────────────────────────────────────────────────────────
// "8" FIELD
// ─────────────────────────────────────────────────────────────────────────
function EightField({ visible }) {
  return (
    <div className="m8-eight-field" data-visible={visible} aria-hidden={!visible}>
      <span className="m8-eight-numeral">8</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// AUTO-FIT HOOK — shrinks font-size until text fits parent box
// ─────────────────────────────────────────────────────────────────────────
function useFitText(text, deps = []) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!text) { el.style.fontSize = ''; return; }
    const parent = el.parentElement;
    if (!parent) return;
    const w = parent.clientWidth;
    const h = parent.clientHeight;
    if (w === 0 || h === 0) return;
    let s = 24;
    const min = 10;
    el.style.fontSize = s + 'px';
    while (s > min && (el.scrollWidth > w - 2 || el.scrollHeight > h - 2)) {
      s -= 1;
      el.style.fontSize = s + 'px';
    }
  }, [text, ...deps]);
  return ref;
}

// ─────────────────────────────────────────────────────────────────────────
// TRIANGLE WINDOW + INK
// ─────────────────────────────────────────────────────────────────────────
function AnswerTriangle({ phase, answer, isEasterEgg }) {
  const showInk = phase === 'revealing' || phase === 'answered';
  const showText = phase === 'answered';
  const textRef = useFitText(showText ? answer : '', [phase]);

  // Force-restart ink animation on each reveal entry by keying the rect on phase
  const inkKey = showInk ? 'on' : 'off';

  return (
    <div
      className={`m8-triangle ${showInk ? 'is-visible' : ''} ${showInk ? 'is-active' : ''}`}
      aria-hidden={!showText}
    >
      <svg viewBox="0 0 100 87" className="m8-triangle-svg" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="m8-ink" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%"   stopColor="var(--m8-fluid-hi)" />
            <stop offset="22%"  stopColor="var(--m8-fluid-mid)" />
            <stop offset="100%" stopColor="var(--m8-fluid-deep)" />
          </linearGradient>
          <radialGradient id="m8-recess" cx="50%" cy="22%" r="85%">
            <stop offset="0%"   stopColor="rgba(0,0,0,0)" />
            <stop offset="60%"  stopColor="rgba(0,0,0,0.22)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.7)" />
          </radialGradient>
          <linearGradient id="m8-bezel" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%"   stopColor="oklch(22% 0.005 270)" />
            <stop offset="100%" stopColor="oklch(2% 0 0)" />
          </linearGradient>
          <clipPath id="m8-clip">
            <polygon points="50,3 97,84 3,84" />
          </clipPath>
          <filter id="m8-blur-soft" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="0.4" />
          </filter>
        </defs>

        {/* bezel rim */}
        <polygon points="50,0.5 99.5,86.5 0.5,86.5" fill="url(#m8-bezel)" />
        {/* cavity */}
        <polygon points="50,3 97,84 3,84" fill="var(--m8-cavity-dark)" />

        {/* ink group — full-cavity rect, scaleY from bottom */}
        <g clipPath="url(#m8-clip)" className="m8-ink-group">
          <rect
            key={inkKey}
            className="m8-ink-rect"
            x="0" y="3" width="100" height="81"
            fill="url(#m8-ink)"
          />
          {/* meniscus highlight at the top edge */}
          <path
            key={'m-' + inkKey}
            className="m8-ink-meniscus"
            d="M 4 6 Q 18 4.5 30 6 T 54 6 T 78 6 T 96 6"
            stroke="var(--m8-fluid-meniscus)"
            strokeWidth="0.7"
            fill="none"
            filter="url(#m8-blur-soft)"
          />
          {/* faint vertical streaks */}
          <line x1="32" y1="8" x2="36" y2="80" stroke="rgba(255,255,255,0.05)" strokeWidth="0.3" />
          <line x1="62" y1="8" x2="58" y2="80" stroke="rgba(255,255,255,0.04)" strokeWidth="0.3" />
        </g>

        {/* recess shadow always */}
        <polygon points="50,3 97,84 3,84" fill="url(#m8-recess)" opacity="0.55" />

        {/* glass dome reflection */}
        <ellipse cx="50" cy="16" rx="24" ry="3" fill="rgba(255,255,255,0.07)" />
      </svg>

      {/* answer text — HTML overlay for crisp type, auto-fit */}
      <div className="m8-answer-wrap" data-show={showText}>
        <div
          ref={textRef}
          className="m8-answer-text"
          style={{
            color: isEasterEgg ? 'var(--m8-amber)' : 'var(--m8-answer-ink)',
            textShadow: isEasterEgg
              ? '0 0 14px oklch(78% 0.135 78 / 0.65), 0 0 4px oklch(78% 0.135 78 / 0.9)'
              : '0 0 10px var(--m8-answer-glow), 0 0 3px rgba(255,255,255,0.28)',
          }}
        >
          {answer}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// MAGIK BALL — composes Sphere + EightField + AnswerTriangle
// ─────────────────────────────────────────────────────────────────────────
function MagikBall({
  phase = 'idle',
  answer = '',
  isEasterEgg = false,
  size = 320,
  renderer = 'css',
  onTap,
}) {
  const hideEight = phase === 'revealing' || phase === 'answered';

  return (
    <div className="m8-ball-wrap" style={{ width: size, height: size }}>
      <button
        type="button"
        className={`m8-ball m8-ball-${phase}`}
        style={{ width: size, height: size }}
        onClick={onTap}
        aria-label={
          phase === 'answered'
            ? 'Magik 8 ball — tap to ask again'
            : 'Magik 8 ball — tap or shake to reveal'
        }
      >
        {renderer === '3d'
          ? <ThreeSphere size={size} phase={phase} />
          : <CssSphere phase={phase} />}
        <EightField visible={!hideEight} />
        <div className="m8-triangle-slot">
          <AnswerTriangle phase={phase} answer={answer} isEasterEgg={isEasterEgg} />
        </div>
      </button>
      <div className="m8-ball-contact" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Export to window so other Babel scripts can import them
// ─────────────────────────────────────────────────────────────────────────
Object.assign(window, { MagikBall, AnswerTriangle, CssSphere, ThreeSphere, EightField });
