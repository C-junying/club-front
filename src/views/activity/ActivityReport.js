import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Form, message, Button, Descriptions } from 'antd'
import MyEditor from '@/components/other/MyEditor'
import { http } from '@/utils/http'
import { toHump } from '@/utils/toHump'

// 活动总结
export default function ActivityReport() {
  // 通知
  const [messageApi, contextHolder] = message.useMessage()

  //   获取链接数据
  const params = useParams()
  // 活动信息
  const [activityInfo, setActivityInfo] = useState({})

  // 获取数据
  useEffect(() => {
    http.post('/activity/activityIdInfo', params).then((res) => {
      setActivityInfo(res.data.data[0])
    })
  }, [params])
  // 表单
  const [form] = Form.useForm()
  // 总结内容
  const [content, setContent] = useState('')
  useEffect(() => {
    if (activityInfo['activity_state'] === 2) {
      setContent(activityInfo['activity_report'])
    }
  }, [activityInfo])
  useEffect(() => {
    form.setFieldValue('activity_report', content)
    form.validateFields(['activity_report'])
  }, [content, form])
  // 设置内容
  const getContent = (val) => {
    setContent(val)
  }
  // 提交活动总结
  const submitActivityReport = () => {
    form.validateFields().then((values) => {
      values['activity_id'] = params.activityId
      http.post('/activity/addactivityReport', toHump(values)).then((res) => {
        messageApi.success(res.data.msg)
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      })
    })
  }
  // 撤回活动总结
  const alterAcitivityReport = () => {
    http.post('/activity/alteractivityReport', toHump(params)).then((res) => {
      messageApi.success(res.data.msg)
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    })
  }
  return (
    <>
      {contextHolder}
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        validateTrigger={['onBlur', 'onChange']}
        style={{ display: activityInfo['activity_state'] === 1 ? 'block' : 'none' }}>
        <Form.Item
          name="activity_report"
          rules={[
            {
              required: true,
              message: '请输入活动内容',
              validateTrigger: 'onBlur',
            },
          ]}>
          <MyEditor content={content} getContent={getContent} />
        </Form.Item>
      </Form>
      <Descriptions
        size="middle"
        style={{
          display: activityInfo['activity_state'] === 1 ? 'none' : 'block',
        }}>
        <Descriptions.Item label="活动总结">
          {
            <div
              dangerouslySetInnerHTML={{
                __html: activityInfo['activity_report'],
              }}
              style={{
                margin: '0 24px',
              }}></div>
          }
        </Descriptions.Item>
      </Descriptions>
      <div style={{ textAlign: 'center', marginTop: 20 }}>
        <Button
          size="large"
          type="primary"
          hidden={activityInfo['activity_state'] === 2}
          onClick={submitActivityReport}>
          提交
        </Button>
        <Button
          size="large"
          type="primary"
          danger
          hidden={activityInfo['activity_state'] === 1}
          onClick={alterAcitivityReport}>
          撤回
        </Button>
      </div>
    </>
  )
}
