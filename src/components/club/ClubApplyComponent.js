import { useEffect, useState } from 'react'
import { Form, Input, Select } from 'antd'
import { http } from '@/utils/http'
import MyEditor from '../other/MyEditor'

export default function ClubApplyComponent(props) {
  const form = props.form
  // 内容
  const [content, setContent] = useState('')
  // 判断内容是否是第一次加载
  const [flag, setFlag] = useState(true)
  // 类型列表
  const [typeList, setTypeList] = useState([])
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
        name="area_id"
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
