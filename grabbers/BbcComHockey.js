import BaseGrabber from '../BaseGrabber';

export default class BbcComHockey extends BaseGrabber {

  static getName () {
    return 'BbcComHockey';
  }

  static getType () {
    return 'Rss';
  }

  static getSources () {
    return [
      'http://feeds.bbci.co.uk/sport/59ac9a3a-5a8f-4143-bd71-3268762cefc1/rss.xml'
    ]
  }

}