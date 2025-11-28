# Railway 배포 오류 해결 가이드

## 🔍 일반적인 오류 원인 및 해결 방법

### 1. 포트 설정 문제

**증상**: 사이트가 로드되지 않거나 "Connection refused" 오류

**해결 방법**:
- Railway는 동적 포트를 사용합니다
- `package.json`의 start 스크립트가 수정되었습니다
- 변경사항을 GitHub에 푸시하면 자동으로 재배포됩니다

### 2. 환경 변수 미설정

**증상**: API 호출 실패, "API key not found" 오류

**확인 방법**:
1. Railway 대시보드 → 프로젝트 선택
2. "Variables" 탭 확인
3. `GEMINI_API_KEY`가 있는지 확인
4. 값이 올바른지 확인

**해결 방법**:
- Variables 탭에서 `GEMINI_API_KEY` 추가
- Value에 API 키 입력
- 저장 후 재배포

### 3. 빌드 실패

**확인 방법**:
1. Railway 대시보드 → "Deployments" 탭
2. 실패한 배포 클릭
3. 로그 확인

**일반적인 원인**:
- 의존성 설치 실패
- TypeScript 오류
- 빌드 명령어 오류

**해결 방법**:
- 로그의 오류 메시지 확인
- 로컬에서 `npm run build` 실행하여 오류 확인
- 오류 수정 후 GitHub에 푸시

### 4. 메모리 부족

**증상**: 배포 중 타임아웃 또는 크래시

**해결 방법**:
- Railway 대시보드 → Settings → Resources
- 메모리 할당량 확인
- 필요시 업그레이드

## 🔧 Railway 대시보드에서 확인할 사항

### 1. 배포 상태 확인
- "Deployments" 탭에서 최신 배포 상태 확인
- "Building" → "Deploying" → "Active" 순서로 진행되어야 함
- 실패한 경우 빨간색 표시

### 2. 로그 확인
- 실패한 배포 클릭
- "View Logs" 클릭
- 오류 메시지 확인

### 3. 환경 변수 확인
- "Variables" 탭에서 확인
- `GEMINI_API_KEY`가 있는지 확인
- 값이 올바른지 확인 (앞뒤 공백 없음)

### 4. 도메인 확인
- "Settings" → "Domains" 확인
- 도메인이 생성되었는지 확인
- HTTPS가 활성화되었는지 확인

## 🚀 수정사항 적용 방법

### 변경사항을 GitHub에 푸시

1. **변경사항 확인**
   ```bash
   git status
   ```

2. **변경사항 추가**
   ```bash
   git add .
   ```

3. **커밋**
   ```bash
   git commit -m "Fix Railway deployment configuration"
   ```

4. **푸시**
   ```bash
   git push origin main
   ```

5. **Railway 자동 재배포**
   - GitHub에 푸시하면 Railway가 자동으로 재배포를 시작합니다
   - "Deployments" 탭에서 진행 상황 확인

## 📋 체크리스트

배포 문제 해결을 위한 확인사항:

- [ ] Railway 대시보드에서 배포 상태 확인
- [ ] 로그에서 오류 메시지 확인
- [ ] 환경 변수 `GEMINI_API_KEY` 설정 확인
- [ ] 도메인이 생성되었는지 확인
- [ ] 변경사항을 GitHub에 푸시했는지 확인
- [ ] 재배포가 완료되었는지 확인

## 💡 추가 도움말

### Railway 로그 확인 방법

1. Railway 대시보드 접속
2. 프로젝트 선택
3. "Deployments" 탭 클릭
4. 최신 배포 클릭
5. "View Logs" 클릭
6. 오류 메시지 확인

### 일반적인 오류 메시지

**"Build failed"**
- 로그를 확인하여 구체적인 오류 원인 파악
- 보통 TypeScript 오류나 의존성 문제

**"Port already in use"**
- Railway가 자동으로 포트를 할당하므로 문제없음
- `package.json`의 start 스크립트 확인

**"Environment variable not found"**
- Variables 탭에서 환경 변수 확인
- 변수 이름이 정확한지 확인 (`GEMINI_API_KEY`)

**"Module not found"**
- `package.json`에 필요한 의존성이 있는지 확인
- `npm install`이 제대로 실행되었는지 확인

## 🆘 여전히 문제가 있나요?

다음 정보를 알려주세요:
1. Railway 대시보드의 오류 메시지
2. 로그의 마지막 몇 줄
3. 어떤 단계에서 실패했는지 (빌드/배포/실행)

이 정보를 바탕으로 더 구체적인 해결 방법을 제시할 수 있습니다.

