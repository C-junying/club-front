import React, { useEffect, useState } from 'react'
import { Menu } from 'antd'
import { http } from '@/utils/http'
import { MyIcon } from '@/utils/MyIcon'
import HeanderTitle from '@/components/other/HeanderTitle'
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'
export default function ActivityInfo() {
  //   获取链接数据
  const params = useParams()

  // 当前用户数据
  // user
  const [myUser, setMyUser] = useState({})
  useEffect(() => {
    http.post('/activity/activityIdUserIdToBearName', params).then((res) => {
      if (res.data.data.member.length > 0) {
        setMyUser(res.data.data.member[0])
      } else if (res.data.data.taecher.length > 0) {
        setMyUser(res.data.data.taecher[0])
      }
    })
  }, [params])

  const items = [
    {
      label: '活动信息',
      key: 'information',
      icon: MyIcon('HomeOutlined'),
    },
    {
      label: '活动成员',
      key: 'member',
      icon: MyIcon('UserOutlined'),
    },
    {
      label: '活动阶段',
      key: 'activity-stage',
      icon: MyIcon('AppstoreOutlined'),
    },
  ]
  if (myUser['bear_name'] === '活动负责人') {
    items.push({
      label: '活动总结',
      key: 'report',
      icon: MyIcon('SolutionOutlined'),
    })
  }

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
  // 社团名称
  const [title, setTitle] = useState('')
  const [activityInfo, setActivityInfo] = useState({})
  useEffect(() => {
    http.post('/activity/activityIdInfo', params).then((res) => {
      setTitle(res.data.data[0]['activity_title'])
      setActivityInfo(res.data.data[0])
    })
  }, [params])
  // 顶部菜单点击响应
  const onClick = (e) => {
    setCurrent(e.key)
    navigate(e.key, { state: { activityInfo, myUser }, replace: true })
  }

  return (
    <>
      <HeanderTitle title={title} onBack={() => navigate(-2)} />
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
