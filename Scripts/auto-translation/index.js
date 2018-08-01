const path = require('path');
const glob = require('glob');
const fs = require('fs-extra');
const translate = require('google-translate-api');

const config = {
  entry: {
    // log: 'E:/cdn_console_v2/cdn_web/src/pages/Log',
    // home: 'E:/cdn_console_v2/cdn_web/src/pages/Home',
    // app: 'E:/cdn_console_v2/cdn_web/src/pages/App',
    // auth: 'E:/cdn_console_v2/cdn_web/src/pages/Auth',
    // dispatch: 'E:/cdn_console_v2/cdn_web/src/pages/Dispatch',
    // doc: 'E:/cdn_console_v2/cdn_web/src/pages/Doc',
    // login: 'E:/cdn_console_v2/cdn_web/src/pages/Login',
    // monitor: 'E:/cdn_console_v2/cdn_web/src/pages/Monitor',
    // notfound: 'E:/cdn_console_v2/cdn_web/src/pages/NotFound',
    // order: 'E:/cdn_console_v2/cdn_web/src/pages/Order',
    // refresh: 'E:/cdn_console_v2/cdn_web/src/pages/Refresh',
    // ssl: 'E:/cdn_console_v2/cdn_web/src/pages/SSL',
    // stats: 'E:/cdn_console_v2/cdn_web/src/pages/Stats',
    // warngroup: 'E:/cdn_console_v2/cdn_web/src/pages/WarningGroup',
    domain: 'E:/cdn_console_v2/cdn_web/src/pages/Domain',
  },
  output: {
    dictionaryPath: 'E:/cdn_console_v2/cdn_web/src/dictionary'
  }
}

let dictionary = []; // 字典

translate('你好', { from: 'zh-cn', to: 'en' }).then(res => {
  console.log(res);
}).catch(err => {
  console.log('translate err')
});

// 匹配  >你好<  替换为 >{locale.get('hello')}<
async function parseStrOfJsx(moduleName, filename, context) {
  return new Promise(function(resolve, reject) {
    let reg = />[\u4e00-\u9fa5]+.*?</gi;
    let list = context.match(reg) || [];
    list = list.map(x => ({
      value: x,
      cn: x.replace(/>|</gi, ''),
      en: null
    }));


    let requests = []; // 请求
    list.forEach(x => {
      requests.push(translate(x.cn, { from: 'zh-cn', to: 'en' }));
    });

    Promise.all(requests).then((res) => {
      res.forEach((x, index) => {
        dictionary.push({ cn: list[index].cn, en: x.text });
        context = context.replace(list[index].value, `>{locale.get('${x.text}')}<`)
      });
      resolve(context);
    }).catch(err => {
      console.log(err);
    });
  });
}


async function parseStrOfObject(moduleName, filename, context) {
  return new Promise(function(resolve, reject) {
    let reg = /['"][\u4e00-\u9fa5]+?['"]\S{0,1}:/gi;
    let list = context.match(reg) || [];
    list = list.map(x => ({
      value: x,
      cn: x.replace(/['":]/gi, ''),
      en: null
    }));

    let requests = []; // 请求
    list.forEach(x => {
      requests.push(translate(x.cn, { from: 'zh-cn', to: 'en' }));
    });

    Promise.all(requests).then((res) => {
      res.forEach((x, index) => {
        dictionary.push({ cn: list[index].cn, en: x.text });
        context = context.replace(list[index].value, `[locale.get('${x.text}')]:`)
      });
      resolve(context);
    }).catch(err => {
      console.log(err);
    });
  });
}

// <input place="输入" /> 替换成 <input place={locale.get('insert')} />
async function parseStrOfProps(moduleName, filename, context) {
  return new Promise(function(resolve, reject) {
    let reg = /[a-z]+=['"][\u4e00-\u9fa5]+.*?['"]/gi;
    let list = context.match(reg) || [];

    list = list.map(x => ({
      value: x,
      valueOfBefore: x.split('=')[0],
      cn: x.split('=')[1].replace(/['":]/gi, ''),
      en: null
    }));

    let requests = []; // 请求
    list.forEach(x => {
      requests.push(translate(x.cn, { from: 'zh-cn', to: 'en' }));
    });

    Promise.all(requests).then((res) => {
      res.forEach((x, index) => {
        dictionary.push({ cn: list[index].cn, en: x.text });
        context = context.replace(list[index].value, `${list[index].valueOfBefore}={locale.get('${x.text}')}`)
      });
      resolve(context);
    }).catch(err => {
      console.log(err);
    });
  });
}

// '你好' 替换成 locale.get('hello')
async function parseStrOf(moduleName, filename, context) {
  return new Promise(function(resolve, reject) {
    let reg = /['"][\u4e00-\u9fa5]+.*?['"]/gi;
    let list = context.match(reg) || [];

    list = list.map(x => ({
      value: x,
      cn: x.replace(/['"]/gi, ''),
      en: null
    }));

    let requests = []; // 请求
    list.forEach(x => {
      requests.push(translate(x.cn, { from: 'zh-cn', to: 'en' }));
    });

    Promise.all(requests).then((res) => {
      res.forEach((x, index) => {
        dictionary.push({ cn: list[index].cn, en: x.text });
        context = context.replace(list[index].value, `locale.get('${x.text}')`)
      });
      resolve(context);
    }).catch(err => {
      console.log(err);
    });
  });
}


// 匹配剩余所有中文并替换，你好 替换成 {locale.get('hello')} ！！！会替换注释中文
async function parseStr(moduleName, filename, context) {
  return new Promise(function(resolve, reject) {
    let reg = /[\u4e00-\u9fa5]+.*?/gi;
    let list = context.match(reg) || [];

    list = list.map(x => ({
      value: x,
      cn: x.replace(/['"]/gi, ''),
      en: null
    }));

    let requests = []; // 请求
    list.forEach(x => {
      requests.push(translate(x.cn, { from: 'zh-cn', to: 'en' }));
    });

    Promise.all(requests).then((res) => {
      res.forEach((x, index) => {
        dictionary.push({ cn: list[index].cn, en: x.text });
        context = context.replace(list[index].value, `{locale.get('${x.text}')}`)
      });
      resolve(context);
    }).catch(err => {
      console.log(err);
    });
  });
}

// 添加 import locale from 'src/local';
async function insertImport(moduleName, filename, context) {
  return new Promise(function(resolve, reject) {
    let reg = /import[\S\s]+?from[\S\s]+?\n/gi;
    let list = context.match(reg) || [];

    let withImport = list.find(x => /locale/.test(x));
    // console.log(withImport);
    if (!withImport) {
      context = context.replace(list[list.length - 1], list[list.length - 1] + "import locale from 'src/local';\r\n");
    }

    // console.log(list);

    resolve(context);
  });
}



async function parse(moduleName, filename, context) {
  let res = context;
  res = await insertImport(moduleName, filename, res);
  res = await parseStrOfJsx(moduleName, filename, res);
  res = await parseStrOfObject(moduleName, filename, res);
  res = await parseStrOfProps(moduleName, filename, res);
  res = await parseStrOf(moduleName, filename, res);
  // res = await parseStr(moduleName, filename, res);
  // console.log(res);
  // console.log(dictionary);
  writeFile(moduleName, filename, res);
  writeDictionary(moduleName, dictionary);
}


function readFile(moduleName, filename) {
  fs.readFile(filename, { encoding: 'utf8' }).then(res => {
    parse(moduleName, filename, res);
  });
}


function writeFile(moduleName, filename, data) {
  fs.writeFile(filename, data, (err) => {
    if (err) throw err;
    console.log('File saved!');
  });
}

function writeDictionary(moduleName, data) {
  let enData = {};
  data.forEach(x => {
    let key = x.en.replace(/'|"/gi, '')
    enData[key] = key;
  });

  let cnData = {};
  data.forEach(x => {
    let key = x.en.replace(/'|"/gi, '')
    let value = x.cn.replace(/'|"/gi, '')
    cnData[key] = value;
  });


  fs.writeFile(config.output.dictionaryPath + '/' + moduleName + '-en-US.js', 'module.exports = ' + JSON.stringify(enData), (err) => {
    if (err) throw err;
    console.log('Dictionary saved!');
  });

  fs.writeFile(config.output.dictionaryPath + '/' + moduleName + '-cn-ZH.js', 'module.exports = ' + JSON.stringify(cnData), (err) => {
    if (err) throw err;
    console.log('Dictionary saved!');
  });
}


// 读取目录
function readPath(moduleName, modulePath) {
  glob(modulePath + '/*.?(jsx|js)', null, function(err, files) {
    console.log('files: ')
    console.log(files);
    files.forEach(f => readFile(moduleName, f));
  });
}


Object.keys(config.entry).forEach(k => {
  readPath(k, config.entry[k])
});