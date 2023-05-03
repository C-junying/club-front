import { Form, Input, Upload } from 'antd'
import { MyIcon } from '@/utils/MyIcon'
import { baseURL } from '@/utils/http'
import { useEffect, useState } from 'react'

export default function ClubTypeComponent(props) {
  const form = props.form

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
      console.log('status', info)
    }
    // 上传成功
    if (info.file.status === 'done') {
      setLoading(false)
      console.log('done', info)
      // 让图片显示
      setImageUrl(info.file.response.data.img)
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
          {
            required: true,
            message: '请输入类型名称!',
            validateTrigger: 'onBlur',
          },
        ]}>
        <Input placeholder="请输入类型名称" />
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
          action={baseURL + 'images/uploadClubType'}>
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
