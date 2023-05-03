import { Form, Input, Button } from 'antd'
import { MyIcon } from '@/utils/MyIcon'
import { http } from '@/utils/http'
import { toHump } from '@/utils/toHump'
import { useNavigate } from 'react-router-dom'

export function LoginComponent(props) {
  const navigate = useNavigate()
  const onFinish = (values) => {
    console.log('Success:', values)
    http.post('/users/login', toHump(values)).then((res) => {
      console.log(res.data)
      if (res.data.code === 200) {
        localStorage.setItem('token', res.data.data)
        navigate('/')
      }
      alert(res.data.msg)
    })
  }

  return (
    <Form
      name="normal_login"
      className="login-form"
      validateTrigger={['onBlur', 'onChange']}
      initialValues={{
        remember: false,
      }}
      onFinish={onFinish}>
      {props.lable}
      <Form.Item
        name="password"
        rules={[
          { type: 'string', max: 60, message: '密码最多60个字符', validateTrigger: 'onBlur' },
          { required: true, message: '请输入密码' },
        ]}>
        <Input.Password
          prefix={MyIcon('LockOutlined', 'site-form-item-icon')}
          size="large"
          placeholder="请输入密码"
          maxLength={61}
        />
      </Form.Item>
      <Form.Item style={{ textAlign: 'end' }}>
        <a className="login-form-forgot" href="#123">
          忘记密码
        </a>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" size="large" block className="login-form-button">
          登录
        </Button>
        或 <a href="/register">注册!</a>
      </Form.Item>
    </Form>
  )
}
