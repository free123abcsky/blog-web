<template>
  <div :class="drawerClass" ref="drawer">
    <header class="drawer-navbar" role="banner">
      <div class="drawer-navbar-header">
        <a class="drawer-brand" href="javascript:void(0)">
          <slot name='logo'></slot>
        </a>
      </div>
      <button type="button" class="drawer-toggle drawer-hamburger" @click="toggle">
        <span class="sr-only">toggle navigation</span>
        <span class="drawer-hamburger-icon"></span>
      </button>
      <nav class="drawer-nav" role="navigation">
        <div class="nav-header">
          <span class="avatar"></span>
        </div>
        <ul class="drawer-menu">
          <li v-for="nav in navs" @click="close">
            <router-link  :to="{ name: nav.toRoute}" :title="nav.text" class="drawer-menu-item">
              <icon :type="nav.icon"></icon><span>{{nav.text}}</span>
            </router-link>
          </li>
        </ul>
        <div title="退出" @click="logout()" class="drawer-logout">
          <icon type="log-out" size="18" color="#fff"></icon>
        </div>
      </nav>
    </header>
    <div class="drawer-content">
      <slot name="main"></slot>
    </div>
    <div class="drawer-mask" :class="{'active': state}" @click="close"></div>
  </div>
</template>
<script type="text/javascript">

  import {mapState, mapActions} from 'vuex';

  export default{
    name: 'Drawer',
    props: {
      navs: Array,
      fixed: {
        type: Boolean,
        default: false
      },
      goback: {
        type: Boolean,
        default: false
      }
    },
    data(){
      return {
        isMobile: window.ua.mobile,
        state: false
      }
    },
    computed: {
      drawerClass () {
        return [
          'drawer',
          'drawer-left',
          {
              'drawer-navbar-fixed': this.fixed,
              'drawer-open': this.state,
          }
        ];
      },
    },
    methods: {
      toggle() {
        this.state = !this.state;
      },
      close() {
        this.state = false;
      },
      logout() {

        this.close();
        this.$Modal.confirm({
          title: '确认对话框标题',
          content: '<p>确定退出后台管理?</p>',
          loading: true,
          onOk: () => {
            setTimeout(() => {
              this.$localStorage.$delete('authorization');
              this.$localStorage.$delete('commentInfo');
              this.setLoginState(false);// 登录状态
              this.setCommentInfoStatus(false);// 评论信息状态
              this.$Modal.remove();
              this.$router.push({
                name: 'index'
              });
            }, 200);
          }
        });
      },
      init() {

        window.onresize = () => {
          return (() => {
            this.close()
          })()
        }
      }
    },
    created() {
    },
    mounted() {
      this.init()
    }
  }
</script>

<style lang="scss">

  .drawer,.drawer-content{
    height: 100%;
    width: 100%;
  }

  .drawer-navbar {
    position: fixed;
    top: 0;
    z-index:101;
    width:220px;
    height: 100%;
    box-shadow: 0 2px 2px rgba(0, 0, 0, 0.18);
    border-top: 2px solid #59bfff;
    background-color: #34393d;
  }

  .drawer-open .drawer-navbar{
    left: 0;
  }

  .drawer-navbar a:hover {
    color: #f70;
  }

  .drawer-navbar-header {
    display: none;
  }

  .nav-header{
    position: relative;
    display: block;
    width: 100%;
    height: 140px;
    padding: 30px 0px;
    margin-bottom: 20px;
    border: 0;
    background: url(../../assets/drawer-bg.jpg);
    background-size: cover;
  }

  .nav-header .avatar{
    display: block;
    margin: 0 auto;
    width: 90px;
    height: 90px;
    border-radius: 60px;
    border: 2px solid #fff;
    background: url(../../assets/avatar.jpg);
  }

  .drawer-brand {
    font-size: 20px;
    font-weight: bold;
    line-height: 50px;
    padding: 0 10px;
    color: #5A5454;
  }

  .drawer-navbar .drawer-brand {
    text-decoration: none;
    cursor: pointer;
  }

  .drawer-logout {
    position: absolute;
    right: 30px;
    bottom: 30px;
    width: 50px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    background: transparent;
    cursor: pointer;
  }

  .drawer-hamburger {
    position: fixed;
    z-index: 104;
    top: 0;
    left: 0;
    padding: 10px;
    box-sizing: border-box;
    width: 50px;
    height: 50px;
    -webkit-transition: all .6s cubic-bezier(0.190, 1.000, 0.220, 1.000);
    transition: all .6s cubic-bezier(0.190, 1.000, 0.220, 1.000);
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
    border: 0;
    outline: 0;
    background-color: transparent;
  }

  .drawer-hamburger:hover {
    cursor: pointer;
    background-color: transparent;
  }

  .drawer-hamburger-icon {
    position: relative;
    display: block;
  }

  .drawer-hamburger-icon,
  .drawer-hamburger-icon:before,
  .drawer-hamburger-icon:after {
    width: 100%;
    height: 2px;
    -webkit-transition: all .6s cubic-bezier(0.190, 1.000, 0.220, 1.000);
    transition: all .6s cubic-bezier(0.190, 1.000, 0.220, 1.000);
    background-color: #222;
  }

  .drawer-hamburger-icon:before,
  .drawer-hamburger-icon:after {
    position: absolute;
    top: -10px;
    left: 0;
    content: ' ';
  }

  .drawer-hamburger-icon:after {
    top: 10px;
  }

  .drawer-open .drawer-hamburger-icon {
    background-color: transparent;
  }

  .drawer-open .drawer-hamburger-icon:before,
  .drawer-open .drawer-hamburger-icon:after {
    top: 0;
  }

  .drawer-open .drawer-hamburger-icon:before {
    -webkit-transform: rotate(45deg);
    transform: rotate(45deg);
  }

  .drawer-open .drawer-hamburger-icon:after {
    -webkit-transform: rotate(-45deg);
    transform: rotate(-45deg);
  }
  /*!------------------------------------*\
    accessibility
\*!------------------------------------*/

  /*!
   * Only display content to screen readers
   * See: http://a11yproject.com/posts/how-to-hide-content
   */

  .sr-only {
    position: absolute;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    border: 0;
  }

  /*!
   * Use in conjunction with .sr-only to only display content when it's focused.
   * Useful for "Skip to main content" links; see http://www.w3.org/TR/2013/NOTE-WCAG20-TECHS-20130905/G1
   * Credit: HTML5 Boilerplate
   */

  .sr-only-focusable:active,
  .sr-only-focusable:focus {
    position: static;
    overflow: visible;
    clip: auto;
    width: auto;
    height: auto;
    margin: 0;
  }

  .drawer-nav {
    position: relative;
    overflow: visible;
    width: 100%;
    height: 100%;
    padding-top: 0;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
    .drawer-menu {
      list-style: none;
      i{
        margin-right: 5px;
      }
    }
  }

  .drawer-navbar {
    .drawer-menu-item {
      display: block;
      padding: 0px 30px;
      width:100%;
      line-height: 50px;
      font-size: 16px;
      text-decoration: none;
      color: #fff;
      &.active{
        color: #f70;
      }
    }
  }

  @media (max-width: 640px) {

    .drawer-navbar-fixed{
      padding-top: 50px;
    }

    .drawer-navbar{
      width: 100%;
      height: 0px;
      border-top: initial;
      background: #fff;
    }

    .drawer-navbar-fixed .drawer-navbar{
      height: 50px;
    }

    .drawer-open .drawer-hamburger{
      position: fixed;
    }

    .drawer-navbar-fixed .drawer-navbar-header {
      display: block;
      width: 100%;
      height: 50px;
      text-align: center;
      border-top: 2px solid #59bfff;
    }

    .drawer-navbar .drawer-hamburger{
      display: block;
    }

    .drawer-navbar .drawer-menu li {
      float: none;
    }

    .drawer-menu .drawer-menu-item.active{
      background: #59A550;
    }

    .drawer-menu i{
      display: inline-block;
      margin: 0 10px;
    }

    .drawer-left .drawer-nav{
      position: fixed;
      top: 0px;
      left: -16.25rem;
      bottom: 0px;
      z-index: 101;
      overflow: hidden;
      width: 16.25rem;
      background: #34393d;
      -webkit-transition: left .6s cubic-bezier(0.190, 1.000, 0.220, 1.000);
      transition: left .6s cubic-bezier(0.190, 1.000, 0.220, 1.000);
    }

    .drawer-left .drawer-menu-item{
      height: 45px;
      line-height: 45px;
      padding: 0 10px 0 28px;
      color:#fff;
      font-size: 14px;
      display: block;
      text-decoration: none;
    }

    .drawer-left .drawer-menu-item:hover{
      background: #59A550;
    }

    .drawer-left.drawer-open .drawer-nav{
      left: 0;
    }

    .drawer-left .drawer-hamburger,
    .drawer-left.drawer-open .drawer-navbar .drawer-hamburger {
      right: 0;
    }

    .drawer-mask.active{
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 100;
      background: rgba(6, 6, 6, 0.08);
    }
  }

  @media (min-width: 640px) {
    .drawer-navbar{
      left: 0;
    }
    .drawer-left{
      padding-left: 220px;
    }
    .drawer-navbar .drawer-hamburger{
      display: none;
    }
    .drawer-content{
      padding: 10px;
    }
  }

  @media (min-width: 750px) {
  }
</style>
