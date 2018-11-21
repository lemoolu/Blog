const axios = require('axios');
const moment = require('moment');

const tryCount = 10; // 每秒钟次数
const start = '2018-10-31 20:00'; // 开始时间
const url = '';
const headers = {

};

function jQuery9555886(data) {
  console.info(moment(t).format('HH:mm:ss.SSS'), data.data.resultMsg);
}

function send() {
  var t = new Date().valueOf();
  console.log('!!actioning');
  console.log(t);

  axios({
    method: 'get',
    url: 'https://act-jshop.jd.com/couponSend.html',
    headers: {
      'Accept': '*/*',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept-Language': 'zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2',
      'Connection': 'keep-alive',
      'Cookie': '__jda=122270672.15409656840982144290067.1540965684.1540965684.1540965684.1; __jdc=122270672; __jdv=122270672|direct|-|none|-|1540965684099; __jdu=15409656840982144290067; shshshfp=f475a255a3a083e26de8363e35ba7cb9; shshshfpa=bbbf4a45-3e18-1504-68a6-758f8422666c-1540965685; shshshfpb=09861417496845a26ee54c12118d444f687bf136012899d195bd94535a; user-key=f1bbc1cf-6fd9-4b53-83d8-23642f8667b3; cn=0; 3AB9D23F7A4B3C9B=DHDJ4MR5COSUJECNZVPAJ6NIF4XY4GLUWIYEASUUNK4MVZDR4N6M3H5YKBLL26NJTF7RFGMCJJOIKTDQ5T76LW4EQI; wlfstk_smdl=fnx10z8zxwj5wfxa0viurbc2dqwex38c; TrackID=1Pv124S0RXTsXpfQkcEhUhuiplBZnU09FfaVkWzieYQwtCJnd75kFEeOlR-kuukObhluMePUv1bp98UbEpE3EGejiyEhhW8-PprDIR4Ft66WaWEC4L15jJarAUzBE2L2y; thor=3ED26258DD52821ECCB75F274715C1D3C03B9B4428DA6380C8C3FB5BC253C0D50A0AE06E55219A596DAA81989AFBE9B06E2D61A5BA65301C49ED1467F68E753D3F28A9FC532D7AD6200EAE56BBCC812808B7F8EC20898B12DB1902DAD09871C53E8EBF556AF64A567BC6FF7CD2C9E2212C1C48B6DB0751B75BC51E5F4F103F2F1368A30F53270E469E3816067FEBA1DC; pinId=Z_DAFVqLgdm1ffsfn98I-w; pin=lomo_hao; unick=lomo_hao; ceshi3.com=103; _tp=rXkK%2FUR%2FulQpoqO14HwQ9w%3D%3D; _pst=lomo_hao; ipLoc-djd=1-72-2799-0; ipLocation=%u5317%u4EAC; areaId=1',
      'Host': 'act-jshop.jd.com',
      'Referer': 'https://sale.jd.com/act/XmPhIL3cHikZaq.html?cpdad=1DLSUE',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.13; rv:63.0) Gecko/20100101 Firefox/63.0',
    },
    params: {
      '_': t,
      'applicationId': '1646990',
      'callback': 'jQuery9555886',
      'eid': '6JRRFNJQTNL2OXJOYFKSIR5KIPW6AHGZ5HC4AD2U664HBAUBALLTGEBZAJMBQEROMBNHKR7LV6Z53TZ4KSRE4OVZLU',
      'fp': '431e1a9b6ea8863a9a5710fa58ead987',
      'jda': '122270672.15409656840982144290067.1540965684.1540965684.1540965684.1',
      'key': 'f3350be6064046cea24eac05e177d9ae',
      'pageClickKey': 'pageclick|keycount|coupon_simple_38658951_1|0',
      'platform': '0',
      'ruleId': '15112645',
      'shshshfp': 'f475a255a3a083e26de8363e35ba7cb9',
      'shshshfpa': 'bbbf4a45-3e18-1504-68a6-758f8422666c-1540965685',
      'shshshfpb': '09861417496845a26ee54c12118d444f687bf136012899d195bd94535a',
    }
  }).then(res => {
    console.log(res.data);
  });
}


function live(startValue) {
  const current = moment().valueOf();
  if (current > startValue) {
    console.log('已经结束');
    return;
  }
  if (startValue - current > 2000) {
    console.error('!!等待开始', start);
    setTimeout(() => live(startValue), 1000);
    return;
  }

  const interval = setInterval(send, 1000 / tryCount);
  setTimeout(() => {
    console.log('抢券结束');
    clearInterval(interval);
  }, 5000);
}

function main() {
  if (!start) {
    console.error('设置开始时间');
  }
  console.error('!!run');
  console.log('测试请求')
  send();
  const startValue = moment(start).valueOf();
  live(startValue);
}
main();
