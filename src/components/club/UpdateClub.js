import { useEffect, useState } from 'react'
import { Form, Input, Button, message, Select } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import { http } from '@/utils/http'
import { toHump } from '@/utils/toHump'
import MyEditor from '@/components/other/MyEditor'
import MyUpload from '@/components/other/MyUpload'
import HeanderTitle from '@/components/other/HeanderTitle'

export default function UpdateClub() {
  const [form] = Form.useForm()
  // 通知
  const [messageApi, contextHolder] = message.useMessage()
  const navigate = useNavigate()
  //   获取参数
  const params = useParams()
  // 内容
  const [content, setContent] = useState('')
  // 类型列表
  const [typeList, setTypeList] = useState([])
  // 判断内容是否是第一次加载
  const [flag, setFlag] = useState(true)

  // 显示图片地址
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    http.post('/club/clubIdClub', toHump(params)).then((res) => {
      setContent(res.data.data[0]['club_content'])
      setImageUrl(res.data.data[0].picture)
      form.setFieldsValue(res.data.data[0])
    })
  }, [params, form])
  //   社团类型
  useEffect(() => {
    http.post('/club/clubTypeAll').then((res) => {
      setTypeList(res.data.data)
    })
  }, [])
  useEffect(() => {
    if (flag) {
      setFlag(false)
    } else {
      form.setFieldValue('club_content', content)
      form.validateFields(['club_content'])
    }
  }, [content])
  // 设置内容
  const getContent = (val) => {
    setContent(val)
  }
  // 上传图片
  const imageHandleChange = (info) => {
    if (Array.isArray(info)) {
      return info
    }
    // 上传中
    if (info.file.status === 'uploading') {
      setLoading(true)
    }
    // 上传成功
    if (info.file.status === 'done') {
      setLoading(false)
      // 让图片显示
      setImageUrl(info.file.response.data.img)
      form.setFieldValue('picture', info.file.response.data.img)
    }
    return info && info.fileList
  }
  const onFinish = (values) => {
    console.log('Success:', values)
    if (values.picture === '' || values.picture === undefined) {
      messageApi.error('代表图没有上传')
    } else {
      http.post('/club/updateClubInfo', toHump(values)).then((res) => {
        if (res.data.code === 200) {
          messageApi.success(res.data.msg)
          setTimeout(() => {
            navigate(-1)
          }, 1000)
        } else {
          messageApi.error(res.data.msg)
        }
      })
    }
  }
  return (
    <>
      {contextHolder}
      <HeanderTitle title="社团报告" onBack={() => navigate(-1)} />
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        validateTrigger={['onBlur', 'onChange']}
        onFinish={onFinish}>
        <Form.Item name="club_id" label="社团编号" hidden>
          <Input />
        </Form.Item>
        <Form.Item name="club_name" label="社团名称">
          <Input disabled />
        </Form.Item>
        <Form.Item
          name="type_id"
          label="社团类型"
          rules={[
            {
              required: true,
              message: '请选择社团类型!',
              validateTrigger: 'onBlur',
            },
          ]}>
          <Select
            style={{
              width: 150,
            }}
            fieldNames={{ label: 'type_name', value: 'type_id' }}
            options={typeList}
          />
        </Form.Item>
        <Form.Item
          name="club_intro"
          label="社团介绍"
          rules={[
            {
              required: true,
              message: '请输入介绍!',
              validateTrigger: 'onBlur',
            },
          ]}>
          <Input.TextArea showCount maxLength={130} />
        </Form.Item>
        <Form.Item name="picture" label="社团logo" valuePropName="picture" noStyle>
          <MyUpload
            name="社团logo"
            imageUrl={imageUrl}
            loading={loading}
            href="images/uploadClub"
            imageHandleChange={imageHandleChange}
          />
        </Form.Item>
        <Form.Item
          name="club_content"
          label="社团内容"
          rules={[
            {
              required: true,
              message: '请输入总结内容',
              validateTrigger: 'onBlur',
            },
          ]}>
          <MyEditor content={content} getContent={getContent} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" size="large" block className="login-form-button">
            更新
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}
