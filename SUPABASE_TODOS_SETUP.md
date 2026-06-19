# Supabase 待辦同步設定

這個網站的待辦清單已支援 Supabase 雲端同步，但需要先建立 Supabase 專案並填入公開前端設定。

## 1. 建立資料表

在 Supabase 專案中打開 `SQL Editor`，貼上並執行：

```sql
-- supabase/site-todos.sql
```

實際 SQL 內容在 `supabase/site-todos.sql`。

## 2. 填入網站設定

到 Supabase 專案的 `Project Settings` > `API`，複製：

- Project URL
- anon / publishable key

然後打開 `index.html`，找到：

```js
const supabaseConfig = {
  url: '',
  anonKey: '',
  table: 'site_todo_lists',
  listKey: 'main',
};
```

把 `url` 和 `anonKey` 填上後重新部署 GitHub Pages。

## 3. 同步行為

- 有 Supabase 設定時：新增、勾選、刪除會寫入雲端。
- 沒有 Supabase 設定時：仍會退回 localStorage / 網址備援，不會讓頁面壞掉。
- 頁面開著時會定時讀取雲端更新。
