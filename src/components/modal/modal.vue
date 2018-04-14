<template>
  <div v-transfer-dom>
    <transition :name="transitionNames[1]">
      <div :class="maskClasses" v-show="visible" @click="mask"></div>
    </transition>
    <div :class="wrapClasses" @click="handleWrapClick">
      <transition :name="transitionNames[0]">
        <div :class="classes" :style="mainStyles" v-show="visible">
          <div :class="[prefixCls + '-content']">
            <a :class="[prefixCls + '-close']" v-if="closable" @click="close">
              <slot name="close">
                <icon type="ios-close-empty"></icon>
              </slot>
            </a>
            <div :class="[prefixCls + '-header']" v-if="showHead"><slot name="header"><div :class="[prefixCls + '-header-inner']">{{ title }}</div></slot></div>
            <div :class="[prefixCls + '-body']"><slot></slot></div>
            <div :class="[prefixCls + '-footer']" v-if="!footerHide">
              <slot name="footer">
                <k-button type="default" size="sm" @click.native="cancel">{{ localeCancelText }}</k-button>
                <k-button type="primary" size="sm" :loading="buttonLoading" @click.native="ok">{{ localeOkText }}</k-button>
              </slot>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<style lang="scss">
  //base
  @import "../../theme/theme.scss";
  .k-modal {
    width: auto;
    margin: 0 auto;
    position: relative;
    outline: 0;
    top: 100px
  }

  .k-modal-hidden {
    display: none!important
  }

  .k-modal-wrap {
    position: fixed;
    overflow: auto;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1000;
    -webkit-overflow-scrolling: touch;
    outline: 0
  }

  .k-modal-wrap * {
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent
  }

  .k-modal-mask {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(55,55,55,.6);
    height: 100%;
    z-index: 1000
  }

  .k-modal-mask-hidden {
    display: none
  }

  .k-modal-content {
    position: relative;
    background-color: #fff;
    border: 0;
    border-radius: 6px;
    background-clip: padding-box
  }

  .k-modal-header {
    border-bottom: 1px solid #e3e8ee;
    padding: 14px 16px;
    line-height: 1
  }

  .k-modal-header-inner,.k-modal-header p {
    display: inline-block;
    width: 100%;
    height: 20px;
    line-height: 20px;
    font-size: 14px;
    color: #464c5b;
    font-weight: 700;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap
  }

  .k-modal-close {
    font-size: 12px;
    position: absolute;
    right: 16px;
    top: 8px;
    overflow: hidden;
    cursor: pointer
  }

  .k-modal-close .k-icon-ios-close-empty {
    font-size: 31px;
    color: #999;
    transition: color .2s ease;
    position: relative;
    top: 1px
  }

  .k-modal-close .k-icon-ios-close-empty:hover {
    color: #444
  }

  .k-modal-body {
    padding: 16px;
    font-size: 12px;
    line-height: 1.5
  }

  .k-modal-footer {
    border-top: 1px solid #e3e8ee;
    padding: 12px 18px;
    text-align: right
  }

  .k-modal-footer button+button {
    margin-left: 8px;
    margin-bottom: 0
  }

  @media (max-width: 768px) {
    .k-modal {
      width:auto!important;
      margin: 10px
    }

    .vertical-center-modal .k-modal {
      -ms-flex: 1;
      flex: 1
    }
  }

  .k-modal-confirm {
    padding: 0 4px
  }

  .k-modal-confirm-head-title {
    display: inline-block;
    font-size: 14px;
    color: #464c5b;
    font-weight: 700
  }

  .k-modal-confirm-body {
    margin-top: 6px;
    padding-left: 48px;
    padding-top: 18px;
    font-size: 12px;
    color: #657180;
    position: relative
  }

  .k-modal-confirm-body-icon {
    font-size: 36px;
    position: absolute;
    top: 0;
    left: 0
  }

  .k-modal-confirm-body-icon-info {
    color: #39f
  }

  .k-modal-confirm-body-icon-success {
    color: #0c6
  }

  .k-modal-confirm-body-icon-warning {
    color: #f90
  }

  .k-modal-confirm-body-icon-error {
    color: #f30
  }

  .k-modal-confirm-body-icon-confirm {
    color: #f90
  }

  .k-modal-confirm-footer {
    margin-top: 40px;
    text-align: right
  }

  .k-modal-confirm-footer button+button {
    margin-left: 8px;
    margin-bottom: 0
  }
</style>
<script>
  import TransferDom from '../../directives/transfer-dom';
  import icon from '../icon';
  import kButton from '../button'
  import { getScrollBarSize } from '../../utils/assist';

  const prefixCls = 'k-modal';

  export default {
    components: {  icon, kButton},
    directives: { TransferDom },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      closable: {
        type: Boolean,
        default: true
      },
      maskClosable: {
        type: Boolean,
        default: true
      },
      title: {
        type: String
      },
      width: {
        type: [Number, String],
        default: 520
      },
      okText: {
        type: String
      },
      cancelText: {
        type: String
      },
      loading: {
        type: Boolean,
        default: false
      },
      styles: {
        type: Object
      },
      className: {
        type: String
      },
      // for instance
      footerHide: {
        type: Boolean,
        default: false
      },
      scrollable: {
        type: Boolean,
        default: false
      },
      transitionNames: {
        type: Array,
        default () {
          return ['ease', 'fade'];
        }
      }
    },
    data () {
      return {
        prefixCls: prefixCls,
        wrapShow: false,
        showHead: true,
        buttonLoading: false,
        visible: this.value
      };
    },
    computed: {
      wrapClasses () {
        return [
          `${prefixCls}-wrap`,
          {
            [`${prefixCls}-hidden`]: !this.wrapShow,
            [`${this.className}`]: !!this.className
          }
        ];
      },
      maskClasses () {
        return `${prefixCls}-mask`;
      },
      classes () {
        return `${prefixCls}`;
      },
      mainStyles () {
        let style = {};

        const styleWidth = {
          width: `${this.width}px`
        };

        const customStyle = this.styles ? this.styles : {};

        Object.assign(style, styleWidth, customStyle);

        return style;
      },
      localeOkText () {
        if (this.okText === undefined) {
          return '确定';
        } else {
          return this.okText;
        }
      },
      localeCancelText () {
        if (this.cancelText === undefined) {
          return '取消';
        } else {
          return this.cancelText;
        }
      }
    },
    methods: {
      close () {
        this.visible = false;
        this.$emit('input', false);
        this.$emit('on-cancel');
      },
      mask () {
        if (this.maskClosable) {
          this.close();
        }
      },
      handleWrapClick (event) {
        // use indexOf,do not use === ,because k-modal-wrap can have other custom className
        const className = event.target.getAttribute('class');
        if (className && className.indexOf(`${prefixCls}-wrap`) > -1) this.mask();
      },
      cancel () {
        this.close();
      },
      ok () {
//        if (this.loading) {
//          this.buttonLoading = true;
//        } else {
//          this.visible = false;
//          this.$emit('input', false);
//        }
        this.$emit('on-ok');
      },
      EscClose (e) {
        if (this.visible && this.closable) {
          if (e.keyCode === 27) {
            this.close();
          }
        }
      },
      checkScrollBar () {
        let fullWindowWidth = window.innerWidth;
        if (!fullWindowWidth) { // workaround for missing window.innerWidth in IE8
          const documentElementRect = document.documentElement.getBoundingClientRect();
          fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left);
        }
        this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth;
        if (this.bodyIsOverflowing) {
          this.scrollBarWidth = getScrollBarSize();
        }
      },
      setScrollBar () {
        if (this.bodyIsOverflowing && this.scrollBarWidth !== undefined) {
          document.body.style.paddingRight = `${this.scrollBarWidth}px`;
        }
      },
      resetScrollBar () {
        document.body.style.paddingRight = '';
      },
      addScrollEffect () {
        this.checkScrollBar();
        this.setScrollBar();
        document.body.style.overflow = 'hidden';
      },
      removeScrollEffect() {
        document.body.style.overflow = '';
        this.resetScrollBar();
      }
    },
    mounted () {
      if (this.visible) {
        this.wrapShow = true;
      }

      let showHead = true;

      if (this.$slots.header === undefined && !this.title) {
        showHead = false;
      }

      this.showHead = showHead;

      // ESC close
      document.addEventListener('keydown', this.EscClose);
    },
    beforeDestroy () {
      document.removeEventListener('keydown', this.EscClose);
      this.removeScrollEffect();
    },
    watch: {
      value (val) {
        this.visible = val;
      },
      visible (val) {
        if (val === false) {
          this.buttonLoading = false;
          this.timer = setTimeout(() => {
            this.wrapShow = false;
            this.removeScrollEffect();
          }, 300);
        } else {
          if (this.timer) clearTimeout(this.timer);
          this.wrapShow = true;
          if (!this.scrollable) {
            this.addScrollEffect();
          }
        }
        //this.broadcast('Table', 'on-visible-change', val);
      },
      loading (val) {
        if (!val) {
          this.buttonLoading = false;
        }
      },
      scrollable (val) {
        if (!val) {
          this.addScrollEffect();
        } else {
          this.removeScrollEffect();
        }
      },
      title (val) {
        if (this.$slots.header === undefined) {
          this.showHead = !!val;
        }
      }
    }
  };
</script>
