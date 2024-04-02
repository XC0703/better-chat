module.exports = {
	env: {
		browser: true,
		commonjs: true,
		es2021: true
	},
	extends: 'eslint:recommended',
	overrides: [
		{
			env: {
				node: true
			},
			files: ['.eslintrc.{js,cjs}'],
			parserOptions: {
				sourceType: 'script'
			}
		}
	],
	parserOptions: {
		ecmaVersion: 'latest'
	},
	rules: {
		'no-console': 'error',
		eqeqeq: 'error',
		'prefer-const': [
			'error',
			{
				destructuring: 'any',
				ignoreReadBeforeAssign: false
			}
		]
	}
};
