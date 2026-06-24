# 鬼速PDCA アプリ

スマホ対応のPDCAサイクル管理PWAアプリ。

**URL:** `https://<あなたのGitHubユーザー名>.github.io/onisoku-pdca/`

---

## アプリ更新手順（重要）

### 設計変更を反映する流れ

1. `index.html` を修正する
2. **`index.html` の `<meta name="app-version">` のバージョン番号を上げる**
   ```html
   <!-- 例: 1.0.0 → 1.0.1 -->
   <meta name="app-version" content="1.0.1">
   ```
3. **`version.json` のバージョン番号も同じ値に上げる**
   ```json
   {
     "version": "1.0.1",
     "updated": "2026-06-24",
     "notes": "変更内容のメモ"
   }
   ```
4. **`sw.js` の `CACHE_NAME` も同じバージョンに変更する**
   ```js
   const CACHE_NAME = 'onisoku-pdca-v1.0.1';
   ```
5. GitHubにPush → GitHub Pagesが自動デプロイ（約1〜2分）
6. スマホでアプリを開くと「新しいバージョンが利用可能です」バナーが表示される
7. ユーザーが「今すぐ更新」をタップ → 最新版に切り替わる

---

## 自動更新の仕組み

- アプリ起動時と**5分おき**に `version.json` をサーバーから取得
- `index.html` 内のバージョンと差異があれば更新バナーを表示
- 手動更新ボタン（右下の ↻ ボタン）でも即時チェック可能
- 「今すぐ更新」タップでService Workerキャッシュをクリアしてリロード

---

## GitHub Pages 設定手順

1. このリポジトリを GitHub に作成（名前: `onisoku-pdca`）
2. Settings → Pages → Source: `Deploy from a branch`
3. Branch: `main` / `/ (root)` → Save
4. 数分後に `https://<username>.github.io/onisoku-pdca/` でアクセス可能

## ファイル構成

```
onisoku-pdca/
├── index.html    # メインアプリ（全機能）
├── version.json  # バージョン管理（更新チェック用）
├── manifest.json # PWA設定
├── sw.js         # Service Worker（キャッシュ管理）
└── README.md
```
