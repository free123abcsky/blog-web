/**
 * Created by Hsiang on 2016/10/12.
 * 路由
 */
'use strict';
import Vue from 'vue';
import store from './vuex/store'
import {setPageTitle} from './utils/assist'
import VueRouter from "vue-router";
Vue.use(VueRouter);
const routes = [
  {
    path: '/',
    name: 'index', //命名路由
    component: require('./views/index.vue'),
    meta: { title: '首页'}
  },
  {
    path: '/labs',
    name: 'labs',
    redirect: {
      name: 'labsList'
    },
    component: require('./views/labs/labs.vue'),
    children: [
      {
        path: 'labsList',
        name: 'labsList',
        component: require('./views/labs/lab.list.vue'),
        meta: { title: '实验室'}
      },
      {
        path: 'video',
        name: 'video',
        component: require('./views/labs/video.vue'),
        meta: { title: 'VIP视频'}
      },
      {
        path: 'waterfall',
        name: 'waterfall',
        component: require('./views/labs/waterfall.vue'),
        meta: { title: '瀑布流'}
      }
    ]
  },
  {
    path: '/music',
    name: 'music',
    component: require('./views/blog/music.vue'),
    meta: { title: '享受音乐中'}
  },
  {
    path: '/login',
    name: 'login',
    component: function (resolve) {
      require(['./views/login.vue'], resolve)
    },
    meta: { title: '登录'}
  },
/*  {
    path: '/blogn',
    name: 'blogn',
    component: function (resolve) {
      require(['./views/blog/blogn.vue'], resolve)
    },
    meta: { title: '博客新'}
  },*/
  {
    path: '/blog',
    name: 'blog',
    //跳转到文章列表并携带参数
    redirect: {
      name: 'artList'
    },
    component: require('./views/blog/blog.vue'),
    children: [
      {
        path: 'articles',
        name: 'artList',
        component: require('./views/blog/articleList.vue'),
      },
/*      {
        path: 'article/:articleId',
        name: 'article',
        component: function (resolve) {
          require(['./views/blog/article.vue'], resolve)
        },
      },*/
      {
        path: 'his-list',
        name: 'historyList',
        component: require('./views/blog/historyList.vue'),
      },
      {
        path: 'tag-list',
        name: 'tagList',
        redirect: '/blog/tag-list/classify',
        component: {
          template: '<router-view></router-view>'
        },
        children: [
          {
            path: 'classify',
            name: 'tagListClassify',
            component: require('./views/blog/tagList.vue'),
          },
          {
            path: 'find-by-tag-id',
            name: 'tagListFindByTagId',
            component: require('./views/blog/articleList.vue'),
          },
        ]
      }
    ]
  },
  {
    path: '/admin',
    name: 'admin',
    component: function (resolve) {
      require(['./views/admin.vue'], resolve)
    },
    redirect: {
      name: 'admin-dashboard'
    },
    meta: {requiresAuth: true},
    children: [
      {
        path: 'dashboard',
        name: 'admin-dashboard',
        component: function (resolve) {
          require(['./views/admin/dashboard.vue'], resolve)
        },
        meta: {title: '控制台', requiresAuth: true},
      },
      {
        path: 'myinfo',
        name: 'admin-myinfo',
        component: function (resolve) {
          require(['./views/admin/myInfo.vue'], resolve)
        },
        meta: {title: '个人信息', requiresAuth: true},
      },
      {
        path: 'tag',
        name: 'admin-tag',
        component: function (resolve) {
          require(['./views/admin/tagList.vue'], resolve)
        },
        meta: {title: '标签管理', requiresAuth: true},
      },
      {
        path: 'articles',
        name: 'articles',
        component: function (resolve) {
          require(['./views/admin/articles.vue'], resolve)
        },
        meta: {title: '文章管理', requiresAuth: true},
      },
      {
        path: 'articleManager',
        name: 'admin-articleManager',
        redirect: {
          name: 'admin-articleList'
        },
        component: {
          template: '<router-view></router-view>'
        },
        meta: {requiresAuth: true},
        children: [
          {
            path: 'admin-articleList',
            name: 'admin-articleList',
            component: function (resolve) {
              require(['./views/admin/articleList.vue'], resolve)
            },
            meta: {requiresAuth: true},
          },
          // {
          //   path: 'admin-article/:articleId',
          //   name: 'admin-article',
          //   component: function (resolve) {
          //     require(['./views/admin/article.vue'], resolve)
          //   },
          //   meta: {requiresAuth: true},
          // },
        ]
      },
      {
        path: 'comments',
        name: 'admin-commentList',
        component: function (resolve) {
          require(['./views/admin/commentList.vue'], resolve)
        },
        meta: {title: '评论管理', requiresAuth: true},
      },
      {
        path: 'comments1',
        name: 'admin-commentList1',
        component: function (resolve) {
          require(['./views/admin/commentList1.vue'], resolve)
        },
        meta: {title: '评论管理', requiresAuth: true},
      },
    ]
  },
  {
    path: '/noauth',
    name: 'noauth',
    component: function (resolve) {
      require(['./views/page/noauth.vue'], resolve)
    },
    meta: { title: '您没有权限'}
  },
  {
    path: '/500',
    name: '500',
    component: function (resolve) {
      require(['./views/page/500.vue'], resolve)
    },
    meta: { title: '服务器开小差了，请等等再试试吧'}
  },
  {
    path: '/maintenance',
    name: 'maintenance',
    component: function (resolve) {
      require(['./views/page/maintenance.vue'], resolve)
    },
    meta: { title: '系统正在维护中'}
  },
  {
    path: '*',
    name: '404',
    component: function (resolve) {
      require(['./views/page/404.vue'], resolve)
    },
    meta: { title: '您指定的页面已丢失'}
  }
];
const router = new VueRouter({
  mode: 'history', //  hash 模式  history 模式
  base: '/',//默认值: "/",应用的基路径。例如，如果整个单页应用服务在 /app/ 下，然后 base 就应该设为 "/app/"。
  linkActiveClass: 'active',
  routes: routes // （缩写）相当于 routes: routes
});

/**
 * 登录状态检查
 * */
router.beforeEach((to, from, next) => {

  if(to.meta.title){
    setPageTitle(to.meta.title)
  }
  if (to.matched.some(record => record.meta.requiresAuth)) {

    // 未登录状态
    if (!store.state.isLogin) {
      //存在authorization信息，则验证下。
      if (!!Vue.$localStorage.authorization) {
        _checkAuth().then(function () {
          next();
        },function () {
          next({
            name: 'login',
          })
        });
      } else {
        next({
          name: 'login',
        })
      }
    } else {
      _checkAuth().then(function () {
        next();
      },function () {
        next({
          name: 'login',
        })
      });
    }
  } else {
    next(); // 确保一定要调用 next()
  }
});


/**
 * Token验证，只是对时间验证过期否
 * */
function _checkAuth() {
  return new Promise(function (resolve, reject) {
    let authorization = Vue.$localStorage.authorization;
    let time = parseInt(authorization.time);
    if ((new Date().getTime() - time) < 1000 * 60 * 60 * 2) {
      //token有效,能进入
      store.dispatch('setLoginState',true);
      // 设置请求的token
      Vue.http.defaults.headers.common['authorization'] = "Bearer " + authorization.token;
      resolve();
    } else {
      Vue.$localStorage.$delete('authorization');
      Vue.$localStorage.$delete('commentInfo');
      store.dispatch('setLoginState',false);
      reject();
    }
  })
}

module.exports = router;
