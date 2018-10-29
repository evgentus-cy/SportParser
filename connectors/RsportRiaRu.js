'use strict'

import BaseConnector from '../BaseConnector'
import moment from 'moment'
import {AllHtmlEntities} from 'html-entities'

const entities = new AllHtmlEntities()

export default class RsportRiaR extends BaseConnector {

  /*
   * Имя парсера
   */
  static getName(){
    return 'RsportRiaR'
  }

  static getLang(){
    return 'ru'
  }

  static getSport(entity){
    if (entity.url.indexOf('football') !== -1) {
      return 'soccer'
    }
    if (entity.url.indexOf('russia2018') !== -1) {
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
    return 'rsport\.ria\.ru\/(football|basketball|russia2018|hockey|tennis)'
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
        selector: 'h1.b-mediatitle__title',
        type: 'text'
      },
      {
        name: 'date',
        selector: '.b-article__info .m-date',
        type: 'text'
      },
      {
        name: 'content',
        selector: '.b-article__body .b-article__text',
        type: 'html'
      },
      {
        name: 'image',
        selector: 'meta[property="og:image"]',
        type: 'attr',
        attr: 'content'
      },
      {
        name: 'tags',
        selector: '.b-article__tags-list',
        type: 'text'
      }
    ]
  }

  /*
   * Для обработки поля добавьте метод со следующим именем resolve[NameField]Field
   * Метод получит значение спаршенного поля
   */

  static resolveContentField(data){
    data = data.replace(/(<script>[.*\n\r]<\/script>)/ig, "");
    return entities.decode(data)
  }

  static resolveDateField(data){
    return moment(data.trim(), "hh:mm DD.MM.YYYY").format()
  }

  static resolveTextField(data){
    data = data.replace(/<br>/, '\n');
    data = this.clear(data)
    return entities.decode(data)
  }

  static clear(data) {
    data = data.replace(/(<script>[.*\n\r]<\/script>)/ig, "");
    return data.replace(/(<([^>]+)>)/ig, "");
  }
}