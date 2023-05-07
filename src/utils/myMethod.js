// 将数组分割成多个数组
/* 
  @array 数组
  @subGroupLength 分割数组最多元素
*/
function group(array, subGroupLength) {
  let index = 0
  let newArray = []
  while (index < array.length) {
    newArray.push(array.slice(index, (index += subGroupLength)))
  }
  return newArray
}
export { group }
