import BaseGrabber from '../BaseGrabber';

export default class BasketballInsidersCom extends BaseGrabber {

  static getName () {
    return 'BasketballInsidersCom';
  }

  static getType () {
    return 'Rss';
  }

  static getSources () {
    return [
      'http://www.basketballinsiders.com/feed/'
    ]
  }

}