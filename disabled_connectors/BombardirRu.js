'use strict'

import BaseConnector from '../BaseConnector'
import moment from 'moment'
import {AllHtmlEntities} from 'html-entities'

const entities = new AllHtmlEntities()

export default class BombardirRu extends BaseConnector {

  static rssLinks() {
    return []
  }

  /*
   * Имя парсера
   */
  static getName(){
    return 'BombardirRu'
  }

  static getLang(){
    return 'ru'
  }

  static getSport(entity){
    return ''
  }

  /*
   * Правило для теста принадлежности ссылки к этому парсеру
   */
  static testUrl(){
    return '/bombardir\.ru\/articles'
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
        selector: 'h1.content-headline',
        type: 'text'
      },
      {
        name: 'date',
        selector: '.article-content-body .date',
        type: 'text'
      },
      {
        name: 'content',
        selector: '.article-content-body .content',
        type: 'html'
      },
      {
        name: 'text',
        selector: '.article-content-body .content',
        type: 'html'
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

  static resolveDateField(data){
    return moment(data.trim(), "DD/MM/YYYY hh:mm").format()
  }

  static resolveTextField(data){
    data = data.replace(/<br>/, '\n');
    data = data.replace(/(<([^>]+)>)/ig, "");
    return entities.decode(data)
  }
}