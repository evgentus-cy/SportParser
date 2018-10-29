'use strict';

import GrabberLink from './models/GrabberLink';
import Parser from 'rss-parser';
import request from './lib/async-request';
import cheerio from 'cheerio';
import Proxy from './lib/proxy';
import slugify from 'slugify'
import Url from 'url'

import connectors from './connectors';
import Article from './models/Article';

const debug = {log: require('debug')('grabber:log'), error: require('debug')('grabber:error')};

const parser = new Parser();

export default class BaseGrabber {

  /*
   *
   * Проверка на существование ссылки в БД
   *
   */
  static isExistsLink (url) {
    GrabberLink.findOne({link: url}, (err, link) => {
      if (err) {
        throw err
      }

      return !!(link);
    })
  }

  /*
   *
   * Метод определяет обработчика ресурсов в зависимости от их типа (Rss, Html-link)
   *
   */
  static async loadSources () {
    let type = this.getType();
    let sources = this.getSources();

    if (!this[`load${type}`]) {
      throw Error(`Handler for ${type} type not found`);
    }

    return await this[`load${type}`](sources);
  }

  /*
   *
   * Парсинг rss-feeds
   *
   */
  static async loadRss (sources) {
    let links = [];

    await sources.forEach(async (source) => {
      await this.loadRssSource(source)
    });

    return links;
  }

  /*
   *
   * Парсинг ссылок со страниц сайта
   *
   */
  static async loadHtml (sources) {
    let links = [];

    await sources.forEach((source) => {
      this.loadHtmlSource(source)
    });

    return links;
  }

  /*
   *
   * Загрузка и парсинг rss-фида
   *
   */
  static async loadRssSource (source) {
    let result;

    try {
      result = await parser.parseURL(source);
    } catch (e) {
      debug.error(`Can\`t parse rss: ${source}`);
      return [];
    }

    let that = this;

    if (result.items) {
      await result.items.forEach(item => {
        if (!this.isExistsLink(item.link)) {
          connectors.forEach((connector) => {
            let re = new RegExp(connector.testUrl(), 'ig');
            if (re.test(item.link)) {
              GrabberLink.create({link: item.link, site: that.getName()}, async (err, doc) => {
                if (!err) {
                  connector.parse(item.link).then((article) => {

                    if (article.content && article.title && item.pubDate) {

                      let entity = new Article();

                      let urlObject = Url.parse(item.link);

                      entity.url = item.link;
                      entity.source = urlObject.hostname;
                      entity.content = article.content;
                      entity.title = article.title;
                      entity.image = article.image || null;
                      entity.lang = connector.getLang();
                      entity.slug = slugify(article.title, {
                        replacement: '-',
                        lower: true
                      });
                      entity.date = item.pubDate;
                      entity.sportSlug = connector.getSport({url: item.link, content: article.content});
                      entity.tags = article.tags;
                      
                      entity.save((err) => {
                        if (err) throw err;
                      });
                    } else {
                      debug.error(`Article by URL "${item.link}" don\`t parsed. Check parser!`)
                    }
                  }).catch((e) => {
                    debug.error(`Article by URL "${item.link}" don\`t parsed. Check parser! Error: ${e}`);
                  })
                }
              });
            }
          });
        }
      })
    }
  }

  /*
   *
   * Загрузка и парсинг web страницы на наличие новых ссылок
   *
   */
  static async loadHtmlSource (source) {
    let response;
    let proxy = await Proxy.resolveProxy();

    try {
      //let options = (this['getRequestOptions']) ? this.getRequestOptions() : {};
      let options = {proxy: proxy};
      debug.log(`Send request via proxy ${proxy}`);
      response = await request(source, options);
    } catch (e) {
      debug.error(`Response with error. Next attempt!`);
      Proxy.removeProxy(proxy);
      return this.loadHtmlSource(source)
    }

    if (!response || [504, 403, 407].indexOf(response.statusCode) > -1) {
      debug.error(`Page "${url}" NOT loaded, response code ${response.statusCode}. Next attempt!`);
      Proxy.removeProxy(proxy);
      return this.loadHtmlSource(source)
    }

    let that = this;
    let links = [];

    if (response.statusCode === 200) {
      let $ = await cheerio.load(response.body);

      $('a').each(function () {
        let link = $(this).attr('href');
        link = (link && link[0] === '/' && link[1] !== '/') ? that.getHost() + $(this).attr('href') : $(this).attr('href');

        if (links.indexOf(link) === -1) {
          links.push(link);

          connectors.forEach((connector) => {
            let re = new RegExp(connector.testUrl(), 'ig');
            if (re.test(link)) {
              if (!that.isExistsLink(link)) {
                GrabberLink.create({link: link, site: that.getName()}, async (err, item) => {
                  if (!err) {
                    connector.parse(item.link).then((article) => {

                      if (article.content && article.title && article.date) {

                        let entity = new Article();

                        let urlObject = Url.parse(link);

                        entity.url = link;
                        entity.source = urlObject.hostname;
                        entity.content = article.content;
                        entity.title = article.title;
                        entity.image = article.image || null;
                        entity.lang = connector.getLang();
                        entity.slug = slugify(article.title, {
                          replacement: '-',
                          lower: true
                        });
                        entity.date = article.date;
                        entity.tags = article.tags;
                        entity.sportSlug = connector.getSport({url: link, content: article.content});

                        entity.save((err) => {
                          if (err) throw err;
                        });
                      } else {
                        debug.error(`Article by URL "${link}" don\`t parsed. Check parser!`)
                      }
                    }).catch((e) => {
                      debug.error(`Article by URL "${link}" don\`t parsed. Check parser! Error: ${e}`)
                    })
                  }
                });
              }
            }
          });
        }
      });
    }
  }
}