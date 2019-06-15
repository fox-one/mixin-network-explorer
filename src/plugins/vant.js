import Vue from 'vue'
import { Cell, Button, List, Loading, CellGroup, Row, Col, Panel, Field, Picker, Popup, Toast, NumberKeyboard, Dialog } from 'vant';
import VanTab from 'vant/lib/tab';
import VanTabs from 'vant/lib/tabs';
import VanNavBar from 'vant/lib/nav-bar';
import 'vant/lib/index.css';

import { Locale } from 'vant';
import enUS from 'vant/lib/locale/lang/en-US';
import zhCN from 'vant/lib/locale/lang/zh-CN';
// import i18n from '@/i18n'

Locale.use('en-US', enUS);
// if (i18n.locale === 'en') {
//   Locale.use('en-US', enUS);
// } else {
//   Locale.use('zh-CN', zhCN);
// }

Vue.use(Toast)
Vue.use(Cell)
Vue.use(List)
Vue.use(Button)
Vue.use(Loading)
Vue.use(CellGroup).use(Cell)
Vue.use(VanTab).use(VanTabs)
Vue.use(Row).use(Col)
Vue.use(Panel)
Vue.use(Field)
Vue.use(Picker)
Vue.use(Popup)
Vue.use(NumberKeyboard)
Vue.use(VanNavBar)
Vue.use(Dialog)