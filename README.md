# ダイスシミュレーター

4個以上のダイスを使うゲーム向けのフロントエンドシミュレーターです。静的サイトとして動作し、ローカルストレージで盤面状態を保存します。

## 機能

- 6面ダイス（3〜10個）
- 11種類のマークでダイス面をカスタマイズ
- 1面にマーク2個（1ダイスあたり最大2面）
- 3Dアニメーション付きダイスロール
- 100回シミュレーションによる出目統計

## 公開 URL

`main` への push または Pull Request 作成時に GitHub Actions で GitHub Pages に自動デプロイされます。

- 本番: https://pokeca-chips.github.io/dice-sim/
- PR では Checks タブからプレビュー URL を確認できます

初回はリポジトリの **Settings → Pages → Build and deployment → Source** を **GitHub Actions** に設定してください。

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
