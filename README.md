# EventBanner AI

네이버 플레이스 이벤트 배너 전용 문구 & 구성 자동 생성기

## 🚀 기능

- AI 기반 이벤트 배너 문구 자동 생성
- 로고 이미지 업로드 및 분석
- 드래그 앤 드롭 이미지 업로드
- 예시 배너 갤러리
- 클립보드 복사 기능

## 📦 설치 방법

1. 의존성 설치
```bash
npm install
```

2. 환경 변수 설정
`.env.local` 파일을 생성하고 다음 내용을 추가하세요:
```
GEMINI_API_KEY=your_api_key_here
```

Google Gemini API 키는 [Google AI Studio](https://makersuite.google.com/app/apikey)에서 발급받을 수 있습니다.

3. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 🏗️ 빌드

```bash
npm run build
npm start
```

## 🌐 배포

### Vercel (권장)

1. [Vercel](https://vercel.com)에 가입
2. GitHub 저장소 연결
3. 환경 변수 `GEMINI_API_KEY` 설정
4. 배포 완료!

자세한 배포 가이드는 `배포가이드.md`를 참고하세요.

## 🛠️ 기술 스택

- **Framework**: Next.js 14 (Pages Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI**: Google Gemini API

## 📁 프로젝트 구조

```
event-banner-ai/
├── pages/
│   ├── index.tsx          # 메인 페이지
│   ├── _app.tsx           # 앱 래퍼
│   └── api/
│       └── generate-banner.ts  # Gemini API 엔드포인트
├── public/
│   └── banners/           # 예시 배너 이미지
├── styles/
│   └── globals.css       # 글로벌 스타일
└── .env.local            # 환경 변수 (git에 포함되지 않음)
```

## 📝 사용 방법

1. 상호명 입력 (필수)
2. 이벤트 정보 입력 (선택)
3. 로고 이미지 업로드 (선택, 드래그 앤 드롭 지원)
4. "문구 자동 생성하기" 버튼 클릭
5. 생성된 문구 확인 및 복사

## ⚙️ 환경 변수

| 변수명 | 설명 | 필수 |
|--------|------|------|
| `GEMINI_API_KEY` | Google Gemini API 키 | ✅ |

## 📄 라이선스

이 프로젝트는 개인 사용을 위한 것입니다.
