import React, { useEffect, useState } from 'react'
import { Button, Modal, Table, Form, message } from 'antd'
import { http } from '@/utils/http'
import { MyIcon } from '@/utils/MyIcon'
import { toHump } from '@/utils/toHump'
import AddRole from '@/components/right-manage/AddRole'
import MenuTree from '@/components/right-manage/MenuTree'

const { confirm } = Modal

// 角色列表
export default function RoleList() {
  // 通知
  const [messageApi, contextHolder] = message.useMessage()
  // table操作
  const [dataSource, setDataSource] = useState([])
  useEffect(() => {
    http.post('/role/roleList').then((res) => {
      setDataSource(res.data.data)
    })
  }, [])
  const columns = [
    {
      title: '角色名称',
      dataIndex: 'role_name',
      key: 'role_name',
      render: (key) => {
        return <b>{key}</b>
      },
    },
    {
      title: 'logo',
      dataIndex: 'role_logo',
      key: 'role_logo',
      render: (key) => {
        return MyIcon(key)
      },
    },
    {
      title: '级别',
      dataIndex: 'rank',
      key: 'rank',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
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
            type="primary"
            shape="circle"
            icon={MyIcon('UnorderedListOutlined')}
            onClick={() => {
              console.log(item)
              http.post('/menu/roleIdMenu', toHump(item)).then((res) => {
                setOpen(true)
                // 树中有哪些被选择
                setCurrentRights(res.data.data.map((val) => val['menu_id']))
                setCurrentId(item['role_id'])
              })
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
  // 删除操作
  const deleteMothed = (item) => {
    console.log(item)
    // 当前页面同步状态+后端同步
    setDataSource(dataSource.filter((data) => data['role_id'] !== item['role_id']))
    http.post('/role/deleteRole', toHump(item))
  }
  // 权限弹出框操作
  const [open, setOpen] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [currentRights, setCurrentRights] = useState([])
  const [currentId, setCurrentId] = useState(0)

  // 权限确认弹出框
  const handleOk = () => {
    // 加载
    setConfirmLoading(true)
    // 分配权限
    http.post('/role/shareRolePower', { roleId: currentId, roleMenuIdArr: currentRights }).then((res) => {
      console.log(res.data)
      setOpen(false)
      setConfirmLoading(false)
      if (res.data.code === 200) {
        messageApi.success(res.data.msg)
      } else {
        messageApi.error(res.data.msg)
      }
    })
  }
  const handleCancel = () => {
    console.log('Clicked cancel button')
    setOpen(false)
  }
  // 添加角色弹出框
  const [addOpen, setAddOpen] = useState(false)
  const [addForm] = Form.useForm()

  const addFormOk = () => {
    addForm
      .validateFields()
      .then((values) => {
        http.post('/role/addRole', toHump(values)).then((res) => {
          console.log(res.data)
          setAddOpen(false)
          addForm.resetFields()
          if (res.data.code === 200) {
            messageApi.success(res.data.msg)
            setTimeout(() => {
              window.location.reload()
            }, 1000)
          } else {
            messageApi.error(res.data.msg)
          }
        })
      })
      .catch((info) => {
        console.log('Validate Failed:', info)
      })
  }

  // 更新角色弹出框
  const [updateOpen, setUpdateOpen] = useState(false)
  const [updateForm] = Form.useForm()

  // 弹出更新角色
  const handleUpdate = (item) => {
    setUpdateOpen(true)
    updateForm.setFieldsValue(item)
  }
  const updateFormOk = () => {
    updateForm
      .validateFields()
      .then((values) => {
        http.post('/role/updateRole', toHump(values)).then((res) => {
          console.log(res.data)
          setUpdateOpen(false)
          updateForm.resetFields()
          if (res.data.code === 200) {
            setDataSource(
              dataSource.map((item) => {
                if (item['role_id'] === values['role_id']) {
                  return values
                }
                return item
              })
            )

            messageApi.success(res.data.msg)
          } else {
            messageApi.error(res.data.msg)
          }
        })
      })
      .catch((info) => {
        console.log('Validate Failed:', info)
      })
  }
  return (
    <div>
      {contextHolder}
      <Button type="primary" shape="round" onClick={() => setAddOpen(true)}>
        添加角色
      </Button>
      <Table
        id="table-antn-menu"
        columns={columns}
        rowKey="role_id"
        pagination={{
          position: ['bottomCenter'],
          showQuickJumper: true,
          hideOnSinglePage: true,
          showSizeChanger: true,
          defaultPageSize: 5,
          total: dataSource.length,
        }}
        dataSource={dataSource}
      />
      <Modal
        open={addOpen}
        title="添加角色"
        okText="添加"
        cancelText="取消"
        onCancel={() => {
          setAddOpen(false)
          addForm.resetFields()
        }}
        onOk={() => addFormOk()}>
        <AddRole form={addForm} />
      </Modal>
      <Modal
        open={updateOpen}
        title="更新角色"
        okText="更新"
        cancelText="取消"
        onCancel={() => {
          setUpdateOpen(false)
          updateForm.resetFields()
        }}
        onOk={() => updateFormOk()}>
        <AddRole form={updateForm} />
      </Modal>
      <Modal
        title="权限分配"
        okText="分配权限"
        cancelText="取消"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}>
        <MenuTree currentRights={currentRights} setCurrentRights={setCurrentRights} selectBoolean={true} />
      </Modal>
    </div>
  )
}
