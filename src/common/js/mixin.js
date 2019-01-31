import { mapGetters } from "vuex";

export const EBookMixin = {
  computed: {
    ...mapGetters({menuVisible: "Book/menuVisible"})
  }
}
