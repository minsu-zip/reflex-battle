📋 Step 1: AdMob 설정 및 라이브러리 설치
1-1. 라이브러리 설치
bashnpx expo install react-native-google-mobile-ads

1-2. app.json 설정
app.json 파일을 열고 아래 내용을 추가/수정하세요:
json{
"expo": {
"name": "Reflex Battle",
"slug": "reflex-battle",
"version": "1.0.0",
"orientation": "portrait",
"icon": "./assets/icon.png",
"userInterfaceStyle": "dark",
"splash": {
"image": "./assets/splash.png",
"resizeMode": "contain",
"backgroundColor": "#1A1A2E"
},
"assetBundlePatterns": [
"**/*"
],
"ios": {
"supportsTablet": true,
"bundleIdentifier": "com.yourname.reflexbattle"
},
"android": {
"adaptiveIcon": {
"foregroundImage": "./assets/adaptive-icon.png",
"backgroundColor": "#1A1A2E"
},
"package": "com.yourname.reflexbattle"
},
"plugins": [
[
"react-native-google-mobile-ads",
{
"androidAppId": "ca-app-pub-1115538294872595~7584589276",
"iosAppId": "ca-app-pub-1115538294872595~7310355552"
}
]
]
}
}

1-3. 광고 ID 상수 파일 생성
bashtouch src/constants/adUnitIds.ts
src/constants/adUnitIds.ts:
typescriptimport { Platform } from 'react-native';

// 테스트 모드 설정 (개발 중에는 true, 출시 시 false)
const TEST_MODE = **DEV**;

// Google 제공 테스트 광고 ID
const TEST_IDS = {
BANNER: 'ca-app-pub-3940256099942544/6300978111',
INTERSTITIAL: 'ca-app-pub-3940256099942544/1033173712',
NATIVE: 'ca-app-pub-3940256099942544/2247696110',
};

// 실제 광고 ID
const PRODUCTION_IDS = {
ANDROID: {
BANNER: 'ca-app-pub-1115538294872595/1874125263',
INTERSTITIAL: 'ca-app-pub-1115538294872595/3535612130',
NATIVE: 'ca-app-pub-1115538294872595/4420661850',
},
IOS: {
BANNER: 'ca-app-pub-1115538294872595/5343819141',
INTERSTITIAL: 'ca-app-pub-1115538294872595/5247793837',
NATIVE: 'ca-app-pub-1115538294872595/4952936905',
},
};

// 플랫폼별 ID 선택
const getAdUnitId = (type: 'BANNER' | 'INTERSTITIAL' | 'NATIVE'): string => {
if (TEST_MODE) {
return TEST_IDS[type];
}

return Platform.select({
ios: PRODUCTION_IDS.IOS[type],
android: PRODUCTION_IDS.ANDROID[type],
}) || TEST_IDS[type];
};

export const AD_UNIT_IDS = {
BANNER: getAdUnitId('BANNER'),
INTERSTITIAL: getAdUnitId('INTERSTITIAL'),
NATIVE: getAdUnitId('NATIVE'),
};

// 광고 빈도 설정
export const AD_CONFIG = {
// 전면 광고: N회 게임마다 1번
INTERSTITIAL_FREQUENCY: 3,
// 스플래시 후 전면 광고 표시 여부
SHOW_SPLASH_INTERSTITIAL: true,
};

1-4. Expo Prebuild (중요!)
react-native-google-mobile-ads는 네이티브 코드가 필요해서 Expo Go에서는 작동하지 않아요. Development Build가 필요합니다.
bash# 네이티브 프로젝트 생성
npx expo prebuild

# Android 빌드 실행

npx expo run:android

# 또는 iOS 빌드 실행 (Mac 필요)

npx expo run:ios

1-5. 광고 초기화 (App.tsx 수정)
App.tsx:
typescriptimport React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import mobileAds from 'react-native-google-mobile-ads';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
const [adsInitialized, setAdsInitialized] = useState(false);

useEffect(() => {
// AdMob 초기화
mobileAds()
.initialize()
.then((adapterStatuses) => {
console.log('AdMob initialized:', adapterStatuses);
setAdsInitialized(true);
})
.catch((error) => {
console.error('AdMob initialization failed:', error);
setAdsInitialized(true); // 실패해도 앱은 계속 진행
});
}, []);

return (
<>
<StatusBar style="light" />
<AppNavigator />
</>
);
}

📋 Step 2: 광고 컴포넌트 개발
2-1. AdBanner 컴포넌트
bashtouch src/components/AdBanner.tsx
src/components/AdBanner.tsx:
typescriptimport React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { AD_UNIT_IDS } from '../constants/adUnitIds';

interface AdBannerProps {
size?: BannerAdSize;
}

export default function AdBanner({ size = BannerAdSize.ANCHORED_ADAPTIVE_BANNER }: AdBannerProps) {
const [adLoaded, setAdLoaded] = useState(false);
const [adError, setAdError] = useState(false);

if (adError) {
return null; // 광고 로드 실패 시 빈 공간 없이 처리
}

return (
<View style={[styles.container, !adLoaded && styles.loading]}>
<BannerAd
unitId={AD_UNIT_IDS.BANNER}
size={size}
requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
onAdLoaded={() => {
console.log('Banner ad loaded');
setAdLoaded(true);
}}
onAdFailedToLoad={(error) => {
console.error('Banner ad failed to load:', error);
setAdError(true);
}}
/>
</View>
);
}

const styles = StyleSheet.create({
container: {
alignItems: 'center',
justifyContent: 'center',
width: '100%',
},
loading: {
minHeight: 50, // 로딩 중 최소 높이
},
});

2-2. 전면 광고 훅
bashtouch src/hooks/useInterstitialAd.ts
src/hooks/useInterstitialAd.ts:
typescriptimport { useEffect, useState, useCallback } from 'react';
import {
InterstitialAd,
AdEventType,
TestIds,
} from 'react-native-google-mobile-ads';
import { AD_UNIT_IDS } from '../constants/adUnitIds';

const interstitial = InterstitialAd.createForAdRequest(AD_UNIT_IDS.INTERSTITIAL, {
requestNonPersonalizedAdsOnly: true,
});

export function useInterstitialAd() {
const [isLoaded, setIsLoaded] = useState(false);
const [isClosed, setIsClosed] = useState(false);

useEffect(() => {
const loadListener = interstitial.addAdEventListener(AdEventType.LOADED, () => {
console.log('Interstitial ad loaded');
setIsLoaded(true);
});

    const closeListener = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
      console.log('Interstitial ad closed');
      setIsClosed(true);
      setIsLoaded(false);
      // 다음 광고 미리 로드
      interstitial.load();
    });

    const errorListener = interstitial.addAdEventListener(AdEventType.ERROR, (error) => {
      console.error('Interstitial ad error:', error);
      setIsLoaded(false);
    });

    // 초기 로드
    interstitial.load();

    return () => {
      loadListener();
      closeListener();
      errorListener();
    };

}, []);

const showAd = useCallback(async (): Promise<boolean> => {
if (isLoaded) {
try {
await interstitial.show();
return true;
} catch (error) {
console.error('Failed to show interstitial:', error);
return false;
}
}
return false;
}, [isLoaded]);

const resetClosed = useCallback(() => {
setIsClosed(false);
}, []);

return {
isLoaded,
isClosed,
showAd,
resetClosed,
};
}

2-3. 광고 빈도 관리 Context
bashtouch src/contexts/AdContext.tsx
src/contexts/AdContext.tsx:
typescriptimport React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { AD_CONFIG } from '../constants/adUnitIds';

interface AdContextType {
gameCount: number;
incrementGameCount: () => void;
shouldShowInterstitial: () => boolean;
resetGameCount: () => void;
}

const AdContext = createContext<AdContextType | undefined>(undefined);

export function AdProvider({ children }: { children: ReactNode }) {
const [gameCount, setGameCount] = useState(0);

const incrementGameCount = useCallback(() => {
setGameCount((prev) => prev + 1);
}, []);

const shouldShowInterstitial = useCallback(() => {
// N회마다 1번 광고 표시
return gameCount > 0 && gameCount % AD_CONFIG.INTERSTITIAL_FREQUENCY === 0;
}, [gameCount]);

const resetGameCount = useCallback(() => {
setGameCount(0);
}, []);

return (
<AdContext.Provider
value={{
        gameCount,
        incrementGameCount,
        shouldShowInterstitial,
        resetGameCount,
      }} >
{children}
</AdContext.Provider>
);
}

export function useAdContext() {
const context = useContext(AdContext);
if (context === undefined) {
throw new Error('useAdContext must be used within an AdProvider');
}
return context;
}

2-4. App.tsx에 AdProvider 추가
App.tsx 수정:
typescriptimport React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import mobileAds from 'react-native-google-mobile-ads';
import AppNavigator from './src/navigation/AppNavigator';
import { AdProvider } from './src/contexts/AdContext';

export default function App() {
const [adsInitialized, setAdsInitialized] = useState(false);

useEffect(() => {
mobileAds()
.initialize()
.then((adapterStatuses) => {
console.log('AdMob initialized:', adapterStatuses);
setAdsInitialized(true);
})
.catch((error) => {
console.error('AdMob initialization failed:', error);
setAdsInitialized(true);
});
}, []);

return (
<AdProvider>
<StatusBar style="light" />
<AppNavigator />
</AdProvider>
);
}

📋 Step 3: 화면에 광고 적용
3-1. 스플래시 후 전면 광고 (AppNavigator 수정)
src/navigation/AppNavigator.tsx:
typescriptimport React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { InterstitialAd, AdEventType } from 'react-native-google-mobile-ads';

import HomeScreen from '../screens/HomeScreen';
import TimeStopSetup from '../screens/TimeStop/SetupScreen';
import TimeStopGame from '../screens/TimeStop/GameScreen';
import TimeStopResult from '../screens/TimeStop/ResultScreen';
import QuickTapSetup from '../screens/QuickTap/SetupScreen';
import QuickTapGame from '../screens/QuickTap/GameScreen';
import QuickTapResult from '../screens/QuickTap/ResultScreen';

import { Player } from '../types/game';
import { COLORS } from '../constants/colors';
import { AD_UNIT_IDS, AD_CONFIG } from '../constants/adUnitIds';

export type RootStackParamList = {
Home: undefined;
TimeStopSetup: undefined;
TimeStopGame: { players: Player[]; targetTime: number };
TimeStopResult: { players: Player[]; targetTime: number };
QuickTapSetup: undefined;
QuickTapGame: { players: Player[] };
QuickTapResult: { players: Player[] };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// 스플래시용 전면 광고
const splashInterstitial = InterstitialAd.createForAdRequest(AD_UNIT_IDS.INTERSTITIAL, {
requestNonPersonalizedAdsOnly: true,
});

export default function AppNavigator() {
const [isReady, setIsReady] = useState(false);
const [adShown, setAdShown] = useState(false);

useEffect(() => {
if (!AD_CONFIG.SHOW_SPLASH_INTERSTITIAL) {
setIsReady(true);
return;
}

    let timeoutId: NodeJS.Timeout;

    const loadListener = splashInterstitial.addAdEventListener(AdEventType.LOADED, () => {
      console.log('Splash interstitial loaded');
      splashInterstitial.show();
    });

    const closeListener = splashInterstitial.addAdEventListener(AdEventType.CLOSED, () => {
      console.log('Splash interstitial closed');
      setAdShown(true);
      setIsReady(true);
    });

    const errorListener = splashInterstitial.addAdEventListener(AdEventType.ERROR, (error) => {
      console.error('Splash interstitial error:', error);
      setIsReady(true); // 광고 실패해도 앱 진행
    });

    // 광고 로드 시작
    splashInterstitial.load();

    // 타임아웃: 5초 후에도 광고 안 뜨면 그냥 진행
    timeoutId = setTimeout(() => {
      if (!adShown) {
        console.log('Ad timeout, proceeding without ad');
        setIsReady(true);
      }
    }, 5000);

    return () => {
      loadListener();
      closeListener();
      errorListener();
      clearTimeout(timeoutId);
    };

}, []);

// 로딩 화면 (스플래시 대용)
if (!isReady) {
return (
<View style={styles.loadingContainer}>
<ActivityIndicator size="large" color={COLORS.primary} />
</View>
);
}

return (
<NavigationContainer>
<Stack.Navigator
initialRouteName="Home"
screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: COLORS.background },
        }} >
<Stack.Screen name="Home" component={HomeScreen} />
<Stack.Screen name="TimeStopSetup" component={TimeStopSetup} />
<Stack.Screen name="TimeStopGame" component={TimeStopGame} />
<Stack.Screen name="TimeStopResult" component={TimeStopResult} />
<Stack.Screen name="QuickTapSetup" component={QuickTapSetup} />
<Stack.Screen name="QuickTapGame" component={QuickTapGame} />
<Stack.Screen name="QuickTapResult" component={QuickTapResult} />
</Stack.Navigator>
</NavigationContainer>
);
}

const styles = StyleSheet.create({
loadingContainer: {
flex: 1,
justifyContent: 'center',
alignItems: 'center',
backgroundColor: COLORS.background,
},
});

3-2. HomeScreen에 배너 추가
src/screens/HomeScreen.tsx 수정:
typescriptimport React from 'react';
import {
View,
Text,
StyleSheet,
TouchableOpacity,
SafeAreaView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { COLORS } from '../constants/colors';
import AdBanner from '../components/AdBanner';

type HomeScreenProps = {
navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

export default function HomeScreen({ navigation }: HomeScreenProps) {
return (
<SafeAreaView style={styles.container}>
<View style={styles.content}>
<Text style={styles.title}>⚡ REFLEX BATTLE ⚡</Text>
<Text style={styles.subtitle}>친구들과 반응속도 대결!</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.modeButton}
            onPress={() => navigation.navigate('TimeStopSetup')}
          >
            <Text style={styles.modeEmoji}>🎯</Text>
            <Text style={styles.modeTitle}>TIME STOP</Text>
            <Text style={styles.modeDescription}>목표 시간에 정확히 멈춰라!</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.modeButton}
            onPress={() => navigation.navigate('QuickTapSetup')}
          >
            <Text style={styles.modeEmoji}>⚡</Text>
            <Text style={styles.modeTitle}>QUICK TAP</Text>
            <Text style={styles.modeDescription}>색이 바뀌면 최대한 빨리!</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 하단 배너 광고 */}
      <AdBanner />
    </SafeAreaView>

);
}

const styles = StyleSheet.create({
container: {
flex: 1,
backgroundColor: COLORS.background,
},
content: {
flex: 1,
justifyContent: 'center',
alignItems: 'center',
padding: 20,
},
title: {
fontSize: 32,
fontWeight: 'bold',
color: COLORS.text,
marginBottom: 8,
},
subtitle: {
fontSize: 16,
color: COLORS.textSecondary,
marginBottom: 48,
},
buttonContainer: {
width: '100%',
gap: 16,
},
modeButton: {
backgroundColor: COLORS.surface,
borderRadius: 16,
padding: 24,
alignItems: 'center',
borderWidth: 1,
borderColor: COLORS.primary,
},
modeEmoji: {
fontSize: 48,
marginBottom: 12,
},
modeTitle: {
fontSize: 24,
fontWeight: 'bold',
color: COLORS.text,
marginBottom: 8,
},
modeDescription: {
fontSize: 14,
color: COLORS.textSecondary,
},
});

3-3. Result 화면에 전면 광고 + 배너 추가
src/screens/TimeStop/ResultScreen.tsx 수정 (주요 부분):
typescriptimport React, { useMemo, useEffect } from 'react';
import {
View,
Text,
StyleSheet,
SafeAreaView,
ScrollView,
Share,
Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { COLORS } from '../../constants/colors';
import { rankPlayers, generateShareText } from '../../utils/calculateScore';
import Button from '../../components/Button';
import RankingList from '../../components/RankingList';
import AdBanner from '../../components/AdBanner';
import { useInterstitialAd } from '../../hooks/useInterstitialAd';
import { useAdContext } from '../../contexts/AdContext';

type ResultScreenProps = {
navigation: NativeStackNavigationProp<RootStackParamList, 'TimeStopResult'>;
route: RouteProp<RootStackParamList, 'TimeStopResult'>;
};

export default function ResultScreen({ navigation, route }: ResultScreenProps) {
const { players, targetTime } = route.params;
const { showAd, isLoaded } = useInterstitialAd();
const { incrementGameCount, shouldShowInterstitial } = useAdContext();

// 게임 완료 시 카운트 증가
useEffect(() => {
incrementGameCount();
}, []);

const rankedPlayers = useMemo(() => {
return rankPlayers(players, targetTime);
}, [players, targetTime]);

const winner = rankedPlayers[0];

// 다시하기 (전면 광고 포함)
const handlePlayAgain = async () => {
if (shouldShowInterstitial() && isLoaded) {
await showAd();
}

    const resetPlayers = players.map(p => ({ ...p, score: null }));
    navigation.replace('TimeStopGame', {
      players: resetPlayers,
      targetTime,
    });

};

// 홈으로 (전면 광고 포함)
const handleGoHome = async () => {
if (shouldShowInterstitial() && isLoaded) {
await showAd();
}
navigation.popToTop();
};

const handleShare = async () => {
try {
const shareText = generateShareText(rankedPlayers, targetTime, 'timeStop');
await Share.share({ message: shareText });
} catch (error) {
Alert.alert('공유 실패', '공유하는 중 오류가 발생했습니다.');
}
};

return (
<SafeAreaView style={styles.container}>
<ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
{/_ 헤더 _/}
<View style={styles.header}>
<Text style={styles.trophy}>🏆</Text>
<Text style={styles.title}>게임 결과</Text>
<Text style={styles.targetTime}>목표 시간: {targetTime.toFixed(1)}초</Text>
</View>

        {/* 우승자 하이라이트 */}
        <View style={styles.winnerSection}>
          <Text style={styles.winnerLabel}>🎉 우승 🎉</Text>
          <Text style={styles.winnerName}>{winner.name}</Text>
          <Text style={styles.winnerScore}>
            오차 {winner.score?.toFixed(2)}초
          </Text>
        </View>

        {/* 전체 순위 */}
        <View style={styles.rankingSection}>
          <Text style={styles.sectionTitle}>전체 순위</Text>
          <RankingList
            players={rankedPlayers}
            targetTime={targetTime}
            gameMode="timeStop"
          />
        </View>
      </ScrollView>

      {/* 하단 버튼 */}
      <View style={styles.footer}>
        <Button
          title="🔄 다시하기"
          onPress={handlePlayAgain}
          variant="primary"
          style={styles.button}
        />
        <View style={styles.buttonRow}>
          <Button
            title="🏠 홈으로"
            onPress={handleGoHome}
            variant="outline"
            style={styles.halfButton}
          />
          <Button
            title="📤 공유"
            onPress={handleShare}
            variant="secondary"
            style={styles.halfButton}
          />
        </View>
      </View>

      {/* 하단 배너 광고 */}
      <AdBanner />
    </SafeAreaView>

);
}

// ... styles는 기존과 동일
const styles = StyleSheet.create({
container: {
flex: 1,
backgroundColor: COLORS.background,
},
scrollView: {
flex: 1,
},
content: {
padding: 24,
paddingBottom: 16,
},
header: {
alignItems: 'center',
marginBottom: 24,
},
trophy: {
fontSize: 64,
marginBottom: 8,
},
title: {
fontSize: 28,
fontWeight: 'bold',
color: COLORS.text,
marginBottom: 8,
},
targetTime: {
fontSize: 16,
color: COLORS.primary,
fontWeight: '600',
},
winnerSection: {
backgroundColor: COLORS.gold + '20',
borderRadius: 16,
padding: 24,
alignItems: 'center',
marginBottom: 24,
borderWidth: 2,
borderColor: COLORS.gold,
},
winnerLabel: {
fontSize: 18,
color: COLORS.gold,
marginBottom: 8,
},
winnerName: {
fontSize: 32,
fontWeight: 'bold',
color: COLORS.gold,
marginBottom: 8,
},
winnerScore: {
fontSize: 18,
color: COLORS.text,
},
rankingSection: {
marginBottom: 16,
},
sectionTitle: {
fontSize: 18,
fontWeight: 'bold',
color: COLORS.text,
marginBottom: 16,
},
footer: {
padding: 16,
paddingBottom: 8,
gap: 12,
},
button: {
width: '100%',
},
buttonRow: {
flexDirection: 'row',
gap: 12,
},
halfButton: {
flex: 1,
},
});

3-4. Setup 화면들에 배너 추가
src/screens/TimeStop/SetupScreen.tsx와 src/screens/QuickTap/SetupScreen.tsx의 return 부분 마지막에 추가:
typescript// import 추가
import AdBanner from '../../components/AdBanner';

// return문 SafeAreaView 마지막에 추가
{/_ 하단 배너 광고 _/}
<AdBanner />
</SafeAreaView>

3-5. QuickTap Result에도 동일하게 적용
src/screens/QuickTap/ResultScreen.tsx도 TimeStop Result와 동일한 패턴으로 수정:
typescript// import 추가
import AdBanner from '../../components/AdBanner';
import { useInterstitialAd } from '../../hooks/useInterstitialAd';
import { useAdContext } from '../../contexts/AdContext';

// 컴포넌트 내부에 추가
const { showAd, isLoaded } = useInterstitialAd();
const { incrementGameCount, shouldShowInterstitial } = useAdContext();

useEffect(() => {
incrementGameCount();
}, []);

// handlePlayAgain, handleGoHome 수정
const handlePlayAgain = async () => {
if (shouldShowInterstitial() && isLoaded) {
await showAd();
}
const resetPlayers = players.map(p => ({ ...p, score: null }));
navigation.replace('QuickTapGame', { players: resetPlayers });
};

const handleGoHome = async () => {
if (shouldShowInterstitial() && isLoaded) {
await showAd();
}
navigation.popToTop();
};

// return문 마지막에 AdBanner 추가

📋 빌드 및 테스트
빌드 명령어
bash# Android 빌드
npx expo prebuild --platform android
npx expo run:android

# iOS 빌드 (Mac 필요)

npx expo prebuild --platform ios
npx expo run:ios

```

---

## ✅ 체크리스트

- [ ] 라이브러리 설치 완료
- [ ] app.json에 AdMob App ID 추가
- [ ] prebuild 실행
- [ ] 앱 실행 시 스플래시 후 전면 광고 표시
- [ ] Home 화면 하단 배너 표시
- [ ] Setup 화면들 하단 배너 표시
- [ ] Game 화면은 광고 없음
- [ ] Result 화면 하단 배너 표시
- [ ] 다시하기/홈으로 클릭 시 3회마다 전면 광고

---

## 📁 새로 추가된 파일
```

src/
├── constants/
│ └── adUnitIds.ts ✅ NEW
├── components/
│ └── AdBanner.tsx ✅ NEW
├── hooks/
│ └── useInterstitialAd.ts ✅ NEW
├── contexts/
│ └── AdContext.tsx ✅ NEW
└── ...

완료되면 말해줘요! 네이티브 광고(종료 팝업용)는 다음 단계에서 구현할게요 🚀패키지는 설치되어 있습니다. react-native-google-mobile-ads 플러그인 에러는 플러그인 설정 형식 문제일 수 있습니다. 두 가지 옵션이 있습니다: 간단한 방법: 플러그인을 문자열로만 추가하고, AdMob App ID는 나중에 네이티브 파일(google-services.json, Info.plist)에서 설정상세 설정 방법: expo-build-properties 플러그인을 추가로 사용하여 설정

어떤 방법을 선호하시나요?이런걸 물어보는ㄷ제오후 3:13플러그인 설정 방식을 검토하고 간단한 옵션을 권장했습니다.사용자가 expo prebuild 과정에서 플러그인 설정 에러가 발생했고, Claude Code나 다른 도구가 두 가지 옵션을 제안한 것 같습니다.
Expo에서 react-native-google-mobile-ads를 사용할 때 플러그인 설정 방식이 조금 까다로울 수 있습니다.
옵션 1이 더 간단하고 일반적으로 잘 작동합니다. 네이티브 파일에서 직접 설정하는 방식이 더 확실합니다.
옵션 1을 추천하고, 구체적인 설정 방법을 알려드리겠습니다.**옵션 1 (간단한 방법)**을 추천해요!

옵션 1로 진행
Step 1: app.json 수정
플러그인을 문자열로만 추가:
json{
"expo": {
"name": "Reflex Battle",
"slug": "reflex-battle",
"plugins": [
"react-native-google-mobile-ads"
]
}
}

Step 2: prebuild 실행
bashnpx expo prebuild --clean

Step 3: Android 설정 (자동 생성된 파일 수정)
android/app/src/main/AndroidManifest.xml 열고 <application> 태그 안에 추가:
xml<meta-data
    android:name="com.google.android.gms.ads.APPLICATION_ID"
    android:value="ca-app-pub-1115538294872595~7584589276"/>

Step 4: iOS 설정 (자동 생성된 파일 수정)
ios/ReflexBattle/Info.plist 열고 <dict> 안에 추가:
xml<key>GADApplicationIdentifier</key>
<string>ca-app-pub-1115538294872595~7310355552</string>
<key>SKAdNetworkItems</key>
<array>
<dict>
<key>SKAdNetworkIdentifier</key>
<string>cstr6suwn9.skadnetwork</string>
</dict>
</array>

Step 5: 빌드 실행
bash# Android
npx expo run:android

# iOS (Mac)

npx expo run:ios

이 방법이 더 확실하고 에러 없이 작동해요. 진행해보고 결과 알려주세요! 🚀Claude는 AI이며 실수할 수 있습니다. 응답을 다시 한번 확인해 주세요.
