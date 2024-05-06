/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html"],
	plugins: [],
	theme: {
		extend: {},
		colors: {
			transparent: 'transparent',
			current: 'currentColor',
			'gray': {
				100: '#f3f4f6',
				700: '#374151',
				900: '#111827'
			},
			'silver': '#f1f1f1',
			'white': '#FDFFFC',
			'black': '#020100',
			'blue': '#235789',
			'yellow': {
				'400': '#FFCB47',
				DEFAULT: '#FFB703'
			},
			'cyan': '#06AED5'
		}
	},
};
