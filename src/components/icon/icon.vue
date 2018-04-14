<template>
  <i :class="classes" :style="styles"></i>
</template>

<style scoped lang="scss">

  .ion-load-loop {
    animation: ani-load-loop 1s linear infinite
  }

  @keyframes ani-load-loop {
    0% {
      transform: rotate(0)
    }

    50% {
      transform: rotate(180deg)
    }

    to {
      transform: rotate(1turn)
    }
  }



</style>

<script>
  const prefixCls = 'ion';

  export default {
    name: 'Icon',
    props: {
      type: String,
      size: [Number, String],
      color: String
    },
    computed: {
      classes () {
        return `${prefixCls} ${prefixCls}-${this.type}`;
      },
      styles () {
        let style = {};

        if (this.size) {
          style['font-size'] = `${this.size}px`;
        }

        if (this.color) {
          style.color = this.color;
        }

        return style;
      }
    }
  };
</script>
