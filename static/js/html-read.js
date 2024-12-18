var events = function () {
    var articleOpen = function (event, $param) {
        //当打开文档时，将文档ID加入到本地缓存。
        window.sessionStorage && window.sessionStorage.setItem("MinDoc::LastLoadDocument:" + window.book.identify, $param.$id);
        var prevState = window.history.state || {};
        if ('pushState' in history) {
            if ($param.$id) {
                prevState.$id === $param.$id || window.history.pushState($param, $param.$id, $param.$url);
            } else {
                window.history.pushState($param, $param.$id, $param.$url);
                window.history.replaceState($param, $param.$id, $param.$url);
            }
        } else {
            window.location.hash = $param.$url;
        }

        initHighlighting();
        $(window).resize();

        $(".manual-right").scrollTop(0);
        //使用layer相册功能查看图片
        layer.photos({photos: "#page-content"});
    };

    return {
        data: function ($key, $value) {
            $key = "MinDoc::Document:" + $key;
            if (typeof $value === "undefined") {
                return $("body").data($key);
            } else {
                return $('body').data($key, $value);
            }
        },
        trigger: function ($e, $obj) {
            if ($e === "article.open") {
                articleOpen($e, $obj);
            } else {
                $('body').trigger('article.open', $obj);
            }
        }
    }

}();

function format($d) {
    return $d < 10 ? "0" + $d : "" + $d;
}

function timeFormat($time) {
    var span = Date.parse($time)
    var date = new Date(span)
    var year = date.getFullYear();
    var month = format(date.getMonth() + 1);
    var day = format(date.getDate());
    var hour = format(date.getHours());
    var min = format(date.getMinutes());
    var sec = format(date.getSeconds());
    return year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec;
}

// 点击翻页
function pageClicked($page, $docid) {
    if (!window.IS_DISPLAY_COMMENT) {
        return;
    }
    $("#articleComment").removeClass('not-show-comment');
    $.ajax({
        url : "/comment/lists?page=" + $page + "&docid=" + $docid,
        type : "GET",
        success : function ($res) {
            console.log($res.data);
            loadComment($res.data.page, $res.data.doc_id);
        },
        error : function () {
            layer.msg("加载失败");
        }
    });
}

// 加载评论
function loadComment($page, $docid) {
    $("#commentList").empty();
    var html = ""
    var c = $page.List;
    for (var i = 0; c && i < c.length; i++) {
        html += "<div class=\"comment-item\" data-id=\"" + c[i].comment_id + "\">";
            html += "<p class=\"info\"><a class=\"name\">" + c[i].author + "</a><span class=\"date\">" + timeFormat(c[i].comment_date) + "</span></p>";
            html += "<div class=\"content\">" + c[i].content + "</div>";
            html += "<p class=\"util\">";
                if (c[i].show_del == 1) html += "<span class=\"operate toggle\">";
                else html += "<span class=\"operate\">";
                    html += "<span class=\"number\">" + c[i].index + "#</span>";
                    if (c[i].show_del == 1) html += "<i class=\"delete e-delete glyphicon glyphicon-remove\" style=\"color:red\" onclick=\"onDelComment(" + c[i].comment_id + ")\"></i>";
                html += "</span>";
            html += "</p>";
        html += "</div>";
    }
    $("#commentList").append(html);

    if ($page.TotalPage > 1) {
        $("#page").bootstrapPaginator({
            currentPage: $page.PageNo,
            totalPages: $page.TotalPage,
            bootstrapMajorVersion: 3,
            size: "middle",
            onPageClicked: function(e, originalEvent, type, page){
                pageClicked(page, $docid);
            }
        });
    } else {
        $("#page").find("li").remove();
    }
}

// 删除评论
function onDelComment($id) {
    console.log($id);
    $.ajax({
        url : "/comment/delete",
        data : {"id": $id},
        type : "POST",
        success : function ($res) {
            if ($res.errcode == 0) {
                layer.msg("删除成功");
                $("div[data-id=" + $id + "]").remove();
            } else {
                layer.msg($res.message);
            }
        },
        error : function () {
            layer.msg("删除失败");
        }
    });
}




function markdownToc(contentSelector,tocSelector) {

  
   // let selector=document.getElementById(selectorId);
    //获取到markdown文章全部内容的子节点列表
    let allNodes = document.querySelector(contentSelector).childNodes
    let maxLevel = 2
    
    //设置目录跳转滑动的动画，注意有兼容性问题
    document.documentElement.style["scroll-behavior"] = "smooth"
  
    //创建正则表达式，用来匹配节点名为h开头的2-6标签（其实就是所有的h1-h6标签）
    let nodeExp = /H[2-6]/i;
    let nodeList = []
    //debugger
    for( let node of allNodes) {
      if(nodeExp.test(node.nodeName)) {
        //初始化一个对象，用它来保存所有的H开头的节点的节点本身、对应的目录名称、以及提取H后面的数字来进行目录的分级
        let nodeInfo = {}
        nodeInfo.nodeObject = node;
        nodeInfo.content = node.innerText;
        nodeInfo.level = [...node.nodeName][1] * 1
        nodeInfo.topDistance = node.offsetTop
        nodeInfo.offsetParent = node.offsetParent
        nodeList.push(nodeInfo)
      }
    }

    //根据NodeList的内容自动生成节点列表
    //let Toc = document.createElement('div')
    let Toc =  document.querySelector(tocSelector)
    let TocItem = '<ul class="markdown-toc-list">'
    //Toc.className = 'markdown_toc22'
    for(let i=0; i<nodeList.length; i++) {
      TocItem += `<li class="directory-item  " > <a class="directory-item-link directory-item-link-${nodeList[i].level}" name= "${nodeList[i].nodeObject.id}" level=${nodeList[i].level}>${nodeList[i].content}</a> </li>`
    }
    Toc.innerHTML = `${TocItem}</ul>`
  
    // for(let node of Toc.childNodes) {
    //   node.style.left = (node.getAttribute('level') - maxLevel) * 12 + 'px'
    // }
  
  
    // addStyleNode(`.currentToc{ color: #42b983; border-right: solid 2px}
    // .markdown_toc22{position: fixed;top: 20%; transform: translateY(-50%); ;right: 300px; color: #505d6b;} 
    // .markdown_toc22 a{display: block;font-size: 16px;font-weight: 400;overflow: hidden;text-decoration: none;text-overflow: ellipsis;white-space: nowrap; padding: 6px 10px 6px 0; position: relative;}
    //  `)
  
    
    
    
    
    
    Toc.onclick = function (event) {
      //点击目录栏时先屏蔽一下监听滚动的程序
  
      //获取到当前目录以及所对应的h元素
      let currentTocNode = event.target
      let currentNode = document.getElementById(currentTocNode.name)
  
      currentNode.scrollIntoView(true);
      
      
      //给当前目录的a标签添加动态类
      //toggleClass(Toc.childNodes, currentTocNode, 'currentToc')
      //toggleClass(nodeList, currentNode, ".currentToc")
      
      //一秒钟后再重新监听鼠标滚动
      
    }
  
  
    let fn = function() {
      for (let node of Toc.childNodes) {
        node.classList.remove('currentToc')
      }
  
      for(let i =0; i<[...Toc.childNodes].length; i++) {
        
        if(document.documentElement.scrollTop > nodeList[i].topDistance - 2) {
          toggleClass(Toc.childNodes,Toc.childNodes[i],'currentToc')
        }
      }
      // for (let element of Toc.childNodes) {
      //   console.log(document.getElementById(element.name).offsetTop);
        
      //   if(document.documentElement.scrollTop > document.getElementById(element.name).offsetTop - 2) {
      //     toggleClass(Toc.childNodes,element,'currentToc')
      //   }
      // }
  
      console.log(document.documentElement.scrollTop);
      
    }
    
    document.body.onscroll = debounce(fn, 10)
  
    //往body元素内添加此目录元素
    return Toc
  }
  
  //新建一个style标签，采用传统的CSS写法后传入str参数即可
  function addStyleNode(str){
    var styleNode=document.createElement("style");
    styleNode.type="text/css";
    if( styleNode.styleSheet){         //
      styleNode.styleSheet.cssText=	str;       //ie下要通过 styleSheet.cssText写入. 
    }else{
      styleNode.innerHTML=str;	   //在ff中， innerHTML是可读写的，但在ie中，它是只读的. 
    }
    document.getElementsByTagName("head")[0].appendChild( styleNode );
   }
  
  //切换动态类函数,将节点列表和当前切换的节点以及动态类传入进来
  function toggleClass(nodeList,currentNode, className) {
    
    if(currentNode.nodeName == 'A') {
      for(let node of nodeList) {
        node.classList.remove(className)
      }
      currentNode.classList.add(className)
    }
  }
  
  //防抖函数
  function debounce(fn, delay) {
    let time = null
    return function () {
      //如果之前被设置了定时器则清除
      let args = arguments
      let that = this
      if(time) {
        clearTimeout(time)
      }
      
      //然后重新设置一个定时器
      time = setTimeout(fn.bind(that, args), delay)
    }
  }


// 重新渲染页面
function renderPage($data) {
    $("#page-content").html($data.body);
    $("title").text($data.title);
    $("#article-title").text($data.doc_title);
    $("#article-info").text($data.doc_info);
    $("#view_count").text("阅读次数：" + $data.view_count);
    $("#doc_id").val($data.doc_id);
    if(window.viewer){
        //debugger
        window.viewer.setMarkdown($data.markdown);
        markdownToc(".toastui-editor-contents","#page-content2-right-tab")
    }
    if ($data.page) {
        loadComment($data.page, $data.doc_id);
    }
    else {
        pageClicked(-1, $data.doc_id);
    }
}

/***
 * 加载文档到阅读区
 * @param $url
 * @param $id
 * @param $callback
 */
function loadDocument($url, $id, $callback) {
    $.ajax({
        url : $url,
        type : "GET",
        beforeSend : function () {
            var data = events.data($id);
            if(data) {
                if (typeof $callback === "function") {
                    data.body = $callback(data.body);
                }else if(data.version && data.version != $callback){
                    return true;
                }
                renderPage(data);

                events.trigger('article.open', {$url: $url, $id: $id});

                return false;

            }

            NProgress.start();
        },
        success : function ($res) {
            if ($res.errcode === 0) {
                renderPage($res.data);

                $body = $res.data.body;
                if (typeof $callback === "function" ) {
                    $body = $callback($body);
                }

                events.data($id, $res.data);

                events.trigger('article.open', { $url : $url, $id : $id });
            } else if ($res.errcode === 6000) {
                window.location.href = "/";
            } else {
                layer.msg("加载失败");
            }
        },
        complete : function () {
            NProgress.done();
        },
        error : function () {
            layer.msg("加载失败");
        }
    });
}

/**
 * 初始化代码高亮
 */
function initHighlighting() {
    try {
        $('pre,pre.ql-syntax').each(function (i, block) {
            if ($(this).hasClass('prettyprinted')) {
                return;
            }
            hljs.highlightBlock(block);
        });
        // hljs.initLineNumbersOnLoad();
    }catch (e){
        console.log(e);
    }
}
/**
 * 生成 table of contents
 * @param  $contentElement 
 */
function generateLinkMarkup($contentElement) {

    const headings = [...$contentElement.querySelectorAll('h1, h2')]
  const parsedHeadings = headings.map(heading => {
    return {
      title: heading.innerText,
      depth: heading.nodeName.replace(/\D/g,''),
      id: heading.getAttribute('id')
    }
  })
  console.log(parsedHeadings)

 

}








$(function () {
    $(".view-backtop").on("click", function () {
        $('.manual-right').animate({ scrollTop: '0px' }, 200);
    });
    $(".manual-right").scroll(function () {
        try {
            var top = $(".manual-right").scrollTop();
            if (top > 100) {
                $(".view-backtop").addClass("active");
            } else {
                $(".view-backtop").removeClass("active");
            }
        }catch (e) {
            console.log(e);
        }

        try{
            var scrollTop = $("body").scrollTop();
            var oItem = $(".markdown-heading").find(".reference-link");
            var oName = "";
            $.each(oItem,function(){
                var oneItem = $(this);
                var offsetTop = oneItem.offset().top;

                if(offsetTop-scrollTop < 100){
                    oName = "#" + oneItem.attr("name");
                }
            });
            $(".markdown-toc-list a").each(function () {
                if(oName === $(this).attr("href")) {
                    $(this).parents("li").addClass("directory-item-active");
                }else{
                    $(this).parents("li").removeClass("directory-item-active");
                }
            });
            if(!$(".markdown-toc-list li").hasClass('directory-item-active')) {
                $(".markdown-toc-list li:eq(0)").addClass("directory-item-active");
            }
        }catch (e) {
            console.log(e);
        }
    }).on("click",".markdown-toc-list a", function () {
        var $this = $(this);
        setTimeout(function () {
            $(".markdown-toc-list li").removeClass("directory-item-active");
            $this.parents("li").addClass("directory-item-active");
        },10);
    }).find(".markdown-toc-list li:eq(0)").addClass("directory-item-active");


    $(window).resize(function (e) {
        var h = $(".manual-catalog").innerHeight() - 20;
        $(".markdown-toc").height(h);
    }).resize();

    window.isFullScreen = false;

    initHighlighting();
    window.jsTree = $("#sidebar").jstree({
        'plugins' : ["wholerow", "types", 'contextmenu'],
        "types": {
            "default" : {
                "icon" : false  // 删除默认图标
            }
        },
        'core' : {
            'check_callback' : true,
            "multiple" : false,
            'animation' : 0
        },
        "contextmenu": {
            show_at_node: false,
            select_node: false,
            "items": {
                "添加文档": {
                    "separator_before": false,
                    "separator_after": true,
                    "_disabled": false,
                    "label": "添加文档",
                    "icon": "fa fa-plus",
                    "action": function (data) {

                        var inst = $.jstree.reference(data.reference),
                            node = inst.get_node(data.reference);

                        openCreateCatalogDialog(node);
                    }
                },
                "编辑": {
                    "separator_before": false,
                    "separator_after": true,
                    "_disabled": false,
                    "label": "编辑",
                    "icon": "fa fa-edit",
                    "action": function (data) {
                        var inst = $.jstree.reference(data.reference);
                        var node = inst.get_node(data.reference);
                        editInNewTab(node.id);
                    }
                },
                "删除": {
                    "separator_before": false,
                    "separator_after": true,
                    "_disabled": false,
                    "label": "删除",
                    "icon": "fa fa-trash-o",
                    "action": function (data) {
                        var inst = $.jstree.reference(data.reference);
                        var node = inst.get_node(data.reference);
                        openDeleteDocumentDialog(node);
                    }
                }
            }
        }
    }).on('select_node.jstree', function (node, selected) {
        //如果是空目录则直接出发展开下一级功能
        if (selected.node.a_attr && selected.node.a_attr.disabled) {
            selected.instance.toggle_node(selected.node);
            return false
        }
        $(".m-manual").removeClass('manual-mobile-show-left');
        loadDocument(selected.node.a_attr.href, selected.node.id,selected.node.a_attr['data-version']);
    });

    $("#slidebar").on("click", function () {
        $(".m-manual").addClass('manual-mobile-show-left');
    });
    $(".manual-mask").on("click", function () {
        $(".m-manual").removeClass('manual-mobile-show-left');
    });

    /**
     * 关闭侧边栏
     */
    $(".manual-fullscreen-switch").on("click", function () {
        isFullScreen = !isFullScreen;
        if (isFullScreen) {
            $(".m-manual").addClass('manual-fullscreen-active');
        } else {
            $(".m-manual").removeClass('manual-fullscreen-active');
        }
    });

    $(".navg-item[data-mode]").on("click", function () {
        var mode = $(this).data('mode');
        $(this).siblings().removeClass('active').end().addClass('active');
        $(".m-manual").removeClass("manual-mode-view manual-mode-collect manual-mode-search").addClass("manual-mode-" + mode);
    });

    /**
     * 项目内搜索
     */
    $("#searchForm").ajaxForm({
        beforeSubmit : function () {
            var keyword = $.trim($("#searchForm").find("input[name='keyword']").val());
            if (keyword === "") {
                $(".search-empty").show();
                $("#searchList").html("");
                return false;
            }
            $("#btnSearch").attr("disabled", "disabled").find("i").removeClass("fa-search").addClass("loading");
            window.keyword = keyword;
        },
        success : function (res) {
            var html = "";
            if (res.errcode === 0) {
                for(var i in res.data) {
                    var item = res.data[i];
                    html += '<li><a href="javascript:;" title="' + item.doc_name + '" data-id="' + item.doc_id + '"> ' + item.doc_name + ' </a></li>';
                }
            }
            if (html !== "") {
                $(".search-empty").hide();
            } else {
                $(".search-empty").show();
            }
            $("#searchList").html(html);
        },
        complete : function () {
            $("#btnSearch").removeAttr("disabled").find("i").removeClass("loading").addClass("fa-search");
        }
    });

    window.onpopstate = function (e) {
        var $param = e.state;
        if (!$param) return;
        if($param.hasOwnProperty("$url")) {
            window.jsTree.jstree().deselect_all();

            if ($param.$id) {
                window.jsTree.jstree().select_node({ id : $param.$id });
            }else{
                window.location.assign($param.$url);
            }
            // events.trigger('article.open', $param);
        } else {
            console.log($param);
        }
    };

    // 提交评论
    $("#commentForm").ajaxForm({
        beforeSubmit : function () {
            $("#btnSubmitComment").button("loading");
        },
        success : function (res) {
            if(res.errcode === 0){
                layer.msg("保存成功");
            }else{
                layer.msg(res.message);
            }
            $("#btnSubmitComment").button("reset");
            $("#commentContent").val("");
            pageClicked(-1, res.data.doc_id); // -1 表示请求最后一页
        },
        error : function () {
            layer.msg("服务错误");
            $("#btnSubmitComment").button("reset");
        }
    });
});