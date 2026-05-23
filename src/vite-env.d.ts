/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WEBGL?: string;
  readonly VITE_HTTPS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
