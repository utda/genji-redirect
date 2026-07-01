// 自己消滅する Service Worker (self-destroying service worker)
//
// 旧「デジタル源氏物語」は PWA だったため、genji.dl.itc.u-tokyo.ac.jp には
// 旧 Service Worker (/sw.js) がブラウザに登録されたまま残っている。放置すると、
// その残存 SW が古いキャッシュを配信し、この転送サイトの index.html/404.html を
// 乗っ取ってしまう。
//
// ブラウザはナビゲーション時に /sw.js の更新を確認するため、旧 SW はこのファイルに
// 置き換わる。この SW は自分自身を unregister し、全キャッシュを削除し、開いている
// タブを再読み込みする。再読み込み後は SW が無い状態で index.html が動き、
// genji.lib.u-tokyo.ac.jp へ転送される。

self.addEventListener('install', function () {
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    (async function () {
      try {
        var keys = await caches.keys();
        await Promise.all(keys.map(function (k) { return caches.delete(k); }));
      } catch (e) { /* no-op */ }

      await self.registration.unregister();

      var clients = await self.clients.matchAll({ type: 'window' });
      clients.forEach(function (client) {
        client.navigate(client.url);
      });
    })()
  );
});
