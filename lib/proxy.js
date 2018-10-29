'use strict';

require('dotenv').config();
import request from '../lib/async-request'

let debug = {log: require('debug')('proxy:log'), error: require('debug')('proxy:error')};
let interval = process.env.PROXY_UPDATE_INTERVAL || 60000;
let updatesCount = 0;
let timer;
let apiKey = process.env.PROXY_API_KEY || '';
let proxyUrl = `http://api.best-proxies.ru/proxylist.txt?key=${apiKey}&type=https&unique=1&response=300&limit=0&nocascade=1&includeType`;
let proxies = [];
let bannedProxy = [];

function startUpdate() {
  timer = setInterval(function () {
    updatesCount++;
    getProxyList()
  }, interval)
}

async function getProxyList() {
  debug.log(`Get proxy list. Attempt ${updatesCount}, interval ${interval}ms.`);
  let response = await request(proxyUrl)
  if (response.statusCode === 200) {
    if ((response.body.split("\r\n")).length){
      proxies = response.body.split("\r\n").filter(val => bannedProxy.indexOf(val.trim()) === -1)
      debug.log(`Success get proxy list! Proxy count ${(response.body.split("\n")).length}`)
    }
    else {
      debug.error(`Empty proxy list!`)
    }
  } else {
    debug.error(`Proxy list NOT loaded, response code ${response.statusCode}`)
    throw new Error(response.body)
  }
}

async function resolveProxy() {
  if (!timer) {
    await getProxyList();
    startUpdate()
  }
  return (proxies[Math.floor(Math.random() * proxies.length)]).trim();
}

function removeProxy (proxy) {
  debug.error(`Remove proxy ${proxy} from list`)
  bannedProxy.push(proxy)
  proxies = proxies.filter(val => val.trim() !== proxy)
}

export default {resolveProxy, removeProxy}