import BaseGrabber from '../BaseGrabber';

export default class ChampionatCom extends BaseGrabber {

  static getName () {
    return 'ChampionatCom';
  }

  static getType () {
    return 'Rss';
  }

  static getSources () {
    return [
      'https://www.championat.com/rss/news/'
    ];
  }

}