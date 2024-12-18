<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>{{i18n .Lang "doc.edit_doc"}} - Powered by MinDoc</title>
    <script type="text/javascript">
        window.IS_ENABLE_IFRAME = '{{conf "enable_iframe" }}' === 'true';
        window.BASE_URL = '{{urlfor "HomeController.Index" }}';

    </script>
    <script type="text/javascript">
        window.treeCatalog = null;
        window.baseUrl = "{{.BaseUrl}}";
        window.saveing = false;
        window.bookIdentify="{{.Identify}}";
        window.docId="{{.Id}}";
        window.editor = null;
        window.imageUploadURL = "{{urlfor "DocumentController.Upload" "identify" .Identify "doc_id" .Id}}";
        window.fileUploadURL = "{{urlfor "DocumentController.Upload" "identify" .Identify "doc_id" .Id}}";
        window.deleteURL = "{{urlfor "DocumentController.Delete" ":key" .Model.Identify}}";
        window.readURL = "{{urlfor "DocumentController.Read" ":key" .Identify ":id" .Id}}";
        window.saveURL = "{{urlfor "DocumentController.Save" ":key" .Identify ":id" ""}}";
        window.historyURL = "{{urlfor "DocumentController.History"}}";
        window.removeAttachURL = "{{urlfor "DocumentController.RemoveAttachment"}}";
        window.highlightStyle = "{{.HighlightStyle}}";
        window.lang = {{i18n $.Lang "common.js_lang"}};



    </script>
    <link href="{{cdncss "/static/bootstrap/bootstrap.5.3.3.min.css"}}" rel="stylesheet">
 
    <link href="{{cdncss "/static/font-awesome/css/font-awesome.min.css"}}" rel="stylesheet">
    <link href="{{cdncss "/static/jstree/3.3.4/themes/default/style.min.css"}}" rel="stylesheet">

    <link href="{{cdncss "/static/css/jstree.css"}}" rel="stylesheet">

    <link href="{{cdncss "/static/toastui-editor/toastui-editor.css" "version"}}" rel="stylesheet">
    <link href="{{cdncss "/static/toastui-editor/prism.min.css" }}" rel="stylesheet">
    <link href="{{cdncss "/static/toastui-editor/toastui-editor-plugin-code-syntax-highlight.min.css" }}" rel="stylesheet">
    <link href="{{cdncss "/static/css/markdown-edit.css"}}" rel="stylesheet">
    <link href="{{cdncss "/static/css/markdown-toc.css"}}" rel="stylesheet">
 
</head>
<body>

<div class="container-fluid h-100 d-flex flex-column">

    <div class="row fixed-height">
        <div class="col-md-2">

        </div>
        <div class="col-md-8 text-center">
            <h2 id="article-title">加载中...</h1>
        </div>
        <div class="col-md-2">
        </div>
    </div>


 

    <div class="row  flex-grow" id="manualEditorContainer" >
        <div  id="markdown-toc" class="col-md-2" style="bottom: 30px;overflow-y: auto;max-height: 100%;" >
        </div>
        <div class="manual-editormd col-md-10"  style="bottom: 30px;">
            <div id="docEditor" class="manual-editormd-active"></div>
        </div>
    </div>
 
    <div class="row">
        <div class="manual-editor-status col-md-12">
                <div id="attachInfo" class="item">0 {{i18n .Lang "doc.attachments"}}</div>
         </div>


    </div>
</div>
<!-- 创建文档 -->
<div class="modal fade" id="addDocumentModal" tabindex="-1" role="dialog" aria-labelledby="addDocumentModalLabel">
    <div class="modal-dialog" role="document">
        <form method="post" action="{{urlfor "DocumentController.Create" ":key" .Model.Identify}}" id="addDocumentForm" class="form-horizontal">
            <input type="hidden" name="identify" value="{{.Model.Identify}}">
            <input type="hidden" name="doc_id" value="0">
            <input type="hidden" name="parent_id" value="0">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title" id="myModalLabel">{{i18n .Lang "doc.create_doc"}}</h4>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label class="col-sm-2 control-label">{{i18n .Lang "doc.doc_name"}} <span class="error-message">*</span></label>
                    <div class="col-sm-10">
                        <input type="text" name="doc_name" id="documentName" placeholder="{{i18n .Lang "doc.doc_name"}}" class="form-control"  maxlength="150">
                        <p style="color: #999;font-size: 12px;">{{i18n .Lang "doc.doc_name_tips"}}</p>

                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-2 control-label">{{i18n .Lang "doc.doc_id"}} <span class="error-message">&nbsp;</span></label>
                    <div class="col-sm-10">
                        <input type="text" name="doc_identify" id="documentIdentify" placeholder="{{i18n .Lang "doc.doc_id"}}" class="form-control" maxlength="50">
                        <p style="color: #999;font-size: 12px;">{{i18n .Lang "doc.doc_id_tips"}}</p>
                    </div>

                </div>
                <div class="form-group">
                        <div class="col-lg-4">
                            <label>
                                <input type="radio" name="is_open" value="1"> {{i18n .Lang "doc.expand"}}<span class="text">{{i18n .Lang "doc.expand_desc"}}</span>
                            </label>
                        </div>
                        <div class="col-lg-4">
                            <label>
                                <input type="radio" name="is_open" value="0" checked> {{i18n .Lang "doc.fold"}}<span class="text">{{i18n .Lang "doc.fold_desc"}}</span>
                            </label>
                        </div>
                    <div class="col-lg-4">
                        <label>
                            <input type="radio" name="is_open" value="2"> {{i18n .Lang "doc.empty_contents"}}<span class="text">{{i18n .Lang "doc.empty_contents_desc"}}</span>
                        </label>
                    </div>
                    <div class="clearfix"></div>
                </div>
            </div>
            <div class="modal-footer">
                <span id="add-error-message" class="error-message"></span>
                <button type="button" class="btn btn-default" data-dismiss="modal">{{i18n .Lang "common.cancel"}}</button>
                <button type="submit" class="btn btn-primary" id="btnSaveDocument" data-loading-text="{{i18n .Lang "message.processing"}}">{{i18n .Lang "doc.save"}}</button>
            </div>
        </div>
        </form>
    </div>
</div>
 

<script src="{{cdnjs "/static/bootstrap/bootstrap.5.3.3.min.js"}}" ></script>
<script src="{{cdnjs "/static/js/array.js" "version"}}" type="text/javascript"></script>
<script src="{{cdnjs "/static/jquery/1.12.4/jquery.min.js"}}"></script>

<script src="{{cdnjs "/static/layer/layer.js"}}" type="text/javascript" ></script>
<script src="{{cdnjs "/static/js/jquery.form.js"}}" type="text/javascript"></script>
<script src="{{cdnjs "/static/toastui-editor/toastui-editor-all.js" "version" }}" type="text/javascript"></script>
<script src="{{cdnjs "/static/toastui-editor/toastui-editor-plugin-code-syntax-highlight-all.min.js"  }}" type="text/javascript"></script>
<script src="{{cdnjs "/static/js/markdown-toc.js" "version"}}" type="text/javascript"></script>
<script src="{{cdnjs "/static/js/markdown-edit.js" "version"}}" type="text/javascript"></script>
 
</body>
</html>