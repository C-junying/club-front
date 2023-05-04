import { Form, Input, Upload } from 'antd'
import { MyIcon } from '@/utils/MyIcon'
import { baseURL } from '@/utils/http'
import { useEffect, useState } from 'react'

export default function ActivityTypeComponent(props) {
  const form = props.form

  // 显示图片地址
  const [imageUrl, setImageUrl] = useState(props.imageUrl)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setImageUrl(props.imageUrl)
  }, [props.imageUrl])
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
      form.validateFields().then((values) => {
        form.setFieldsValue({ ...values, picture: info.file.response.data.img })
      })
    }
    return info && info.fileList
  }
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
  return (
    <Form form={form} layout="vertical" name="form_in_modal" validateTrigger={['onBlur', 'onChange']}>
      <Form.Item name="type_id" label="类型编号" hidden>
        <Input />
      </Form.Item>
      <Form.Item
        name="type_name"
        label="类型名称"
        rules={[
          { type: 'string', max: 20, message: '类型名称最多20个字符', validateTrigger: 'onBlur' },
          {
            required: true,
            message: '请输入类型名称!',
            validateTrigger: 'onBlur',
          },
        ]}>
        <Input placeholder="请输入类型名称" maxLength={21} />
      </Form.Item>
      <Form.Item
        name="picture"
        label="头像"
        valuePropName="picture"
        getValueFromEvent={(e) => imageHandleChange(e)}
        noStyle>
        <Upload
          name="file"
          accept="image/png,image/jpeg,image/gif,image/tif,image/tga,image/bmp,image/dds,image/svg,image/eps,image/jpg"
          listType="picture-card"
          className="avatar-uploader"
          showUploadList={false}
          action={baseURL + 'images/uploadType'}>
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
      <Form.Item name="type_content" label="类型介绍">
        <Input.TextArea showCount maxLength={130} />
      </Form.Item>
    </Form>
  )
}
