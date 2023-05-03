import React, { useEffect, useState } from 'react'
import { Button, Modal, Table, Form, Input } from 'antd'
import { http } from '@/utils/http'
import { MyIcon } from '@/utils/MyIcon'
import { toHump } from '@/utils/toHump'
import { dateFormat } from '@/utils/time'
import AddUserComponent from '@/components/user-manage/AddUserComponent'
import UpdatePassword from '@/components/user-manage/UpdatePassword'

const { confirm } = Modal
const { Search } = Input
export default function UserList() {
  // table
  const [dataSource, setDataSource] = useState([])
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const setImageNull = () => {
    setImageUrl('')
    setLoading(false)
  }
  useEffect(() => {
    http.post('/users/queryAll').then((res) => {
      setDataSource(res.data.data)
    })
  }, [])
  const columns = [
    {
      title: '昵称',
      dataIndex: 'nickname',
      key: 'nickname',
      render: (key) => {
        return <b>{key}</b>
      },
    },
    {
      title: '姓名',
      dataIndex: 'user_name',
      key: 'user_name',
      render: (key) => {
        return <b>{key}</b>
      },
    },
    {
      title: '性别',
      dataIndex: 'sex',
      key: 'sex',
    },
    {
      title: '电话',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '头像',
      dataIndex: 'picture',
      key: 'picture',
      render: (pic) => {
        return pic !== null && pic !== '' ? <img src={pic} alt="无" style={{ width: 50 }} /> : ''
      },
    },
    {
      title: '操作',
      dataIndex: '',
      key: 'x',
      render: (item) => (
        <div>
          <Button danger shape="circle" icon={MyIcon('DeleteOutlined')} onClick={() => confirmMethod(item)} />
          <Button
            type="primary"
            shape="circle"
            icon={MyIcon('EditOutlined')}
            onClick={() => handleUpdate(item)}
          />
          <Button
            danger
            shape="circle"
            icon={MyIcon('LockOutlined')}
            onClick={() => {
              setPasswordOpen(true)
              passwordForm.setFieldValue('user_id', item['user_id'])
            }}
          />
        </div>
      ),
    },
  ]
  const confirmMethod = (item) => {
    confirm({
      title: '你确认删除吗?',
      icon: MyIcon('ExclamationCircleFilled'),
      content: 'Some descriptions',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        deleteMothed(item)
      },
      onCancel() {
        console.log('Cancel')
      },
    })
  }
  // 删除用户操作
  const deleteMothed = (item) => {
    console.log(item)
    // 当前页面同步状态+后端同步
    setDataSource(dataSource.filter((data) => data['user_id'] !== item['user_id']))
    http.post('/users/delete', toHump(item))
  }
  // 添加用户弹出框
  const [open, setOpen] = useState(false)
  const [form] = Form.useForm()
  const [roleList, setRoleList] = useState([])
  useEffect(() => {
    http.post('/role/roleList').then((res) => {
      setRoleList(res.data.data)
    })
  }, [])
  const addFormOk = () => {
    form
      .validateFields()
      .then((values) => {
        values.sex = !!values.sex ? '男' : '女'
        values.picture = Array.isArray(values.picture) ? values.picture[0].response.data.img : values.picture
        http.post('/users/register', toHump(values)).then((res) => {
          console.log(res.data)
          setOpen(false)
          form.resetFields()
          alert(res.data.msg)
        })
      })
      .catch((info) => {
        console.log('Validate Failed:', info)
      })
  }
  // 更新用户弹出框
  const [updateOpen, setUpdateOpen] = useState(false)
  const [updateForm] = Form.useForm()
  const [hiddenPassword] = useState(true)

  // 弹出更新用户
  const handleUpdate = (item) => {
    setUpdateOpen(true)
    setImageUrl(item.picture)
    updateForm.setFieldsValue(item)
    item.sex === '男' ? updateForm.setFieldValue('sex', true) : updateForm.setFieldValue('sex', false)
  }
  const updateFormOk = () => {
    updateForm
      .validateFields()
      .then((values) => {
        values.sex = !!values.sex ? '男' : '女'
        values.picture = !!values.picture ? values.picture[0].response.data.img : null
        values['regist_time'] = new Date(values['regist_time'])
        http.post('/users/update', toHump(values)).then((res) => {
          console.log(res.data)
          setUpdateOpen(false)
          updateForm.resetFields()
          if (res.data.data === 200)
            setDataSource(
              dataSource.map((item) => {
                if (item['user_id'] === values['user_id']) {
                  return values
                }
                return item
              })
            )
          alert(res.data.msg)
        })
      })
      .catch((info) => {
        console.log('Validate Failed:', info)
      })
  }
  // 修改密码
  const [passwordOpen, setPasswordOpen] = useState(false)
  const [passwordForm] = Form.useForm()
  // 搜索
  const onSearch = (value) => {
    let href = '/users/getSearch'
    if (value === '') {
      href = '/users/queryAll'
    }
    http.post(href, { keywords: value }).then((res) => {
      setDataSource(res.data.data)
    })
  }
  return (
    <div>
      <div id="user_top">
        <Button type="primary" shape="round" onClick={() => setOpen(true)}>
          添加用户
        </Button>
        <Search
          className="user_search"
          placeholder="昵称 姓名 电话 邮箱"
          allowClear
          enterButton="Search"
          size="large"
          onSearch={onSearch}
        />
      </div>
      <Table
        id="table-antn-menu"
        columns={columns}
        rowKey="user_id"
        pagination={{
          position: ['bottomCenter'],
          showQuickJumper: true,
          hideOnSinglePage: true,
          showSizeChanger: true,
          defaultPageSize: 5,
          total: dataSource.length,
          showTotal: (total) => `总共：${total}个`,
        }}
        expandable={{
          expandedRowRender: (user) => (
            <div style={{ margin: 0 }}>
              <p>
                <b style={{ color: 'red' }}>注册时间：</b>
                {dateFormat(user['regist_time'])}
              </p>
              <p>
                <b style={{ color: 'red' }}>角色名称：</b>
                {user['role_name']}
              </p>
              <p>
                <b>个人介绍：</b>
                {user.intro}
              </p>
            </div>
          ),
        }}
        dataSource={dataSource}
      />

      <Modal
        open={open}
        title="注册用户"
        okText="添加"
        cancelText="取消"
        onCancel={() => {
          setOpen(false)
          form.resetFields()
          setImageNull()
        }}
        onOk={() => addFormOk()}>
        <AddUserComponent
          form={form}
          roleList={roleList}
          imageUrl={imageUrl}
          setImageUrl={setImageUrl}
          loading={loading}
          setLoading={setLoading}
        />
      </Modal>
      <Modal
        open={updateOpen}
        title="更新用户"
        okText="更新"
        cancelText="取消"
        onCancel={() => {
          setUpdateOpen(false)
          updateForm.resetFields()
          setImageNull()
        }}
        onOk={() => updateFormOk()}>
        <AddUserComponent
          form={updateForm}
          roleList={roleList}
          isHiddenPassword={hiddenPassword}
          imageUrl={imageUrl}
          setImageUrl={setImageUrl}
          loading={loading}
          setLoading={setLoading}
        />
      </Modal>
      <Modal
        open={passwordOpen}
        title="修改密码"
        okText="确认修改"
        cancelText="取消"
        onCancel={() => {
          setPasswordOpen(false)
          passwordForm.resetFields()
        }}
        onOk={() => {
          passwordForm
            .validateFields()
            .then((values) => {
              http.post('/users/updatePassword', toHump(values)).then((res) => {
                console.log(res.data)
                setPasswordOpen(false)
                passwordForm.resetFields()
                setTimeout(() => {
                  alert(res.data.msg)
                }, 1000)
              })
            })
            .catch((info) => {
              console.log('Validate Failed:', info)
            })
        }}>
        <UpdatePassword form={passwordForm} />
      </Modal>
    </div>
  )
}
