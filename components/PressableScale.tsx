import React from 'react';
import { GestureResponderEvent, TouchableOpacity, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

interface PressableScaleProps {
	onPress?: (event: GestureResponderEvent) => void;
	children: React.ReactNode;
	style?: ViewStyle | ViewStyle[];
	scaleTo?: number;
	haptic?: boolean;
}

export default function PressableScale({
	onPress,
	children,
	style,
	scaleTo = 0.98,
	haptic = true,
}: PressableScaleProps) {
	const scale = useSharedValue(1);

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ scale: scale.value }],
	}));

	function handlePressIn() {
		scale.value = withSpring(scaleTo, { mass: 0.3, stiffness: 300, damping: 20 });
	}

	function handlePressOut() {
		scale.value = withSpring(1, { mass: 0.3, stiffness: 300, damping: 20 });
	}

	async function handlePress(event: GestureResponderEvent) {
		if (haptic) {
			try { await Haptics.selectionAsync(); } catch {}
		}
		onPress?.(event);
	}

	return (
		<Animated.View style={animatedStyle}>
			<TouchableOpacity
				activeOpacity={0.9}
				onPressIn={handlePressIn}
				onPressOut={handlePressOut}
				onPress={handlePress}
				style={style}
			>
				{children}
			</TouchableOpacity>
		</Animated.View>
	);
}

