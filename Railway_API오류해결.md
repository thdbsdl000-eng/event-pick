# Railway Gemini API 호출 실패 해결 가이드

## 🔍 문제 진단

사용자가 문구 생성을 시도했을 때 Gemini API 호출에 실패하는 경우, 다음을 확인하세요.

## ✅ 1단계: Railway 환경 변수 확인

### 확인 방법

1. **Railway 대시보드 접속**
   - https://railway.app 접속
   - 프로젝트 선택

2. **Variables 탭 확인**
   - 왼쪽 메뉴에서 "Variables" 클릭
   - `GEMINI_API_KEY`가 있는지 확인

3. **값 확인**
   - `GEMINI_API_KEY` 클릭하여 값 확인
   - 값이 `AIzaSyBc3bQiiqJBoSFjTqm9x9h77La9EXmXYpY`와 일치하는지 확인
   - 앞뒤 공백이 없는지 확인

### 환경 변수가 없는 경우

1. "New Variable" 클릭
2. Variable: `GEMINI_API_KEY` 입력
3. Value: `AIzaSyBc3bQiiqJBoSFjTqm9x9h77La9EXmXYpY` 입력
4. "Add" 클릭
5. **중요**: 재배포 필요 (자동으로 시작됨)

### 환경 변수가 있는 경우

1. 값이 올바른지 확인
2. 값이 다르면 수정
3. 저장 후 재배포 대기

## ✅ 2단계: 재배포 확인

환경 변수를 추가하거나 수정한 후:

1. **자동 재배포 확인**
   - Railway가 자동으로 재배포를 시작합니다
   - "Deployments" 탭에서 확인

2. **배포 완료 대기**
   - 보통 2-5분 소요
   - "Active" 상태가 되면 완료

3. **서비스 재시작** (필요시)
   - "Deployments" 탭에서 최신 배포 클릭
   - "Redeploy" 버튼 클릭

## ✅ 3단계: 로그 확인

### Railway 로그 확인

1. **대시보드 → 프로젝트 선택**
2. **"Deployments" 탭 클릭**
3. **최신 배포 클릭**
4. **"View Logs" 클릭**

### 확인할 로그 메시지

**정상적인 경우:**
```
✓ Compiled successfully
✓ Linting and checking validity of types
Ready on http://0.0.0.0:3000
```

**오류가 있는 경우:**
- `GEMINI_API_KEY 환경 변수가 설정되지 않았습니다.`
- `Gemini API Error Response: ...`
- `API key not valid`

### 로그에서 확인할 내용

1. **환경 변수 로드 확인**
   - `GEMINI_API_KEY`가 로드되었는지 확인
   - (보안상 실제 값은 로그에 표시되지 않음)

2. **API 호출 오류 확인**
   - Gemini API 오류 메시지 확인
   - HTTP 상태 코드 확인 (401, 403, 429 등)

## 🔧 일반적인 오류 및 해결 방법

### 오류 1: "API 키가 설정되지 않았습니다"

**원인**: Railway에서 환경 변수가 설정되지 않음

**해결**:
1. Variables 탭에서 `GEMINI_API_KEY` 추가
2. 값 입력 후 저장
3. 재배포 대기

### 오류 2: "API key not valid" 또는 401 오류

**원인**: API 키가 잘못되었거나 만료됨

**해결**:
1. Google AI Studio에서 API 키 확인
2. 새 API 키 발급 (필요시)
3. Railway Variables에서 업데이트
4. 재배포

### 오류 3: "Quota exceeded" 또는 429 오류

**원인**: API 할당량 초과

**해결**:
1. Google AI Studio에서 할당량 확인
2. 다음 날까지 대기 (무료 플랜)
3. 또는 유료 플랜으로 업그레이드

### 오류 4: "API 호출에 실패했습니다" (500 오류)

**원인**: 네트워크 오류 또는 Gemini API 서버 문제

**해결**:
1. Railway 로그 확인
2. 몇 분 후 다시 시도
3. Gemini API 상태 확인: https://status.cloud.google.com

## 📋 체크리스트

문제 해결을 위한 확인사항:

- [ ] Railway Variables에 `GEMINI_API_KEY`가 있는지 확인
- [ ] API 키 값이 올바른지 확인 (`AIzaSyBc3bQiiqJBoSFjTqm9x9h77La9EXmXYpY`)
- [ ] 환경 변수 추가/수정 후 재배포가 완료되었는지 확인
- [ ] Railway 로그에서 오류 메시지 확인
- [ ] Google AI Studio에서 API 키가 활성화되어 있는지 확인
- [ ] API 할당량이 남아있는지 확인

## 🚀 빠른 해결 방법

### 방법 1: 환경 변수 재설정

1. Railway 대시보드 → Variables
2. `GEMINI_API_KEY` 삭제 (있다면)
3. "New Variable" 클릭
4. Variable: `GEMINI_API_KEY`
5. Value: `AIzaSyBc3bQiiqJBoSFjTqm9x9h77La9EXmXYpY`
6. "Add" 클릭
7. 재배포 완료 대기

### 방법 2: 서비스 재시작

1. Railway 대시보드 → Deployments
2. 최신 배포 클릭
3. "Redeploy" 버튼 클릭
4. 재배포 완료 대기

## 💡 추가 팁

### 환경 변수 확인 방법

Railway에서 환경 변수가 제대로 로드되었는지 확인하려면:
1. 로그에서 "GEMINI_API_KEY 환경 변수가 설정되지 않았습니다" 메시지가 없는지 확인
2. API 호출 시도 후 로그 확인

### API 키 보안

- ✅ Railway Variables에만 저장
- ✅ GitHub에 업로드하지 않음 (`.gitignore`에 포함)
- ✅ 공개하지 않음

## 🆘 여전히 문제가 있나요?

다음 정보를 알려주세요:
1. Railway 로그의 오류 메시지 (마지막 10줄)
2. Variables 탭에 `GEMINI_API_KEY`가 있는지
3. 브라우저 콘솔의 오류 메시지 (F12 → Console)

이 정보를 바탕으로 더 구체적인 해결 방법을 제시할 수 있습니다.

