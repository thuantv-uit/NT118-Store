// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
    plugins: {
      "react-native": require("eslint-plugin-react-native"),
    },

    rules: {
      "react-native/no-unused-styles": "warn", // ⚠️ cảnh báo style không dùng
      "react-native/no-inline-styles": "off",
      "react-native/no-color-literals": "off",
      "react-native/no-raw-text": "off",
    },
  },

  
]);
