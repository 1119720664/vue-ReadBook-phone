export function px2rem(px) {
  const ratio = 375 / 10
  return px / ratio
}

export function realPx(px) {
  const maxWidth = window.innerWidth > 500 ? 500 : window.innerWidth
  return px * (maxWidth / 375)
}

export function addendAddToShelf(list) {
  console.log(1111, list)
  list.push({
    id: Math.random() * 100,
    type: 3
  })
  console.log(list)
  return list
}

export function removeAddToShelf(list) {
  return list.filter(item => item.type !== 3)
}

export function gotoStoreHome(vue) {
  vue.$router.push({path: '/home/family'})
}
