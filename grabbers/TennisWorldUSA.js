import BaseGrabber from '../BaseGrabber';

export default class TennisWorldUSA extends BaseGrabber {

  static getName () {
    return 'TennisWorldUSA';
  }

  static getType () {
    return 'Rss';
  }

  static getSources () {
    return [
      'http://www.tennisworldusa.org/rss/news.php'
    ]
  }

}