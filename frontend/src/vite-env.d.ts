/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Override only when the API lives on a different origin than the site. */
  readonly VITE_API_BASE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
