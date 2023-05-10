import { Button, Modal, message } from 'antd'
import React, { useEffect, useState } from 'react'
import { MyIcon } from '@/utils/MyIcon'
import { http } from '@/utils/http'
import { useParams } from 'react-router-dom'

export default function ClubDisband() {
  const params = useParams()
  // 通知
  const [messageApi, contextHolder] = message.useMessage()
  // 社团信息
  const [clubInfo, setClubInfo] = useState({})
  useEffect(() => {
    http.post('/club/clubIdClub', params).then((res) => {
      setClubInfo(res.data.data[0])
    })
  }, [params])
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
              window.location.reload()
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
  const alterClubState = () => {
    Modal.confirm({
      title: '你确认撤回解散吗?',
      icon: MyIcon('ExclamationCircleFilled'),
      okText: '撤回',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        http.post('/club/alterclubDisband', params).then((res) => {
          if (res.data.code === 200) {
            messageApi.success(res.data.msg)
            setTimeout(() => {
              window.location.reload()
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
      {clubInfo.state === 1 && (
        <Button type="primary" danger className="btn" onClick={() => confirmMethod()}>
          解散社团
        </Button>
      )}
      {clubInfo.state === 2 && (
        <Button type="primary" danger className="btn" onClick={() => alterClubState()}>
          撤回解散
        </Button>
      )}
    </div>
  )
}
