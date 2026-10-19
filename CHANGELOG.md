# Changelog

## 1.0.0 (2026-10-19)


### Features

* add printable delivery confirmation summary ([3c5a705](https://github.com/zeemscript/HarvestLock/commit/3c5a70551265ad8b82755176425783e6c2c19b32))
* **api:** cap GET /commitments page size and make page order total ([#225](https://github.com/zeemscript/HarvestLock/issues/225)) ([35bf2be](https://github.com/zeemscript/HarvestLock/commit/35bf2beb8fe6d9c22f143220c86185710da26912))
* **api:** include Postgres in health checks ([58fc4f6](https://github.com/zeemscript/HarvestLock/commit/58fc4f6aa1d4772d5e72f9198fb8098e2133ae66))
* **api:** report database health status ([6f12e51](https://github.com/zeemscript/HarvestLock/commit/6f12e519b58d0d0ee268b2091a68e5df16e524be))
* **apps:** retry transient fetch failures and fix 360px layout findings ([cac44e8](https://github.com/zeemscript/HarvestLock/commit/cac44e8a1f5ddcc0968fd276315fa1138f0d95fe))
* **apps:** retry transient network failures in buyer-app/coop-pwa api.ts ([6f6d36e](https://github.com/zeemscript/HarvestLock/commit/6f6d36ea246bfabe351fc32f165786405aa83c9e)), closes [#195](https://github.com/zeemscript/HarvestLock/issues/195) [#196](https://github.com/zeemscript/HarvestLock/issues/196)
* **apps:** retry transient network failures; add live e2e smoke tests for all three frontends ([77ce26d](https://github.com/zeemscript/HarvestLock/commit/77ce26da67af246fd7c0bde843ddf4b2e3bab211))
* **buyer-app:** walk the commitments list a page at a time ([#226](https://github.com/zeemscript/HarvestLock/issues/226)) ([80834e5](https://github.com/zeemscript/HarvestLock/commit/80834e5fe3ebe9e931bde808367974dfe8b9c9d2))
* **coop-pwa:** paginate commitment list ([aa7dc38](https://github.com/zeemscript/HarvestLock/commit/aa7dc389acbcf3c4a4dcc5d70d0304342af54620))
* **coop-pwa:** paginate commitment list ([9e0afd6](https://github.com/zeemscript/HarvestLock/commit/9e0afd6c6da46013bdee366de4139324d866a890))
* dependency audit, Storybook catalog, and PWA installability ([fd8a120](https://github.com/zeemscript/HarvestLock/commit/fd8a120df3a4bf034029b0a278bc4bee2af0dcd5))
* dependency audit, Storybook component catalog, and PWA installability ([b68bcbf](https://github.com/zeemscript/HarvestLock/commit/b68bcbf557c32721e7dbf39446d9e558d53a729a))
* paginate GET /commitments server-side and walk it page-by-page in buyer-app ([fa38878](https://github.com/zeemscript/HarvestLock/commit/fa388786fe11cd97d0ea5326fc4a1e6b0020a590))
* **release:** automate changelog release PRs ([ed43b8e](https://github.com/zeemscript/HarvestLock/commit/ed43b8e755c0f5673ee178a9c86a5bd22e7bb8ba))
* **release:** automate changelog release PRs ([f05dfae](https://github.com/zeemscript/HarvestLock/commit/f05dfae881f0398a098dd1306cb6374177f3b638))
* **site:** add branded not-found page ([0c1f897](https://github.com/zeemscript/HarvestLock/commit/0c1f897a98f00ea78f5caca05f7fd21b6e7a3378))
* **site:** add branded not-found page ([38faf8a](https://github.com/zeemscript/HarvestLock/commit/38faf8aa0d6d0ad6398a22151157c70aed200da6))
* **site:** flag stale live chain status ([3667fdb](https://github.com/zeemscript/HarvestLock/commit/3667fdbf63cace310d0f7f9b16503b0938b1d7f8))
* **site:** indicate when live status data is stale ([572f301](https://github.com/zeemscript/HarvestLock/commit/572f3010f65278025280ef4adab3c03320b01082))
* **warehouse-app:** retry transient network failures in api.ts ([0cfc097](https://github.com/zeemscript/HarvestLock/commit/0cfc0975a53e187b14a0cb8cc677bac57160dfa7))


### Bug Fixes

* **api:** 400s for malformed dispute input; complete .env.example audits ([150e99b](https://github.com/zeemscript/HarvestLock/commit/150e99be9105e519a48bc628c47f394831b2b9ee))
* **api:** restrict CORS to configured origins ([1c62479](https://github.com/zeemscript/HarvestLock/commit/1c624797631ece524aee2ef97884b48a4a51032f))
* **api:** restrict CORS to configured origins ([5a71bc0](https://github.com/zeemscript/HarvestLock/commit/5a71bc095d019ea9fc1c1153a6158636e696d9b4))
* **api:** return 400, not 500, for malformed dispute-route input ([08d2ce6](https://github.com/zeemscript/HarvestLock/commit/08d2ce6b1900c8fa24820ff77db8f77d1099e64b)), closes [#205](https://github.com/zeemscript/HarvestLock/issues/205)
* **api:** return 400, not 500, for malformed input on audited routes ([8d00135](https://github.com/zeemscript/HarvestLock/commit/8d001350d5e305620a67c6d93f69fd3cbac1a337))
* **api:** return 400, not 500, for malformed input on audited routes ([ef0265a](https://github.com/zeemscript/HarvestLock/commit/ef0265ac45d41ad67d1c5bfde929691b2759b2d9)), closes [#201](https://github.com/zeemscript/HarvestLock/issues/201) [#202](https://github.com/zeemscript/HarvestLock/issues/202) [#203](https://github.com/zeemscript/HarvestLock/issues/203) [#204](https://github.com/zeemscript/HarvestLock/issues/204)
* **apps:** hold up at 360-400px mobile widths ([a1285ee](https://github.com/zeemscript/HarvestLock/commit/a1285ee55fe11a150e4646e4d2a587e90e028f39)), closes [#191](https://github.com/zeemscript/HarvestLock/issues/191) [#192](https://github.com/zeemscript/HarvestLock/issues/192)
* **apps:** reconcile StatusBadge colour drift and pin duplicated components ([fa09164](https://github.com/zeemscript/HarvestLock/commit/fa09164a51da80af2ecb9cda7b8909123c0ef4ac)), closes [#187](https://github.com/zeemscript/HarvestLock/issues/187) [#188](https://github.com/zeemscript/HarvestLock/issues/188)
* **apps:** reconcile StatusBadge drift; voucher and cache-refresh design docs ([eed601e](https://github.com/zeemscript/HarvestLock/commit/eed601e616d6910d63c8e9564189ce1d96b36f4f))
* **apps:** reconcile wallet.ts/api.ts copy drift and make all three apps hold up at mobile widths ([5a7f6fd](https://github.com/zeemscript/HarvestLock/commit/5a7f6fded32e9495254d09c233606b2ad7b30f30))
* **buyer-app:** CommitmentList owns loading/error/empty states ([8cc8551](https://github.com/zeemscript/HarvestLock/commit/8cc8551edfb2bc8d08e309097b38d678a6a94bc6))
* **ci:** reconcile lockfile sync check with npm ci's peer resolution ([b5d4289](https://github.com/zeemscript/HarvestLock/commit/b5d4289b1116f73a955a8779ad4ccc19535c2975))
* **site:** add content security policy ([c78eacc](https://github.com/zeemscript/HarvestLock/commit/c78eaccd4e12333d7add1dbd5713cf906d37a84c))
* **site:** align share metadata with testnet prototype status ([74e7639](https://github.com/zeemscript/HarvestLock/commit/74e76391291abbebdc885fcda5713f1fea5c4a75))
* **site:** honor system color scheme and contrast ([0b638a7](https://github.com/zeemscript/HarvestLock/commit/0b638a7e24ccd9bd192b61068db2f691f80c5cd7))
* **site:** honor system color scheme and improve contrast ([7763bd1](https://github.com/zeemscript/HarvestLock/commit/7763bd110e3891ba49a426a50577fca8f8a25eea))
* **site:** wrap footer links at 360px instead of clipping them ([825c38b](https://github.com/zeemscript/HarvestLock/commit/825c38be5973fe5242a631edc5ffe7775123932e)), closes [#194](https://github.com/zeemscript/HarvestLock/issues/194)
* **warehouse-app:** add list loading state; document state audits ([#181](https://github.com/zeemscript/HarvestLock/issues/181)–[#183](https://github.com/zeemscript/HarvestLock/issues/183)) ([9777831](https://github.com/zeemscript/HarvestLock/commit/97778315f7bbb04fd164e3b9c0608c22a5633b96))
* **warehouse-app:** add the missing .env.example ([0396db6](https://github.com/zeemscript/HarvestLock/commit/0396db670107a6c5b28514f3dfd25c367315c8b7)), closes [#209](https://github.com/zeemscript/HarvestLock/issues/209)
* **warehouse-app:** mobile-width findings from the 360px pass ([36702e7](https://github.com/zeemscript/HarvestLock/commit/36702e78d70b6f44293b2997a51f94def37cf6c6)), closes [#193](https://github.com/zeemscript/HarvestLock/issues/193)
