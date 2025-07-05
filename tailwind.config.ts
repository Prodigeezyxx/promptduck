
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
			padding: {
				DEFAULT: '1rem',
				sm: '1.5rem',
				lg: '2rem',
				xl: '2.5rem',
				'2xl': '3rem'
			},
			screens: {
				'sm': '640px',
				'md': '768px',
				'lg': '1024px',
				'xl': '1280px',
				'2xl': '1400px'
			}
		},
		screens: {
			'xs': '360px',
			'sm': '640px',
			'md': '768px',
			'lg': '1024px',
			'xl': '1280px',
			'2xl': '1536px',
			// Mobile-first breakpoints
			'mobile': {'max': '767px'},
			'tablet': {'min': '768px', 'max': '1023px'},
			'desktop': {'min': '1024px'},
			// Touch device detection
			'touch': {'raw': '(hover: none) and (pointer: coarse)'},
			'no-touch': {'raw': '(hover: hover) and (pointer: fine)'},
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
			spacing: {
				'safe-top': 'env(safe-area-inset-top)',
				'safe-bottom': 'env(safe-area-inset-bottom)',
				'safe-left': 'env(safe-area-inset-left)',
				'safe-right': 'env(safe-area-inset-right)',
			},
			boxShadow: {
				'soft-inner': 'inset 0 0 0 1px rgba(255,255,255,0.05)',
				'soft-inner-light': 'inset 0 0 0 1px rgba(0,0,0,0.05)',
				'elevation-1': '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
				'elevation-2': '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)',
				'elevation-3': '0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)',
				// Mobile-optimized shadows
				'mobile-soft': '0 2px 8px rgba(0, 0, 0, 0.1)',
				'mobile-elevated': '0 4px 16px rgba(0, 0, 0, 0.15)',
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
				},
				// New text wobble animation
				'text-wobble': {
					'0%, 100%': {
						transform: 'rotate(0deg) scale(1)'
					},
					'25%': {
						transform: 'rotate(0.5deg) scale(1.01)'
					},
					'50%': {
						transform: 'rotate(0deg) scale(1)'
					},
					'75%': {
						transform: 'rotate(-0.5deg) scale(1.01)'
					}
				},
				// Mobile-optimized animations
				'mobile-slide-in': {
					'0%': {
						transform: 'translateY(20px)',
						opacity: '0'
					},
					'100%': {
						transform: 'translateY(0)',
						opacity: '1'
					}
				},
				'mobile-bounce': {
					'0%, 20%, 50%, 80%, 100%': {
						transform: 'translateY(0)'
					},
					'40%': {
						transform: 'translateY(-8px)'
					},
					'60%': {
						transform: 'translateY(-4px)'
					}
				},
				// Smooth tab switching
				'tab-slide-in': {
					'0%': {
						opacity: '0',
						transform: 'translateX(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateX(0)'
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
				// New text wobble animation
				'text-wobble': 'text-wobble 2.5s ease-in-out infinite',
				// Mobile-optimized animations
				'mobile-slide-in': 'mobile-slide-in 0.3s ease-out',
				'mobile-bounce': 'mobile-bounce 1s ease-in-out',
				// Tab animations
				'tab-slide-in': 'tab-slide-in 0.2s ease-out',
			},
			fontFamily: {
				sans: ['Inter', 'system-ui', 'sans-serif'],
			},
			fontSize: {
				// Mobile-optimized font sizes
				'mobile-xs': ['0.75rem', { lineHeight: '1.4' }],
				'mobile-sm': ['0.875rem', { lineHeight: '1.5' }],
				'mobile-base': ['1rem', { lineHeight: '1.6' }],
				'mobile-lg': ['1.125rem', { lineHeight: '1.5' }],
				'mobile-xl': ['1.25rem', { lineHeight: '1.4' }],
			},
			backdropBlur: {
				xs: '2px',
			},
			// Container queries support
			supports: {
				'container-queries': 'container-type: inline-size',
			}
		}
	},
	plugins: [
		require("tailwindcss-animate"),
		// Add line-clamp support
		function({ addUtilities }) {
			addUtilities({
				'.line-clamp-1': {
					display: '-webkit-box',
					'-webkit-line-clamp': '1',
					'-webkit-box-orient': 'vertical',
					overflow: 'hidden',
				},
				'.line-clamp-2': {
					display: '-webkit-box',
					'-webkit-line-clamp': '2',
					'-webkit-box-orient': 'vertical',
					overflow: 'hidden',
				},
				'.line-clamp-3': {
					display: '-webkit-box',
					'-webkit-line-clamp': '3',
					'-webkit-box-orient': 'vertical',
					overflow: 'hidden',
				},
			})
		}
	],
} satisfies Config;
