'use strict';

module.exports.adminpanel = {
  models: {
  },
  // administrator: {
	// 	login: process.env.ADMIN_LOGIN === undefined ? 'admin' : process.env.ADMIN_LOGIN,
	// 	password: process.env.ADMIN_PASS === undefined ? 'Eng&&ner' : process.env.ADMIN_PASS
	// },
  auth: process.env.NODE_ENV === "production" ? true : process.env.ADMINIZER_AUTH_ENABLE !== undefined ? true : false,
  translation: {
    locales: [
    "en",
    "es",
    "zh",
    "hi",
    "ar",
    "ru",
    "fr",
    "ua"
    ],
    path: `config/locales`,
    defaultLocale: 'en'
  },
  dashboard: {
    autoloadWidgetsPath1: "api/dashboard",
    defaultWidgets: [
      // TODO: after mogration to adminizer need update these widgets
      // 'dish-count', 
      // 'order-count'
    ]
  },
  mediamanager: false,
  policies: []
};
