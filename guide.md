🚀 Reflex Battle 프로젝트 초기 세팅 가이드

Step 1: 프로젝트 생성
bashnpx create-expo-app reflex-battle --template blank-typescript
cd reflex-battle

Step 2: 필수 패키지 설치
bash# Navigation
npx expo install @react-navigation/native @react-navigation/native-stack react-native-screens react-native-safe-area-context

# Storage (기록 저장용)

npx expo install @react-native-async-storage/async-storage

# 추가 유틸

npx expo install expo-status-bar expo-haptics

Step 3: 폴더 구조 생성
bashmkdir -p src/screens/TimeStop src/screens/QuickTap src/components src/hooks src/utils src/constants src/types

```

생성될 구조:
```

reflex-battle/
├── src/
│ ├── screens/
│ │ ├── TimeStop/
│ │ └── QuickTap/
│ ├── components/
│ ├── hooks/
│ ├── utils/
│ ├── constants/
│ └── types/
├── App.tsx
└── ...

Step 4: 기본 파일 생성
아래 명령어로 필요한 파일들을 한번에 생성해요:
bash# Screens
touch src/screens/HomeScreen.tsx
touch src/screens/TimeStop/SetupScreen.tsx
touch src/screens/TimeStop/GameScreen.tsx
touch src/screens/TimeStop/ResultScreen.tsx
touch src/screens/QuickTap/SetupScreen.tsx
touch src/screens/QuickTap/GameScreen.tsx
touch src/screens/QuickTap/ResultScreen.tsx

# Components

touch src/components/Button.tsx
touch src/components/Timer.tsx
touch src/components/PlayerInput.tsx
touch src/components/RankingList.tsx

# Hooks

touch src/hooks/useTimer.ts
touch src/hooks/useGameState.ts

# Utils & Constants

touch src/utils/calculateScore.ts
touch src/constants/colors.ts
touch src/constants/config.ts

# Types

touch src/types/game.ts

# Navigation

touch src/navigation/AppNavigator.tsx
mkdir -p src/navigation
touch src/navigation/AppNavigator.tsx

Step 5: 기본 코드 작성

1. src/types/game.ts
   typescriptexport interface Player {
   id: string;
   name: string;
   score: number | null; // 오차 또는 반응시간
   }

export interface GameState {
players: Player[];
currentPlayerIndex: number;
targetTime?: number; // Mode 1용
isGameComplete: boolean;
}

export type GameMode = 'timeStop' | 'quickTap'; 2) src/constants/colors.ts
typescriptexport const COLORS = {
primary: '#6C5CE7',
secondary: '#A29BFE',
background: '#1A1A2E',
surface: '#16213E',
text: '#FFFFFF',
textSecondary: '#B2B2B2',
success: '#00D26A',
danger: '#FF6B6B',
warning: '#FDCB6E',
gold: '#FFD700',
silver: '#C0C0C0',
bronze: '#CD7F32',
}; 3) src/constants/config.ts
typescriptexport const CONFIG = {
MIN_PLAYERS: 2,
MAX_PLAYERS: 8,
DEFAULT_TARGET_TIME: 3.0, // 3초
MIN_TARGET_TIME: 1.0,
MAX_TARGET_TIME: 10.0,
QUICK_TAP_MIN_DELAY: 1000, // 1초
QUICK_TAP_MAX_DELAY: 5000, // 5초
TIMER_INTERVAL: 10, // 10ms
}; 4) src/navigation/AppNavigator.tsx
typescriptimport React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import TimeStopSetup from '../screens/TimeStop/SetupScreen';
import TimeStopGame from '../screens/TimeStop/GameScreen';
import TimeStopResult from '../screens/TimeStop/ResultScreen';
import QuickTapSetup from '../screens/QuickTap/SetupScreen';
import QuickTapGame from '../screens/QuickTap/GameScreen';
import QuickTapResult from '../screens/QuickTap/ResultScreen';

import { Player } from '../types/game';

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

export default function AppNavigator() {
return (
<NavigationContainer>
<Stack.Navigator
initialRouteName="Home"
screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#1A1A2E' },
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
} 5) src/screens/HomeScreen.tsx
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
}); 6) App.tsx 수정
typescriptimport React from 'react';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
return (
<>
<StatusBar style="light" />
<AppNavigator />
</>
);
} 7) 임시 Screen 파일들 (빈 화면)
src/screens/TimeStop/SetupScreen.tsx:
typescriptimport React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { COLORS } from '../../constants/colors';

export default function SetupScreen() {
return (
<SafeAreaView style={styles.container}>
<View style={styles.content}>
<Text style={styles.text}>Time Stop - Setup</Text>
<Text style={styles.subtext}>플레이어 설정 화면 (구현 예정)</Text>
</View>
</SafeAreaView>
);
}

const styles = StyleSheet.create({
container: { flex: 1, backgroundColor: COLORS.background },
content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
text: { fontSize: 24, color: COLORS.text, marginBottom: 8 },
subtext: { fontSize: 14, color: COLORS.textSecondary },
});
나머지 파일들도 동일한 패턴으로 생성:
bash# 각 Screen 파일에 같은 템플릿 적용
src/screens/TimeStop/GameScreen.tsx:
typescriptimport React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { COLORS } from '../../constants/colors';

export default function GameScreen() {
return (
<SafeAreaView style={styles.container}>
<View style={styles.content}>
<Text style={styles.text}>Time Stop - Game</Text>
</View>
</SafeAreaView>
);
}

const styles = StyleSheet.create({
container: { flex: 1, backgroundColor: COLORS.background },
content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
text: { fontSize: 24, color: COLORS.text },
});
src/screens/TimeStop/ResultScreen.tsx:
typescriptimport React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { COLORS } from '../../constants/colors';

export default function ResultScreen() {
return (
<SafeAreaView style={styles.container}>
<View style={styles.content}>
<Text style={styles.text}>Time Stop - Result</Text>
</View>
</SafeAreaView>
);
}

const styles = StyleSheet.create({
container: { flex: 1, backgroundColor: COLORS.background },
content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
text: { fontSize: 24, color: COLORS.text },
});
src/screens/QuickTap/SetupScreen.tsx:
typescriptimport React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { COLORS } from '../../constants/colors';

export default function SetupScreen() {
return (
<SafeAreaView style={styles.container}>
<View style={styles.content}>
<Text style={styles.text}>Quick Tap - Setup</Text>
</View>
</SafeAreaView>
);
}

const styles = StyleSheet.create({
container: { flex: 1, backgroundColor: COLORS.background },
content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
text: { fontSize: 24, color: COLORS.text },
});
src/screens/QuickTap/GameScreen.tsx:
typescriptimport React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { COLORS } from '../../constants/colors';

export default function GameScreen() {
return (
<SafeAreaView style={styles.container}>
<View style={styles.content}>
<Text style={styles.text}>Quick Tap - Game</Text>
</View>
</SafeAreaView>
);
}

const styles = StyleSheet.create({
container: { flex: 1, backgroundColor: COLORS.background },
content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
text: { fontSize: 24, color: COLORS.text },
});
src/screens/QuickTap/ResultScreen.tsx:
typescriptimport React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { COLORS } from '../../constants/colors';

export default function ResultScreen() {
return (
<SafeAreaView style={styles.container}>
<View style={styles.content}>
<Text style={styles.text}>Quick Tap - Result</Text>
</View>
</SafeAreaView>
);
}

const styles = StyleSheet.create({
container: { flex: 1, backgroundColor: COLORS.background },
content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
text: { fontSize: 24, color: COLORS.text },
});

Step 6: 실행 확인
bashnpx expo start

```

iOS 시뮬레이터: `i` 키
Android 에뮬레이터: `a` 키

---

### ✅ 체크리스트

완료 후 확인할 것:

- [ ] 앱이 정상 실행되는가
- [ ] Home 화면이 보이는가
- [ ] Time Stop 버튼 → Setup 화면으로 이동하는가
- [ ] Quick Tap 버튼 → Setup 화면으로 이동하는가

---

### 📁 최종 폴더 구조
```

reflex-battle/
├── src/
│ ├── components/
│ │ ├── Button.tsx
│ │ ├── Timer.tsx
│ │ ├── PlayerInput.tsx
│ │ └── RankingList.tsx
│ ├── constants/
│ │ ├── colors.ts ✅
│ │ └── config.ts ✅
│ ├── hooks/
│ │ ├── useTimer.ts
│ │ └── useGameState.ts
│ ├── navigation/
│ │ └── AppNavigator.tsx ✅
│ ├── screens/
│ │ ├── HomeScreen.tsx ✅
│ │ ├── TimeStop/
│ │ │ ├── SetupScreen.tsx ✅
│ │ │ ├── GameScreen.tsx ✅
│ │ │ └── ResultScreen.tsx ✅
│ │ └── QuickTap/
│ │ ├── SetupScreen.tsx ✅
│ │ ├── GameScreen.tsx ✅
│ │ └── ResultScreen.tsx ✅
│ ├── types/
│ │ └── game.ts ✅
│ └── utils/
│ └── calculateScore.ts
├── App.tsx ✅
└── package.json
