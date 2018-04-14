<template>
  <div class="container-fluid page-swapper">
    <div class="row page-article">
      <div class="col-md-3 d-flex flex-column p-md-0 article-list">
        <div class="article-head">
          <icon type="ios-list"></icon>文章列表
          <span title="添加文章" class="add-article" @click="addArticle">
            <icon type="android-add"></icon>
          </span>
        </div>
        <div class="list-swapper">
        <ul>
          <li :class="{selected: article && article._id === arti._id}" v-for="(arti,index) in orderedArticleLists" :key="arti._id" @click="selectArticle(arti._id)" :aid="arti._id">
            <div class="article-title">
              {{arti.title}}
          </div>
            <span class="publish-time">
             {{arti.publish_time | moment('YYYY/MM/DD')}}
          </span>
          </li>
        </ul>
        </div>
      </div>
      <div class="col-md d-flex flex-column p-md-0 article-content" v-if="article._id || isAdd">
        <div class="content-head">
          <input type="text" class="content-title" v-model="article.title" ref="title"/>
        </div>
        <div class="d-flex justify-content-between align-items-center edit-btns">
          <span class="d-flex align-items-center tag-deal">
            <icon type="ios-pricetag"></icon>
                            <Multiselect class="form-control multiselect other_form--input small" placeholder="请选择" id="tags"
                                         :searchable="true"
                                         :close-on-select="false"
                                         :limit="3"
                                         :multiple="true"
                                         :max="3"
                                         :max-height="500"
                                         :selected="selectedTags"
                                         :options="options"
                                         deselect-label="点击移除" select-label="点击选择" selected-label="当前选择" option-key="_id"
                                         option-label="name"
                                         @update="updateValuePrimitive"></Multiselect>
          </span>
          <div class="float-right">
            <button type="button" class="btn btn-default">删除草稿</button>
            <button type="button" class="btn btn-success" @click="publishArticle">发布文章</button>
          </div>
        </div>
        <div class="d-flex editor-swapper" id="editor">
          <mavon-editor style="height: 100%" v-model="content" @change="getContent" :toolbars="toolbars" default_open="edit"></mavon-editor>
        </div>
      </div>
      <div class="col-md p-md-0 d-flex flex-column justify-content-center align-items-center empty-page" v-else>
        <icon type="planet"></icon>
        <p>内容为空</p>
      </div>
    </div>
  </div>
</template>
<script type="text/javascript">
  import Vue from "vue";
  import _ from "lodash";
  import editor from "../../components/editor/editor";
  import Multiselect from 'vue-multiselect'
  import { mavonEditor } from 'mavon-editor'
  import 'mavon-editor/dist/css/index.css'
  import {
    GetArticleList,
    DeleteArticle,
    GetRawArticleById,
    SaveArticle
  } from "../../api/api_article";
  import {GetTagsList} from "../../api/api_tag"

  module.exports = {
    components: {
      mavonEditor,
      Multiselect
    },
    data: function () {
      return {
        toolbars: {
          bold: true, // 粗体
          italic: true, // 斜体
          header: true, // 标题
          underline: true, // 下划线
          strikethrough: true, // 中划线
          mark: true, // 标记
//            superscript: true, // 上角标
//            subscript: true, // 下角标
          quote: true, // 引用
          ol: true, // 有序列表
          ul: true, // 无序列表
          link: true, // 链接
          imagelink: true, // 图片链接
          code: true, // code
          table: true, // 表格
          fullscreen: true, // 全屏编辑
          //readmodel: true, // 沉浸式阅读
          //htmlcode: true, // 展示html源码
          help: true, // 帮助
          /* 1.3.5 */
          //undo: true, // 上一步
          //redo: true, // 下一步
          //trash: true, // 清空
          //save: true, // 保存（触发events中的save事件）
          /* 1.4.2 */
          //navigation: true, // 导航目录
          /* 2.1.8 */
          alignleft: true, // 左对齐
          aligncenter: true, // 居中
          alignright: true, // 右对齐
          /* 2.2.1 */
          subfield: true, // 单双栏模式
          preview: true, // 预览
        },
        reverse: 'desc',
        predicate: 'publish_time',
        articleLists: [],
        deleteArticle: {},
        selectedTags: [],
        options: [],
        content: '',
        article: {},
        isAdd: false
      }
    },
    computed:{
      orderedArticleLists: function () {
        if (!!this.articleLists) {
          return _.orderBy(this.articleLists, [this.predicate], [this.reverse])
        } else {
          return []
        }
      },
    },
    methods: {
      // 标签多选更新
      updateValuePrimitive(value) {
        this.selectedTags = value;
      },
      order: function (name) {
        this.predicate = name;
        if (this.reverse === 'asc') {
          this.reverse = 'desc';
        } else {
          this.reverse = 'asc';
        }
      },
      delArtBtn(article){
        this.deleteArticle = article;
      },
      confirmDelArtBtn(){
        DeleteArticle(this.deleteArticle._id).then(()=> {
          //刷新文章列表
          this.articleLists.splice(this.articleLists.indexOf(this.deleteArticle), 1);
          $('#delArticle').modal('hide');
        })
      },
      //选中某条文章记录
      selectArticle(id) {
        let articles = this.articleLists.filter(function(item) {
          return item._id === id;
        });
        if(articles.length > 0){
          this.getArticle(articles[0]._id);
        }
      },
      getArticle(id){
        GetRawArticleById(id).then((data) => {
          this.article = data;
          this.content = data.content;
          this.selectedTags = this.article.tags;
        }, (err) => {
          alert(JSON.stringify(err))
        })
      },
      //发布文章
      publishArticle() {
        this.article.state = true;
        this._save().then(() => {
          this.getArticleList()
        });
      },
      _save(){
        let params = this.collectEditedArtInfo();
        return SaveArticle(params).then((data) => {
          // 针对新建的情况
          if (!params._id) {
            this.article._id = data._id
          }
        })
      },
      //添加文章
      addArticle() {

        this.selectedIndex = ''
        this.selectedTags = []
        this.article = {}
        this.content = ''
        this.isAdd = true
        this.$nextTick(() => {
          this.$refs.title.focus()
        })
      },
      //删除草稿
      delDraft() {

      },
      //获取文章列表
      getArticleList(){
        GetArticleList().then((data)=> {
          this.articleLists = data;
        })
      },
      //获取标签列表
      getTagList(){
        GetTagsList().then((data) => {
          this.options = data
        });
      },
      getContent(value){
        this.content =  value
      },
      //获取书写的文章信息
      collectEditedArtInfo(){
        let tagsArr = [];
        for (let tag of this.selectedTags) {
          tagsArr.push(tag._id);
        }
        let params = {
          "_id": this.article._id,
          "title": this.article.title,
          "publish_time": new Date(),
          "tags": tagsArr,
          "state": this.article.state,
          "content": this.content,
        };

        return params;
      },
    },
    created: function () {

        this.getArticleList()
        this.getTagList()
    }
  }

</script>
<style lang="scss">
  //base
  @import "../../theme/theme.scss";

  .page-swapper {
    height: 100%;
    .page-article{
      height: 100%;
    }
  }

  .article-list{
    border-right: 1px solid #c1bebe;
  }

  .list-swapper{
    height: calc(100% - 50px);
    overflow: auto;
    ul{
      list-style: none;
      cursor: pointer;
      li{
        padding: 15px 10px 15px 25px;
        border-bottom: 1px solid #eee;
        &.selected{
          color: #00cc66;
          background: #d3e2e1;
        }
      }
    }
  }

  .article-head{
    position: relative;
    height: 50px;
    line-height: 50px;
    padding-left: 25px;
    border-bottom: 1px solid #c1bebe;
    i {
      margin-right: 10px;
    }
    .add-article{
      position: absolute;
      right:20px;
      cursor: pointer;
    }
  }

  .article-content{
    .content-head{
      padding: 0px 10px;
      height: 50px;
      line-height: 50px;
      border-bottom: 1px solid #c1bebe;
      .content-title{
        display: inline-block;
        width: 100%;
        padding: 0px 20px;
        font-size: 18px;
        color: #393939;
        font-weight: bold;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        border: 0 none;
        background-color: transparent;
        outline: none;
      }
    }
    .edit-btns{
      padding: 10px;
      border-bottom: 1px solid #c1bebe;
      .tag-deal{
        i{
          margin: 0px 10px;
        }
      }
      .multiselect{
        min-height: inherit;
        &.form-control{
          padding: 0;
        }
      }
    }
  }

  .empty-page{
    i{
      font-size: 70px;
      color:#76838f;
    }
    p{
      color:#76838f;
    }
  }

  .editor-swapper{
    height: calc(100% - 100px);
  }

  #editor {
    margin: auto;
    width: 100%;
    height: 100%;
  }
  #editor .markdown-body{
    z-index: 49;
    width: 100%;
  }
  #editor .markdown-body.fullscreen{
    z-index: 1500;
  }

  @media (min-width: 640px) {
    .drawer-content {
      //max-width: 98%;
    }
  }
  @media (min-width: 750px) {
    .drawer-content {
      //max-width: 98%;
    }
  }
</style>
