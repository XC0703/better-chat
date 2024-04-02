module.exports = {
	env: {
		browser: true,
		es2021: true,
		node: true
	},
	extends: [
		'eslint:recommended',
		'plugin:react/recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:react/jsx-runtime'
	],
	overrides: [],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module'
	},
	plugins: ['react', '@typescript-eslint', 'import'],
	rules: {
		'@typescript-eslint/no-non-null-assertion': 'off',
		'no-console': 'error',
		eqeqeq: 'error',
		'prefer-const': [
			'error',
			{
				destructuring: 'any',
				ignoreReadBeforeAssign: false
			}
		],
		'import/order': [
			'error',
			{
				groups: [
					'builtin',
					'external',
					['internal', 'parent', 'sibling', 'index', 'object', 'type'],
					'unknown'
				],
				pathGroups: [
					{
						pattern: '@app/**',
						group: 'external',
						position: 'after'
					}
				],
				pathGroupsExcludedImportTypes: ['builtin'],
				'newlines-between': 'always',
				alphabetize: {
					order: 'asc',
					caseInsensitive: true
				}
			}
		]
	},
	settings: {
		react: {
			version: 'detect'
		}
	}
};
