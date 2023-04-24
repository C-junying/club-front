import { UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons'
import { Layout, Menu } from 'antd'
import React from 'react'
import './index.css'
import { useHistory } from 'react-router-use-history'
const { Sider } = Layout

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  }
}
const items = [
  getItem('首页', '/backstage/home', <UserOutlined />),
  {
    type: 'divider',
  },
  getItem('用户管理', '/backstage/users', <VideoCameraOutlined />, [
    getItem('用户列表', '/backstage/users/list'),
  ]),
  {
    type: 'divider',
  },
  getItem('权限管理', '/backstage/admin', <UploadOutlined />, [
    getItem('角色管理', '/backstage/admin/role'),
    getItem('菜单管理', '/backstage/admin/menu'),
  ]),
]
export default function SideMenu(props) {
  const test = useHistory()
  return (
    <Sider
      breakpoint="lg"
      collapsedWidth="0"
      onBreakpoint={(broken) => {
        console.log(broken)
      }}>
      <div className="logo">高校社团管理系统</div>
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={['/backstage/home']}
        onClick={({ key, keyPath, domEvent }) => {
          console.log(key, keyPath, domEvent)
          console.log(test)
          test.push(key)
        }}
        items={items}
      />
    </Sider>
  )
}
