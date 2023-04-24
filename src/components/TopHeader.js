import { Layout, Dropdown, Avatar } from 'antd'
import { UserOutlined } from '@ant-design/icons'
const { Header } = Layout
export default function TopHeader() {
  const items = [
    {
      key: '1',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="#">
          超级管理员
        </a>
      ),
    },
    {
      key: '2',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="#">
          退出
        </a>
      ),
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
          }}
          placement="bottom">
          <Avatar size="large" icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </Header>
  )
}
