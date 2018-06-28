# Git相关配置及命令

## 命令

## 配置

### 提交保存密码
    git config --global credential.helper store 
    会在用户主目录的.gitconfig文件中生成下面的配置
    [credential]
        helper = store
    如果没有--global，则在当前项目下的.git/config文件中添加。

### windows下log乱码
    git config --global i18n.logoutputencoding gbk

### windows下commit乱码
    git config --global i18n.commitencoding utf-8

### windows下status乱码
    git config --global core.quotepath false
