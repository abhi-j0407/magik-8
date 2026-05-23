# HDRI environment maps

## `studio_small_08_1k.hdr`

- **Source:** [Poly Haven — studio_small_08](https://polyhaven.com/a/studio_small_08)
- **License:** [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) (public domain)
- **Resolution:** 1k (bundled for reflections via drei `<Environment>` in `src/three/Lighting.tsx`)

Vite copies `public/hdri/*` into the build output. Workbox precache glob in `vite.config.ts` currently lists `png/svg/…` only — `.hdr` is served as a static asset; offline HDRI caching may be extended in G9.
