<template>
  <div class="container-fluid page-swapper">
    <div class="head-title">
      <h3>
        <icon type="ios-pricetag"></icon>标签管理
      </h3>
    </div>
    <div class="float-right table-toolbar">
      <button class="btn btn-success" @click="addTagModal=!addTagModal" >
        <icon type="android-add"></icon>
      </button>
    </div>
    <table class="table table-responsive-sm table-striped">
      <thead>
      <tr>
        <th>#</th>
        <th @click="order('name')">
          标签名称/Name
          <span v-if="predicate == 'name'">
                        <i v-if="reverse==='asc'" class="fa fa-caret-up"></i>
                        <i v-if="reverse==='desc'" class="fa fa-caret-down"></i>
                    </span>
        </th>
        <th @click="order('catalogue_name')">
          分类名称/Cat.
          <span v-if="predicate == 'catalogue_name'">
                        <i v-if="reverse==='asc'" class="fa fa-caret-up"></i>
                        <i v-if="reverse==='desc'" class="fa fa-caret-down"></i>
                    </span>
        </th>
        <th @click="order('used_num')">引用数/Quote
                <span v-if="predicate == 'used_num'">
                        <i v-if="reverse==='asc'" class="fa fa-caret-up"></i>
                        <i v-if="reverse==='desc'" class="fa fa-caret-down"></i>
                    </span></th>
        <th @click="order('create_time')">创建时间/C.T.
                <span v-if="predicate == 'create_time'">
                        <i v-if="reverse==='asc'" class="fa fa-caret-up"></i>
                        <i v-if="reverse==='desc'" class="fa fa-caret-down"></i>
                    </span>
        </th>
        <th>操作</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(tag,index) in orderedTagList">
        <td>{{index+1}}</td>
        <td>{{tag.name}}</td>
        <td>{{tag.catalogue_name}}</td>
        <td>{{tag.used_num}}</td>
        <td>{{tag.create_time | moment("YYYY/MM/DD")}}</td>
        <td>
          <button class="btn btn-default btn-sm" @click="editTagBtn(tag)">
            <icon type="edit"></icon>
          </button>
          <button class="btn btn-danger btn-sm" @click="confirmDelTag(tag._id)">
            <icon type="ios-trash"></icon>
          </button>
        </td>
      </tr>
      </tbody>
    </table>

    <!--弹出层-新增-->
    <Modal
      v-model="addTagModal"
      title="增加标签"
      ok-text="保存"
      @on-ok="confirmSaveNewTag"
      @on-cancel="">
      <form>
        <div class="form-group" :class="{true:'has-error',false:''}[!newTag.name]">
          <label for="tagname">标签名/Name</label>
          <input type="text" class="form-control" v-model="newTag.name" id="tagname" aria-describedby="emailHelp" placeholder="请输入标签名称 email">
        </div>
        <div class="form-group" :class="{true:'has-error',false:''}[!newTag.catalogue_name]">
          <label for="catname">分类名/Cat.</label>
          <input type="text" class="form-control" v-model="newTag.catalogue_name" id="catname" placeholder="请输入分类名称">
        </div>
      </form>
    </Modal>

    <!--弹出层-修改-->
    <Modal
      v-model="editTagModal"
      title="修改标签"
      ok-text="保存"
      @on-ok="confirmEditTag"
      @on-cancel="">
      {{!!editTag.name && !!editTag.catalogue_name}}
      <form>
        <div class="form-group" :class="{true:'has-error',false:''}[!editTag.name]">
          <label for="tagname">标签名/Name</label>
          <input type="text" class="form-control" v-model="editTag.name" id="tagname" placeholder="请输入标签名称 email" required>
        </div>
        <div class="form-group" :class="{true:'has-error',false:''}[!editTag.catalogue_name]">
          <label for="catname">分类名/Cat.</label>
          <input type="text" class="form-control" v-model="editTag.catalogue_name" id="catname" placeholder="请输入分类名称" required>
        </div>
      </form>
    </Modal>
</div>
</template>

<script type="text/javascript">
  import Vue from "vue";
  import _ from "lodash";
  import {
    GetTagsList,
    AddTag,
    DeleteTag,
    EditTag,
  } from "../../api/api_tag";


  module.exports = {
    data: function () {
      return {
        addTagModal: false,
        editTagModal: false,
        delTagModal: false,
        reverse: 'desc',
        predicate: 'used_num',
        tagLists: [],

        newTag: {
          name: '',
          catalogue_name: ''
        },
        editTag: {
          _id: '',
          name: '',
          catalogue_name: ''
        },
        submitText: '',
        delTag: {
          _id: ''
        },
      }
    },
    computed: {
      orderedTagList: function () {
        if (!!this.tagLists) {
          return _.orderBy(this.tagLists, [this.predicate], [this.reverse])
        } else {
          return []
        }
      },
    },
    methods: {
      /**
       * 获取列表
       * */
      getTagList: function () {
        GetTagsList().then((data)=> {
          this.tagLists = data;
        }, (err) => {
        })
      },
      /**
       * 排序
       * */
      order: function (name) {
        this.predicate = name;
        if (this.reverse === 'asc') {
          this.reverse = 'desc';
        } else {
          this.reverse = 'asc';
        }
      },
      confirmSaveNewTag: function () {
        const scope = this;
        let params = {
          name: scope.newTag.name,
          catalogue_name: scope.newTag.catalogue_name,
        };
        this.submitText = '正在提交...';
        AddTag(params).then(()=> {
          this.getTagList();
          this.addTagModal = false
        }, (code)=> {
          //操作提示
          switch (parseInt(code)) {
            case 2:
              scope.submitText = '新增失败, 标签名称已存在!';
              break;
            case 9:
              scope.submitText = '您没有修改权限!';
              break;
            default:
              scope.submitText = '修改失败!';
              break;
          }
          this.$Message.warning(scope.submitText)
        });
      },
      /**
       * 模态框弹出(修改)
       * */
      editTagBtn: function (tagInfo) {
        const scope = this;
        this.editTagModal = true
        scope.submitText = '';
        scope.editTag = {
          _id: tagInfo._id,
          name: tagInfo.name,
          catalogue_name: tagInfo.catalogue_name,
        };
      },
      confirmEditTag: function () {
        const scope = this;
        scope.submitText = '正在提交...';
        EditTag(scope.editTag).then(()=> {
          this.getTagList();
          this.editTagModal = false
        }, (code)=> {
          //操作提示
          switch (parseInt(code)) {
            case 2:
              scope.submitText = '修改失败, 此标签不存在!';
              break;
            case 3:
              scope.submitText = '修改失败, 标签名称重复!';
              break;
            case 9:
              scope.submitText = '您没有修改权限!';
              break;
            default:
              scope.submitText = '修改失败!';
              break;
          }
          this.$Message.warning(scope.submitText)
        })
      },
      /**
       * 确认删除标签
       * */
      confirmDelTag: function (id) {
        const scope = this;
        this.delTagModal = true
        scope.submitText = '';
        scope.delTag = {
          _id: id
        };
        this.$Modal.confirm({
          title: '确认对话框标题',
          content: '<p>确定删除该标签?</p>',
          loading: true,
          onOk: () => {
            this.submitText = '正在删除...';
            DeleteTag(this.delTag._id).then(()=> {
              // 刷新列表
              this.getTagList();
              this.delTagModal = false
            }, ()=> {
              //操作提示
              this.submitText = '删除失败!';
              this.$Message.warning(scope.submitText)
            })
          }
        });
      }
    },
    mounted: function () {

      this.getTagList();
    }
  }
</script>
<style lang="scss">
  //base
  @import "../../theme/theme.scss";

  .head-title{
    width:100%;
    margin-bottom: 25px;
    i {
      padding-left: 20px;
      padding-right: 10px;
    }
  }

  .table-toolbar{
    padding: 0px 10px 10px 10px;
  }
</style>
