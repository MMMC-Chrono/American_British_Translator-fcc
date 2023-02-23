'use strict';

const Translator = require('../components/translator.js');

module.exports = function (app) {
  
  const translator = new Translator();

  app.route('/api/translate') 
    .post((req, res) => {
      const { text, locale } = req.body
      let valid_locale = false;
      if (locale === 'american-to-british' || locale === 'british-to-american') {
        valid_locale = true;
      }

      return typeof(text) !== 'string' || typeof(locale) !== 'string' ? res.json({ error: 'Required field(s) missing' }) :
        text.trim() === '' ? res.json({ error: 'No text to translate' }) :
        !valid_locale ? res.json({ error: 'Invalid value for locale field' }) :
        res.json({text, translation: translator.translate(text, locale)});

    });
};
