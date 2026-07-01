# genji-redirect

`genji.dl.itc.u-tokyo.ac.jp` への旧アクセスを、パス・クエリ・ハッシュを保ったまま
`genji.lib.u-tokyo.ac.jp`（本体サイト: [nakamura196/genji_vue](https://github.com/nakamura196/genji_vue)）へ転送するためだけの静的サイト。

## 仕組み

- `index.html` … トップ (`/`) 用のリダイレクト。
- `404.html` … 深いパス用。GitHub Pages は存在しないパスへのアクセスに `404.html` を返すため、
  ここで `location.pathname + search + hash` を lib ドメインに付け替えて転送する。
- `CNAME` … このサイトのカスタムドメイン `genji.dl.itc.u-tokyo.ac.jp`。
- `sw.js` … 自己消滅する Service Worker。旧サイトは PWA で、`genji.dl.itc` には
  旧 Service Worker がブラウザに残る。放置すると残存 SW が古いキャッシュを配信して
  転送を乗っ取るため、ブラウザが `/sw.js` 更新時に取得すると自分を unregister し
  全キャッシュを削除して再読み込みする。`index.html`/`404.html` 側でも登録解除と
  キャッシュ削除を行ってから転送する（二重の保険）。

GitHub Pages はサーバ側 301 リダイレクトができないため、クライアント側 JS (`location.replace`) で実現している。
JS 無効時は `<noscript>` の meta refresh でトップへフォールバックする（パスは保持できない）。

## デプロイ

ビルド不要。GitHub リポジトリを作成し、Settings → Pages で
**Source = Deploy from a branch / `main` / `/ (root)`** を選ぶだけ。
`CNAME` によりカスタムドメインが `genji.dl.itc.u-tokyo.ac.jp` に設定される。

## 注意

- 本体 (`genji_vue`) の `static/CNAME` を `genji.dl...` から `genji.lib...` に張り替えて
  再デプロイし、dl ドメインが解放された後に、このリポジトリで dl ドメインを引き受けること
  （同一ドメインを 2 リポジトリが同時に主張できない）。
- lib 側 DNS: `genji.lib.u-tokyo.ac.jp` の CNAME を `nakamura196.github.io` に向ける必要がある。
