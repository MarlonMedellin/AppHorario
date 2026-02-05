/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
    readonly PUBLIC_CSV_URL_MATRIZ: string;
    readonly PUBLIC_CSV_URL_CONFIG: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
