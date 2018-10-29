'use strict'

import BaseConnector from '../BaseConnector'

export default class DailyMailCoUk extends BaseConnector {

  /*
   * Массив с rss-лентами портала
   */
  static rssLinks() {
    return [
      'http://www.dailymail.co.uk/sport/articles.rss',
      //'http://www.dailymail.co.uk/sport/football/articles.rss',
      //'http://www.dailymail.co.uk/sport/football/index.rss'
    ]
  }

  /*
   * Имя парсера
   */
  static getName(){
    return 'DailyMailCoUk'
  }

  /*
   * Язык спаршенного контента
   */
  static getLang(){
    return 'en'
  }

  /*
   * Язык спаршенного контента
   */
  static getSport(entity){
    return 'soccer'
  }

  /*
   * Правило для теста принадлежности ссылки к этому парсеру
   */
  static testUrl(){
    return 'dailymail\.co\.uk\/sport\/football\/article'
  }

  /*
   * Генерим headers для запроса
   */
  static getHeaders(){
    return {
      'headers': {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Pragma': 'no-cache',
        'Upgrade-Insecure-Requests': 1,
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'
      }
    }
  }

  /*
   * Настройки полей для парсинга
   */
  static getFields(){
    return [
      {
        name: 'title',
        selector: '#js-article-text:first-child h2',
        type: 'text'
      },
      {
        name: 'date',
        selector: 'meta[property="article:published_time"]',
        type: 'attr',
        attr: 'content'
      },
      {
        name: 'content',
        selector: '#js-article-text:first-child div[itemprop="articleBody"]',
        type: 'html'
      },
      {
        name: 'image',
        selector: 'meta[property="og:image"]',
        type: 'attr',
        attr: 'content'
      }
    ]
  }

  /*
   * Для обработки поля добавьте метод со следующим именем resolve[NameField]Field
   * Метод получит значение спаршенного поля
   */



}