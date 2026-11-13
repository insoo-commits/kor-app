# KOR Lang

라오스 사람이 한국어를 배우는 웹앱입니다. (ແອັບຮຽນພາສາເກົາຫຼີສຳລັບຄົນລາວ)

- 주소: https://insoo-commits.github.io/kor-app/
- 9개 영역, 88개 소분류, 438개 묶음. 묶음 내용은 `data/K1.json` … `data/K9.json`
- 화면과 동작은 `src/`(app.js, app.css, body.html, meta.js)를 고친 뒤 `node build.js`로 `index.html`, `app.js`, `sw.js`를 다시 만듭니다. 만들어진 파일은 직접 고치지 않습니다.
- 버전은 `build.js`의 `VER` 한 곳만 바꾸면 화면 아래 표시, `app.js?v=`, 서비스워커 캐시 이름에 함께 반영됩니다.
- 재생 규칙과 화면 규칙은 [LAO Lang의 HANDOFF.md](https://github.com/insoo-commits/lao-app/blob/main/HANDOFF.md)를 따릅니다.
