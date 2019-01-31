import { addCss ,removeAll} from "common/js/book-font"

export function globalThemeCss(theme) {
  removeAll()
  switch (theme) {
    case "Default":
      addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_default.css`)
      break;
    case "Eye":
      addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_eye.css`)
      break;
    case "Gold":
      addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_gold.css`)
      break;
    case "Night":
      addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_night.css`)
      break;
    default:
      addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_default.css`)
      break;
  }
}
