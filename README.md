# にがてノート

やることが苦手でも大丈夫。予定とタスクをやさしく整理できる、個人向けのスケジュール管理アプリです。

タスクを完了すると育成ロボットが成長し、動きや「すごい！」の吹き出しで達成感を伝えてくれます。データはブラウザの `localStorage` に保存されるため、アカウント登録なしで使い始められます。

## 主な機能

- 今日のタスク管理と完了アニメーション
- タスクの分解、優先度、期限、繰り返し設定
- カレンダー表示
- タイムブロックによる予定管理
- アイゼンハワー・マトリクスでの分類
- ポモドーロ風のタイムトラッキング
- 「やらないことリスト」
- 達成状況のレポート
- タスク達成数に応じて進化する育成ロボット
- モバイル向けレスポンシブレイアウト
- `prefers-reduced-motion` に配慮したアニメーション

## 開発環境

- Next.js 16（App Router）
- React 19
- TypeScript
- Zustand + `localStorage`
- CSS カスタムプロパティ
- Netlify（Next.jsランタイムプラグイン）

## セットアップ

```bash
npm install
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

## 利用可能なコマンド

```bash
npm run dev      # 開発サーバーを起動
npm run lint     # ESLintを実行
npm run build    # 本番ビルドを作成
npm run start    # 本番ビルドを起動
```

## デプロイ

Netlifyでこのリポジトリを接続すると、`netlify.toml` の設定により `npm run build` が実行されます。

## ライセンス

MIT
