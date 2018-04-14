<template>
  <Modal
    v-model="isShowVisitorSet"
    title="留个名呗"
    :mask-closable="false"
    :loading="loading"
    @on-ok="submit"
    @on-cancel="cancel">
    <form name="addTags">
      <div class="form-group" :class="{true:'has-error',false:''}[!name]">
        <label class="control-label">昵称</label>
        <input type="text" class="form-control" name="nickname" v-model="name" placeholder="请输入昵称" required>
      </div>
      <div class="form-group" :class="{true:'has-error',false:''}[!email]">
        <label class="control-label">邮箱</label>
        <input type="text" class="form-control" name="email" v-model="email" placeholder="请输入邮箱" required>
      </div>
    </form>
  </Modal>
</template>
<style>

</style>
<script type="text/javascript">
  import {mapState, mapActions} from 'vuex';
  import Toast from 'Toast';
  export default{
    data(){
      return {
        name: null,//游客名称
        email: null,//游客邮箱
        submitText: '',
        loading: false
      }
    },
    computed: {
      ...mapState({
        isShowVisitorSet: 'isShowVisitorSet',
      }),
    },
    methods: {
      ...mapActions({
        setCommentInfoStatus: 'setCommentInfoStatus',
        setVisitorSetStatus: 'setVisitorSetStatus'
      }),
      cancel: function(){
        this.setVisitorSetStatus(false);
      },
      submit: function () {

        let _this = this;
        if (!_this.name) {
          this.$Message.info('请输入昵称');
          //this.submitText = '请输入昵称';
          return
        }
        if (!_this.email) {
          this.submitText = '请输入邮箱';
          return
        }
        if (!/^\w+@[1-9a-z]+(\.[a-z]+){1,3}$/.test(_this.email)) {
          this.submitText = '邮箱格式输入错误';
          return
        }
        _this.$localStorage.$set({
          commentInfo: {
            name: _this.name,
            email: _this.email
          }
        });
        _this.setCommentInfoStatus(true);
        _this.setVisitorSetStatus(false);

      },
    },
    created: function () {
      //获取游客昵称及邮箱
      let visitorInfo = this.$localStorage.visitorInfo;
      if (!!visitorInfo && !!visitorInfo.name && !!visitorInfo.email) {
        this.setCommentInfoStatus(true);
        this.name = visitorInfo.name;
        this.email = visitorInfo.email;
      }
    },
  }

</script>
