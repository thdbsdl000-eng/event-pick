# Google Gemini API 키 발급 가이드

Google Gemini API를 사용하기 위해 API 키를 발급받는 방법입니다.

## 🔑 API 키 발급 방법

### 1단계: Google AI Studio 접속

1. **웹 브라우저 열기**
   - Chrome, Edge, Firefox 등 아무 브라우저나 사용 가능

2. **Google AI Studio 접속**
   - https://makersuite.google.com/app/apikey 접속
   - 또는 https://aistudio.google.com/app/apikey 접속

### 2단계: Google 계정으로 로그인

1. **로그인**
   - "Sign in" 또는 "로그인" 버튼 클릭
   - Google 계정으로 로그인
   - 처음 사용하는 경우 약관 동의 필요

### 3단계: API 키 생성

1. **API 키 만들기**
   - 페이지 중앙에 "Create API Key" 또는 "API 키 만들기" 버튼 클릭
   - 또는 왼쪽 메뉴에서 "Get API Key" 선택

2. **프로젝트 선택**
   - 기존 Google Cloud 프로젝트가 있으면 선택
   - 없으면 "Create API key in new project" 선택
   - 프로젝트 이름은 자동 생성되거나 직접 입력 가능

3. **API 키 생성 완료**
   - 생성된 API 키가 화면에 표시됩니다
   - **중요**: 이 키는 한 번만 표시되므로 반드시 복사하세요!

### 4단계: API 키 복사 및 저장

1. **API 키 복사**
   - 생성된 API 키를 클릭하여 전체 선택
   - Ctrl + C로 복사
   - 또는 "Copy" 버튼 클릭

2. **안전하게 보관**
   - 메모장이나 비밀번호 관리자에 저장
   - **절대 공개하지 마세요!**

## 📝 API 키 사용 방법

### 로컬 개발 환경

1. 프로젝트 폴더에 `.env.local` 파일 생성
2. 다음 내용 입력:
   ```
   GEMINI_API_KEY=여기에_복사한_API_키_붙여넣기
   ```
3. 저장

### Railway 배포 시

1. Railway 대시보드 접속
2. 프로젝트 선택 → "Variables" 탭
3. "New Variable" 클릭
4. Variable: `GEMINI_API_KEY`
5. Value: 복사한 API 키 붙여넣기
6. "Add" 클릭

## ⚠️ 주의사항

### 보안
- ✅ API 키는 절대 GitHub에 업로드하지 마세요
- ✅ `.env.local` 파일은 `.gitignore`에 포함되어 있어 자동으로 제외됩니다
- ✅ API 키를 공유하거나 공개하지 마세요
- ✅ API 키가 유출되면 즉시 재생성하세요

### 사용 제한
- 무료 플랜: 월 15 RPM (Requests Per Minute), 1500 RPD (Requests Per Day)
- 유료 플랜: 더 많은 할당량 제공
- 자세한 내용: https://ai.google.dev/pricing

### API 키 재생성
- 필요시 Google AI Studio에서 기존 키 삭제 후 새로 생성 가능
- 삭제된 키는 즉시 무효화됩니다

## 🔍 API 키 확인 방법

### Google AI Studio에서 확인
1. https://makersuite.google.com/app/apikey 접속
2. 로그인
3. 생성된 API 키 목록 확인
4. 필요시 키 삭제 또는 재생성

## 💡 문제 해결

### API 키가 작동하지 않을 때
1. API 키가 올바르게 복사되었는지 확인 (앞뒤 공백 제거)
2. `.env.local` 파일이 프로젝트 루트에 있는지 확인
3. 서버를 재시작했는지 확인
4. API 키에 할당량이 남아있는지 확인

### "API key not valid" 오류
- API 키가 올바른지 확인
- API 키가 삭제되지 않았는지 확인
- Google Cloud 프로젝트에서 Gemini API가 활성화되어 있는지 확인

### 할당량 초과 오류
- 무료 플랜의 일일/분당 제한을 초과했을 수 있습니다
- 다음 날까지 기다리거나 유료 플랜으로 업그레이드

## 📚 추가 정보

- **공식 문서**: https://ai.google.dev/docs
- **가격 정보**: https://ai.google.dev/pricing
- **지원 모델**: gemini-1.5-pro, gemini-1.5-flash 등

## ✅ 체크리스트

배포 전 확인사항:
- [ ] API 키 발급 완료
- [ ] API 키를 안전하게 복사 및 저장
- [ ] `.env.local` 파일에 API 키 설정 (로컬 개발용)
- [ ] Railway 환경 변수에 API 키 설정 (배포용)
- [ ] API 키가 GitHub에 업로드되지 않았는지 확인

---

**중요**: API 키는 비밀번호처럼 다뤄야 합니다. 절대 공개하지 마세요!

