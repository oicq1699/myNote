# MyNote 简介
默认用户名/密码:admin/123456
MyNote fork 于 MinDoc，MinDoc 是一款针对IT团队开发的简单好用的文档管理系统。

分叉的原因是每个人的口味并不相同，这个笔记主要是自己用的，所以基于MinDoc，做些改造，更合自己的口味，让自己用的更舒服一点。


我个人不太喜欢nodejs和npm生态，特别是在一些小项目上，我觉得他们会把简单事情复杂化（想像一下你只是想做个简单的编辑页面，一不小心就会像钓带鱼一样钓上成百上千个js，更不用说一堆Deprecated 和版本不兼容的报错....）。所以这个小项目的前端，我只使用直接能引用的js,css,尽量不用带min的，这样有啥问题就直接改。

帮助使用手册完全可以参考MinDoc。

## 常规编译
```bash
# 克隆源码
git clone https://github.com/mindoc-org/mindoc.git
# go包安装
go mod tidy -v
# 编译(sqlite需要CGO支持)
go build -ldflags "-w" -o mindoc main.go
# 数据库初始化(此步骤执行之前，需配置`conf/app.conf`)
./mindoc install
# 执行
./mindoc
# 开发阶段运行
bee run

# 调试
main.go
```


>如果下文所列的一些调整项，对你而言并不需要，建议你还是使用原版MinDoc.原版的维护更有保障





## MinDoc适合我的地方
- 网页应用，不需要专门的app，因为是基于服务端的，所以也不存在同步的问题，而我在手机端，基本上不会做编辑，最多就是浏览一下
- markdown 格式，非专有格式保证数据可移植性
## 我已调整的项
- 编辑器：原有的编辑器编辑视图和预览视图不能很好的同步滚动，特别是贴比较多图的时候，两边能差一页以上，所以我最后把编辑器改成toastui-editor了
- 浏览界面：原有的浏览界面，在显示代码时，区块高度不够，需要用区块内滚动条来查看整个代码块，这块我也用不习惯，所以后面也改成toastui-editor-viewer了
- toc,toastui-editor-viewer自身并没有toc概念，当文章比较长的时候，想按目录查看就会比较麻烦，所以改造了一下toastui-editor 和 mindoc，让mindoc右侧的toc栏适应toastui-editor,这块也用到了markdown-toc/markdown-toc.js 的部分代码
## 后期开发计划
- toc栏双向交互
- 标题栏下方显示文章所在目录
- 左侧加一个打开文件历史记录
- 图片粘贴toastui-editor-viewer 是直接转成base64内嵌，这个有优点也有缺点，优点是不用单独找文件夹放图片了，缺点是文章上base64占的量太大了，会有断裂感




## 使用到的技术
- [Mindoc](https://github.com/mindoc-org/mindoc) 本项目的主框架，感谢作者 lifei6671 创造了MinDoc，并持续维护了很久。感谢社区(github组织mindoc-org)继续维护
  - Beego 1.10.0
  - MySQL 5.6
  - editor.md Markdown 编辑器
  - Bootstrap 3.2
  - jQuery 库
  - WebUploader 文件上传框架
  - NProgress 库
  - jsTree 树状结构库
  - Font Awesome 字体库
  - Cropper 图片剪裁库
  - layer 弹出层框架
  - highlight.js 代码高亮库
  - to-markdownTurndown HTML转Markdown库
  - quill 富文本编辑器
  - wangEditor 富文本编辑器
  - wangEditor v4.7 富文本编辑器教程
  - Vue.js 框架
- [markdown-toc](https://github.com/wzd521314/markdown-toc) 生成toc边栏使用了部分代码
- [TOAST UI Editor](https://github.com/nhn/tui.editor) markdown编辑及浏览主要使得了该编辑器

---
>下面是mindoc的介绍，摘之其官网,向原作者致敬，终于让我找到了一个合适的文档管理软件
## MinDoc 简介


[![Build Status](https://travis-ci.com/mindoc-org/mindoc.svg?branch=master)](https://travis-ci.com/mindoc-org/mindoc)
[![Build status](https://ci.appveyor.com/api/projects/status/7680ia6mu29m12wx?svg=true)](https://ci.appveyor.com/project/mindoc-org/mindoc)

MinDoc 是一款针对IT团队开发的简单好用的文档管理系统。

MinDoc 的前身是 [SmartWiki](https://github.com/lifei6671/SmartWiki) 文档系统。SmartWiki 是基于 PHP 框架 laravel 开发的一款文档管理系统。因 PHP 的部署对普通用户来说太复杂，所以改用 Golang 开发。可以方便用户部署和实用。

开发缘起是公司IT部门需要一款简单实用的项目接口文档管理和分享的系统。其功能和界面源于 kancloud 。

可以用来储存日常接口文档，数据库字典，手册说明等文档。内置项目管理，用户管理，权限管理等功能，能够满足大部分中小团队的文档管理需求。

##### 演示站点&文档:
- https://www.iminho.me/wiki/docs/mindoc/
- https://doc.gsw945.com/docs/mindoc-docs/

---

|aa|bb|cc|dd|
|---|--|--|--|
|a|b|c|d|
|a|b|c|d|

### 安装与使用

**如果你的服务器上没有安装golang程序请手动设置一个环境变量如下：键名为 ZONEINFO，值为MinDoc跟目录下的/lib/time/zoneinfo.zip 。**

更多信息请查看手册： [MinDoc 使用手册](https://www.iminho.me/wiki/docs/mindoc/mindoc-summary.md)

对于没有Golang使用经验的用户，可以从 [https://github.com/mindoc-org/mindoc/releases](https://github.com/mindoc-org/mindoc/releases) 这里下载编译完的程序。

如果有Golang开发经验，建议通过编译安装，要求golang版本不小于1.15.1(需支持`CGO`、`go mod`和`import _ "time/tzdata"`)(推荐Go版本为1.18.1)。
> 注意: CentOS7上GLibC版本低，常规编译版本不能使用。需要自行源码编译,或使用使用musl编译版本。

### 常规编译
```bash
# 克隆源码
git clone https://github.com/mindoc-org/mindoc.git
# go包安装
go mod tidy -v
# 编译(sqlite需要CGO支持)
go build -ldflags "-w" -o mindoc main.go
# 数据库初始化(此步骤执行之前，需配置`conf/app.conf`)
./mindoc install
# 执行
./mindoc
# 开发阶段运行
bee run
```

MinDoc 如果使用MySQL储存数据，则编码必须是`utf8mb4_general_ci`。请在安装前，把数据库配置填充到项目目录下的 `conf/app.conf` 中。



如果使用 `SQLite` 数据库，则直接在配置文件中配置数据库路径即可.

如果conf目录下不存在 `app.conf` 请重命名 `app.conf.example` 为 `app.conf`。

**默认程序会自动初始化一个超级管理员用户：admin 密码：123456 。请登录后重新设置密码。**

### Linux系统中不依赖gLibC的编译方式

#### 安装 musl-gcc
```bash
wget -c http://www.musl-libc.org/releases/musl-1.2.2.tar.gz
tar -xvf musl-1.2.2.tar.gz
cd musl-1.2.2
./configure
make
sudo make install
```
#### 使用 musl-gcc 编译 mindoc
```bash
go mod tidy -v
export GOARCH=amd64
export GOOS=linux
# 设置使用musl-gcc
export CC=/usr/local/musl/bin/musl-gcc
# 设置版本
export TRAVIS_TAG=temp-musl-v`date +%y%m%d`
go build -v -o mindoc_linux_musl_amd64 -ldflags="-linkmode external -extldflags '-static' -w -X 'github.com/mindoc-org/mindoc/conf.VERSION=$TRAVIS_TAG' -X 'github.com/mindoc-org/mindoc/conf.BUILD_TIME=`date`' -X 'github.com/mindoc-org/mindoc/conf.GO_VERSION=`go version`'"
# 验证
./mindoc_linux_musl_amd64 version
```


```ini
#邮件配置-示例
#是否启用邮件
enable_mail=true
#smtp服务器的账号
smtp_user_name=admin@iminho.me
#smtp服务器的地址
smtp_host=smtp.ym.163.com
#密码
smtp_password=1q2w3e__ABC
#端口号
smtp_port=25
#邮件发送人的地址
form_user_name=admin@iminho.me
#邮件有效期30分钟
mail_expired=30
```


### 使用Docker部署
如果是Docker用户，可参考项目内置的Dockerfile文件自行编译镜像(编译命令见Dockerfile文件底部注释，仅供参考)。

在启动镜像时需要提供如下的常用环境变量(全部支持的环境变量请参考: [`conf/app.conf.example`](https://github.com/mindoc-org/mindoc/blob/master/conf/app.conf.example))：
```ini
DB_ADAPTER                  指定DB类型(默认为sqlite)
MYSQL_PORT_3306_TCP_ADDR    MySQL地址
MYSQL_PORT_3306_TCP_PORT    MySQL端口号
MYSQL_INSTANCE_NAME         MySQL数据库名称
MYSQL_USERNAME              MySQL账号
MYSQL_PASSWORD              MySQL密码
HTTP_PORT                   程序监听的端口号
MINDOC_ENABLE_EXPORT        开启导出(默认为false)
```

#### 举个栗子-当前(公开)镜像(信息页面: https://cr.console.aliyun.com/images/cn-hangzhou/mindoc-org/mindoc/detail , 需要登录阿里云账号才可访问列表)
##### Windows
```bash
set MINDOC=//d/mindoc
docker run -it --name=mindoc --restart=always -v "%MINDOC%/conf":"/mindoc/conf" -p 8181:8181 -e MINDOC_ENABLE_EXPORT=true -d registry.cn-hangzhou.aliyuncs.com/mindoc-org/mindoc:v2.1
```

##### Linux、Mac
```bash
export MINDOC=/home/ubuntu/mindoc-docker
docker run -it --name=mindoc --restart=always -v "${MINDOC}/conf":"/mindoc/conf" -p 8181:8181 -e MINDOC_ENABLE_EXPORT=true -d registry.cn-hangzhou.aliyuncs.com/mindoc-org/mindoc:v2.1
```

##### 举个栗子-更多环境变量示例(镜像已过期，仅供参考，请以当前镜像为准)
```bash
docker run -p 8181:8181 --name mindoc -e DB_ADAPTER=mysql -e MYSQL_PORT_3306_TCP_ADDR=10.xxx.xxx.xxx -e MYSQL_PORT_3306_TCP_PORT=3306 -e MYSQL_INSTANCE_NAME=mindoc -e MYSQL_USERNAME=root -e MYSQL_PASSWORD=123456 -e httpport=8181 -d daocloud.io/lifei6671/mindoc:latest
```

#### dockerfile内容参考
- [无需代理直接加速各种 GitHub 资源拉取 | 国内镜像赋能 | 助力开发](https://blog.frytea.com/archives/504/)
- [阿里云 - Ubuntu 镜像](https://developer.aliyun.com/mirror/ubuntu)

### docker-compose 一键安装

1. 修改配置文件
    修改`docker-compose.yml`中的配置信息，主要修改`volumes`节点，将宿主机的两个目录映射到容器内。
    `environment`节点，配置自己的环境变量。
    
2. 一键完成所有环境搭建
    
    > docker-compose up -d
3. 浏览器访问
    > http://localhost:8181/

    整个部署完成了
4. 常用命令参考
   - 启动
        
        > docker-compose up -d
   - 停止
        
        > docker-compose stop
   - 重启
        
        > docker-compose restart
   - 停止删除容器，释放所有资源
        
        > docker-compose down
   - 删除并重新创建
        > docker-compose -f docker-compose.yml down && docker-compose up -d
        > 
        > 更多 docker-compose 的使用相关的内容 请查看官网文档或百度
   



### 使用的技术(TODO: 最新技术栈整理中，使用的第三方库升级中)

- [Beego](https://github.com/beego/beego) ~~1.10.0~~
- MySQL 5.6
- [editor.md](https://github.com/pandao/editor.md) Markdown 编辑器
- [Bootstrap](https://github.com/twbs/bootstrap) 3.2
- [jQuery](https://github.com/jquery/jquery) 库
- [WebUploader](https://github.com/fex-team/webuploader) 文件上传框架
- [NProgress](https://github.com/rstacruz/nprogress) 库
- [jsTree](https://github.com/vakata/jstree) 树状结构库
- [Font Awesome](https://github.com/FortAwesome/Font-Awesome) 字体库
- [Cropper](https://github.com/fengyuanchen/cropper) 图片剪裁库
- [layer](https://github.com/sentsin/layer) 弹出层框架
- [highlight.js](https://github.com/highlightjs/highlight.js) 代码高亮库
- ~~to-markdown~~[Turndown](https://github.com/domchristie/turndown) HTML转Markdown库
- ~~quill 富文本编辑器~~
- [wangEditor](https://github.com/wangeditor-team/wangEditor) 富文本编辑器
  - 参考
    - [wangEditor v4.7 富文本编辑器教程](https://www.bookstack.cn/books/wangeditor-4.7-zh)
    - [扩展菜单注册太过繁琐 #2493](https://github.com/wangeditor-team/wangEditor/issues/2493)
  - 工具： `https://babeljs.io/repl` + `@babel/plugin-transform-classes`
- [Vue.js](https://github.com/vuejs/vue) 框架


### 主要功能

- 项目管理，可以对项目进行编辑更改，成员添加等。
- 文档管理，添加和删除文档等。
- 评论管理，可以管理文档评论和自己发布的评论。
- 用户管理，添加和禁用用户，个人资料更改等。
- 用户权限管理 ， 实现用户角色的变更。
- 项目加密，可以设置项目公开状态，私有项目需要通过Token访问。
- 站点配置，可开启匿名访问、验证码等。



### 关于作者[lifei6671](https://github.com/lifei6671)

一个不纯粹的PHPer，一个不自由的 gopher 。

