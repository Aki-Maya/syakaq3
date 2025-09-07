/**
 * @type {import('next').NextConfig}
 * JSDoc形式のコメントです。
 * これにより、エディタ（VSCodeなど）が`nextConfig`オブジェクトの型を認識し、
 * 設定項目を入力する際に補完機能が働くようになります。
 */
const nextConfig = {
  // TypeScriptに関する設定
  typescript: {
    /**
     * `true`にすると、本番ビルド時（`next build`）にTypeScriptの型エラーを無視します。
     * 通常、型エラーがあるとビルドは失敗しますが、この設定で強制的にビルドを完了させます。
     * 【注意】エラーを認識しつつも、一時的にビルドを通したい場合などに利用しますが、
     * 未解決のバグが本番環境に含まれるリスクがあるため、恒久的な設定としては非推奨です。
     */
    ignoreBuildErrors: true,
  },

  // ESLint（コード品質チェックツール）に関する設定
  eslint: {
    /**
     * `true`にすると、本番ビルド時にESLintによるチェックをスキップします。
     * これによりビルド時間は短縮されますが、コードの品質チェックが行われなくなるため、
     * こちらも利用には注意が必要です。
     */
    ignoreDuringBuilds: true,
  },

  // Next.jsの実験的な（Experimental）機能に関する設定
  // 注意: appDirはNext.js 14では削除されました（App Routerはデフォルトで有効）

  /**
   * HTTPレスポンスヘッダーをカスタマイズするための非同期関数です。
   * これにより、特定のパスに対して任意のヘッダーを追加できます。
   */
  async headers() {
    return [
      {
        // このヘッダー設定を適用するリクエストのパス（URL）を指定します。
        // この例では、PWA（プログレッシブウェブアプリ）で使われるマニフェストファイルが対象です。
        source: '/manifest.json',

        // 実際に追加するHTTPヘッダーのリスト
        headers: [
          {
            // 'Content-Type'ヘッダーを、マニフェストファイルの正しいMIMEタイプに設定します。
            // これにより、ブラウザがこのファイルを正しく解釈できるようになります。
            key: 'Content-Type',
            value: 'application/manifest+json',
          },
        ],
      },
    ];
  },
}

// Node.jsのモジュールシステム（CommonJS）を使い、定義した設定オブジェクトをエクスポートします。
// これにより、Next.jsがビルドや開発サーバー起動時にこの設定を読み込めるようになります。
module.exports = nextConfig
