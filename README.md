# my-card

南臺科技大學 JavaScript 期末專題個人網站。

## 內容

- 個人名片與自我介紹
- 本學期上課內容整理
- 已開發作品區塊
- 可新增、勾選、刪除並保留紀錄的待辦事項
- 科幻風格的 React/Vite 單頁網站

## 本機執行

```bash
npm install
npm run dev
```

## 產生可直接開啟的 HTML

```bash
npm run build -- --outDir dist-local
node scripts/make-local-preview.cjs dist-local chrome.html
```

產生後可直接用瀏覽器開啟 `chrome.html`。