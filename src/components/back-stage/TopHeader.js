import { Layout, Dropdown, Avatar } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const { Header } = Layout
export default function TopHeader() {
  const navigate = useNavigate()
  const items = [
    {
      key: '1',
      label: '超级管理员',
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
        <span>欢迎admin回来</span>
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
          <Avatar size="large" icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </Header>
  )
}
