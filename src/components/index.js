
import Message from './message'
import Modal from './modal/index'
import Notice from './notice'
import Affix from './affix'
import Icon from './icon'
import Overlay from './overlay'
import Panel from './panel'
import BackTop from './back-top'
import KButton from './button'
import Loading from './loading'
import NoData from './nodata'
import TitleLine from './title-line'
import Ribbon from './ribbon'

const kComps = {
    Message,
    Modal,
    Notice,
    Affix,
    Icon,
    Overlay,
    Panel,
    BackTop,
    KButton,
    Loading,
    NoData,
    TitleLine,
    Ribbon
};

const install = function (Vue, opts = {}) {

    Object.keys(kComps).forEach((key) => {
        Vue.component(key, kComps[key]);
    });

    Vue.prototype.$Message = Message;
    Vue.prototype.$Modal = Modal;
    Vue.prototype.$Notice = Notice;
};

// auto install
if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
}

module.exports = Object.assign(kComps, {install});
