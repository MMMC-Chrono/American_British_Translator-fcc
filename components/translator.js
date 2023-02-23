const a_b = require('./american-british.js');
const a_b_spelling = require('./american-to-british-spelling.js');
const a_b_titles = require("./american-to-british-titles.js")
const b_a = require('./british-american.js')

class Translator {

  a2b(input) {

    let org = input;

    let punctuation;
    let concat_str = false;
    if (!/\w$/i.test(input)) {
      punctuation = input[input.length - 1]
      input = input.slice(0, input.length - 1)
      concat_str = true;
    }

    let a_b_spelling_arr = Object.entries(a_b_spelling)
    for (let [key, value] of a_b_spelling_arr) {
      let regex = new RegExp('\\b'+key+'\\b', 'i')
      let regex_key = regex.exec(input)
      if (regex_key) {
        input = input.replace(regex_key, `<span class="highlight">${value}</span>`)
      }
    }

    let a_b_titles_arr = Object.entries(a_b_titles)
    for (let [key, value] of a_b_titles_arr) {
      let regex = new RegExp('\\b'+key+'(?=.)', 'i')
      let regex_key = regex.exec(input)
      if (regex_key) {
        let result = [...value];
        result[0] = result[0].toUpperCase()
        input = input.replace(regex_key, `<span class="highlight">${result.join('')}</span>`)
      }
    }
    
    let a_b_arr = Object.entries(a_b)
    for (let [key, value] of a_b_arr) {
      let regex = new RegExp('\\b'+key+'\\b', 'i')
      let regex_key = regex.exec(input)

      let re = new RegExp('<span class="highlight">'+value+'<\/span>', 'i')
      let prev_input = input.match(re)
      
      if (regex_key) {
        input = input.replace(regex_key, `<span class="highlight">${value}</span>`)
        if (prev_input) {
          input = regex_key.input
        }
      }
    }

    const pattern = /\d{1,2}[:]\d{1,2}/
    let time = pattern.exec(input)
    if (time) {
      let result = time[0]
      result = result.replace(':', '.')
      input = input.replace(time[0], `<span class="highlight">${result}</span>`)
    }

    let result = input.concat(punctuation)

    return org === result && org[0] === org[0].toUpperCase() || 
           org === input && org[0] === org[0].toUpperCase()? 'Everything looks good to me!':
           concat_str? result : input;

  }

  b2a(input) {

    let org = input
    let punctuation;
    let concat_str = false;
    if (!/\w$/i.test(input)) {
      punctuation = input[input.length - 1]
      input = input.slice(0, input.length - 1)
      concat_str = true;
    }

    let a_b_spelling_arr = Object.entries(a_b_spelling)
    for (let [key, value] of a_b_spelling_arr) {
      let regex = new RegExp('\\b'+value+'\\b', 'i')
      let regex_value = regex.exec(input)
      if (regex_value) {
        input = input.replace(regex_value, `<span class="highlight">${key}</span>`)
      }
    }

    let a_b_titles_arr = Object.entries(a_b_titles)
    for (let [key, value] of a_b_titles_arr) {
      let regex = new RegExp('\\b'+value+'\\b', 'i')
      let regex_value = regex.exec(input)
      if (regex_value) {
        let result = [...key];
        result[0] = result[0].toUpperCase()
        input = input.replace(regex_value, `<span class="highlight">${result.join('')}</span>`)
      }
    }

    let b_a_arr = Object.entries(b_a)
    
    for (let [key, value] of b_a_arr) {

      let regex = new RegExp('\\b'+key+'\\b', 'i')
      let regex_key = regex.exec(input)
      
      let re = new RegExp('<span class="highlight">'+value+'<\/span>', 'i')
      let prev_input = input.match(re)
      
      if (regex_key) {
        input = input.replace(regex_key, `<span class="highlight">${value}</span>`)
        if (prev_input) {
          input = regex_key.input
        }
      }
    }

    const pattern = /\d{1,2}[.]\d{1,2}/
    let time = pattern.exec(input)
    if (time) {
      let result = time[0]
      result = result.replace('.', ':')
      input = input.replace(time[0], `<span class="highlight">${result}</span>`)
    }

    let result = input.concat(punctuation)

    return org === result && org[0] === org[0].toUpperCase() || 
           org === input && org[0] === org[0].toUpperCase()? 'Everything looks good to me!':
           concat_str? result : input;
  }
  
  translate(text, locale) {
    if (locale === 'american-to-british') {
      return this.a2b(text.trim())
    }
    if (locale === 'british-to-american') {
      return this.b2a(text.trim())
    }
    
  }
}

module.exports = Translator;