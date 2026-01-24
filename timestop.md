📋 Step 2: Time Stop - Setup 화면 구현
구현할 기능
┌─────────────────────────────┐
│ ← TIME STOP 설정 │
├─────────────────────────────┤
│ │
│ 참가 인원 │
│ [ - ] 4명 [ + ] │
│ │
│ ┌─────────────────────┐ │
│ │ 👤 Player 1 │ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │ 👤 Player 2 │ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │ 👤 Player 3 │ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │ 👤 Player 4 │ │
│ └─────────────────────┘ │
│ │
│ 목표 시간 │
│ [ - ] 3.00초 [ + ] │
│ │
│ ┌───────────────────┐ │
│ │ 🎮 게임 시작 │ │
│ └───────────────────┘ │
└─────────────────────────────┘

1. 공통 Button 컴포넌트
   src/components/Button.tsx:
   typescriptimport React from 'react';
   import {
   TouchableOpacity,
   Text,
   StyleSheet,
   ViewStyle,
   TextStyle,
   } from 'react-native';
   import { COLORS } from '../constants/colors';

interface ButtonProps {
title: string;
onPress: () => void;
variant?: 'primary' | 'secondary' | 'outline';
size?: 'small' | 'medium' | 'large';
disabled?: boolean;
style?: ViewStyle;
textStyle?: TextStyle;
}

export default function Button({
title,
onPress,
variant = 'primary',
size = 'medium',
disabled = false,
style,
textStyle,
}: ButtonProps) {
return (
<TouchableOpacity
style={[
styles.button,
styles[variant],
styles[size],
disabled && styles.disabled,
style,
]}
onPress={onPress}
disabled={disabled}
activeOpacity={0.8} >
<Text
style={[
styles.text,
styles[`${variant}Text`],
styles[`${size}Text`],
textStyle,
]} >
{title}
</Text>
</TouchableOpacity>
);
}

const styles = StyleSheet.create({
button: {
borderRadius: 12,
alignItems: 'center',
justifyContent: 'center',
},
primary: {
backgroundColor: COLORS.primary,
},
secondary: {
backgroundColor: COLORS.surface,
},
outline: {
backgroundColor: 'transparent',
borderWidth: 2,
borderColor: COLORS.primary,
},
small: {
paddingVertical: 8,
paddingHorizontal: 16,
},
medium: {
paddingVertical: 14,
paddingHorizontal: 24,
},
large: {
paddingVertical: 18,
paddingHorizontal: 32,
},
disabled: {
opacity: 0.5,
},
text: {
fontWeight: '600',
},
primaryText: {
color: COLORS.text,
},
secondaryText: {
color: COLORS.text,
},
outlineText: {
color: COLORS.primary,
},
smallText: {
fontSize: 14,
},
mediumText: {
fontSize: 16,
},
largeText: {
fontSize: 18,
},
});

2. PlayerInput 컴포넌트
   src/components/PlayerInput.tsx:
   typescriptimport React from 'react';
   import { View, TextInput, StyleSheet } from 'react-native';
   import { COLORS } from '../constants/colors';

interface PlayerInputProps {
value: string;
onChangeText: (text: string) => void;
playerNumber: number;
}

export default function PlayerInput({
value,
onChangeText,
playerNumber,
}: PlayerInputProps) {
return (
<View style={styles.container}>
<TextInput
style={styles.input}
value={value}
onChangeText={onChangeText}
placeholder={`Player ${playerNumber}`}
placeholderTextColor={COLORS.textSecondary}
maxLength={12}
/>
</View>
);
}

const styles = StyleSheet.create({
container: {
marginBottom: 12,
},
input: {
backgroundColor: COLORS.surface,
borderRadius: 12,
paddingVertical: 14,
paddingHorizontal: 16,
fontSize: 16,
color: COLORS.text,
borderWidth: 1,
borderColor: COLORS.primary + '40',
},
});

3. NumberStepper 컴포넌트 (새로 생성)
   bashtouch src/components/NumberStepper.tsx
   src/components/NumberStepper.tsx:
   typescriptimport React from 'react';
   import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
   import { COLORS } from '../constants/colors';

interface NumberStepperProps {
value: number;
onIncrease: () => void;
onDecrease: () => void;
min: number;
max: number;
label: string;
unit?: string;
step?: number;
formatValue?: (value: number) => string;
}

export default function NumberStepper({
value,
onIncrease,
onDecrease,
min,
max,
label,
unit = '',
formatValue,
}: NumberStepperProps) {
const displayValue = formatValue ? formatValue(value) : `${value}`;

return (
<View style={styles.container}>
<Text style={styles.label}>{label}</Text>
<View style={styles.stepperContainer}>
<TouchableOpacity
style={[styles.button, value <= min && styles.buttonDisabled]}
onPress={onDecrease}
disabled={value <= min} >
<Text style={[styles.buttonText, value <= min && styles.buttonTextDisabled]}>
−
</Text>
</TouchableOpacity>

        <View style={styles.valueContainer}>
          <Text style={styles.value}>
            {displayValue}{unit}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.button, value >= max && styles.buttonDisabled]}
          onPress={onIncrease}
          disabled={value >= max}
        >
          <Text style={[styles.buttonText, value >= max && styles.buttonTextDisabled]}>
            +
          </Text>
        </TouchableOpacity>
      </View>
    </View>

);
}

const styles = StyleSheet.create({
container: {
marginBottom: 24,
},
label: {
fontSize: 16,
color: COLORS.textSecondary,
marginBottom: 12,
textAlign: 'center',
},
stepperContainer: {
flexDirection: 'row',
alignItems: 'center',
justifyContent: 'center',
gap: 16,
},
button: {
width: 48,
height: 48,
borderRadius: 24,
backgroundColor: COLORS.primary,
alignItems: 'center',
justifyContent: 'center',
},
buttonDisabled: {
backgroundColor: COLORS.surface,
},
buttonText: {
fontSize: 24,
color: COLORS.text,
fontWeight: 'bold',
},
buttonTextDisabled: {
color: COLORS.textSecondary,
},
valueContainer: {
minWidth: 100,
alignItems: 'center',
},
value: {
fontSize: 28,
color: COLORS.text,
fontWeight: 'bold',
},
});

4. Time Stop Setup 화면 구현
   src/screens/TimeStop/SetupScreen.tsx:
   typescriptimport React, { useState } from 'react';
   import {
   View,
   Text,
   StyleSheet,
   SafeAreaView,
   ScrollView,
   TouchableOpacity,
   KeyboardAvoidingView,
   Platform,
   } from 'react-native';
   import { NativeStackNavigationProp } from '@react-navigation/native-stack';
   import { RootStackParamList } from '../../navigation/AppNavigator';
   import { COLORS } from '../../constants/colors';
   import { CONFIG } from '../../constants/config';
   import { Player } from '../../types/game';
   import Button from '../../components/Button';
   import PlayerInput from '../../components/PlayerInput';
   import NumberStepper from '../../components/NumberStepper';

type SetupScreenProps = {
navigation: NativeStackNavigationProp<RootStackParamList, 'TimeStopSetup'>;
};

export default function SetupScreen({ navigation }: SetupScreenProps) {
const [playerCount, setPlayerCount] = useState(2);
const [playerNames, setPlayerNames] = useState<string[]>(
Array(CONFIG.MAX_PLAYERS).fill('')
);
const [targetTime, setTargetTime] = useState(CONFIG.DEFAULT_TARGET_TIME);

const handlePlayerCountIncrease = () => {
if (playerCount < CONFIG.MAX_PLAYERS) {
setPlayerCount(playerCount + 1);
}
};

const handlePlayerCountDecrease = () => {
if (playerCount > CONFIG.MIN_PLAYERS) {
setPlayerCount(playerCount - 1);
}
};

const handleTargetTimeIncrease = () => {
if (targetTime < CONFIG.MAX_TARGET_TIME) {
setTargetTime(Math.round((targetTime + 0.5) \* 10) / 10);
}
};

const handleTargetTimeDecrease = () => {
if (targetTime > CONFIG.MIN_TARGET_TIME) {
setTargetTime(Math.round((targetTime - 0.5) \* 10) / 10);
}
};

const handlePlayerNameChange = (index: number, name: string) => {
const newNames = [...playerNames];
newNames[index] = name;
setPlayerNames(newNames);
};

const handleStartGame = () => {
const players: Player[] = Array.from({ length: playerCount }, (\_, i) => ({
id: `player-${i + 1}`,
name: playerNames[i].trim() || `Player ${i + 1}`,
score: null,
}));

    navigation.navigate('TimeStopGame', {
      players,
      targetTime,
    });

};

return (
<SafeAreaView style={styles.container}>
<KeyboardAvoidingView
behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
style={styles.flex} >
{/_ Header _/}
<View style={styles.header}>
<TouchableOpacity
style={styles.backButton}
onPress={() => navigation.goBack()} >
<Text style={styles.backButtonText}>← 뒤로</Text>
</TouchableOpacity>
<Text style={styles.headerTitle}>🎯 TIME STOP</Text>
<View style={styles.headerSpacer} />
</View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* 참가 인원 설정 */}
          <NumberStepper
            label="참가 인원"
            value={playerCount}
            onIncrease={handlePlayerCountIncrease}
            onDecrease={handlePlayerCountDecrease}
            min={CONFIG.MIN_PLAYERS}
            max={CONFIG.MAX_PLAYERS}
            unit="명"
          />

          {/* 플레이어 이름 입력 */}
          <View style={styles.playerInputs}>
            <Text style={styles.sectionLabel}>플레이어 이름</Text>
            {Array.from({ length: playerCount }, (_, i) => (
              <PlayerInput
                key={i}
                playerNumber={i + 1}
                value={playerNames[i]}
                onChangeText={(text) => handlePlayerNameChange(i, text)}
              />
            ))}
          </View>

          {/* 목표 시간 설정 */}
          <NumberStepper
            label="목표 시간"
            value={targetTime}
            onIncrease={handleTargetTimeIncrease}
            onDecrease={handleTargetTimeDecrease}
            min={CONFIG.MIN_TARGET_TIME}
            max={CONFIG.MAX_TARGET_TIME}
            unit="초"
            formatValue={(v) => v.toFixed(1)}
          />

          {/* 게임 규칙 설명 */}
          <View style={styles.rulesContainer}>
            <Text style={styles.rulesTitle}>🎮 게임 방법</Text>
            <Text style={styles.rulesText}>
              1. 시작하면 0.00초부터 타이머가 올라갑니다{'\n'}
              2. 목표 시간에 최대한 가깝게 STOP!{'\n'}
              3. 목표 시간과의 오차가 가장 적은 사람이 승리!
            </Text>
          </View>
        </ScrollView>

        {/* 게임 시작 버튼 */}
        <View style={styles.footer}>
          <Button
            title="🎮 게임 시작"
            onPress={handleStartGame}
            size="large"
            style={styles.startButton}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>

);
}

const styles = StyleSheet.create({
container: {
flex: 1,
backgroundColor: COLORS.background,
},
flex: {
flex: 1,
},
header: {
flexDirection: 'row',
alignItems: 'center',
justifyContent: 'space-between',
paddingHorizontal: 16,
paddingVertical: 12,
borderBottomWidth: 1,
borderBottomColor: COLORS.surface,
},
backButton: {
padding: 8,
},
backButtonText: {
color: COLORS.primary,
fontSize: 16,
},
headerTitle: {
fontSize: 20,
fontWeight: 'bold',
color: COLORS.text,
},
headerSpacer: {
width: 60,
},
content: {
flex: 1,
},
contentContainer: {
padding: 24,
},
sectionLabel: {
fontSize: 16,
color: COLORS.textSecondary,
marginBottom: 12,
textAlign: 'center',
},
playerInputs: {
marginBottom: 24,
},
rulesContainer: {
backgroundColor: COLORS.surface,
borderRadius: 12,
padding: 16,
marginTop: 8,
},
rulesTitle: {
fontSize: 16,
fontWeight: 'bold',
color: COLORS.text,
marginBottom: 8,
},
rulesText: {
fontSize: 14,
color: COLORS.textSecondary,
lineHeight: 22,
},
footer: {
padding: 16,
paddingBottom: 24,
},
startButton: {
width: '100%',
},
});

5. 실행 확인
   bashnpx expo start

```

---

### ✅ 체크리스트

- [ ] Home → Time Stop 버튼 클릭 → Setup 화면 표시
- [ ] 참가 인원 +/- 버튼 동작 (2~8명)
- [ ] 플레이어 이름 입력 가능
- [ ] 목표 시간 +/- 버튼 동작 (1.0~10.0초)
- [ ] 뒤로 버튼으로 Home 복귀
- [ ] 게임 시작 버튼 클릭 (아직 Game 화면은 빈 화면)

---

### 📁 현재까지 완성된 파일
```

src/
├── components/
│ ├── Button.tsx ✅ NEW
│ ├── PlayerInput.tsx ✅ NEW
│ └── NumberStepper.tsx ✅ NEW
├── screens/
│ ├── HomeScreen.tsx ✅
│ └── TimeStop/
│ └── SetupScreen.tsx ✅ UPDATED
└── ...

📋 Step 3: Time Stop - Game 화면 구현
구현할 기능
┌─────────────────────────────┐
│ │
│ Player 1의 차례 │
│ │
│ 목표: 3.0초 │
│ │
│ ┌─────────────────────┐ │
│ │ │ │
│ │ 02.47 │ │
│ │ │ │
│ └─────────────────────┘ │
│ │
│ ┌─────────────────────┐ │
│ │ │ │
│ │ STOP │ │
│ │ │ │
│ └─────────────────────┘ │
│ │
│ 남은 플레이어: 3명 │
│ │
└─────────────────────────────┘

1. useTimer 훅 구현
   src/hooks/useTimer.ts:
   typescriptimport { useState, useRef, useCallback } from 'react';
   import { CONFIG } from '../constants/config';

interface UseTimerReturn {
time: number;
isRunning: boolean;
start: () => void;
stop: () => number;
reset: () => void;
}

export function useTimer(): UseTimerReturn {
const [time, setTime] = useState(0);
const [isRunning, setIsRunning] = useState(false);
const startTimeRef = useRef<number>(0);
const intervalRef = useRef<NodeJS.Timeout | null>(null);

const start = useCallback(() => {
if (isRunning) return;

    setIsRunning(true);
    startTimeRef.current = Date.now();

    intervalRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      setTime(elapsed);
    }, CONFIG.TIMER_INTERVAL);

}, [isRunning]);

const stop = useCallback((): number => {
if (intervalRef.current) {
clearInterval(intervalRef.current);
intervalRef.current = null;
}

    const finalTime = (Date.now() - startTimeRef.current) / 1000;
    setTime(finalTime);
    setIsRunning(false);

    return finalTime;

}, []);

const reset = useCallback(() => {
if (intervalRef.current) {
clearInterval(intervalRef.current);
intervalRef.current = null;
}
setTime(0);
setIsRunning(false);
}, []);

return { time, isRunning, start, stop, reset };
}

2. Timer 표시 컴포넌트
   src/components/Timer.tsx:
   typescriptimport React from 'react';
   import { View, Text, StyleSheet } from 'react-native';
   import { COLORS } from '../constants/colors';

interface TimerProps {
time: number;
size?: 'medium' | 'large';
}

export default function Timer({ time, size = 'large' }: TimerProps) {
const formatTime = (seconds: number): string => {
const mins = Math.floor(seconds / 60);
const secs = seconds % 60;

    if (mins > 0) {
      return `${mins}:${secs.toFixed(2).padStart(5, '0')}`;
    }
    return secs.toFixed(2);

};

return (
<View style={styles.container}>
<Text style={[styles.time, size === 'large' ? styles.large : styles.medium]}>
{formatTime(time)}
</Text>
</View>
);
}

const styles = StyleSheet.create({
container: {
alignItems: 'center',
justifyContent: 'center',
padding: 24,
},
time: {
fontWeight: 'bold',
color: COLORS.text,
fontVariant: ['tabular-nums'], // 숫자 폭 고정
},
large: {
fontSize: 72,
},
medium: {
fontSize: 48,
},
});

3. StopButton 컴포넌트 (큰 원형 버튼)
   bashtouch src/components/StopButton.tsx
   src/components/StopButton.tsx:
   typescriptimport React from 'react';
   import { TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
   import { COLORS } from '../constants/colors';

interface StopButtonProps {
onPress: () => void;
disabled?: boolean;
label?: string;
}

export default function StopButton({
onPress,
disabled = false,
label = 'STOP'
}: StopButtonProps) {
return (
<TouchableOpacity
style={[styles.button, disabled && styles.disabled]}
onPress={onPress}
disabled={disabled}
activeOpacity={0.8} >
<Text style={styles.text}>{label}</Text>
</TouchableOpacity>
);
}

const styles = StyleSheet.create({
button: {
width: 180,
height: 180,
borderRadius: 90,
backgroundColor: COLORS.danger,
alignItems: 'center',
justifyContent: 'center',
shadowColor: COLORS.danger,
shadowOffset: { width: 0, height: 4 },
shadowOpacity: 0.5,
shadowRadius: 12,
elevation: 8,
},
disabled: {
backgroundColor: COLORS.surface,
shadowOpacity: 0,
},
text: {
fontSize: 32,
fontWeight: 'bold',
color: COLORS.text,
},
});

4. Time Stop Game 화면 구현
   src/screens/TimeStop/GameScreen.tsx:
   typescriptimport React, { useState, useEffect, useCallback } from 'react';
   import {
   View,
   Text,
   StyleSheet,
   SafeAreaView,
   Alert,
   } from 'react-native';
   import { NativeStackNavigationProp } from '@react-navigation/native-stack';
   import { RouteProp } from '@react-navigation/native';
   import { RootStackParamList } from '../../navigation/AppNavigator';
   import { COLORS } from '../../constants/colors';
   import { Player } from '../../types/game';
   import { useTimer } from '../../hooks/useTimer';
   import Timer from '../../components/Timer';
   import StopButton from '../../components/StopButton';
   import Button from '../../components/Button';

type GameScreenProps = {
navigation: NativeStackNavigationProp<RootStackParamList, 'TimeStopGame'>;
route: RouteProp<RootStackParamList, 'TimeStopGame'>;
};

type GamePhase = 'ready' | 'playing' | 'stopped';

export default function GameScreen({ navigation, route }: GameScreenProps) {
const { players: initialPlayers, targetTime } = route.params;

const [players, setPlayers] = useState<Player[]>(initialPlayers);
const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
const [gamePhase, setGamePhase] = useState<GamePhase>('ready');
const [stoppedTime, setStoppedTime] = useState<number | null>(null);

const { time, isRunning, start, stop, reset } = useTimer();

const currentPlayer = players[currentPlayerIndex];
const remainingPlayers = players.length - currentPlayerIndex;
const isLastPlayer = currentPlayerIndex === players.length - 1;

// 게임 시작
const handleStart = useCallback(() => {
setGamePhase('playing');
start();
}, [start]);

// STOP 버튼 클릭
const handleStop = useCallback(() => {
if (gamePhase !== 'playing') return;

    const finalTime = stop();
    const roundedTime = Math.round(finalTime * 100) / 100;
    setStoppedTime(roundedTime);
    setGamePhase('stopped');

    // 현재 플레이어 점수 저장 (오차값)
    const score = Math.abs(targetTime - roundedTime);
    setPlayers(prevPlayers => {
      const newPlayers = [...prevPlayers];
      newPlayers[currentPlayerIndex] = {
        ...newPlayers[currentPlayerIndex],
        score: Math.round(score * 100) / 100,
      };
      return newPlayers;
    });

}, [gamePhase, stop, targetTime, currentPlayerIndex]);

// 다음 플레이어로
const handleNext = useCallback(() => {
if (isLastPlayer) {
// 모든 플레이어 완료 → 결과 화면으로
const updatedPlayers = [...players];
updatedPlayers[currentPlayerIndex] = {
...updatedPlayers[currentPlayerIndex],
score: stoppedTime !== null
? Math.round(Math.abs(targetTime - stoppedTime) \* 100) / 100
: 999,
};

      navigation.replace('TimeStopResult', {
        players: updatedPlayers,
        targetTime,
      });
    } else {
      // 다음 플레이어
      setCurrentPlayerIndex(prev => prev + 1);
      setGamePhase('ready');
      setStoppedTime(null);
      reset();
    }

}, [isLastPlayer, players, currentPlayerIndex, stoppedTime, targetTime, navigation, reset]);

// 오차 계산
const calculateDifference = (): string => {
if (stoppedTime === null) return '';
const diff = stoppedTime - targetTime;
const sign = diff >= 0 ? '+' : '';
return `${sign}${diff.toFixed(2)}초`;
};

return (
<SafeAreaView style={styles.container}>
<View style={styles.content}>
{/_ 현재 플레이어 정보 _/}
<View style={styles.header}>
<Text style={styles.playerTurn}>{currentPlayer.name}의 차례</Text>
<Text style={styles.targetTime}>목표: {targetTime.toFixed(1)}초</Text>
</View>

        {/* 타이머 */}
        <View style={styles.timerContainer}>
          <Timer time={gamePhase === 'stopped' && stoppedTime !== null ? stoppedTime : time} />

          {/* 결과 표시 (STOP 후) */}
          {gamePhase === 'stopped' && stoppedTime !== null && (
            <View style={styles.resultContainer}>
              <Text style={[
                styles.difference,
                Math.abs(stoppedTime - targetTime) < 0.1
                  ? styles.excellent
                  : Math.abs(stoppedTime - targetTime) < 0.3
                    ? styles.good
                    : styles.normal
              ]}>
                {calculateDifference()}
              </Text>
              <Text style={styles.differenceLabel}>
                오차: {Math.abs(stoppedTime - targetTime).toFixed(2)}초
              </Text>
            </View>
          )}
        </View>

        {/* 버튼 영역 */}
        <View style={styles.buttonContainer}>
          {gamePhase === 'ready' && (
            <StopButton onPress={handleStart} label="START" />
          )}

          {gamePhase === 'playing' && (
            <StopButton onPress={handleStop} label="STOP" />
          )}

          {gamePhase === 'stopped' && (
            <Button
              title={isLastPlayer ? '🏆 결과 보기' : `다음 플레이어 →`}
              onPress={handleNext}
              size="large"
              style={styles.nextButton}
            />
          )}
        </View>

        {/* 하단 정보 */}
        <View style={styles.footer}>
          <Text style={styles.remainingText}>
            남은 플레이어: {remainingPlayers}명
          </Text>
          <View style={styles.progressDots}>
            {players.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index < currentPlayerIndex && styles.dotComplete,
                  index === currentPlayerIndex && styles.dotCurrent,
                ]}
              />
            ))}
          </View>
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
justifyContent: 'space-between',
padding: 24,
},
header: {
alignItems: 'center',
paddingTop: 20,
},
playerTurn: {
fontSize: 28,
fontWeight: 'bold',
color: COLORS.text,
marginBottom: 8,
},
targetTime: {
fontSize: 18,
color: COLORS.primary,
fontWeight: '600',
},
timerContainer: {
flex: 1,
justifyContent: 'center',
alignItems: 'center',
},
resultContainer: {
alignItems: 'center',
marginTop: 16,
},
difference: {
fontSize: 24,
fontWeight: 'bold',
marginBottom: 4,
},
excellent: {
color: COLORS.success,
},
good: {
color: COLORS.warning,
},
normal: {
color: COLORS.danger,
},
differenceLabel: {
fontSize: 16,
color: COLORS.textSecondary,
},
buttonContainer: {
alignItems: 'center',
paddingVertical: 32,
},
nextButton: {
minWidth: 200,
},
footer: {
alignItems: 'center',
paddingBottom: 20,
},
remainingText: {
fontSize: 14,
color: COLORS.textSecondary,
marginBottom: 12,
},
progressDots: {
flexDirection: 'row',
gap: 8,
},
dot: {
width: 10,
height: 10,
borderRadius: 5,
backgroundColor: COLORS.surface,
},
dotComplete: {
backgroundColor: COLORS.success,
},
dotCurrent: {
backgroundColor: COLORS.primary,
},
});

5. START 버튼 스타일 추가
   src/components/StopButton.tsx 수정 - START일 때 색상 변경:
   typescriptimport React from 'react';
   import { TouchableOpacity, Text, StyleSheet } from 'react-native';
   import { COLORS } from '../constants/colors';

interface StopButtonProps {
onPress: () => void;
disabled?: boolean;
label?: string;
}

export default function StopButton({
onPress,
disabled = false,
label = 'STOP'
}: StopButtonProps) {
const isStart = label === 'START';

return (
<TouchableOpacity
style={[
styles.button,
isStart && styles.startButton,
disabled && styles.disabled
]}
onPress={onPress}
disabled={disabled}
activeOpacity={0.8} >
<Text style={styles.text}>{label}</Text>
</TouchableOpacity>
);
}

const styles = StyleSheet.create({
button: {
width: 180,
height: 180,
borderRadius: 90,
backgroundColor: COLORS.danger,
alignItems: 'center',
justifyContent: 'center',
shadowColor: COLORS.danger,
shadowOffset: { width: 0, height: 4 },
shadowOpacity: 0.5,
shadowRadius: 12,
elevation: 8,
},
startButton: {
backgroundColor: COLORS.success,
shadowColor: COLORS.success,
},
disabled: {
backgroundColor: COLORS.surface,
shadowOpacity: 0,
},
text: {
fontSize: 32,
fontWeight: 'bold',
color: COLORS.text,
},
});

6. 실행 확인
   bashnpx expo start

```

---

### ✅ 체크리스트

- [ ] Setup에서 게임 시작 → Game 화면 표시
- [ ] 현재 플레이어 이름 표시
- [ ] 목표 시간 표시
- [ ] START 버튼 (초록색) 클릭 → 타이머 시작
- [ ] 타이머가 0.00부터 올라감
- [ ] STOP 버튼 (빨간색) 클릭 → 타이머 멈춤
- [ ] 오차 표시 (+0.15초 등)
- [ ] 다음 플레이어 버튼 → 다음 플레이어로 전환
- [ ] 마지막 플레이어 → "결과 보기" 버튼 표시
- [ ] 하단 진행 dots 업데이트

---

### 📁 현재까지 완성된 파일
```

src/
├── components/
│ ├── Button.tsx ✅
│ ├── PlayerInput.tsx ✅
│ ├── NumberStepper.tsx ✅
│ ├── Timer.tsx ✅ NEW
│ └── StopButton.tsx ✅ NEW
├── hooks/
│ └── useTimer.ts ✅ NEW
├── screens/
│ ├── HomeScreen.tsx ✅
│ └── TimeStop/
│ ├── SetupScreen.tsx ✅
│ └── GameScreen.tsx ✅ NEW
└── ...

📋 Step 4: Time Stop - Result 화면 구현
구현할 기능
┌─────────────────────────────┐
│ 🏆 결과 🏆 │
├─────────────────────────────┤
│ │
│ 목표 시간: 3.0초 │
│ │
│ ┌─────────────────────┐ │
│ │ 🥇 1등 Player 2 │ │
│ │ 2.98초 (오차 0.02)│ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │ 🥈 2등 Player 1 │ │
│ │ 3.15초 (오차 0.15)│ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │ 🥉 3등 Player 3 │ │
│ │ 2.67초 (오차 0.33)│ │
│ └─────────────────────┘ │
│ │
│ ┌───────────────────┐ │
│ │ 🔄 다시하기 │ │
│ └───────────────────┘ │
│ ┌───────────────────┐ │
│ │ 🏠 홈으로 │ │
│ └───────────────────┘ │
│ ┌───────────────────┐ │
│ │ 📤 공유하기 │ │
│ └───────────────────┘ │
└─────────────────────────────┘

1. 점수 계산 유틸리티
   src/utils/calculateScore.ts:
   typescriptimport { Player } from '../types/game';

export interface RankedPlayer extends Player {
rank: number;
actualTime: number; // 실제 멈춘 시간
}

/\*\*

- 플레이어들을 오차 기준으로 정렬하고 순위 부여
  \*/
  export function rankPlayers(players: Player[], targetTime: number): RankedPlayer[] {
  // 오차(score)가 적은 순으로 정렬
  const sorted = [...players].sort((a, b) => {
  const scoreA = a.score ?? 999;
  const scoreB = b.score ?? 999;
  return scoreA - scoreB;
  });

// 순위 부여 (동점 처리 포함)
let currentRank = 1;
return sorted.map((player, index) => {
if (index > 0 && player.score !== sorted[index - 1].score) {
currentRank = index + 1;
}

    // 실제 멈춘 시간 계산 (목표시간 + 오차 또는 목표시간 - 오차)
    // score는 절대값이므로 원래 시간을 정확히 알 수 없지만,
    // 여기서는 대략적인 표시를 위해 계산
    const actualTime = targetTime + (player.score ?? 0);

    return {
      ...player,
      rank: currentRank,
      actualTime: Math.round(actualTime * 100) / 100,
    };

});
}

/\*\*

- 순위에 따른 메달 이모지 반환
  \*/
  export function getRankEmoji(rank: number): string {
  switch (rank) {
  case 1:
  return '🥇';
  case 2:
  return '🥈';
  case 3:
  return '🥉';
  default:
  return `${rank}등`;
  }
  }

/\*\*

- 순위에 따른 메달 텍스트 반환
  \*/
  export function getRankText(rank: number): string {
  switch (rank) {
  case 1:
  return '1등';
  case 2:
  return '2등';
  case 3:
  return '3등';
  default:
  return `${rank}등`;
  }
  }

/\*\*

- 결과 공유용 텍스트 생성
  \*/
  export function generateShareText(
  rankedPlayers: RankedPlayer[],
  targetTime: number,
  gameMode: 'timeStop' | 'quickTap'
  ): string {
  const modeText = gameMode === 'timeStop' ? '⏱️ TIME STOP' : '⚡ QUICK TAP';
  const targetText = gameMode === 'timeStop' ? `목표: ${targetTime.toFixed(1)}초` : '';

let text = `🎮 Reflex Battle 결과\n${modeText}\n${targetText}\n\n`;

rankedPlayers.forEach((player) => {
const emoji = getRankEmoji(player.rank);
const scoreText = gameMode === 'timeStop'
? `오차 ${player.score?.toFixed(2)}초`
: `${player.score?.toFixed(3)}초`;
text += `${emoji} ${player.name}: ${scoreText}\n`;
});

text += '\n🔥 나도 도전하기!\n#ReflexBattle #반응속도';

return text;
}

2. RankingList 컴포넌트
   src/components/RankingList.tsx:
   typescriptimport React from 'react';
   import { View, Text, StyleSheet } from 'react-native';
   import { COLORS } from '../constants/colors';
   import { RankedPlayer, getRankEmoji } from '../utils/calculateScore';

interface RankingListProps {
players: RankedPlayer[];
targetTime: number;
gameMode?: 'timeStop' | 'quickTap';
}

export default function RankingList({
players,
targetTime,
gameMode = 'timeStop'
}: RankingListProps) {
const getRankStyle = (rank: number) => {
switch (rank) {
case 1:
return styles.gold;
case 2:
return styles.silver;
case 3:
return styles.bronze;
default:
return styles.default;
}
};

const getRankBorderStyle = (rank: number) => {
switch (rank) {
case 1:
return styles.goldBorder;
case 2:
return styles.silverBorder;
case 3:
return styles.bronzeBorder;
default:
return styles.defaultBorder;
}
};

return (
<View style={styles.container}>
{players.map((player, index) => (
<View
key={player.id}
style={[
styles.playerCard,
getRankBorderStyle(player.rank),
index === 0 && styles.firstPlace,
]} >
<View style={styles.rankContainer}>
<Text style={[styles.rankEmoji, player.rank <= 3 && styles.rankEmojiLarge]}>
{getRankEmoji(player.rank)}
</Text>
</View>

          <View style={styles.playerInfo}>
            <Text style={[styles.playerName, getRankStyle(player.rank)]}>
              {player.name}
            </Text>
            <Text style={styles.playerScore}>
              {gameMode === 'timeStop' ? (
                <>오차: {player.score?.toFixed(2)}초</>
              ) : (
                <>{player.score?.toFixed(3)}초</>
              )}
            </Text>
          </View>

          {gameMode === 'timeStop' && (
            <View style={styles.timeInfo}>
              <Text style={styles.actualTime}>
                {(targetTime + (player.score ?? 0)).toFixed(2)}초
              </Text>
            </View>
          )}
        </View>
      ))}
    </View>

);
}

const styles = StyleSheet.create({
container: {
gap: 12,
},
playerCard: {
flexDirection: 'row',
alignItems: 'center',
backgroundColor: COLORS.surface,
borderRadius: 12,
padding: 16,
borderWidth: 2,
borderColor: 'transparent',
},
firstPlace: {
paddingVertical: 20,
},
goldBorder: {
borderColor: COLORS.gold,
backgroundColor: COLORS.gold + '15',
},
silverBorder: {
borderColor: COLORS.silver,
backgroundColor: COLORS.silver + '10',
},
bronzeBorder: {
borderColor: COLORS.bronze,
backgroundColor: COLORS.bronze + '10',
},
defaultBorder: {
borderColor: COLORS.surface,
},
rankContainer: {
width: 50,
alignItems: 'center',
},
rankEmoji: {
fontSize: 24,
},
rankEmojiLarge: {
fontSize: 32,
},
playerInfo: {
flex: 1,
marginLeft: 12,
},
playerName: {
fontSize: 18,
fontWeight: 'bold',
color: COLORS.text,
marginBottom: 4,
},
gold: {
color: COLORS.gold,
},
silver: {
color: COLORS.silver,
},
bronze: {
color: COLORS.bronze,
},
default: {
color: COLORS.text,
},
playerScore: {
fontSize: 14,
color: COLORS.textSecondary,
},
timeInfo: {
alignItems: 'flex-end',
},
actualTime: {
fontSize: 16,
fontWeight: '600',
color: COLORS.primary,
},
});

3. Time Stop Result 화면 구현
   src/screens/TimeStop/ResultScreen.tsx:
   typescriptimport React, { useMemo } from 'react';
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

type ResultScreenProps = {
navigation: NativeStackNavigationProp<RootStackParamList, 'TimeStopResult'>;
route: RouteProp<RootStackParamList, 'TimeStopResult'>;
};

export default function ResultScreen({ navigation, route }: ResultScreenProps) {
const { players, targetTime } = route.params;

// 플레이어 순위 계산
const rankedPlayers = useMemo(() => {
return rankPlayers(players, targetTime);
}, [players, targetTime]);

// 우승자
const winner = rankedPlayers[0];

// 다시하기
const handlePlayAgain = () => {
// 같은 플레이어로 다시 시작
const resetPlayers = players.map(p => ({ ...p, score: null }));
navigation.replace('TimeStopGame', {
players: resetPlayers,
targetTime,
});
};

// 홈으로
const handleGoHome = () => {
navigation.popToTop();
};

// 공유하기
const handleShare = async () => {
try {
const shareText = generateShareText(rankedPlayers, targetTime, 'timeStop');

      const result = await Share.share({
        message: shareText,
      });

      if (result.action === Share.sharedAction) {
        // 공유 완료
      }
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
    </SafeAreaView>

);
}

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
paddingBottom: 24,
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

4. 실행 확인
   bashnpx expo start

```

---

### ✅ 체크리스트

- [ ] 게임 완료 후 Result 화면 표시
- [ ] 목표 시간 표시
- [ ] 우승자 하이라이트 섹션 표시
- [ ] 전체 순위 리스트 (1등~꼴등)
- [ ] 1, 2, 3등 메달 이모지 및 색상 구분
- [ ] 각 플레이어의 오차 표시
- [ ] "다시하기" → 같은 플레이어로 Game 화면 재시작
- [ ] "홈으로" → Home 화면으로 이동
- [ ] "공유" → 시스템 공유 시트 열림

---

### 📁 현재까지 완성된 파일
```

src/
├── components/
│ ├── Button.tsx ✅
│ ├── PlayerInput.tsx ✅
│ ├── NumberStepper.tsx ✅
│ ├── Timer.tsx ✅
│ ├── StopButton.tsx ✅
│ └── RankingList.tsx ✅ NEW
├── hooks/
│ └── useTimer.ts ✅
├── utils/
│ └── calculateScore.ts ✅ NEW
├── screens/
│ ├── HomeScreen.tsx ✅
│ └── TimeStop/
│ ├── SetupScreen.tsx ✅
│ ├── GameScreen.tsx ✅
│ └── ResultScreen.tsx ✅ NEW
└── ...

```

---

### 🎮 Time Stop 모드 완성!
```

HOME → Setup → Game → Result → (다시하기/홈으로)
✅ ✅ ✅ ✅

📋 Step 5: Quick Tap 모드 구현
구현할 기능
┌─────────────────────────────┐
│ Player 1의 차례 │
├─────────────────────────────┤
│ │
│ 준비하세요... │
│ │
│ ┌─────────────┐ │
│ │ │ │
│ │ 🔴 │ ← 대기 │
│ │ │ │
│ └─────────────┘ │
│ │
└─────────────────────────────┘

        ↓ 랜덤 1~5초 후 ↓

┌─────────────────────────────┐
│ Player 1의 차례 │
├─────────────────────────────┤
│ │
│ 지금! │
│ │
│ ┌─────────────┐ │
│ │ │ │
│ │ 🟢 │ ← 탭! │
│ │ │ │
│ └─────────────┘ │
│ │
│ 0.234초 │
└─────────────────────────────┘

1. Quick Tap Setup 화면
   src/screens/QuickTap/SetupScreen.tsx:
   typescriptimport React, { useState } from 'react';
   import {
   View,
   Text,
   StyleSheet,
   SafeAreaView,
   ScrollView,
   TouchableOpacity,
   KeyboardAvoidingView,
   Platform,
   } from 'react-native';
   import { NativeStackNavigationProp } from '@react-navigation/native-stack';
   import { RootStackParamList } from '../../navigation/AppNavigator';
   import { COLORS } from '../../constants/colors';
   import { CONFIG } from '../../constants/config';
   import { Player } from '../../types/game';
   import Button from '../../components/Button';
   import PlayerInput from '../../components/PlayerInput';
   import NumberStepper from '../../components/NumberStepper';

type SetupScreenProps = {
navigation: NativeStackNavigationProp<RootStackParamList, 'QuickTapSetup'>;
};

export default function SetupScreen({ navigation }: SetupScreenProps) {
const [playerCount, setPlayerCount] = useState(2);
const [playerNames, setPlayerNames] = useState<string[]>(
Array(CONFIG.MAX_PLAYERS).fill('')
);

const handlePlayerCountIncrease = () => {
if (playerCount < CONFIG.MAX_PLAYERS) {
setPlayerCount(playerCount + 1);
}
};

const handlePlayerCountDecrease = () => {
if (playerCount > CONFIG.MIN_PLAYERS) {
setPlayerCount(playerCount - 1);
}
};

const handlePlayerNameChange = (index: number, name: string) => {
const newNames = [...playerNames];
newNames[index] = name;
setPlayerNames(newNames);
};

const handleStartGame = () => {
const players: Player[] = Array.from({ length: playerCount }, (\_, i) => ({
id: `player-${i + 1}`,
name: playerNames[i].trim() || `Player ${i + 1}`,
score: null,
}));

    navigation.navigate('QuickTapGame', { players });

};

return (
<SafeAreaView style={styles.container}>
<KeyboardAvoidingView
behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
style={styles.flex} >
{/_ Header _/}
<View style={styles.header}>
<TouchableOpacity
style={styles.backButton}
onPress={() => navigation.goBack()} >
<Text style={styles.backButtonText}>← 뒤로</Text>
</TouchableOpacity>
<Text style={styles.headerTitle}>⚡ QUICK TAP</Text>
<View style={styles.headerSpacer} />
</View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* 참가 인원 설정 */}
          <NumberStepper
            label="참가 인원"
            value={playerCount}
            onIncrease={handlePlayerCountIncrease}
            onDecrease={handlePlayerCountDecrease}
            min={CONFIG.MIN_PLAYERS}
            max={CONFIG.MAX_PLAYERS}
            unit="명"
          />

          {/* 플레이어 이름 입력 */}
          <View style={styles.playerInputs}>
            <Text style={styles.sectionLabel}>플레이어 이름</Text>
            {Array.from({ length: playerCount }, (_, i) => (
              <PlayerInput
                key={i}
                playerNumber={i + 1}
                value={playerNames[i]}
                onChangeText={(text) => handlePlayerNameChange(i, text)}
              />
            ))}
          </View>

          {/* 게임 규칙 설명 */}
          <View style={styles.rulesContainer}>
            <Text style={styles.rulesTitle}>🎮 게임 방법</Text>
            <Text style={styles.rulesText}>
              1. 화면이 빨간색일 때 기다리세요{'\n'}
              2. 초록색으로 바뀌면 최대한 빨리 탭!{'\n'}
              3. 반응 시간이 가장 빠른 사람이 승리!{'\n'}
              ⚠️ 초록색 전에 탭하면 실격!
            </Text>
          </View>
        </ScrollView>

        {/* 게임 시작 버튼 */}
        <View style={styles.footer}>
          <Button
            title="🎮 게임 시작"
            onPress={handleStartGame}
            size="large"
            style={styles.startButton}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>

);
}

const styles = StyleSheet.create({
container: {
flex: 1,
backgroundColor: COLORS.background,
},
flex: {
flex: 1,
},
header: {
flexDirection: 'row',
alignItems: 'center',
justifyContent: 'space-between',
paddingHorizontal: 16,
paddingVertical: 12,
borderBottomWidth: 1,
borderBottomColor: COLORS.surface,
},
backButton: {
padding: 8,
},
backButtonText: {
color: COLORS.primary,
fontSize: 16,
},
headerTitle: {
fontSize: 20,
fontWeight: 'bold',
color: COLORS.text,
},
headerSpacer: {
width: 60,
},
content: {
flex: 1,
},
contentContainer: {
padding: 24,
},
sectionLabel: {
fontSize: 16,
color: COLORS.textSecondary,
marginBottom: 12,
textAlign: 'center',
},
playerInputs: {
marginBottom: 24,
},
rulesContainer: {
backgroundColor: COLORS.surface,
borderRadius: 12,
padding: 16,
marginTop: 8,
},
rulesTitle: {
fontSize: 16,
fontWeight: 'bold',
color: COLORS.text,
marginBottom: 8,
},
rulesText: {
fontSize: 14,
color: COLORS.textSecondary,
lineHeight: 22,
},
footer: {
padding: 16,
paddingBottom: 24,
},
startButton: {
width: '100%',
},
});

2. TapArea 컴포넌트 (큰 탭 영역)
   bashtouch src/components/TapArea.tsx
   src/components/TapArea.tsx:
   typescriptimport React from 'react';
   import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
   import { COLORS } from '../constants/colors';

type TapAreaState = 'waiting' | 'ready' | 'go' | 'tooEarly' | 'result';

interface TapAreaProps {
state: TapAreaState;
onTap: () => void;
reactionTime?: number;
disabled?: boolean;
}

export default function TapArea({
state,
onTap,
reactionTime,
disabled = false
}: TapAreaProps) {
const getBackgroundColor = () => {
switch (state) {
case 'waiting':
return COLORS.surface;
case 'ready':
return COLORS.danger;
case 'go':
return COLORS.success;
case 'tooEarly':
return COLORS.warning;
case 'result':
return COLORS.primary;
default:
return COLORS.surface;
}
};

const getMessage = () => {
switch (state) {
case 'waiting':
return { main: '준비', sub: '화면을 탭해서 시작' };
case 'ready':
return { main: '기다려...', sub: '초록색이 될 때까지' };
case 'go':
return { main: '탭!', sub: '지금!' };
case 'tooEarly':
return { main: '너무 빨랐어요! 😅', sub: '초록색이 될 때까지 기다리세요' };
case 'result':
return {
main: `${reactionTime?.toFixed(3)}초`,
sub: '반응 시간'
};
default:
return { main: '', sub: '' };
}
};

const message = getMessage();

return (
<TouchableOpacity
style={[styles.container, { backgroundColor: getBackgroundColor() }]}
onPress={onTap}
disabled={disabled}
activeOpacity={0.9} >
<View style={styles.content}>
<Text style={styles.mainText}>{message.main}</Text>
<Text style={styles.subText}>{message.sub}</Text>
</View>
</TouchableOpacity>
);
}

const styles = StyleSheet.create({
container: {
flex: 1,
borderRadius: 24,
justifyContent: 'center',
alignItems: 'center',
margin: 16,
},
content: {
alignItems: 'center',
},
mainText: {
fontSize: 48,
fontWeight: 'bold',
color: COLORS.text,
marginBottom: 8,
},
subText: {
fontSize: 18,
color: COLORS.text,
opacity: 0.8,
},
});

3. Quick Tap Game 화면
   src/screens/QuickTap/GameScreen.tsx:
   typescriptimport React, { useState, useEffect, useRef, useCallback } from 'react';
   import {
   View,
   Text,
   StyleSheet,
   SafeAreaView,
   } from 'react-native';
   import { NativeStackNavigationProp } from '@react-navigation/native-stack';
   import { RouteProp } from '@react-navigation/native';
   import { RootStackParamList } from '../../navigation/AppNavigator';
   import { COLORS } from '../../constants/colors';
   import { CONFIG } from '../../constants/config';
   import { Player } from '../../types/game';
   import TapArea from '../../components/TapArea';
   import Button from '../../components/Button';

type GameScreenProps = {
navigation: NativeStackNavigationProp<RootStackParamList, 'QuickTapGame'>;
route: RouteProp<RootStackParamList, 'QuickTapGame'>;
};

type GamePhase = 'waiting' | 'ready' | 'go' | 'tooEarly' | 'result';

export default function GameScreen({ navigation, route }: GameScreenProps) {
const { players: initialPlayers } = route.params;

const [players, setPlayers] = useState<Player[]>(initialPlayers);
const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
const [gamePhase, setGamePhase] = useState<GamePhase>('waiting');
const [reactionTime, setReactionTime] = useState<number | null>(null);

const goTimeRef = useRef<number>(0);
const timeoutRef = useRef<NodeJS.Timeout | null>(null);

const currentPlayer = players[currentPlayerIndex];
const remainingPlayers = players.length - currentPlayerIndex;
const isLastPlayer = currentPlayerIndex === players.length - 1;

// 클린업
useEffect(() => {
return () => {
if (timeoutRef.current) {
clearTimeout(timeoutRef.current);
}
};
}, []);

// 게임 시작 (대기 → 준비)
const startRound = useCallback(() => {
setGamePhase('ready');
setReactionTime(null);

    // 랜덤 대기 시간 후 GO!
    const delay = Math.random() *
      (CONFIG.QUICK_TAP_MAX_DELAY - CONFIG.QUICK_TAP_MIN_DELAY) +
      CONFIG.QUICK_TAP_MIN_DELAY;

    timeoutRef.current = setTimeout(() => {
      setGamePhase('go');
      goTimeRef.current = Date.now();
    }, delay);

}, []);

// 탭 핸들러
const handleTap = useCallback(() => {
switch (gamePhase) {
case 'waiting':
// 게임 시작
startRound();
break;

      case 'ready':
        // 너무 빨리 탭함!
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        setGamePhase('tooEarly');
        break;

      case 'go':
        // 정상 탭! 반응시간 측정
        const reaction = (Date.now() - goTimeRef.current) / 1000;
        setReactionTime(reaction);
        setGamePhase('result');

        // 현재 플레이어 점수 저장
        setPlayers(prevPlayers => {
          const newPlayers = [...prevPlayers];
          newPlayers[currentPlayerIndex] = {
            ...newPlayers[currentPlayerIndex],
            score: Math.round(reaction * 1000) / 1000,
          };
          return newPlayers;
        });
        break;

      case 'tooEarly':
        // 다시 시도
        setGamePhase('waiting');
        break;

      default:
        break;
    }

}, [gamePhase, startRound, currentPlayerIndex]);

// 다음 플레이어로
const handleNext = useCallback(() => {
if (isLastPlayer) {
// 모든 플레이어 완료 → 결과 화면으로
navigation.replace('QuickTapResult', { players });
} else {
// 다음 플레이어
setCurrentPlayerIndex(prev => prev + 1);
setGamePhase('waiting');
setReactionTime(null);
}
}, [isLastPlayer, players, navigation]);

// 반응 시간 평가
const getReactionFeedback = () => {
if (reactionTime === null) return '';
if (reactionTime < 0.2) return '⚡ 번개 반응!';
if (reactionTime < 0.25) return '🔥 매우 빠름!';
if (reactionTime < 0.3) return '👍 좋아요!';
if (reactionTime < 0.4) return '😊 평균';
return '🐢 조금 느려요';
};

return (
<SafeAreaView style={styles.container}>
{/_ 상단 정보 _/}
<View style={styles.header}>
<Text style={styles.playerTurn}>{currentPlayer.name}의 차례</Text>
<View style={styles.progressDots}>
{players.map((\_, index) => (
<View
key={index}
style={[
styles.dot,
index < currentPlayerIndex && styles.dotComplete,
index === currentPlayerIndex && styles.dotCurrent,
]}
/>
))}
</View>
</View>

      {/* 탭 영역 */}
      <TapArea
        state={gamePhase}
        onTap={handleTap}
        reactionTime={reactionTime ?? undefined}
        disabled={gamePhase === 'result'}
      />

      {/* 결과 표시 및 다음 버튼 */}
      {gamePhase === 'result' && (
        <View style={styles.resultSection}>
          <Text style={styles.feedback}>{getReactionFeedback()}</Text>
          <Button
            title={isLastPlayer ? '🏆 결과 보기' : '다음 플레이어 →'}
            onPress={handleNext}
            size="large"
            style={styles.nextButton}
          />
        </View>
      )}

      {/* 하단 정보 */}
      <View style={styles.footer}>
        <Text style={styles.remainingText}>
          남은 플레이어: {remainingPlayers}명
        </Text>
      </View>
    </SafeAreaView>

);
}

const styles = StyleSheet.create({
container: {
flex: 1,
backgroundColor: COLORS.background,
},
header: {
alignItems: 'center',
paddingTop: 20,
paddingHorizontal: 24,
},
playerTurn: {
fontSize: 24,
fontWeight: 'bold',
color: COLORS.text,
marginBottom: 12,
},
progressDots: {
flexDirection: 'row',
gap: 8,
},
dot: {
width: 10,
height: 10,
borderRadius: 5,
backgroundColor: COLORS.surface,
},
dotComplete: {
backgroundColor: COLORS.success,
},
dotCurrent: {
backgroundColor: COLORS.primary,
},
resultSection: {
paddingHorizontal: 24,
paddingBottom: 16,
alignItems: 'center',
},
feedback: {
fontSize: 20,
color: COLORS.text,
marginBottom: 16,
},
nextButton: {
minWidth: 200,
},
footer: {
alignItems: 'center',
paddingBottom: 24,
},
remainingText: {
fontSize: 14,
color: COLORS.textSecondary,
},
});

4. Quick Tap Result 화면
   src/screens/QuickTap/ResultScreen.tsx:
   typescriptimport React, { useMemo } from 'react';
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
   import { Player } from '../../types/game';
   import { getRankEmoji, generateShareText } from '../../utils/calculateScore';
   import Button from '../../components/Button';

type ResultScreenProps = {
navigation: NativeStackNavigationProp<RootStackParamList, 'QuickTapResult'>;
route: RouteProp<RootStackParamList, 'QuickTapResult'>;
};

interface RankedPlayer extends Player {
rank: number;
}

export default function ResultScreen({ navigation, route }: ResultScreenProps) {
const { players } = route.params;

// 플레이어 순위 계산 (빠른 시간순)
const rankedPlayers: RankedPlayer[] = useMemo(() => {
const sorted = [...players].sort((a, b) => {
const scoreA = a.score ?? 999;
const scoreB = b.score ?? 999;
return scoreA - scoreB;
});

    let currentRank = 1;
    return sorted.map((player, index) => {
      if (index > 0 && player.score !== sorted[index - 1].score) {
        currentRank = index + 1;
      }
      return { ...player, rank: currentRank };
    });

}, [players]);

// 우승자
const winner = rankedPlayers[0];

// 다시하기
const handlePlayAgain = () => {
const resetPlayers = players.map(p => ({ ...p, score: null }));
navigation.replace('QuickTapGame', { players: resetPlayers });
};

// 홈으로
const handleGoHome = () => {
navigation.popToTop();
};

// 공유하기
const handleShare = async () => {
try {
let text = `🎮 Reflex Battle 결과\n⚡ QUICK TAP\n\n`;

      rankedPlayers.forEach((player) => {
        const emoji = getRankEmoji(player.rank);
        text += `${emoji} ${player.name}: ${player.score?.toFixed(3)}초\n`;
      });

      text += '\n🔥 나도 도전하기!\n#ReflexBattle #반응속도';

      await Share.share({ message: text });
    } catch (error) {
      Alert.alert('공유 실패', '공유하는 중 오류가 발생했습니다.');
    }

};

const getRankStyle = (rank: number) => {
switch (rank) {
case 1: return styles.gold;
case 2: return styles.silver;
case 3: return styles.bronze;
default: return styles.default;
}
};

const getRankBorderStyle = (rank: number) => {
switch (rank) {
case 1: return styles.goldBorder;
case 2: return styles.silverBorder;
case 3: return styles.bronzeBorder;
default: return styles.defaultBorder;
}
};

// 반응 시간 평가
const getReactionLabel = (time: number | null) => {
if (time === null) return '측정 안됨';
if (time < 0.2) return '⚡ 번개';
if (time < 0.25) return '🔥 매우 빠름';
if (time < 0.3) return '👍 빠름';
if (time < 0.4) return '😊 평균';
return '🐢 느림';
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
<Text style={styles.trophy}>⚡</Text>
<Text style={styles.title}>게임 결과</Text>
<Text style={styles.subtitle}>QUICK TAP</Text>
</View>

        {/* 우승자 하이라이트 */}
        <View style={styles.winnerSection}>
          <Text style={styles.winnerLabel}>🎉 우승 🎉</Text>
          <Text style={styles.winnerName}>{winner.name}</Text>
          <Text style={styles.winnerScore}>
            {winner.score?.toFixed(3)}초
          </Text>
          <Text style={styles.winnerFeedback}>
            {getReactionLabel(winner.score)}
          </Text>
        </View>

        {/* 전체 순위 */}
        <View style={styles.rankingSection}>
          <Text style={styles.sectionTitle}>전체 순위</Text>

          {rankedPlayers.map((player, index) => (
            <View
              key={player.id}
              style={[
                styles.playerCard,
                getRankBorderStyle(player.rank),
                index === 0 && styles.firstPlace,
              ]}
            >
              <View style={styles.rankContainer}>
                <Text style={[styles.rankEmoji, player.rank <= 3 && styles.rankEmojiLarge]}>
                  {getRankEmoji(player.rank)}
                </Text>
              </View>

              <View style={styles.playerInfo}>
                <Text style={[styles.playerName, getRankStyle(player.rank)]}>
                  {player.name}
                </Text>
                <Text style={styles.reactionLabel}>
                  {getReactionLabel(player.score)}
                </Text>
              </View>

              <View style={styles.timeInfo}>
                <Text style={styles.reactionTime}>
                  {player.score?.toFixed(3)}초
                </Text>
              </View>
            </View>
          ))}
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
    </SafeAreaView>

);
}

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
marginBottom: 4,
},
subtitle: {
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
fontSize: 24,
fontWeight: 'bold',
color: COLORS.text,
marginBottom: 4,
},
winnerFeedback: {
fontSize: 16,
color: COLORS.textSecondary,
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
playerCard: {
flexDirection: 'row',
alignItems: 'center',
backgroundColor: COLORS.surface,
borderRadius: 12,
padding: 16,
marginBottom: 12,
borderWidth: 2,
borderColor: 'transparent',
},
firstPlace: {
paddingVertical: 20,
},
goldBorder: {
borderColor: COLORS.gold,
backgroundColor: COLORS.gold + '15',
},
silverBorder: {
borderColor: COLORS.silver,
backgroundColor: COLORS.silver + '10',
},
bronzeBorder: {
borderColor: COLORS.bronze,
backgroundColor: COLORS.bronze + '10',
},
defaultBorder: {
borderColor: COLORS.surface,
},
rankContainer: {
width: 50,
alignItems: 'center',
},
rankEmoji: {
fontSize: 24,
},
rankEmojiLarge: {
fontSize: 32,
},
playerInfo: {
flex: 1,
marginLeft: 12,
},
playerName: {
fontSize: 18,
fontWeight: 'bold',
color: COLORS.text,
marginBottom: 4,
},
gold: {
color: COLORS.gold,
},
silver: {
color: COLORS.silver,
},
bronze: {
color: COLORS.bronze,
},
default: {
color: COLORS.text,
},
reactionLabel: {
fontSize: 14,
color: COLORS.textSecondary,
},
timeInfo: {
alignItems: 'flex-end',
},
reactionTime: {
fontSize: 18,
fontWeight: 'bold',
color: COLORS.primary,
},
footer: {
padding: 16,
paddingBottom: 24,
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

5. 실행 확인
   bashnpx expo start

```

---

### ✅ 체크리스트

**Setup 화면:**
- [ ] Home → Quick Tap 버튼 → Setup 화면 표시
- [ ] 참가 인원 +/- 버튼 동작
- [ ] 플레이어 이름 입력 가능
- [ ] 게임 시작 버튼 클릭 → Game 화면으로 이동

**Game 화면:**
- [ ] 회색 "준비" 상태에서 탭 → 빨간색 "기다려..." 상태
- [ ] 1~5초 랜덤 대기 후 초록색 "탭!" 상태
- [ ] 초록색에서 탭 → 반응 시간 표시
- [ ] 빨간색에서 탭 → "너무 빨랐어요!" 표시
- [ ] 반응 시간 피드백 (번개/빠름/평균 등)
- [ ] 다음 플레이어 버튼 동작
- [ ] 마지막 플레이어 후 "결과 보기" 버튼

**Result 화면:**
- [ ] 우승자 하이라이트 표시
- [ ] 전체 순위 (빠른 시간순)
- [ ] 메달 이모지 및 색상 구분
- [ ] 다시하기/홈으로/공유 버튼 동작

---

### 📁 최종 완성된 구조
```

src/
├── components/
│ ├── Button.tsx ✅
│ ├── PlayerInput.tsx ✅
│ ├── NumberStepper.tsx ✅
│ ├── Timer.tsx ✅
│ ├── StopButton.tsx ✅
│ ├── RankingList.tsx ✅
│ └── TapArea.tsx ✅ NEW
├── hooks/
│ └── useTimer.ts ✅
├── utils/
│ └── calculateScore.ts ✅
├── screens/
│ ├── HomeScreen.tsx ✅
│ ├── TimeStop/
│ │ ├── SetupScreen.tsx ✅
│ │ ├── GameScreen.tsx ✅
│ │ └── ResultScreen.tsx ✅
│ └── QuickTap/
│ ├── SetupScreen.tsx ✅ NEW
│ ├── GameScreen.tsx ✅ NEW
│ └── ResultScreen.tsx ✅ NEW
└── ...

```

---

### 🎮 앱 전체 완성!
```

┌─────────────────────────────────────────┐
│ HOME │
│ ┌─────────────┐ ┌─────────────┐ │
│ │ TIME STOP │ │ QUICK TAP │ │
│ │ ✅ │ │ ✅ │ │
│ └──────┬──────┘ └──────┬──────┘ │
│ │ │ │
│ Setup → Game → Result │
│ ✅ ✅ ✅ │
└─────────────────────────────────────────┘
