/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html"],
	plugins: [],
	theme: {
		extend: {},
		colors: {
			transparent: 'transparent',
			current: 'currentColor',
			'white': '#FCFDFF',
			'black': '#0D1B2A',
			'blue': {
				DEFAULT: '#007ea7',
				700: '#006B8F',
				800: '#005C7A',
				900: '#002E3D'
			},
			'silver': '#F6F5F4',
			'yellow': '#FFCF57',
			'gray': {
				700: '#21201C'
			} 	
		}
	},
};
