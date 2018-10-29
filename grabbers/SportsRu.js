import BaseGrabber from '../BaseGrabber';

export default class SportsRu extends BaseGrabber {

  static getName () {
    return 'SportsRu';
  }

  static getType () {
    return 'Rss';
  }

  static getSources () {
    return  [
      //'https://www.sports.ru/rss/main.xml',
      'https://www.sports.ru/rss/all_news.xml',
      //'https://www.sports.ru/rss/rubric.xml?s=208'
    ]
  }

}