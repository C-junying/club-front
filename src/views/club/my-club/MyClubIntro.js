import React, { useEffect, useState } from 'react'
import { Menu } from 'antd'
import { http } from '@/utils/http'
import { MyIcon } from '@/utils/MyIcon'
import HeanderTitle from '@/components/other/HeanderTitle'
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'
export default function MyClubIntro() {
  //   获取链接数据
  const params = useParams()
  const [manage, setManage] = useState({})
  useEffect(() => {
    http.post('/users/getToken').then((res) => {
      setManage(res.data.data)
    })
  }, [])
  // 当前用户数据
  // user
  const [myUser, setMyUser] = useState({})
  useEffect(() => {
    http.post('/club/clubIdUserIdToBearName', params).then((res) => {
      if (res.data.data.member.length > 0) {
        setMyUser(res.data.data.member[0])
      } else if (res.data.data.taecher.length > 0) {
        setMyUser(res.data.data.taecher[0])
      }
    })
  }, [params])
  // 社团信息
  const [clubInfo, setClubInfo] = useState({})
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
  if (
    (myUser['bear_name'] === '社长' || myUser['bear_name'] === '副社长' || manage.userId === '000000') &&
    clubInfo.state !== 2
  ) {
    items.push(
      {
        label: '申请活动',
        key: 'apply-activity',
        icon: MyIcon('AppstoreAddOutlined'),
      },
      {
        label: '申请活动列表',
        key: 'apply-activity-list',
        icon: MyIcon('UnorderedListOutlined'),
      }
    )
  }
  if ((myUser['bear_name'] === '社长' || manage.userId === '000000') && clubInfo.state !== 2) {
    items.push({
      label: '申请资金',
      key: 'apply-money',
      icon: MyIcon('MoneyCollectOutlined'),
    })
  }
  if (myUser['bear_name'] === '社长' || manage.userId === '000000') {
    items.push(
      {
        label: '费用清单',
        key: 'cost-list',
        icon: MyIcon('MoneyCollectOutlined'),
      },
      {
        label: '社团解散',
        key: 'club-disband',
        icon: MyIcon('DeleteOutlined'),
      }
    )
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
  const [title, setTitle] = useState('我的社团')
  useEffect(() => {
    http.post('/club/clubIdClub', params).then((res) => {
      setTitle(res.data.data[0]['club_name'])
      setClubInfo(res.data.data[0])
    })
  }, [params])

  // 顶部菜单点击响应
  const onClick = (e) => {
    setCurrent(e.key)
    navigate(e.key, { state: { myUser, clubInfo }, replace: true })
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
