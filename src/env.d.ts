/// <reference path="../.astro/types.d.ts" />

declare const __COMMIT_HASH__: string;
declare const __APP_VERSION__: string;

interface ImportMetaEnv {
    readonly PUBLIC_CSV_URL_MATRIZ: string;
    readonly PUBLIC_CSV_URL_CONFIG: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
