import { useColorScheme } from 'react-native';

export type ColorScale = {
	50: string;
	100: string;
	200: string;
	300: string;
	400: string;
	500: string;
	600: string;
	700: string;
	800: string;
	900: string;
};

export type Theme = {
	colors: {
		background: string;
		surface: string;
		surfaceElevated: string;
		primary: string;
		primaryContrast: string;
		secondary: string;
		muted: string;
		mutedForeground: string;
		border: string;
		text: string;
		subtleText: string;
		success: string;
		warning: string;
		error: string;
		info: string;
	};

	radius: {
		xs: number;
		sm: number;
		md: number;
		lg: number;
		xl: number;
		full: number;
	};

	spacing: {
		xs: number;
		sm: number;
		md: number;
		lg: number;
		xl: number;
		xxl: number;
	};

	shadow: {
		sm: object;
		md: object;
		lg: object;
	};
};

export const blue: ColorScale = {
	50: '#EFF6FF',
	100: '#DBEAFE',
	200: '#BFDBFE',
	300: '#93C5FD',
	400: '#60A5FA',
	500: '#3B82F6',
	600: '#2563EB',
	700: '#1D4ED8',
	800: '#1E40AF',
	900: '#1E3A8A',
};

export const emerald: ColorScale = {
	50: '#ECFDF5',
	100: '#D1FAE5',
	200: '#A7F3D0',
	300: '#6EE7B7',
	400: '#34D399',
	500: '#10B981',
	600: '#059669',
	700: '#047857',
	800: '#065F46',
	900: '#064E3B',
};

export const lightTheme: Theme = {
	colors: {
		background: '#F8FAFC',
		surface: '#FFFFFF',
		surfaceElevated: '#FFFFFF',
		primary: blue[700],
		primaryContrast: '#FFFFFF',
		secondary: emerald[600],
		muted: '#F1F5F9',
		mutedForeground: '#64748B',
		border: '#E2E8F0',
		text: '#0F172A',
		subtleText: '#475569',
		success: emerald[600],
		warning: '#F59E0B',
		error: '#DC2626',
		info: blue[700],
	},
	radius: {
		xs: 6,
		sm: 10,
		md: 12,
		lg: 16,
		xl: 20,
		full: 999,
	},
	spacing: {
		xs: 6,
		sm: 10,
		md: 14,
		lg: 20,
		xl: 28,
		xxl: 36,
	},
	shadow: {
		sm: { shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 1 },
		md: { shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
		lg: { shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 4 },
	},
};

export const darkTheme: Theme = {
	colors: {
		background: '#0B1220',
		surface: '#0F172A',
		surfaceElevated: '#111827',
		primary: blue[400],
		primaryContrast: '#0B1220',
		secondary: emerald[400],
		muted: '#111827',
		mutedForeground: '#94A3B8',
		border: '#1F2937',
		text: '#E2E8F0',
		subtleText: '#94A3B8',
		success: emerald[400],
		warning: '#F59E0B',
		error: '#F87171',
		info: blue[400],
	},
	radius: lightTheme.radius,
	spacing: lightTheme.spacing,
	shadow: {
		sm: { shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 1 },
		md: { shadowColor: '#000', shadowOpacity: 0.35, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
		lg: { shadowColor: '#000', shadowOpacity: 0.4, shadowRadius: 18, shadowOffset: { width: 0, height: 8 }, elevation: 4 },
	},
};

export function useTheme(): Theme {
	const scheme = useColorScheme();
	return scheme === 'dark' ? darkTheme : lightTheme;
}

export const tokens = {
	blue,
	emerald,
};

