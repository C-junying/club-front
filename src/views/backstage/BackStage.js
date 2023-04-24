import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './home/Home'
import UserList from './user-manage/UserList'
import RoleList from './right-manage/RoleList'
import MenuList from './right-manage/MenuList'
// import NoPermission from './nopermission/NoPermission'
import { Layout } from 'antd'
import SideMenu from '../../components/SideMenu'
import TopHeader from '../../components/TopHeader'
import BottomFooter from '../../components/BottomFooter'
import './BackStage.css'
const { Content } = Layout
export default function BackStage() {
  return (
    <Layout>
      <SideMenu />
      <Layout>
        <TopHeader />
        <Content
          style={{
            margin: '24px 16px 0',
          }}>
          <div
            style={{
              padding: 24,
              minHeight: 600,
              background: 'white',
            }}>
            <Routes>
              <Route path="/home" element={<Home />} />
              <Route path="/users/list" element={<UserList />} />
              <Route path="/admin/role" element={<RoleList />} />
              <Route path="/admin/menu" element={<MenuList />} />
              {/* <Route path="/*" element={<NoPermission />} /> */}
            </Routes>
          </div>
        </Content>
        <BottomFooter />
      </Layout>
    </Layout>
  )
}
