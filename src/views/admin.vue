<template>
  <drawer-layout :fixed="true" :navs="navs">
    <span slot="logo">{{title}}</span>
    <router-view slot="main"></router-view>
  </drawer-layout>
</template>

<script type="text/javascript">

  import drawerLayout from "../components/layout/admin-layout";
  import blogFooter from "../components/footer";

  export default{
    data(){
      return {
        navs: [
          {text: '控制台', icon: 'ios-speedometer', toRoute: 'admin-dashboard'},
          {text: '标签管理', icon: 'ios-pricetag', toRoute: 'admin-tag'},
          //{text: '文章管理', icon: 'ios-list', toRoute: 'admin-articleManager'},
          {text: '文章管理(新)', icon: 'ios-list', toRoute: 'articles'},
          {text: '文章评论', icon: 'chatbubbles', toRoute: 'admin-commentList'},
          {text: '文章评论1', icon: 'chatbubbles', toRoute: 'admin-commentList1'},
        ]
      }
    },
    computed: {
      title() {
        return this.$route.meta.title || '爱知室'
      }
    },
    components: {
      drawerLayout,
      blogFooter,
    }
  }
</script>

<style lang="scss">

  html{
    font-size:14px;
  }

  .drawer-content{
    margin: 0 auto;
  }

  @media (min-width: 640px) {
    .drawer-content:first-child {
      max-width: 70rem;
    }
  }
  @media (min-width: 750px) {
    .drawer-content:first-child {
      max-width: 70rem;
    }
  }

</style>
