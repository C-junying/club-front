import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './home/Home'
import UserList from './user-manage/UserList'
import RoleList from './right-manage/RoleList'
import MenuList from './right-manage/MenuList'
import Error from '@/components/back-stage/Error'
import { Layout } from 'antd'
import SideMenu from '@/components/back-stage/SideMenu'
import TopHeader from '@/components/back-stage/TopHeader'
import BottomFooter from '@/components/back-stage/BottomFooter'
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
            overflow: 'auto',
          }}>
          <div
            style={{
              padding: 18,
              minHeight: 560,
              background: 'white',
            }}>
            <Routes>
              <Route path="/home" element={<Home />} />
              <Route path="/users/list" element={<UserList />} />
              <Route path="/admin/role" element={<RoleList />} />
              <Route path="/admin/menu" element={<MenuList />} />
              <Route path="/" element={<Navigate to="/backstage/home" />} />
              <Route path="/*" element={<Error />} />
            </Routes>
          </div>
        </Content>
        <BottomFooter />
      </Layout>
    </Layout>
  )
}
