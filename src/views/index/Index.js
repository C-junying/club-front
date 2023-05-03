import { Button } from 'antd'
import { useNavigate } from 'react-router-dom'

export default function Index() {
  const navigate = useNavigate()
  return (
    <Button type="primary" onClick={() => navigate('/backstage')}>
      backstage
    </Button>
  )
}
