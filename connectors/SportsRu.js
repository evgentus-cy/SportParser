'use strict'

import BaseConnector from '../BaseConnector'
import moment from 'moment'
import {AllHtmlEntities} from 'html-entities'

const entities = new AllHtmlEntities()



export default class SportsRu extends BaseConnector {

  /*
   * Имя парсера
   */
  static getName(){
    return 'SportsRu'
  }

  static getLang(){
    return 'ru'
  }

  static getSport(entity){
    if (entity.url.indexOf('football') !== -1) {
      return 'soccer'
    }
    if (entity.url.indexOf('wc2018') !== -1) {
      return 'soccer'
    }
    if (entity.url.indexOf('world-cup-2018') !== -1) {
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
    return 'sports\.ru\/(football|basketball|tennis|hockey|wc2018|world-cup-2018)'
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
        selector: '.news-item__header h1',
        type: 'text'
      },
      {
        name: 'date',
        selector: '.news-item__social-line time',
        type: 'attr',
        attr: 'content'
      },
      {
        name: 'content',
        selector: '.news-item__content',
        type: 'html'
      },
      {
        name: 'image',
        selector: 'meta[property="twitter:image"]',
        type: 'attr',
        attr: 'content'
      },
      {
        name: 'tags',
        selector: '.news-item__tags-line',
        type: 'text'
      }
    ]
  }

  /*
   * Для обработки поля добавьте метод со следующим именем resolve[NameField]Field
   * Метод получит значение спаршенного поля
   */

  static resolveContentField(data){
    return entities.decode(data)
  }

  static resolveTextField(data){
    data = data.replace(/<br>/, '\n');
    data = data.replace(/(<([^>]+)>)/ig, "");
    return entities.decode(data)
  }
}