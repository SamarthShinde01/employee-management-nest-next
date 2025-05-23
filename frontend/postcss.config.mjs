// postcss.config.js
export default {
	plugins: {
		"@tailwindcss/postcss": {},
		"postcss-preset-env": {
			stage: 1,
			features: {
				"color-oklab": true,
			},
		},
	},
};
