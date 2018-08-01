## 插件

### ALL Autocomplete
自动完成功能，在当前窗口的所有打开文件中查找匹配项

### AutoFilename
自动补全文件名

### DocBlockr
自动生成注释


### Emmet
html标签生成插件

### SublimeLinter，SublimeLinter-eslint
js校验

### Babel
js高亮

### html-css-js-prettify
代码格式化
```js
{
    "all":
    {
        "indent_size": 2, // 设置缩进为2
    },

    "js":
    {
        "e4x": true, // 支持jsx
    },
}
```


### scss
支持scss语法



### Markdown Preview
markdown浏览器端预览插件，使用 <kbd>ctrl+shift+p</kbd> 打开面板，选择`Preview in Brower`


### MarkdownLivePreview
markdown实时预览，设置：`Preferences → Package Settings → MarkdownLivePreview → Setting`，添加 "markdown_live_preview_on_open": true


### Table Editor
mardown表格编辑插件，`"enable_table_editor": true,` 开启tab快捷键


### Afterglow主题
[https://github.com/YabataDesign/afterglow-theme/issues](https://github.com/YabataDesign/afterglow-theme/issues)


### 全局配置
```js
{
  "color_scheme": "Packages/Theme - Afterglow/Afterglow.tmTheme", // 设置代码主题
  "enable_table_editor": true,
  "font_face": "Yahei Consolas Hybrid",
  "font_size": 10,
  "ignored_packages":
  [
    "Vintage"
  ],
  "sidebar_size_12": true,
  "tab_size": 2,
  "tabs_medium": true, // 设置tab尺寸
  "theme": "Afterglow.sublime-theme", // 设置ide主题
  "translate_tabs_to_spaces": true, // 使用空格代替tab符
  "update_check": true, // 是否检测更新
}

```
