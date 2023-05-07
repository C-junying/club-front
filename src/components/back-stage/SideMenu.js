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

  const [selectKey, setSelectKey] = useState(
    setPath(location.pathname === '/backstage' ? '/backstage/home' : location.pathname)
  )
  useEffect(() => {
    http.post('/menu/menuList').then((res) => {
      setmenu(res.data.data)
    })
  }, [])
  useEffect(() => {
    setSelectKey(setPath(location.pathname))
  }, [location.pathname])
  items = setItems(menu)
  return (
    <Sider breakpoint="lg" collapsedWidth="0">
      <div className="logo">高校社团管理系统</div>
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={selectKey}
        defaultOpenKeys={selectKey}
        onClick={({ key, keyPath, domEvent }) => {
          // console.log(key, keyPath, domEvent)
          navigate(key)
        }}
        items={items}
      />
    </Sider>
  )
}
