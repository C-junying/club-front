import { makeAutoObservable, runInAction } from 'mobx';
import { http } from '@/utils/http';
import { toHump } from '@/utils/toHump';
class ClubStore {
  clubList = [];
  userClubList = [];
  userPosition = {};
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }
  // 获取所有社团信息,true强制请求，false不强制
  async getAllClubList(flag) {
    // 如果clubList不为空，则不发布请求
    if (this.clubList.length > 0 && !flag) {
      return;
    }
    let clubList = await http.post('/club/getClubsAll').then((res) => res);
    runInAction(() => {
      this.clubList = clubList.data.data;
    });
  }
  // 获取用户社团信息
  async getUserClubList() {
    // 如果userClubList不为空，则不发布请求
    if (this.userClubList.length > 0) {
      return;
    }
    let list = await http.post('/club/getUserClubs').then((res) => res);
    runInAction(() => {
      this.userClubList = list.data.data;
    });
  }
  // 返回当前社团的信息
  getCurrentClub(value) {
    let current = {};
    this.userClubList.forEach((val) => {
      if (val['club_id'] === value) {
        current = val;
        return;
      }
    });
    return current;
  }
  /**
   * @description: 返回用户在社团的职位
   * @param {*} value clubId
   */
  async getUserBearPosition(value) {
    if (JSON.stringify(this.userPosition) !== '{}') {
      return;
    }
    const bear = await http.post('/club/clubIdUserIdToBearName', toHump(value));
    runInAction(() => {
      if (bear.data.data.member.length > 0) {
        this.userPosition = bear.data.data.member[0];
      } else if (bear.data.data.taecher.length > 0) {
        this.userPosition = bear.data.data.taecher[0];
      }
    });
  }
  // 当前社团的相关信息
  currentClubDesciption(value) {
    return http.post('/club/clubIdApplyClub', toHump(value));
  }
  // 社团的担任老师
  currentClubTeacher(value) {
    return http.post('/teacher/clubIdTeacher', toHump(value));
  }
  // 删除社团
  deleteClub(item) {
    this.clubList = this.clubList.filter((user) => user['user_id'] !== item['user_id']);

    return http.post('/users/delete', toHump(item));
  }
  // 更新社团
  updateClub(value) {
    this.clubList = this.clubList.map((item) => {
      if (item['user_id'] === value['user_id']) {
        return value;
      }
      return item;
    });

    return http.post('/users/update', toHump(value));
  }

  // 社团查询
  async getSearch(value) {
    let clubList = await http.post('/club/searchClubsAll', { keywords: value });
    runInAction(() => {
      this.clubList = clubList.data.data;
    });
  }
}

export default ClubStore;
