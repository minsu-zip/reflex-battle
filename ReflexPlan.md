# Reflex Battle 개발 계획서

## 📊 프로젝트 현황

### 완료된 항목 ✅

- [x] 프로젝트 초기 세팅 (React Native + Expo)
- [x] Navigation 구조
- [x] Time Stop 모드 (Setup → Game → Result)
- [x] Quick Tap 모드 (Setup → Game → Result)
- [x] AdMob 배너 광고
- [x] AdMob 전면 광고 (스플래시 후 + 3회마다)
- [x] A. 네이티브 광고 (Android 종료 팝업)
- [x] B. UI 개선 (햅틱, 애니메이션, 설정 Context)
- [x] C. 앱 아이콘 & 스플래시 디자인
- [x] 다국어 지원 (ko, en, ja, zh-CN)

### 남은 항목 📋

- [ ] D. 스토어 출시 준비

---

## 🅳️ Phase D: 스토어 출시 준비

### 목표

- Google Play Store 출시
- (선택) Apple App Store 출시

### 작업 목록

#### D-1. 앱 정보 준비

```
앱 이름:
- 영어: Reflex Battle - Reaction Time Test
- 한국어: 반응속도 배틀

짧은 설명 (80자):
- EN: Test your reflexes! Challenge friends with reaction time games.
- KR: 친구들과 반응속도 대결! 누가 가장 빠를까?

긴 설명 (4000자):
- 앱 소개
- 게임 모드 설명 (Time Stop, Quick Tap)
- 주요 기능
- 플레이 방법

카테고리: Games > Casual
콘텐츠 등급: Everyone (전체이용가)
```

#### D-2. 스크린샷 준비

```
필요한 스크린샷 (최소 2장, 권장 4~8장):

Android 권장 크기: 1080x1920 또는 1080x2400

촬영할 화면:
1. Home 화면 (게임 모드 선택)
2. Time Stop 게임 플레이 중
3. Quick Tap 게임 (초록색 TAP 상태)
4. Result 화면 (순위표)
5. (선택) Setup 화면

Feature Graphic (필수): 1024x500
- 앱 로고 + 캐치프레이즈
- "Test Your Reflexes!" 등
```

#### D-3. 개인정보처리방침 작성

```
필수 포함 내용:
- 수집하는 정보 (광고 ID, 기기 정보)
- 광고 네트워크 사용 (Google AdMob)
- 데이터 사용 목적
- 연락처 (이메일)

호스팅 옵션:
1. GitHub Pages (무료)
2. Notion 공개 페이지 (무료)
3. Google Sites (무료)

예시 URL: https://username.github.io/reflex-battle-privacy
```

#### D-4. Google Play Console 설정

```
사전 준비:
1. Google Play Console 계정 ($25 일회성 결제)
2. Google 계정으로 로그인

설정 단계:
1. 앱 만들기 → 앱 이름 입력
2. 스토어 등록정보 → 설명, 스크린샷 업로드
3. 앱 콘텐츠 → 개인정보처리방침 URL 입력
4. 앱 콘텐츠 → 광고 포함 "예" 선택
5. 앱 콘텐츠 → 콘텐츠 등급 설문 완료
6. 앱 콘텐츠 → 타겟층 설정
```

#### D-5. EAS 빌드 설정

```
파일: eas.json

{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
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

#### D-6. 프로덕션 빌드 생성

```bash
# EAS CLI 설치 (최초 1회)
npm install -g eas-cli

# Expo 계정 로그인
eas login

# 프로젝트 설정 (최초 1회)
eas build:configure

# Android AAB 빌드 (Play Store용)
eas build --platform android --profile production

# 빌드 완료 후 다운로드 링크 제공됨
```

#### D-7. Play Store 제출

```
1. Google Play Console → 프로덕션 → 새 버전 만들기
2. AAB 파일 업로드
3. 버전 정보 입력
4. 검토를 위해 제출

심사 기간: 보통 1~3일 (최대 7일)
```

### 출시 체크리스트

- [ ] 앱 이름 및 설명 작성 완료
- [ ] 스크린샷 4장 이상 준비
- [ ] Feature Graphic (1024x500) 준비
- [ ] 개인정보처리방침 URL 준비
- [ ] 콘텐츠 등급 설문 완료
- [ ] 광고 포함 여부 "예" 설정
- [ ] AAB 파일 빌드 완료
- [ ] 내부 테스트 통과
- [ ] 프로덕션 제출

---

## 📝 참고 정보

### 광고 ID 전체 목록

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

=== 테스트용 ===
Banner: ca-app-pub-3940256099942544/6300978111
Interstitial: ca-app-pub-3940256099942544/1033173712
Native: ca-app-pub-3940256099942544/2247696110
```

### 앱 색상 팔레트

```
Primary: #6C5CE7 (메인 퍼플)
Secondary: #A29BFE (연한 퍼플)
Background: #1A1A2E (다크 배경)
Surface: #16213E (카드 배경)
Text: #FFFFFF (흰색 텍스트)
TextSecondary: #B2B2B2 (회색 텍스트)
Success: #00D26A (초록 - 성공/GO)
Danger: #FF6B6B (빨강 - 정지/대기)
Warning: #FDCB6E (노랑 - 경고)
Gold: #FFD700 (1등)
Silver: #C0C0C0 (2등)
Bronze: #CD7F32 (3등)
```

### 기술 스택

```
- React Native + Expo
- TypeScript
- React Navigation (Native Stack)
- react-native-google-mobile-ads (배너, 전면, 네이티브)
- AsyncStorage
- expo-haptics
- react-native-reanimated
```
