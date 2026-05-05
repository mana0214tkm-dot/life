# ふわキラ日記

ADHD 対応のタスク・スケジュール管理アプリです。

## 機能

- **今日のタスク** — 優先度・期限・繰り返し・サブステップ管理
- **タイムブロック** — 時間グリッドへのブロック割り当て
- **ポモドーロトラッカー** — 集中セッション計測
- **やらないことリスト** — 注意散漫の防止
- **優先度マトリクス / カレンダー / レポート** — 全体俯瞰

## 技術スタック

| | |
|---|---|
| フレームワーク | Next.js 16 (App Router, Turbopack) |
| 状態管理 | Zustand + persist (localStorage) |
| スタイル | CSS カスタムプロパティ (パステルテーマ) |
| 言語 | TypeScript (strict) |
| デプロイ | Vercel |

## 開発

```bash
npm install
npm run dev
```

## セキュリティ

- ユーザーデータはブラウザの localStorage のみに保存（サーバー送信なし）
- `dangerouslySetInnerHTML` / `eval` 不使用
- 依存関係の既知の脆弱性: PostCSS < 8.5.10 (moderate, Next.js 内部 bundle、ユーザー入力と無関係)
