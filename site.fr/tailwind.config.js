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
			'yellow': {
				DEFAULT: '#FFCF57',
				900: '#3D2C00'
			},
			'gray': {
				600: '#4C4A42',
				700: '#21201C'
			} 	
		},
		fontFamily: {
			'sans': 'Seravek, "Gill Sans Nova", Ubuntu, Calibri, "DejaVu Sans", source-sans-pro, sans-serif'
		}
	},
};
