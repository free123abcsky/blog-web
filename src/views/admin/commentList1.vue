<template>
  <div class="container-fluid page-swapper">
    <div class="page-title">
      <h3>
        <icon type="chatbubbles"></icon>评论管理
      </h3>
    </div>
    <div class="row">
      <div class="col-md-4">
        <label>子主评论筛选: </label>
<!--        <multiselect
          lable="name"
          v-model="value"
          :options="commentOptions"
          :searchable="false"
          :close-on-select="false"
          :show-labels="false"
          placeholder="子主评论筛选">
        </multiselect>-->
        <multiselect v-model="value" deselect-label="Can't remove this value" track-by="name" label="name" placeholder="Select one" :options="commentOptions" :searchable="false" :allow-empty="false"></multiselect>

      </div>
      <div class="col-md-4">

      </div>
      <div class="col-md-4">

      </div>
    </div>
  </div>
</template>
<script type="text/javascript">
  import Vue from "vue";
  import _ from "lodash";
  import Multiselect from '../../plugin/vue-multiselect/Multiselect'
  import API from "../../config";
  import {
    GetCommentToArticleList,
    ChangeCommentAuthState,
    DeleteComment,
    ChangeCommentReplyState,
    SendComment,
  } from "../../api/api_comment";

  module.exports = {
    components: {
      Multiselect
    },
    data: function () {
      return {
        commentList: [],
        btn_filter_mainComm: '全部',//0 全部，1 主评论， 2 子评论
        Condition_main: 0,
        btn_filter_reply: '未回复',//0 全部，1 未回复， 2 已回复
        Condition_reply: 1,
        btn_filter_auth: '未审核',//0 全部，1 未审核， 2 已审核
        Condition_auth: 1,
        replyBox: {},
        delBox: {},
        replyContent: '',
        hasData: true,
        isLoading: true,
        value: { name: 'Vue.js', language: 'JavaScript' },
        //commentOptions: [{name: '全部', value: 0}, {name: '主评论', value: 1}, {name: '子评论', value: 2}]
        commentOptions: [
          { name: 'Vue.js', language: 'JavaScript' },
          { name: 'Rails', language: 'Ruby' },
          { name: 'Sinatra', language: 'Ruby' },
          { name: 'Laravel', language: 'PHP', $isDisabled: true },
          { name: 'Phoenix', language: 'Elixir' }
        ]
      }
    },
    computed: {
      resultList: function () {
        const scope = this;
        let _tmp = [];
        let source = scope.commentList;

        for (let data of source) {
          (filter_main(data) && filter_reply(data) && filter_auth(data)) && _tmp.push(data);
        }

        //子主评论筛选
        function filter_main(data) {
          switch (parseInt(scope.Condition_main)) {
            case 0:
              return true;
              break;
            //主评论
            case 1:
              return data.article_id._id.toString() === data.pre_id.toString();
              break;
            //子评论
            case 2:
              return data.article_id._id.toString() !== data.pre_id.toString();
              break;
            default:
              return true;
              break;
          }
        }

        //是否回复筛选
        function filter_reply(data) {
          switch (parseInt(scope.Condition_reply)) {
            case 0:
              return true;
              break;
            //未回复
            case 1:
              return !data.isIReplied;
              break;
            //已回复
            case 2:
              return !!data.isIReplied;
              break;
            default:
              return true;
              break;
          }
        }

        //是否审核筛选
        function filter_auth(data) {
          switch (parseInt(scope.Condition_auth)) {
            case 0:
              return true;
              break;
            //未审核
            case 1:
              return !data.state;
              break;
            //已审核
            case 2:
              return !!data.state;
              break;
            default:
              return true;
              break;
          }
        }

        _tmp.length === 0 ? (scope.hasData = false) : (scope.hasData = true);

        return _.orderBy(_tmp, ['time'], ['desc']);
      }
    },
    methods: {
      //获得列表
      getList: function () {
        const scope = this;
        GetCommentToArticleList().then((data) => {
          scope.commentList = data;
        });
      },
      //改变评论状态
      changeAuthState: function (_id) {
        ChangeCommentAuthState({
          _id: _id
        })
      },
      //打开回复评论弹层
      comment: function (item) {
        //发送数据
        this.replyBox = item;
      },
      confirmAddComment: function (item) {
        const scope = this;
        let params = {
          article_id: item.article_id._id,
          pre_id: item._id,
          next_id: [],
          name: API.MY,
          email: API.EMAIL,
          time: new Date(),
          content: scope.replyContent,
          //这里是增加对主评论的子评论,
          // 既然是我的评论那我没有道理继续评论的理由,
          // 故对自评论显示我已评论,我的评论,审核状态为true
          // 但是主评论需要手动设置
          isIReplied: true,
          state: true
        };
        //如果对用户的文章评论进行了评论,则标记此评论为已阅读
        //此接口只对我有效
        ChangeCommentReplyState({
          _id: item._id
        }).then(function () {
          SendComment(params).then((data) => {
            scope.replyContent = '';
          }).then(function () {
            scope.getList()
          });
        });
      },
      // 删除评论
      delbtn: function (item) {
        this.delBox = item;
      },
      confirmDelCommBtn: function (item) {
        const scope = this;
        $('#delComm').modal('hide');
        DeleteComment(item._id).then((data) => {
        }).then(function () {
          //刷新文章列表
          scope.getList()
        })
      },
    },
    created: function () {
      const scope = this;
      /**
       * 获得评论列表
       * */
      scope.getList()
    }
    ,
    destroyed: function () {
    }
  }

</script>
<style scoped lang="scss">
  .page-title{
    width:100%;
    margin-bottom: 25px;
    i {
      padding-left: 20px;
      padding-right: 10px;
    }
  }
</style>
