---
title: Win10镜像添加版本菜单选择
date: 2017-04-01
tags: git
---

# Win10镜像添加版本菜单选择

1. 新建记事本，并输入以下内容
```
[EditionID] 
[Channel]
Retail
[VL]
0
```

2. 重命名为ei.cfg

3. 解压我们的镜像，找到sources文件夹，将ei.cfg放到该目录

4. 重启继续进入系统安装

    ![](https://raw.githubusercontent.com/milolu/Blog/1685fe7c55374ad269391a2a5f9e5133819b7f0a/images/20180704223741.png)