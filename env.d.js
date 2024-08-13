// JavaScriptでは、以下のコードは必要ありません:
// - `/// <reference types="vite/client" />`
// - `interface ImportMetaEnv` と `interface ImportMeta` の定義

// 代わりに、Viteの環境変数は `import.meta.env` からアクセスします。
// 例えば、Google Maps APIキーを取得する場合は以下のようにします。

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// 公式ドキュメントのリンク
// https://vitejs.dev/guide/env-and-mode.html
