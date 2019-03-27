import Vue from 'vue';

// App
import Fragmented from './main.vue';
Vue.component('vue-fragmented', Fragmented);

import vmHeader from './modules/header.module.vue';
Vue.component('vm-header', vmHeader);
import vmFooter from './modules/footer.module.vue';
Vue.component('vm-footer', vmFooter);

import Button from './components/button.component.vue';
Vue.component('vc-button', Button);
import HeaderButton from './components/header-button.component.vue';
Vue.component('vc-header-button', HeaderButton);
import Loading from './components/loading.component.vue';
Vue.component('vc-loading', Loading);

/* Static
import vmHeader from './modules/header.module.vue';
Vue.component('vmHeader', vmHeader);
import vmSidebar from './modules/sidebar.module.vue';
Vue.component('vmSidebar', vmSidebar);
import vmSocial from './modules/social.module.vue';
Vue.component('vmSocial', vmSocial);
import vmFooter from './modules/footer.module.vue';
Vue.component('vmFooter', vmFooter);

// Window
import vmWindow from './modules/window.module.vue';
Vue.component('vmWindow', vmWindow);
import vcWindow from './modules/components/window.component.vue';
Vue.component('vcWindow', vcWindow);
// Notification
import vmNotification from './modules/notification.module.vue';
Vue.component('vmNotification', vmNotification);
// Select
import vcSelect from './modules/components/select.component.vue';
Vue.component('vcSelect', vcSelect);
import vcUserSelect from './modules/components/userselect.component.vue';
Vue.component('vcUserSelect', vcUserSelect);
import vcTagSelect from './modules/components/tagselect.component.vue';
Vue.component('vcTagSelect', vcTagSelect);
import vcDateSelect from './modules/components/dateselect.component.vue';
Vue.component('vcDateSelect', vcDateSelect);

// Components
import vcUser from './modules/components/user.component.vue';
Vue.component('vcUser', vcUser);
import vcIcon from './modules/components/icon.component.vue';
Vue.component('vcIcon', vcIcon);
import vcButton from './modules/components/button.component.vue';
Vue.component('vcButton', vcButton);
import vcDropdown from './modules/components/dropdown.component.vue';
Vue.component('vcDropdown', vcDropdown);
import vcTooltip from './modules/components/tooltip.component.vue';
Vue.component('vcTooltip', vcTooltip);
import vcInput from './modules/components/input.component.vue';
Vue.component('vcInput', vcInput);

// Pages
import vmBody from './modules/body.module.vue';
Vue.component('vmBody', vmBody);*/