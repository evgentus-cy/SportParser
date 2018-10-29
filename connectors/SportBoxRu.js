'use strict'

import BaseConnector from '../BaseConnector'

export default class SportBoxRu extends BaseConnector {

  /*
   * Имя парсера
   */
  static getName(){
    return 'SportBoxRu'
  }

  static getLang(){
    return 'ru'
  }

  static getSport(entity){
    if (entity.url.indexOf('Futbol') !== -1) {
      return 'soccer'
    }
    else if (entity.url.indexOf('Basketbol') !== -1){
      return 'basketball'
    }
    else if (entity.url.indexOf('Tennis') !== -1){
      return 'tennis'
    }
    else if (entity.url.indexOf('Hokkej') !== -1){
      return 'ice-hockey'
    }
    else{
      return ''
    }
  }

  /*
   * Правило для теста принадлежности ссылки к этому парсеру
   */
  static testUrl(){
    return 'news\.sportbox\.ru\/Vidy_sporta\/(Futbol|Basketbol|Tennis|Hokkej)\/.*\/spbnews_'
  }

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
        selector: 'h1.node-header__title',
        type: 'text'
      },
      {
        name: 'date',
        selector: 'meta[name="mediator_published_time"]',
        type: 'attr',
        attr: 'content'
      },
      {
        name: 'content',
        selector: '.node-content__body .js-mediator-article',
        removeElements: [
          '.node-poster-image-tag-new',
          'h3 > a'
        ],
        type: 'html'
      },
      {
        name: 'image',
        selector: 'meta[name="relap-image"]',
        type: 'attr',
        attr: 'content'
      },
      {
        name: 'tags',
        selector: '.similar-content-wrapper > .tags',
        type: 'text'
      }
    ]
  }

  /*
   * Для обработки поля добавьте метод со следующим именем resolve[NameField]Field
   * Метод получит значение спаршенного поля
   */

  static resolveImageField(url) {
    return (url.indexOf('sb_logo_420_280.jpg') !== -1) ? null : url ;
  }

}