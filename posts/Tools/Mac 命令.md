---
title: Mac 命令
date: 2018-11-21
tags: git
---

## open
> `open .` 在finder中打开此目录  
> `open -a TextEdit xx.xx` 自行选择打开的程序  
> `open -e xx.xx` 强制在TextEdit中编辑此文件  

## pbcopy pbpaste
> `ls ~ | pbcopy` 将当前目录列表写入到剪切板  
> `pbcopy < xx.xxx` 读取文件到剪切板  
> `pbpaste >> xx.xx` 将剪切板内容写入到文件中

## brew
> `brew install imagemagick` 安装ImageMagick  
> `/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"` 安装brew  
> `/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/uninstall)"` 卸载brew  
```shell
// 搜索包
brew search mysql
// 安装包
brew install mysql
// 查看包信息，比如目前的版本，依赖，安装后注意事项等
brew info mysql
// 卸载包
brew uninstall wget
// 显示已安装的包
brew list
// 查看brew的帮助
brew –help
// 更新， 这会更新 Homebrew 自己
brew update
// 检查过时（是否有新版本），这会列出所有安装的包里，哪些可以升级
brew outdated
brew outdated mysql
// 升级所有可以升级的软件们
brew upgrade
brew upgrade mysql
// 清理不需要的版本极其安装包缓存
brew cleanup
brew cleanup mysql
```

## [curl](http://www.ruanyifeng.com/blog/2011/09/curl.html)
> `curl "www.baidu.com"` get请求网页  
> `curl -X POST /api/post` 指定请求方式  
> `curl "/api/post" -X POST -d "{}"` post请求方式，带参数  
> `curl "/api/post" -X POST -d "{}" -H "Content-type: application/json" ` post请求方式，设置请求头  


## wget
> `wget http://www.linuxde.net/testfile.zip` 下载文件
> `wget -O wordpress.zip http://www.linuxde.net/download.aspx?id=1080` 重命名下载
> `wget --limit-rate=300k http://www.linuxde.net/testfile.zip` 限速下载
> `wget -c http://www.linuxde.net/testfile.zip` 断点续传
> `wget -b http://www.linuxde.net/testfile.zip` 后台下载
> `tail -f wget-log` 查看后台下载

## pushd popd
> `pushd` 将当前路径存储
> `popd` 回到先前保存的路径

## touch
> `touch a.txt` 创建文件

## cla
> `cal -m 10` 查看10月 

## grep 

## find

## gzip

## launchctl
> `sudo launchctl load -w /System/Library/LaunchDaemons/org.apache.httpd.plist` 添加开机启动脚本

## say
> `say "Never trust a computer you can't lift."` 语音输出
> `say -f mynovel.txt -o myaudiobook.aiff` 读取文件，输出到音频文件


## 链接
[Apple macOS command](https://ss64.com/osx/)  
[Linux命令大全](http://man.linuxde.net/)
[8个不可不知的Mac OS X专用命令行工具](https://segmentfault.com/a/1190000000509514)  
[linux特殊符号大全](https://www.cnblogs.com/balaamwe/archive/2012/03/15/2397998.html)  
