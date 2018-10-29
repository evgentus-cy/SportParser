import BaseGrabber from '../BaseGrabber';

export default class SportsDailyRu extends BaseGrabber {

  static getName () {
    return 'SportsDailyRu';
  }

  static getType () {
    return 'Rss';
  }

  static getSources () {
    return [
      'https://www.sportsdaily.ru/news.rss'
    ]
  }

}