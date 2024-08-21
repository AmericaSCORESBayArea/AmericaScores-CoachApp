module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-empty': [0, 'never'],
    'subject-empty': [0, 'never'],
    'header-max-length': [0, 'never'],
  },
};
