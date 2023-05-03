import React from 'react'
import { Button } from 'antd'
import { http } from '@/utils/http'
import { useNavigate } from 'react-router-dom'
export default function Home() {
  const navigate = useNavigate()
  const ajax = () => {
    http.post('/menu/roleSelect').then((res) => {
      console.log(res.data)
    })
  }
  return (
    <div>
      <Button type="primary" onClick={ajax}>
        Primary Button
      </Button>
      <Button type="primary" onClick={() => navigate('/')}>
        index
      </Button>
    </div>
  )
}
