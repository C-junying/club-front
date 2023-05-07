import React, { useEffect, useState } from 'react'
import { Menu } from 'antd'
import { http } from '@/utils/http'
import { MyIcon } from '@/utils/MyIcon'
import HeanderTitle from '@/components/other/HeanderTitle'
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'
export default function MyClubIntro() {
  const items = [
    {
      label: '社团信息',
      key: 'information',
      icon: MyIcon('HomeOutlined'),
    },
    {
      label: '社团成员',
      key: 'member',
      icon: MyIcon('UserOutlined'),
    },
    {
      label: '社团活动',
      key: 'activity',
      icon: MyIcon('AppstoreOutlined'),
    },
    {
      label: '社团学期报告',
      key: 'report',
      icon: MyIcon('SolutionOutlined'),
    },
  ]
  // 跳转
  const navigate = useNavigate()
  const location = useLocation()

  const path = location.pathname.split('/')
  // 设置顶部菜单的选中
  const [current, setCurrent] = useState(path[path.length - 1])
  useEffect(() => {
    const currentPath = location.pathname.split('/')
    setCurrent(currentPath[currentPath.length - 1])
  }, [location.pathname])

  // 顶部菜单点击响应
  const onClick = (e) => {
    setCurrent(e.key)
    navigate(e.key)
  }
  //   获取链接数据
  const params = useParams()
  // 社团名称
  const [title, setTitle] = useState('我的社团')
  useEffect(() => {
    http.post('/club/clubIdClub', params).then((res) => {
      setTitle(res.data.data[0]['club_name'])
    })
  }, [params])
  return (
    <>
      <HeanderTitle title={title} onBack={() => navigate('/club/my-club')} />
      <Menu
        onClick={onClick}
        selectedKeys={[current]}
        mode="horizontal"
        items={items}
        style={{ marginBottom: 20 }}
      />
      <Outlet />
    </>
  )
}
