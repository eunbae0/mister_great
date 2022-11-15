module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended"
    ],
    "overrides": [
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module",
        // "requireConfigFile" : "false"
    },
    "plugins": [
        "react"
    ],
    "parser": "@babel/eslint-parser",
    // "babelOptions": { "configFile": "./.babelrc", },
    "rules": {
        "react/react-in-jsx-scope": "off",
        "react/prop-types": "off",
        "no-unused-vars": "off"
    }
}