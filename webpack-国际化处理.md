# 前端-国际化处理

## 需求点
原先中文项目，需要实现国际化

## 现有的库
* [react-intl](https://github.com/yahoo/react-intl)
```js
// en.js 英文
const en_US = {
  'hello': "hello",
  'name': 'my name is {name}'
}
export default en_US;

// zh.js 英文
const zh_CN = {
  'hello': "你好",
  'name': 'my name is {name}'
}
export default zh_CN;

// app.js 导入对应的i18n配置文件
import { addLocaleData, FormattedMessage } from 'react-intl';
import enLocaleData from 'react-intl/locale-data/en';
import zhLocaleData from 'react-intl/locale-data/zh';
import zh from './zh.js';
import en from './en.js';

addLocaleData([...enLocaleData, ...zhLocaleData]);

let lang = 'zh'

<IntlProvider locale={lang} messages={lang === 'zh' ? zh : en}>
  <App>
    <div></div>
    <FormattedMessage id="hello"/>
  </App>
</IntlProvider>
```
优点：React组件化，format多样化。缺点：无法在普通js文件中使用

* [react-intl-universal](https://github.com/alibaba/react-intl-universal)
```js
import intl from 'react-intl-universal';

const locales = {
  "en-US": require('./locales/en-US.js'),
  "zh-CN": require('./locales/zh-CN.js'),
};

intl.init({
  currentLocale: 'en-US', // TODO: determine locale here
  locales,
})
.then(() => {
  // After loading CLDR locale data, start to render
this.setState({initDone: true});
});

<div>
  {intl.get('SIMPLE')}
</div>

```
优点：react、原生js中可以统一使用函数获取的形形式获取文本  
**经过取舍后使用该方案**


## 代码批量替换实现
> 手动替换代码中时间成本太大，使用脚本实现

1. 使用webpack+babel生成的ast进行处理
2. 针对各种字符串进行处理
```javascript
//普通字符串
let a = '你好'; // let a = intl.get('hello');
let b = "你好"; // let b = intl.get("hello");

// jsx组件中文本
<Select placeholder="选择" /> // <Select placeholder={intl.get('select')} />
<Select placeholder={'选择'} /> // <Select placeholder={intl.get('select')} />
<Select placeholder={"选择"} /> // <Select placeholder={intl.get('select')} />
<View>查看</View> // <View>{intl.get('view')}</View>

// 对象key值，确定是否影响业务代码
{ '你好'： '11'} => { [intl.get('hello')]: '11'}

// 需要忽略注释中文

```

3. 匹配出中文文本后，使用[google-translate-api](https://github.com/matheuss/google-translate-api)翻译成对应的文本

4. 替换中文文本为英文key值变量

5. 生成对应语言的字典文件
