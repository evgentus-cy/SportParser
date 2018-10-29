import BaseGrabber from '../BaseGrabber';

export default class SportBoxRu extends BaseGrabber {

  static getName () {
    return 'SportBoxRu';
  }

  static getType () {
    return 'Html';
  }

  static getSources () {
    return [
      'https://news.sportbox.ru/Vidy_sporta/Futbol',
      'https://news.sportbox.ru/Vidy_sporta/Hokkej',
      'https://news.sportbox.ru/Vidy_sporta/Basketbol',
      'https://news.sportbox.ru/Vidy_sporta/Tennis'
    ];
  }

  static getHost () {
    return 'https://news.sportbox.ru'
  }

}