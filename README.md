# 🧊 아이스브레이킹

개발자 모임용 아이스브레이킹 웹 서비스. 조를 나누고, 카드를 섞어 조별 주제를 뽑고, 타이머로 진행을 돕습니다. **프론트엔드만** 있으면 되고, 데이터는 JSON으로 관리합니다.

## 기술 스택

- **React 18** + **Vite** (프론트엔드 전용)
- **framer-motion** — 카드 셔플/공개, 시네마 뷰 이펙트
- 데이터: `src/data/*.json` (주제·자기소개·교환 안내)

## 진행 순서 (5단계)

1. **뽑기 주제 선택** — 이번 세션에 사용할 주제를 켜고/끄기 (전체 선택·해제, 최소 1개). 선택한 주제 개수 = 만들 수 있는 최대 조 개수
2. **조 · 타이머 설정** — 조 개수(선택 주제 수 = 최대 조, **중복 방지**), 자기소개 시간, 주제별 토론 타이머
3. **자기소개 타임** — 공을 던져 받은 사람부터 소개. 질문 2개(직책/소속·기억할 특별한 점)를 크게 표시. 1명당 타이머가 **자동 반복**(끝나면 알람 + 초기화)되고, 사이클마다 "다음 사람에게 공을 던지세요!" 시네마 뷰가 뜸
4. **주제 뽑기** — 카드를 섞어 **조별 카드를 한 번에 전부 공개**(그리드). 주제는 조마다 **중복 없이** 배정. 다 뽑히면 **토론 타이머 자동 시작**. 타이머가 끝나면 *"토론 종료!"* 시네마 뷰 후 **자동으로 다음 주제를 뽑고 타이머가 다시 시작**돼요. `🔀 다시 섞어서 뽑기`로 즉시 새 라운드로 넘어갈 수도 있음
5. **명함 · 링크드인 교환** — 명함/링크드인 교환 안내 + 링크드인 QR 안내 **영상 자리**(넣으면 자동 **반복 재생**)

## 실행

```bash
npm install
npm run dev      # 개발 서버 (http://localhost:5173)
npm run build    # 프로덕션 빌드 (dist/)
npm run preview  # 빌드 결과 미리보기
```

## 데이터 수정

- **주제**: [`src/data/topics.json`](src/data/topics.json) — 기본 주제 12개. `emoji`, `title`, `description`, `accent`(색상). 코드 수정 없이 **앱의 "뽑기 주제 선택" 화면에서 직접 주제를 추가/삭제**할 수도 있습니다(브라우저 localStorage에 저장). 사용할 주제 개수 = 만들 수 있는 최대 조 개수.
- **자기소개 질문/규칙**: [`src/data/opening.json`](src/data/opening.json)
- **명함·교환 안내**: [`src/data/exchange.json`](src/data/exchange.json)

## 링크드인 안내 영상 넣기

`public/videos/linkedin-guide.mp4` 에 영상 파일을 넣으면 "명함 · 링크드인 교환" 화면에 자동으로 재생 플레이어가 나타납니다. 파일이 없으면 자리 표시(플레이스홀더)가 보입니다. 파일명/경로를 바꾸려면 [`src/data/exchange.json`](src/data/exchange.json)의 `videoSrc`를 수정하세요. (자세한 내용: [`public/videos/README.md`](public/videos/README.md))

## 구조

```text
src/
├─ App.jsx                  # 단계(phase) 상태 + 주제(기본/커스텀) 관리
├─ index.css                # 시네마 다크 테마 전체 스타일
├─ data/
│  ├─ topics.json           # 기본 주제 카드 12개
│  ├─ opening.json          # 자기소개 질문/규칙
│  └─ exchange.json         # 명함·링크드인 교환 안내
├─ utils/
│  └─ deck.js               # shuffle + 중복 없는 조별 주제 배분(assignTopics)
└─ components/
   ├─ TopicSelectScreen.jsx # 뽑기 주제 선택 + 직접 추가/삭제
   ├─ SetupScreen.jsx       # 조 개수 + 타이머 2종 설정
   ├─ OpeningScreen.jsx     # 자기소개 + 공 던지기 오버레이
   ├─ CinemaScreen.jsx      # 카드 셔플 → 조별 그리드 공개 + 토론 타이머
   ├─ ExchangeScreen.jsx    # 명함·링크드인 교환 + 영상(반복 재생)
   ├─ GroupCard.jsx         # 조별 주제 카드
   └─ Timer.jsx             # 원형 카운트다운(반복/알람/자동시작 옵션)
```
