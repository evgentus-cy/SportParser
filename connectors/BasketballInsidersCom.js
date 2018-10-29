'use strict'

import BaseConnector from '../BaseConnector'

export default class BasketballInsidersCom extends BaseConnector {

  /*
   * Имя парсера
   */
  static getName(){
    return 'BasketballInsidersCom'
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
    return 'basketball'
  }

  /*
   * Правило для теста принадлежности ссылки к этому парсеру
   */
  static testUrl(){
    return 'basketballinsiders\.com\/'
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
        selector: '#mvp-content-wrap h1.mvp-post-title',
        type: 'text'
      },
      {
        name: 'date',
        selector: 'meta[property="rnews:datePublished"]',
        type: 'attr',
        attr: 'content'
      },
      {
        name: 'content',
        selector: '#mvp-content-wrap #mvp-content-main',
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