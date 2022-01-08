module.exports = {
    parser: 'babel-eslint',
    parserOptions: {
        ecmaVersion: 2017,
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true
        }
    },
    env: {
        es6: true,
        node: true,
        browser: true,
        jest: true
    },
    extends: ['eslint:recommended', 'plugin:react/recommended', 'prettier', 'prettier/react'],
    plugins: ['header', 'react', 'prettier'],
    settings: {
        react: {
            version: '16.8'
        }
    },
    rules: {
        'prettier/prettier': ['error'],
        'no-console': 'off',
        'no-unused-vars': ['error', {ignoreRestSiblings: true}]
    }
};
