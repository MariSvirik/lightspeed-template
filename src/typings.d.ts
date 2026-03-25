declare namespace NodeJS {
  interface ProcessEnv {
    /** Injected by webpack DefinePlugin (see webpack.common.js). */
    ROUTER_BASENAME?: string;
  }
}

declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.svg';
declare module '*.css';
declare module '*.wav';
declare module '*.mp3';
declare module '*.m4a';
declare module '*.rdf';
declare module '*.ttl';
declare module '*.pdf';
