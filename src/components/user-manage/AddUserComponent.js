import { useEffect, useState } from 'react'
import { Form, Input, Switch, Select, Upload } from 'antd'
import { MyIcon } from '@/utils/MyIcon'
import { baseURL } from '@/utils/http'

export default function AddUserComponent(props) {
  const form = props.form
  const roleList = props.roleList
  const handleChange = (value) => {
    console.log(`selected ${value}`)
  }
  const [imageUrl, setImageUrl] = useState(props.imageUrl)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setImageUrl(props.imageUrl)
  }, [props.imageUrl])

  const uploadButton = (
    <div>
      {loading ? MyIcon('LoadingOutlined') : MyIcon('PlusOutlined')}
      <div
        style={{
          marginTop: 8,
        }}>
        Upload
      </div>
    </div>
  )
  const imageHandleChange = (info) => {
    if (Array.isArray(info)) {
      return info
    }
    if (info.file.status === 'uploading') {
      setLoading(true)
      console.log('status', info)
    }
    if (info.file.status === 'done') {
      setLoading(false)
      console.log('done', info)
      setImageUrl(info.file.response.data.img)
    }
    return info && info.fileList
  }
  return (
    <Form form={form} layout="vertical" name="form_in_modal" validateTrigger={['onBlur', 'onChange']}>
      <Form.Item name="user_id" label="用户编号" hidden>
        <Input />
      </Form.Item>
      <Form.Item
        name="nickname"
        label="昵称"
        rules={[
          {
            required: true,
            message: '请输入昵称!',
            validateTrigger: 'onBlur',
          },
        ]}>
        <Input placeholder="请输入昵称" />
      </Form.Item>
      <Form.Item
        name="user_name"
        label="姓名"
        rules={[
          {
            required: true,
            message: '请输入姓名!',
            validateTrigger: 'onBlur',
          },
        ]}>
        <Input placeholder="请输入姓名" />
      </Form.Item>
      <Form.Item
        name="password"
        label="密码"
        hidden={!!props.isHiddenPassword ? true : false}
        rules={[
          { type: 'string', max: 60, message: '密码最多60个字符', validateTrigger: 'onBlur' },
          { required: true, message: '请输入密码' },
        ]}>
        <Input.Password placeholder="请输入密码" maxLength={61} />
      </Form.Item>
      <Form.Item label="性别" valuePropName="checked" name="sex">
        <Switch checkedChildren="男" unCheckedChildren="女" />
      </Form.Item>
      <Form.Item
        name="phone"
        label="手机"
        rules={[
          {
            pattern: /^(?:(?:\+|00)86)?1\d{10}$/,
            message: '手机号码格式不对',
            validateTrigger: 'onBlur',
          },
          { required: true, message: '请输入手机号' },
        ]}>
        <Input placeholder="请输入手机号" />
      </Form.Item>
      <Form.Item
        name="email"
        label="邮箱"
        rules={[
          {
            pattern:
              /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            message: '邮箱格式不对',
            validateTrigger: 'onBlur',
          },
        ]}>
        <Input placeholder="请输入邮箱" />
      </Form.Item>
      <Form.Item name="intro" label="介绍">
        <Input.TextArea showCount maxLength={130} />
      </Form.Item>
      <Form.Item
        name="picture"
        label="头像"
        valuePropName="picture"
        getValueFromEvent={(e) => imageHandleChange(e)}
        noStyle>
        <Upload
          name="file"
          accept=".png,.jpeg,.gif,.tif,.tga,.bmp,.dds,.svg,.eps,.jpg"
          listType="picture-card"
          className="avatar-uploader"
          showUploadList={false}
          action={baseURL + 'images/uploadHead'}>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="avatar"
              style={{
                width: '100%',
              }}
            />
          ) : (
            uploadButton
          )}
        </Upload>
      </Form.Item>
      <Form.Item name="role_id" label="角色">
        <Select
          style={{
            width: 150,
          }}
          fieldNames={{ label: 'role_name', value: 'role_id' }}
          onChange={handleChange}
          options={roleList}
        />
      </Form.Item>
    </Form>
  )
}
