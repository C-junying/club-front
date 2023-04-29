import React from 'react'
import { Button } from 'antd'
import { http } from '@/utils/http'
export default function Home() {
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
    </div>
  )
}
