/** @type {import('next-i18next').UserConfig} */

module.exports = {
    i18n: {
      locales: ['en', 'zh', 'ar'],
      defaultLocale: 'en',
      localeDetection: false, // We'll handle this manually with middleware
    },
  };
  