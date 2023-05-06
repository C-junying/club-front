import { useEffect, useState } from 'react'
import { Form, Input, Select } from 'antd'
import { http } from '@/utils/http'
import MyEditor from '../other/MyEditor'
import MyUpload from '../other/MyUpload'

export default function ClubApplyComponent(props) {
  const form = props.form
  // 内容
  const [content, setContent] = useState('')
  // 判断内容是否是第一次加载
  const [flag, setFlag] = useState(true)
  // 老师列表
  const [teacherList, setTeacherList] = useState([])
  // 类型列表
  const [typeList, setTypeList] = useState([])
  // 显示图片地址
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    http.post('/teacher/teacherAll').then((res) => {
      setTeacherList(
        res.data.data.map((item) => {
          return {
            teacher_intro: `${item['user_name']} (${item.college}) (${item.position})`,
            teacher_id: item['teacher_id'],
          }
        })
      )
    })
  }, [])
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
  // 下拉选择
  const handleChange = (value) => {
    console.log(`selected ${value}`)
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
  return (
    <Form form={form} layout="vertical" name="form_in_modal" validateTrigger={['onBlur', 'onChange']}>
      <Form.Item
        name="club_name"
        label="社团名称"
        rules={[
          { type: 'string', max: 20, message: '社团名称最多20个字符', validateTrigger: 'onBlur' },
          {
            required: true,
            message: '请输入社团名称!',
            validateTrigger: 'onBlur',
          },
        ]}>
        <Input placeholder="请输入社团名称" maxLength={21} />
      </Form.Item>
      <Form.Item
        name="club_intro"
        label="社团介绍"
        rules={[
          {
            required: true,
            message: '请输入社团的介绍!',
            validateTrigger: 'onBlur',
          },
        ]}>
        <Input.TextArea showCount maxLength={130} />
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
          onChange={handleChange}
          options={typeList}
        />
      </Form.Item>
      <Form.Item
        name="teacher_id"
        label="指导老师"
        rules={[
          {
            required: true,
            message: '请选择指导老师!',
            validateTrigger: 'onBlur',
          },
        ]}>
        <Select
          style={{
            width: 250,
          }}
          fieldNames={{ label: 'teacher_intro', value: 'teacher_id' }}
          onChange={handleChange}
          options={teacherList}
        />
      </Form.Item>
      <Form.Item name="picture" label="背景图" valuePropName="picture" noStyle>
        <MyUpload
          name="背景图"
          imageUrl={imageUrl}
          loading={loading}
          href="images/uploadType"
          imageHandleChange={imageHandleChange}
        />
      </Form.Item>
      <Form.Item
        name="club_content"
        label="社团内容"
        rules={[
          {
            required: true,
            message: '请输入社团内容',
            validateTrigger: 'onBlur',
          },
        ]}>
        <MyEditor content={content} getContent={getContent} />
      </Form.Item>
    </Form>
  )
}
