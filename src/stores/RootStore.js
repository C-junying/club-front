import React, { createContext, useContext } from 'react';
import TokenStore from './UserStore/TokenStore';
import UserStore from './UserStore/UserStore';
import RoleStore from './rightManageStore/RoleStore';
import MenuStore from './rightManageStore/MenuStore';
import AreaStore from './AreaStore/AreaStore';
import TeacherStore from './TeacherStore/TeacherStore';
import ClubTypeStore from './ClubStore/ClubTypeStore';
import ActivityTypeStore from './ActivityStore/ActivityTypeStore';

class RootStore {
  // 组合模块
  constructor() {
    // 个人信息
    this.tokenStore = new TokenStore();
    // 所有用户信息
    this.userStore = new UserStore();
    // 角色信息
    this.roleStore = new RoleStore();
    // 菜单信息
    this.menuStore = new MenuStore();
    // 场地信息
    this.areaStore = new AreaStore();
    // 老师信息
    this.teacherStore = new TeacherStore();
    // 社团类型
    this.clubTypeStore = new ClubTypeStore();

    // 活动类型
    this.activityTypeStore = new ActivityTypeStore();
  }
}
const rootStore = new RootStore();
// 注入context
const RootStoreContext = createContext();
// 使用provider包裹组件
const RootStoreProvider = ({ children }) => {
  return <RootStoreContext.Provider value={rootStore}>{children}</RootStoreContext.Provider>;
};
// 使用store
const useRootStore = () => {
  return useContext(RootStoreContext);
};
export { RootStore, RootStoreProvider, useRootStore };
