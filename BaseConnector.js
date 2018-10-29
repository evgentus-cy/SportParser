'use strict'

import request from './lib/async-request'
import cheerio from 'cheerio'
import camelcase from 'camelcase'
import Proxy from './lib/proxy'

const debug = {log: require('debug')('parser:log'), error: require('debug')('parser:error')};

export default class BaseConnector {

  // Метод получения содержимого страницы
  static async loadPage(url) {
    let proxy = await Proxy.resolveProxy();
    try {
      let options = (this['getRequestOptions']) ? this.getRequestOptions() : {};

      options.proxy = proxy;
      debug.log(`Send request via proxy ${proxy}`);
      let response = await request(url, options);

      if (!response || [504, 403, 407].indexOf(response.statusCode) > -1) {
        debug.error(`Page "${url}" NOT loaded, response code ${response.statusCode}. Next attempt!`);
        Proxy.removeProxy(proxy);
        return this.loadPage(url)
      }

      if (response.statusCode === 200) {
        debug.log(`Success get site page!`);
        return response.body
      } else {
        debug.error(`Page "${url}" NOT loaded, response code ${response.statusCode}. Check connector "${this.getName()}"!`);
        return ''
      }
    } catch (e) {
      debug.error(`Response with error. Next attempt!`);
      Proxy.removeProxy(proxy);
      return this.loadPage(url)
    }
  }

  static async parse(url) {
    // Получаем страницу
    this.content = await this.loadPage(url);
    if (this['preParsing']) {
      debug.log(`Preparsing prepare...`);
      this.content = await this.preParsing(this.content)
    }
    let $ = await cheerio.load(this.content);

    let data = {url: url}

    // Парсинг и обработка полей
    await this.getFields().forEach(async (field) => {
      if (field.type === 'text') {
        if(field.name === 'tags') {
          data[field.name] = [];

          await $(`${field.selector} a`).each( (i, el) => {
            data[field.name].push($(el).text().toLowerCase());
          });
        } else{
          data[field.name] = await $(field.selector).text();
        }
      }
      else if (field.type === 'html') {
        if (field.hasOwnProperty('removeElements')) {
          field.removeElements.forEach( async el => {
            await $(el).each( (i, item) => {
              $(item).remove();
            })
          });
        }

        data[field.name] = await $(field.selector).html();
      }
      else if (field.type === 'attr') {
        data[field.name] = await $(field.selector).attr(field.attr);
      }

      if (data[field.name]) {
        let func = camelcase(['resolve', field.name, 'field']);
        if (this[func]) {
          data[field.name] = await this[func](data[field.name])
        }
      } else {
        debug.error(`Field ${field.name} don\`t parsed. Page: ${url}`)
      }
    }, this);

    return data
  }
}