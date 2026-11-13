# KOR Lang

라오스 사람이 한국어를 배우는 웹앱입니다. (ແອັບຮຽນພາສາເກົາຫຼີສຳລັບຄົນລາວ)

- 주소: https://insoo-commits.github.io/kor-app/
- 9개 영역, 88개 소분류, 438개 묶음. 묶음 내용은 `data/K1.json` … `data/K9.json`
- 화면과 동작은 `src/`(app.js, app.css, body.html, meta.js)를 고친 뒤 `node build.js`로 `index.html`, `app.js`, `sw.js`를 다시 만듭니다. 만들어진 파일은 직접 고치지 않습니다.
- 버전은 `build.js`의 `VER` 한 곳만 바꾸면 화면 아래 표시, `app.js?v=`, 서비스워커 캐시 이름에 함께 반영됩니다.
- 재생 규칙과 화면 규칙은 [LAO Lang의 HANDOFF.md](https://github.com/insoo-commits/lao-app/blob/main/HANDOFF.md)를 따릅니다.

## 음성

- 앱은 `audio/`에 mp3가 있으면 그것을 틀고, 없으면 기기의 한국어 음성으로 읽습니다.
- `node build.js`가 필요한 음성 목록 `audio/list.json`(한국어 낱말·문장, 낱말의 라오스어 뜻)과 실제로 있는 파일 목록 `audio/index.js`를 만듭니다. 파일 이름은 `src/clip.js`가 글에서 계산합니다.
- 만들기: `pip install edge-tts` 후 `python3 tools/tts_gen.py` (빠진 것만 만듦), 다시 `node build.js`, 그리고 커밋. `speech.platform.bing.com`에 접속할 수 있어야 합니다.
- 문장을 고치면 그 문장의 파일 이름이 바뀌므로 같은 순서로 다시 돌리면 됩니다. 목록에 없는 옛 mp3는 지워도 됩니다.
