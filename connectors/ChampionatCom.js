'use strict'

import BaseConnector from '../BaseConnector'
import cheerio from 'cheerio'
import {AllHtmlEntities} from 'html-entities'

const entities = new AllHtmlEntities()

export default class ChampionatCom extends BaseConnector {

  /*
   * Имя парсера
   */
  static getName(){
    return 'ChampionatCom'
  }

  /*
   * Язык спаршенного контента
   */
  static getLang(){
    return 'ru'
  }

  static getSport(entity){
    if (entity.url.indexOf('football') !== -1) {
      return 'soccer'
    }
    else if (entity.url.indexOf('basketball') !== -1){
      return 'basketball'
    }
    else if (entity.url.indexOf('tennis') !== -1){
      return 'tennis'
    }
    else if (entity.url.indexOf('hockey') !== -1){
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
    return 'championat\.com\/(football|basketball|tennis|hockey)'
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
        selector: '.article-head__title',
        type: 'text'
      },
      {
        name: 'date',
        selector: '.article-head__details .article-head__date',
        type: 'attr',
        attr: 'content'
      },
      {
        name: 'content',
        selector: '.article-content',
        removeElements: [
          '.external-article._news',
          '.external-article._article'
        ],
        type: 'html'
      },
      {
        name: 'image',
        selector: '#article_head_photo img',
        type: 'attr',
        attr: 'src'
      },
      {
        name: 'tags',
        selector: '.tags__items.js-tags-items',
        type: 'text'
      }
    ]
  }

  /*
   * Для обработки поля добавьте метод со следующим именем resolve[NameField]Field
   * Метод получит значение спаршенного поля
   */



}