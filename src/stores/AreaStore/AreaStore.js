import { makeAutoObservable, runInAction } from 'mobx';
import { http } from '@/utils/http';
import { toHump } from '@/utils/toHump';
class AreaStore {
  areaList = [];
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }
  // 获取场地信息,true强制请求，false不强制
  async getAllAreaList(flag) {
    if (this.areaList.length > 0 && !flag) {
      return;
    }
    let areaList = await http.post('/area/areaAll').then((res) => res);
    runInAction(() => {
      this.areaList = areaList.data.data;
    });
  }
  // 添加场地
  addArea(value) {
    return http.post('/area/addArea', toHump(value));
  }
  // 删除场地
  deleteArea(item) {
    this.areaList = this.areaList.filter((area) => area['area_id'] !== item['area_id']);

    return http.post('/area/deleteArea', toHump(item));
  }
  // 更新场地
  updateArea(value) {
    this.areaList = this.areaList.map((item) => {
      if (item['area_id'] === value['area_id']) {
        return value;
      }
      return item;
    });

    return http.post('/area/updateArea', toHump(value));
  }
  // 查询场地
  async getSearch(value) {
    let areaList = await http.post('/area/areaSearch', { keywords: value });
    runInAction(() => {
      this.areaList = areaList.data.data;
    });
  }
}

export default AreaStore;
