module.exports = () => {
  const tslintConfig = {
    extends: [
      'tslint:latest'
    ],
    rules: {
      "adjacent-overload-signatures": true,
      "member-access": true,
      "ban-comma-operator": true,
      "function-constructor": true,
      "label-position": true,
      "no-arg": true,
      "no-conditional-assignment": true,
      "no-construct": true,
      "no-duplicate-switch-case": true,
      "no-any": true,
      "curly": true,
      "no-sparse-arrays": true,
      "no-var-keyword": true,
      "prefer-const": true,
      "array-type": [true, "array"],
      "one-variable-per-declaration": true,
      "ordered-imports": true,
      "variable-name": [
        true,
        "ban-keywords",
        "check-format",
        "require-const-for-all-caps",
        "allow-leading-underscore",
      ],
      "typedef": [
        true,
        "call-signature",
        "arrow-call-signature",
        "parameter",
        "arrow-parameter",
        "property-declaration",
        "variable-declaration",
        "member-variable-declaration",
        "object-destructuring",
        "array-destructuring",
      ],
      "member-ordering": [
        true,
        {
          order: "fields-first",
          "alphabetize": true,
        },
      ],
    },
  };
  return tslintConfig;
}