<template>
  <div class="articles-swapper">
    <div class="article-list">
      <div class="article-head">
        <icon type="ios-list"></icon>文章列表
        <router-link tag="span" :to="{ name: 'login'}" title="添加文章" class="add-article">
          <icon type="android-add"></icon>
        </router-link>
      </div>
      <ul>
        <li v-for="(article,index) in orderedArticleLists" :key="article._id">
          <div class="article-title">
            {{article.title}}
          </div>
          <span class="publish-time">
             {{article.publish_time | moment('YYYY/MM/DD')}}
          </span>
        </li>
      </ul>
    </div>
    <div class="article-content">
      <div class="content-head">
        <input type="text" class="content-title"/>
      </div>
      <div class="edit-btns">
        <span class="tag-deal">
          <icon type="ios-pricetag"></icon>
        </span>
      </div>
      <div>
        <editor v-model="value"></editor>
      </div>
    </div>
  </div>
</template>
<script type="text/javascript">
  import Vue from "vue";
  import _ from "lodash";
  import editor from "../../components/editor/editor";
  import {
    GetArticleList,
    DeleteArticle,
  } from "../../api/api_article";

  module.exports = {
    components: {
      editor
    },
    data: function () {
      return {
        reverse: 'desc',
        predicate: 'publish_time',
        articleLists: [],
        deleteArticle: {},
        value: ''
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
      }
    },
    created: function () {
      const _this = this;
      //获取文章列表
      GetArticleList().then((data)=> {
        _this.articleLists = data;
      })
    }
  }

</script>
<style lang="scss">
  //base
  @import "../../theme/theme.scss";

  .articles-swapper {
    display: flex;
    height: 100%;
    border: 1px solid #c1bebe;
  }

  .article-list{
    width: 300px;
    border-right: 1px solid #c1bebe;
    background: #fff;
    ul{
      list-style: none;
      li{
        padding: 15px 10px 15px 25px;
        border-bottom: 1px solid #eee;
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
    }
  }

  .article-content{
    flex: 1;
    width: 100%;
    background: #fff;
    .content-head{
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
      height: 50px;
      line-height: 50px;
      padding: 0px 20px;
      border-bottom: 1px solid #c1bebe;
    }
  }



  @media (min-width: 640px) {
    .drawer-content {
      max-width: 98%;
    }
  }
  @media (min-width: 750px) {
    .drawer-content {
      max-width: 98%;
    }
  }
</style>
