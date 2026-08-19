/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Override only when the API lives on a different origin than the site. */
  readonly VITE_API_BASE?: string;
  /**
   * Where the contact form posts. Defaults to "/api/contact". Use "off" for a static build
   * with no backend, or a third-party form URL to keep the form working without one.
   */
  readonly VITE_CONTACT_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
