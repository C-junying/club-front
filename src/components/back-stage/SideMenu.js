import { Layout, Menu } from 'antd'
import React, { useEffect, useState } from 'react'
import './index.css'
import { http } from '@/utils/http'
import { setItems, setPath } from '@/utils/menuTree'
import { useNavigate, useLocation } from 'react-router-dom'
const { Sider } = Layout

let items = []

export default function SideMenu() {
  const navigate = useNavigate()
  const location = useLocation()

  const [menu, setmenu] = useState([])
  const [pathname, setPathName] = useState(
    location.pathname === '/backstage' ? '/backstage/home' : location.pathname
  )
  const [selectKey, setSelectKey] = useState(setPath(pathname))
  useEffect(() => {
    http.post('/menu/menuList').then((res) => {
      setmenu(res.data.data)
    })
  }, [])
  useEffect(() => {
    setPathName(location.pathname)
    setSelectKey(setPath(location.pathname))
  }, [location.pathname])
  items = setItems(menu)
  return (
    <Sider breakpoint="lg" collapsedWidth="0">
      <div className="logo">高校社团管理系统</div>
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={[pathname]}
        defaultOpenKeys={selectKey}
        onClick={({ key, keyPath, domEvent }) => {
          // console.log(key, keyPath, domEvent)
          navigate(key)
          setPathName(key)
        }}
        items={items}
      />
    </Sider>
  )
}
