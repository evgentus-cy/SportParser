import BaseGrabber from '../BaseGrabber';

export default class TheGuardianCom extends BaseGrabber {

  static getName () {
    return 'TheGuardianCom';
  }

  static getType () {
    return 'Rss';
  }

  static getSources () {
    return [
      'https://www.theguardian.com/football/rss'
    ]
  }

}