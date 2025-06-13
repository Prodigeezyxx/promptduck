
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				// New bold design system colors
				background: {
					DEFAULT: '#1E1E22',
					light: '#FFFFFF'
				},
				surface: {
					DEFAULT: '#2A2A2E',
					light: '#F8F9FA'
				},
				input: {
					DEFAULT: '#2F2F33',
					light: '#F1F3F4'
				},
				primaryText: {
					DEFAULT: '#E5E5E5',
					light: '#1A1A1A'
				},
				secondaryText: {
					DEFAULT: '#888888',
					light: '#6B7280'
				},
				accent: {
					DEFAULT: '#7E84F9',
					50: '#f0f1ff',
					100: '#e0e3ff',
					200: '#c7cffe',
					300: '#a5b0fc',
					400: '#818cf8',
					500: '#7E84F9',
					600: '#6366f1',
					700: '#4f46e5',
					800: '#4338ca',
					900: '#3730a3',
					950: '#1e1b4b',
				},
				warning: {
					DEFAULT: '#D94A4A',
					light: '#EF4444'
				},
				success: {
					DEFAULT: '#10B981',
					light: '#059669'
				},
				// Legacy support for existing components (mapped to new system)
				border: 'rgba(255,255,255,0.05)',
				ring: '#7E84F9',
				foreground: '#E5E5E5',
				primary: {
					DEFAULT: '#7E84F9',
					foreground: '#FFFFFF'
				},
				secondary: {
					DEFAULT: '#2A2A2E',
					foreground: '#E5E5E5'
				},
				destructive: {
					DEFAULT: '#D94A4A',
					foreground: '#FFFFFF'
				},
				muted: {
					DEFAULT: '#2F2F33',
					foreground: '#888888'
				},
				popover: {
					DEFAULT: '#2A2A2E',
					foreground: '#E5E5E5'
				},
				card: {
					DEFAULT: '#2A2A2E',
					foreground: '#E5E5E5'
				},
				// Brand colors for compatibility
				brand: {
					50: '#f0f1ff',
					100: '#e0e3ff',
					200: '#c7cffe',
					300: '#a5b0fc',
					400: '#818cf8',
					500: '#7E84F9',
					600: '#6366f1',
					700: '#4f46e5',
					800: '#4338ca',
					900: '#3730a3',
					950: '#1e1b4b',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			boxShadow: {
				'soft-inner': 'inset 0 0 0 1px rgba(255,255,255,0.05)',
				'soft-inner-light': 'inset 0 0 0 1px rgba(0,0,0,0.05)',
				'elevation-1': '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
				'elevation-2': '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)',
				'elevation-3': '0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)',
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'slide-up': {
					'0%': {
						opacity: '0',
						transform: 'translateY(20px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'float': {
					'0%, 100%': {
						transform: 'translateY(0px)'
					},
					'50%': {
						transform: 'translateY(-10px)'
					}
				},
				'glow': {
					'0%, 100%': {
						boxShadow: '0 0 20px rgba(126, 132, 249, 0.3)'
					},
					'50%': {
						boxShadow: '0 0 40px rgba(126, 132, 249, 0.6)'
					}
				},
				'pulse-accent': {
					'0%, 100%': {
						opacity: '1'
					},
					'50%': {
						opacity: '0.5'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.6s ease-out',
				'slide-up': 'slide-up 0.4s ease-out',
				'float': 'float 3s ease-in-out infinite',
				'glow': 'glow 2s ease-in-out infinite',
				'pulse-accent': 'pulse-accent 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
			},
			fontFamily: {
				sans: ['Inter', 'system-ui', 'sans-serif'],
			},
			backdropBlur: {
				xs: '2px',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
