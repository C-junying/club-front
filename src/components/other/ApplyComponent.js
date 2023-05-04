import { useEffect, useState } from 'react'
import { Form, Input, Select } from 'antd'
import { http } from '@/utils/http'

export default function ApplyComponent(props) {
  const form = props.form
  const [areaList, setAreaList] = useState([])
  useEffect(() => {
    http.post('/area/areaStatusAll').then((res) => {
      setAreaList(
        res.data.data.map((item) => {
          if (item.status !== 1) {
            item.disabled = true
          }
          return item
        })
      )
    })
  }, [])
  const handleChange = (value) => {
    console.log(`selected ${value}`)
  }
  return (
    <Form form={form} layout="vertical" name="form_in_modal" validateTrigger={['onBlur', 'onChange']}>
      <Form.Item
        name="apply_content"
        label="申请理由"
        rules={[
          {
            required: true,
            message: '请输入申请理由!',
            validateTrigger: 'onBlur',
          },
        ]}>
        <Input.TextArea showCount maxLength={130} />
      </Form.Item>
      <Form.Item
        name="area_id"
        label="场地"
        rules={[
          {
            required: true,
            message: '请选择场地!',
            validateTrigger: 'onBlur',
          },
        ]}>
        <Select
          style={{
            width: 150,
          }}
          fieldNames={{ label: 'area_name', value: 'area_id' }}
          onChange={handleChange}
          options={areaList}
        />
      </Form.Item>
    </Form>
  )
}
