import Vue from 'vue';
import Modal from './modal.vue';
import Icon from '../icon';
import kButton from '../button'
import { camelcaseToHyphen } from '../../utils/assist';

const prefixCls = 'k-modal-confirm';

Modal.newInstance = properties => {
    const _props = properties || {};

    let props = '';
    Object.keys(_props).forEach(prop => {
        props += ' :' + camelcaseToHyphen(prop) + '=' + prop;
    });

    const div = document.createElement('div');
    div.innerHTML = `
        <Modal${props} v-model="visible" :width="width" :scrollable="scrollable">
            <div class="${prefixCls}">
                <div class="${prefixCls}-head">
                    <div class="${prefixCls}-head-title" v-html="title"></div>
                </div>
                <div class="${prefixCls}-body">
                    <div :class="iconTypeCls"><i :class="iconNameCls"></i></div>
                    <div v-html="body"></div>
                </div>
                <div class="${prefixCls}-footer">
                    <k-button type="default" size="sm" v-if="showCancel" @click.native="cancel">{{ localeCancelText }}</k-button>
                    <k-button type="primary" size="sm" :loading="buttonLoading" @click.native="ok">{{ localeOkText }}</k-button>
                </div>
            </div>
        </Modal>
    `;
    document.body.appendChild(div);

    const modal = new Vue({
        el: div,
        components: { Modal, kButton, Icon },
        data: Object.assign(_props, {
            visible: false,
            width: 416,
            title: '',
            body: '',
            iconType: '',
            iconName: '',
            okText: undefined,
            cancelText: undefined,
            showCancel: false,
            loading: false,
            buttonLoading: false,
            scrollable: false
        }),
        computed: {
            iconTypeCls () {
                return [
                    `${prefixCls}-body-icon`,
                    `${prefixCls}-body-icon-${this.iconType}`
                ];
            },
            iconNameCls () {
                return [
                    'ion',
                    `ion-${this.iconName}`
                ];
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
            cancel () {
                this.$children[0].visible = false;
                this.buttonLoading = false;
                this.onCancel();
                this.remove();
            },
            ok () {
                if (this.loading) {
                    this.buttonLoading = true;
                } else {
                    this.$children[0].visible = false;
                    this.remove();
                }
                this.onOk();
            },
            remove () {
                setTimeout(() => {
                    this.destroy();
                }, 300);
            },
            destroy () {
                this.$destroy();
                document.body.removeChild(this.$el);
                this.onRemove();
            },
            onOk () {},
            onCancel () {},
            onRemove () {}
        }
    }).$children[0];

    return {
        show (props) {
            modal.$parent.showCancel = props.showCancel;
            modal.$parent.iconType = props.icon;

            switch (props.icon) {
                case 'info':
                    modal.$parent.iconName = 'information-circled';
                    break;
                case 'success':
                    modal.$parent.iconName = 'checkmark-circled';
                    break;
                case 'warning':
                    modal.$parent.iconName = 'android-alert';
                    break;
                case 'error':
                    modal.$parent.iconName = 'close-circled';
                    break;
                case 'confirm':
                    modal.$parent.iconName = 'help-circled';
                    break;
            }

            if ('width' in props) {
                modal.$parent.width = props.width;
            }

            if ('title' in props) {
                modal.$parent.title = props.title;
            }

            if ('content' in props) {
                modal.$parent.body = props.content;
            }

            if ('okText' in props) {
                modal.$parent.okText = props.okText;
            }

            if ('cancelText' in props) {
                modal.$parent.cancelText = props.cancelText;
            }

            if ('onCancel' in props) {
                modal.$parent.onCancel = props.onCancel;
            }

            if ('onOk' in props) {
                modal.$parent.onOk = props.onOk;
            }

            // async for ok
            if ('loading' in props) {
                modal.$parent.loading = props.loading;
            }

            if ('scrollable' in props) {
                modal.$parent.scrollable = props.scrollable;
            }

            // notice when component destroy
            modal.$parent.onRemove = props.onRemove;

            modal.visible = true;
        },
        remove () {
            modal.visible = false;
            modal.$parent.buttonLoading = false;
            modal.$parent.remove();
        },
        component: modal
    };
};

export default Modal;
