<template>
  <core-layout>
    <div class="page">
      <section class="index-aboutme">
        <div class="aboutme-body">

          <div class="aboutme-avatar"></div>
          <h3>秋之殇个人Blog</h3>
          <p>90后白羊男，前端工程师，全栈开发尝试者</p>
          <div class="my-sns-links">
            <a href="https://github.com/bh-lay?from=bh-lay" title="github">
              <icon type="social-octocat"></icon>
            </a>
            <a href="http://www.zhihu.com/people/imju-zhong-ren?from=bh-lay" title="知乎">
              知
            </a>
          </div>
        </div>
      </section>
      <section class="index-about-design">
        <h3>响应式设计</h3>
        <p>配合单页架构提升使用体验</p>
        <div class="device-cnt">
          <div class="device mobile"><span></span><i></i><i></i></div>
          <div class="device pc"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
          <div class="device pad"><i></i><i></i><i></i><i></i></div>
        </div>
      </section>
      <section class="index-about-links">
        <router-link :to="{ name: 'blog'}" title="关于我" class="btn btn-warning">
          <span>关于我</span>
        </router-link>
        <router-link :to="{ name: 'blog'}" title="我的博客" class="btn btn-default">
          <span>我的博客</span>
        </router-link>
      </section>
    </div>
  </core-layout>
</template>
<style lang="scss">
    //base
    @import "../theme/theme.scss";

    .page {
      min-height:600px;
      section {
        position: relative;
        font-size: 1rem;
      }
    }

    .index-aboutme {
      position: relative;
      max-height: 94vh;
      min-height: 300px;
      color: #fff;
      text-shadow: 1px 0 2px rgba(0,0,0,.3);
      background: url(../assets/index-aboutme-bg.jpg) center center;
      background-size: cover;
      overflow: hidden;
      .aboutme-avatar {
        margin: 0 auto;
        width:120px;
        height:120px;
        border-radius: 60px;
        border:2px solid #fff;
        padding: 2px;
        background: url(../assets/index-avatar.png);
      }
      &:before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: url(../assets/mask.png);
        z-index: 0
      }
      &:after {
        content: '';
        display: block;
        padding-top: 66%
      }
      .aboutme-body {
        position: absolute;
        width: 100%;
        height: 160px;
        top: 50%;
        left: 0;
        margin-top: -80px;
        text-align: center
      }
      h3 {
        padding-left: 10px;
        margin-bottom: .3em;
        line-height: 1em;
        font-size: 0.6rem;
        font-weight: 500
      }
      p {
        padding-left: 10px;
        margin-bottom: 0.4rem;
        font-size: 0.4rem;
      }
      .my-sns-links a {
        display: inline-block;
        vertical-align: middle;
        width: 1.2rem;
        height: 1.2rem;
        margin: 0 10px;
        line-height: 1.2rem;
        border: 1px solid rgba(255,255,255,.4);
        border-radius: 100%;
        font-size: 0.5em;
        color: #fff;
        text-align: center;
        opacity: .7;
        transition: all .3s ease-in-out;
        -moz-transition: all .3s ease-in-out;
        -webkit-transition: all .3s ease-in-out;
        -o-transition: all .3s ease-in-out
      }
      .my-sns-links a:hover {
        opacity: 1;
        background: rgba(255,255,255,.5)
      }
    }

    .index-about-design {
      position: relative;
      padding: 5em 0;
      line-height: 1.8em;
      text-align: center;
      background: #fff;
      h3 {
        margin-bottom: 0.3rem;
        font-size: 0.6rem;
        font-weight: 400;
        letter-spacing: .2em;
        color: #333
      }
      p {
        margin-bottom: 0.3rem;
        padding-right: .4em;
        font-size: 0.4rem;
        color: #000;
        opacity: .8
      }
      .links {
        font-size: .85em;
        color: #333
      }
      .links a {
        padding: 0 .5em;
        text-decoration: underline
      }
      .device-cnt {
        position: relative;
        height: 176px;
        max-width: 600px;
        margin: 1.5em auto 0;
        border-bottom: 1px solid #fff;
        overflow: hidden
      }
      .device-cnt:after {
        content: '';
        position: absolute;
        height: 10px;
        left: 10px;
        right: 10px;
        bottom: -10px;
        box-shadow: 0 0 10px #000
      }
      .device {
        position: absolute;
        bottom: 0;
        border-radius: 8px 8px 0 0;
        background: #d6d6d6;
        border: 1px solid #444;
        border-width: 10px 6px 0;
        line-height: 0
      }
      .device:before {
        content: '';
        display: block;
        height: 10px;
        margin-bottom: 6px;
        background: #fff;
        box-shadow: 0 0 2px #444
      }
      .device i {
        display: inline-block;
        position: relative;
        width: 58px;
        height: 75px;
        background: #fff;
        margin: 0 3px 8px
      }
      .device i:before {
        content: '';
        position: absolute;
        width: 100%;
        height: 62%;
        left: 0;
        top: 0;
        background: #aaa
      }
      .mobile {
        width: 52px;
        height: 88px;
        border-width: 17px 4px 0;
        left: 10px;
        z-index: 1
      }
      .mobile:after {
        content: '';
        display: block;
        position: absolute;
        background: #000;
        width: 3px;
        height: 3px;
        top: -13px;
        left: 24px;
        border-radius: 3px
      }
      .mobile span {
        display: block;
        position: absolute;
        background: #000;
        width: 10px;
        height: 2px;
        top: -7px;
        left: 20px;
        border-radius: 2px
      }
      .mobile i {
        display: block;
        width: auto;
        height: 55px;
        margin-bottom: 4px
      }
      .pc {
        width: 280px;
        height: 166px;
        left: 50%;
        margin-left: -146px
      }
      .pc:before {
        margin-bottom: 10px
      }
      .pad {
        width: 105px;
        height: 113px;
        right: 10px;
        border-top-width: 17px
      }
      .pad:after {
        content: '';
        display: block;
        position: absolute;
        background: #000;
        width: 4px;
        height: 4px;
        top: -11px;
        left: 51px;
        border-radius: 100%
      }
      .pad i {
        width: 44px;
        height: 55px
      }
    }

    .index-about-links {
      padding: 3em 0;
      text-align: center;
      background: rgba(255,255,255,.5);
      .btn {
        margin: 0 20px
      }
    }

    @media screen and (min-width: 660px) {
      .index-aboutme .aboutme-body {
        top:20%;
        margin-top: 0;
      }
    }

</style>
<script type="text/javascript">

    import coreLayout from "../components/layout/core-layout";

    module.exports = {
        data: function () {
            return {
                now: 1,
                clearInterval: '',
            }
        },
        mounted: function () {
            let _this = this;
            let count = $('#headlines h1').length;
            _this.clearInterval = setInterval(function () {
                _this.now >= count ? _this.now = 1 : _this.now++;
            }, 1000);
        },
        destroyed: function () {
            clearInterval(this.clearInterval)
        },
        components: {
          coreLayout
        }
    }

</script>


