import BaseGrabber from '../BaseGrabber';

export default class RsportRiaRu extends BaseGrabber {

  static getName () {
    return 'RsportRiaRu';
  }

  static getType () {
    return 'Rss';
  }

  static getSources () {
    return [
      'https://rsport.ria.ru/export/rss2/tennis/index.xml',
      'https://rsport.ria.ru/export/rss2/hockey/index.xml',
      'https://rsport.ria.ru/export/rss2/football/index.xml',
      'https://rsport.ria.ru/export/rss2/basketball/index.xml'
    ]
  }

}