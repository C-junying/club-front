// 将下划线的字段转为驼峰格式
// 处理对象：数组，对象
export function toHump(data) {
  if (typeof data != 'object' || !data) return data;
  if (data instanceof Date) return data;
  if (Array.isArray(data)) {
    return data.map((item) => toHump(item));
  }

  const newData = {};
  for (let key in data) {
    let newKey = key.replace(/_([a-z])/g, (p, m) => m.toUpperCase());
    newData[newKey] = toHump(data[key]);
  }
  return newData;
}
// 将驼峰转为下划线
export function toReverseHump(data) {
  if (typeof data != 'object' || !data) return data;
  if (data instanceof Date) return data;
  if (Array.isArray(data)) {
    return data.map((item) => toHump(item));
  }

  const newData = {};
  for (let key in data) {
    let newKey = key.replace(/(?<=[a-z]+)([A-Z])/g, (p) => '_' + p.toLowerCase());
    newData[newKey] = toReverseHump(data[key]);
  }
  return newData;
}
