import React, { useEffect, useState } from 'react'
import { Button, Modal, Table } from 'antd'
import { http } from '@/utils/http'
import { MyIcon } from '@/utils/MyIcon'
import { toHump } from '@/utils/toHump'
import MenuTree from '@/components/right-manage/MenuTree'

const { confirm } = Modal

export default function RoleList() {
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
          <Button type="primary" shape="circle" icon={MyIcon('EditOutlined')} />
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
  // 弹出框操作
  const [open, setOpen] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [currentRights, setCurrentRights] = useState([])
  const [currentId, setCurrentId] = useState(0)

  // 确认弹出框
  const handleOk = () => {
    // 加载
    setConfirmLoading(true)
    // 分配权限
    http.post('/role/shareRolePower', { roleId: currentId, roleMenuIdArr: currentRights }).then((res) => {
      console.log(res.data)
      setOpen(false)
      setConfirmLoading(false)
    })
  }
  const handleCancel = () => {
    console.log('Clicked cancel button')
    setOpen(false)
  }
  return (
    <div>
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
        title="权限分配"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}>
        <MenuTree currentRights={currentRights} setCurrentRights={setCurrentRights} selectBoolean={true} />
      </Modal>
    </div>
  )
}
