# ダイスシミュレーター

4個以上のダイスを使うゲーム向けのフロントエンドシミュレーターです。静的サイトとして動作し、ローカルストレージで盤面状態を保存します。

## 機能

- 6面ダイス（3〜10個）
- 11種類の色マークでダイス面をカスタマイズ
- 1面にマーク2個（1ダイスあたり最大2面）
- 3Dアニメーション付きダイスロール
- 100回シミュレーションによる出目統計（追加実行・リセット対応）

## 公開 URL

GitHub Actions で `gh-pages` ブランチにデプロイします。

| 環境 | トリガー | URL |
|------|---------|-----|
| 本番 | `main` への push | https://pokeca-chips.github.io/dice-sim/ |
| 開発 | Pull Request 作成・更新 | https://pokeca-chips.github.io/dice-sim/dev/pr-{番号}/ |

PR ごとに `/dev/pr-{番号}/` へデプロイされ、本番サイトは更新されません。PR に開発プレビュー URL のコメントも自動投稿されます。

初回はリポジトリの **Settings → Pages → Build and deployment → Source** を **Deploy from a branch** にし、Branch を **`gh-pages` / `/ (root)`** に設定してください。

## 使い方

ブラウザで `index.html` を開くか、ローカルサーバーで配信してください。

```bash
python3 -m http.server 8080
```

http://localhost:8080 にアクセスします。

## ファイル構成

- `index.html` — メインページ
- `css/style.css` — スタイル
- `js/marks.js` — マーク定義・デフォルト状態
- `js/storage.js` — ローカルストレージ
- `js/dice.js` — 3Dダイス表示・アニメーション
- `js/stats.js` — 100回シミュレーション
- `js/app.js` — アプリケーション本体
