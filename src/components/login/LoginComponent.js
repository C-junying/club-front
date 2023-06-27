import { Form, Input, Button, message } from 'antd';
import { MyIcon } from '@/utils/MyIcon';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useRootStore } from '@/stores/RootStore';

function LoginComponent(props) {
  // store
  const { tokenStore } = useRootStore();
  // 通知
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const onFinish = async (values) => {
    // console.log('Success:', values);
    await tokenStore.fetchLogin(values);
    if (tokenStore.checkLogin) {
      messageApi.success(tokenStore.loginInfo.msg);
      setTimeout(() => {
        localStorage.setItem('token', tokenStore.loginInfo.data);
        navigate('/');
      }, 1000);
    } else {
      messageApi.error(tokenStore.loginInfo.msg);
    }
  };

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
      {contextHolder}
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
      {/* <Form.Item style={{ textAlign: 'end' }}>
        <a className="login-form-forgot" href="#123">
          忘记密码
        </a>
      </Form.Item> */}
      <Form.Item>
        <Button type="primary" htmlType="submit" size="large" block className="login-form-button">
          登录
        </Button>
        或 <a href="/register">注册!</a>
      </Form.Item>
    </Form>
  );
}
export default observer(LoginComponent);
