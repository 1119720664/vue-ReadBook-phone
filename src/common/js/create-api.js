import Vue from "vue"
import CreateAPI from "vue-create-api"
import Toast from "../../views/ebook-toast/ebook-toast.vue"
import Popup from "../../views/ebook-popup/ebook-popup.vue"
import GroupDialog from "../../views/ebook-group-dialig/ebook-group-dialig.vue"

Vue.use(CreateAPI)
Vue.createAPI(Toast, true)
Vue.createAPI(Popup, true)
Vue.createAPI(GroupDialog, true)
