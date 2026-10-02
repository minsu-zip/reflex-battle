# Reflex Battle 개발 계획서

## 📊 프로젝트 현황

### 완료된 항목 ✅
- [x] 프로젝트 초기 세팅 (React Native + Expo)
- [x] Navigation 구조
- [x] Time Stop 모드 (Setup → Game → Result)
- [x] Quick Tap 모드 (Setup → Game → Result)
- [x] AdMob 배너 광고
- [x] AdMob 전면 광고 (스플래시 후 + 3회마다)

### 남은 항목 📋
- [ ] A. 네이티브 광고 (종료 팝업)
- [ ] B. UI 개선 (애니메이션, 햅틱, 사운드)
- [ ] C. 앱 아이콘 & 스플래시 디자인
- [ ] D. 스토어 출시 준비
- [ ] E. 추가 기능 (기록 저장, 통계, 설정)

---

## 🅰️ Phase A: 네이티브 광고 (종료 팝업)

### 목표
- 앱 종료 시 확인 팝업 표시
- 팝업 내 네이티브 광고 배치
- Android 뒤로가기 버튼 처리

### 예상 소요 시간
- 2~3시간

### 작업 목록

#### A-1. 종료 확인 모달 컴포넌트 생성
```
파일: src/components/ExitModal.tsx

기능:
- "정말 나가시겠습니까?" 메시지
- 네이티브 광고 영역
- "취소" / "종료" 버튼
```

#### A-2. 네이티브 광고 컴포넌트 생성
```
파일: src/components/NativeAdCard.tsx

기능:
- react-native-google-mobile-ads의 NativeAd 사용
- 광고 로드 실패 시 빈 공간 처리
- 광고 스타일링 (앱 디자인과 조화)
```

#### A-3. Android 뒤로가기 버튼 핸들링
```
파일: src/hooks/useBackHandler.ts

기능:
- Home 화면에서 뒤로가기 시 종료 모달 표시
- 다른 화면에서는 기본 뒤로가기 동작
```

#### A-4. HomeScreen에 종료 모달 통합
```
파일: src/screens/HomeScreen.tsx 수정

기능:
- ExitModal 컴포넌트 추가
- useBackHandler 훅 연결
- 모달 표시/숨김 상태 관리
```

### 광고 ID (이미 생성됨)
```
Android Native: ca-app-pub-1115538294872595/4420661850
iOS Native: ca-app-pub-1115538294872595/4952936905
```

### 테스트 체크리스트
- [ ] Home 화면에서 Android 뒤로가기 → 종료 모달 표시
- [ ] 모달에 네이티브 광고 표시
- [ ] "취소" 클릭 → 모달 닫힘
- [ ] "종료" 클릭 → 앱 종료
- [ ] 다른 화면에서 뒤로가기 → 정상 네비게이션

---

## 🅱️ Phase B: UI 개선 (애니메이션, 햅틱, 사운드)

### 목표
- 사용자 경험 향상
- 게임 피드백 강화
- 몰입감 증대

### 예상 소요 시간
- 3~4시간

### 작업 목록

#### B-1. 햅틱 피드백 추가
```
패키지: expo-haptics (이미 설치됨)

적용 위치:
- 게임 시작 버튼 클릭
- STOP 버튼 클릭
- 색상 변경 시 (Quick Tap)
- 결과 화면 표시 시 (우승자)
```

#### B-2. 타이머 애니메이션 개선
```
패키지: react-native-reanimated

적용:
- 숫자 변경 시 미세한 스케일 효과
- STOP 시 펄스 애니메이션
- 결과 표시 시 카운트업 효과
```

#### B-3. 화면 전환 애니메이션
```
적용:
- Result 화면 등장 시 슬라이드 업
- 순위 카드 순차적 페이드인
- 우승자 섹션 바운스 효과
```

#### B-4. 효과음 추가
```
패키지: expo-av

사운드 파일 필요:
- start.mp3: 게임 시작
- stop.mp3: STOP 버튼 클릭
- color_change.mp3: 색상 변경 (Quick Tap)
- success.mp3: 좋은 결과
- fanfare.mp3: 우승
- countdown.mp3: 카운트다운 (선택)

파일 위치: assets/sounds/
```

#### B-5. 사운드 설정 기능
```
파일: src/contexts/SettingsContext.tsx

기능:
- 사운드 ON/OFF 토글
- AsyncStorage에 설정 저장
- 전역 상태 관리
```

### 테스트 체크리스트
- [ ] 버튼 클릭 시 햅틱 피드백 작동
- [ ] 타이머 숫자 애니메이션 부드러움
- [ ] 효과음 적절한 타이밍에 재생
- [ ] 사운드 OFF 시 효과음 안 들림
- [ ] 애니메이션이 성능에 영향 없음

---

## 🅲️ Phase C: 앱 아이콘 & 스플래시 디자인

### 목표
- 전문적인 앱 아이콘 제작
- 브랜드 아이덴티티 확립
- 스토어 등록 준비

### 예상 소요 시간
- 1~2시간

### 작업 목록

#### C-1. 앱 아이콘 디자인
```
필요한 파일:
- assets/icon.png (1024x1024)
- assets/adaptive-icon.png (1024x1024, Android용)

디자인 컨셉:
- ⚡ 번개 또는 🎯 타겟 모티프
- 앱 테마 색상 (#6C5CE7 퍼플, #1A1A2E 다크)
- 심플하고 인식하기 쉬운 디자인
```

#### C-2. 스플래시 스크린 디자인
```
필요한 파일:
- assets/splash.png (1284x2778 권장)

디자인 컨셉:
- 앱 아이콘 중앙 배치
- 앱 이름 "REFLEX BATTLE"
- 배경색: #1A1A2E
```

#### C-3. app.json 업데이트
```json
{
  "expo": {
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#1A1A2E"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#1A1A2E"
      }
    }
  }
}
```

#### C-4. 아이콘 생성 도구 (선택)
```
옵션 1: 온라인 도구
- https://www.canva.com (무료 템플릿)
- https://makeappicon.com (자동 리사이징)

옵션 2: AI 이미지 생성
- 프롬프트 예시: "Mobile app icon, lightning bolt, purple gradient, minimal, gaming"

옵션 3: 직접 제작
- Figma, Adobe XD 등
```

### 테스트 체크리스트
- [ ] 앱 아이콘이 홈 화면에 정상 표시
- [ ] Android adaptive icon 정상 작동
- [ ] 스플래시 화면 표시 후 앱 로드
- [ ] 아이콘이 작은 크기에서도 인식 가능

---

## 🅳️ Phase D: 스토어 출시 준비

### 목표
- Google Play Store 출시
- (선택) Apple App Store 출시

### 예상 소요 시간
- 4~6시간 (심사 대기 시간 제외)

### 작업 목록

#### D-1. 앱 정보 준비
```
필요한 내용:

앱 이름: Reflex Battle / 반응속도 배틀
짧은 설명 (80자): 친구들과 반응속도 대결! 누가 가장 빠를까?
긴 설명 (4000자): 
  - 앱 소개
  - 게임 모드 설명 (Time Stop, Quick Tap)
  - 주요 기능
  - 사용 방법

카테고리: Games > Casual
콘텐츠 등급: Everyone (전체이용가)
```

#### D-2. 스크린샷 준비
```
필요한 스크린샷:

Android (최소 2장, 권장 8장):
- 1080x1920 또는 1080x2280
- Home 화면
- Time Stop 게임 화면
- Quick Tap 게임 화면
- Result 화면

Feature Graphic (필수):
- 1024x500
- 앱 로고 + 간단한 설명
```

#### D-3. 개인정보처리방침
```
필요한 이유: AdMob 사용 시 필수

내용 포함:
- 수집하는 정보 (광고 ID 등)
- 광고 네트워크 사용 고지
- 연락처

호스팅: GitHub Pages, Notion, 또는 웹사이트
```

#### D-4. Google Play Console 설정
```
단계:
1. Google Play Console 계정 생성 ($25 일회성)
2. 앱 생성
3. 스토어 등록정보 입력
4. 앱 콘텐츠 설정 (광고 포함 여부 등)
5. 가격 및 배포 설정
```

#### D-5. 프로덕션 빌드
```bash
# Android AAB 빌드
eas build --platform android --profile production

# 또는 로컬 빌드
cd android
./gradlew bundleRelease
```

#### D-6. EAS 설정 (Expo Application Services)
```
파일: eas.json

{
  "cli": {
    "version": ">= 3.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      },
      "ios": {
        "resourceClass": "m1-medium"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

#### D-7. 앱 서명 키 관리
```
Android:
- EAS에서 자동 관리 (권장)
- 또는 직접 keystore 생성/관리

iOS:
- Apple Developer 계정 필요 ($99/년)
- 인증서 및 프로비저닝 프로파일
```

### 스토어 등록 체크리스트
- [ ] 앱 이름 및 설명 작성 완료
- [ ] 스크린샷 8장 준비
- [ ] Feature Graphic 준비
- [ ] 개인정보처리방침 URL 준비
- [ ] 콘텐츠 등급 설문 완료
- [ ] AAB 파일 빌드 완료
- [ ] 내부 테스트 → 비공개 테스트 → 프로덕션

---

## 🅴️ Phase E: 추가 기능

### 목표
- 리텐션 향상
- 사용자 참여 증가
- 앱 완성도 향상

### 예상 소요 시간
- 4~6시간

### 작업 목록

#### E-1. 게임 기록 저장
```
파일: src/utils/storage.ts

기능:
- AsyncStorage 사용
- 최근 게임 기록 저장 (최대 50개)
- 최고 기록 저장

데이터 구조:
{
  "timeStop": {
    "bestScore": 0.02,  // 최소 오차
    "history": [...]
  },
  "quickTap": {
    "bestScore": 0.187,  // 최소 반응시간
    "history": [...]
  }
}
```

#### E-2. 통계 화면
```
파일: src/screens/StatsScreen.tsx

표시 내용:
- 총 게임 횟수
- 최고 기록 (Time Stop / Quick Tap)
- 평균 기록
- 최근 게임 기록 리스트
- 그래프 (선택)
```

#### E-3. 설정 화면
```
파일: src/screens/SettingsScreen.tsx

설정 항목:
- 사운드 ON/OFF
- 햅틱 ON/OFF
- 기록 초기화
- 앱 정보 (버전, 개인정보처리방침 링크)
- 문의하기 (이메일)
```

#### E-4. Navigation 업데이트
```
추가할 화면:
- StatsScreen
- SettingsScreen

Home 화면에 버튼 추가:
- 📊 통계
- ⚙️ 설정
```

#### E-5. 온보딩 화면 (선택)
```
파일: src/screens/OnboardingScreen.tsx

기능:
- 첫 실행 시 게임 방법 안내
- 2~3장의 슬라이드
- "다시 보지 않기" 옵션
```

### 테스트 체크리스트
- [ ] 게임 기록 저장 및 불러오기
- [ ] 통계 화면 데이터 정확성
- [ ] 설정 변경 후 앱 재시작해도 유지
- [ ] 기록 초기화 정상 작동

---

## 📅 전체 일정 요약

| Phase | 작업 | 예상 시간 | 우선순위 |
|:-----:|------|:---------:|:--------:|
| A | 네이티브 광고 (종료 팝업) | 2~3시간 | 🔵 |
| B | UI 개선 | 3~4시간 | 🔵 |
| C | 아이콘 & 스플래시 | 1~2시간 | 🔴 |
| D | 스토어 출시 | 4~6시간 | 🔴 |
| E | 추가 기능 | 4~6시간 | 🟢 |

**총 예상 시간: 14~21시간**

---

## 🚀 작업 시작 방법

각 Phase를 시작할 때 아래 형식으로 명령하면 됩니다:

```
"Phase A 작업 시작해줘"
"Phase B-2 타이머 애니메이션 구현해줘"
"Phase D-5 프로덕션 빌드 방법 알려줘"
```

---

## 📝 참고 사항

### 광고 ID 정리
```
=== Android ===
App ID: ca-app-pub-1115538294872595~7584589276
Banner: ca-app-pub-1115538294872595/1874125263
Interstitial: ca-app-pub-1115538294872595/3535612130
Native: ca-app-pub-1115538294872595/4420661850

=== iOS ===
App ID: ca-app-pub-1115538294872595~7310355552
Banner: ca-app-pub-1115538294872595/5343819141
Interstitial: ca-app-pub-1115538294872595/5247793837
Native: ca-app-pub-1115538294872595/4952936905
```

### 색상 팔레트
```
Primary: #6C5CE7
Secondary: #A29BFE
Background: #1A1A2E
Surface: #16213E
Text: #FFFFFF
Success: #00D26A
Danger: #FF6B6B
Gold: #FFD700
```

### 기술 스택
```
- React Native (Expo)
- TypeScript
- React Navigation
- react-native-google-mobile-ads
- AsyncStorage
- expo-haptics
- expo-av
```
