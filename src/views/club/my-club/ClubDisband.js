import { Button, Modal, message } from 'antd'
import React from 'react'
import { MyIcon } from '@/utils/MyIcon'
import { http } from '@/utils/http'
import { useNavigate, useParams } from 'react-router-dom'

export default function ClubDisband() {
  const params = useParams()
  // 通知
  const [messageApi, contextHolder] = message.useMessage()
  const navigate = useNavigate()
  const confirmMethod = () => {
    Modal.confirm({
      title: '你确认解散吗?',
      icon: MyIcon('ExclamationCircleFilled'),
      okText: '解散',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        http.post('/club/clubDisband', params).then((res) => {
          if (res.data.code === 200) {
            messageApi.success(res.data.msg)
            setTimeout(() => {
              navigate('/club/my-club')
            }, 1000)
          } else {
            messageApi.error(res.data.msg)
          }
        })
      },
      onCancel() {
        console.log('Cancel')
      },
    })
  }
  return (
    <div className="danger-btn">
      {contextHolder}
      <Button type="primary" danger className="btn" onClick={() => confirmMethod()}>
        解散社团
      </Button>
    </div>
  )
}
