import { Layout, Dropdown, Avatar } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { http } from '@/utils/http'
import { MyIcon } from '@/utils/MyIcon'

const { Header } = Layout
export default function TopHeader() {
  const navigate = useNavigate()
  const [token, setToken] = useState({})
  const [user, setUser] = useState({})
  useEffect(() => {
    http.post('/users/getToken').then((res) => {
      setToken(res.data.data)
      http.post('/users/getUserId', { userId: res.data.data.userId }).then((res) => {
        setUser(res.data.data)
      })
    })
  }, [])
  const items = [
    {
      key: '1',
      label: token.roleName,
    },
    {
      key: '2',
      label: '退出',
    },
  ]
  return (
    <Header
      style={{
        padding: '0 20',
        background: 'white',
      }}>
      <div style={{ float: 'right' }}>
        <span>
          欢迎<span style={{ color: 'orange' }}>{user['user_name']}</span>回来
        </span>
        <Dropdown
          menu={{
            items,
            onClick: ({ key }) => {
              if (key === '2') {
                localStorage.removeItem('token')
                navigate('/login')
              }
            },
          }}
          placement="bottom">
          <Avatar
            size="large"
            src={
              user.picture !== null && user.picture !== undefined && user.picture !== '' ? (
                <img src={user.picture} alt="avatar" />
              ) : (
                ''
              )
            }
            icon={MyIcon('UserOutlined')}
          />
        </Dropdown>
      </div>
    </Header>
  )
}
