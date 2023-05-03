import React, { useEffect, useState } from 'react'
import { Button, Modal, Table, Form, Input, Tag } from 'antd'
import { http } from '@/utils/http'
import { MyIcon } from '@/utils/MyIcon'
import { toHump } from '@/utils/toHump'
import { dateFormat } from '@/utils/time'
import AreaUpdate from '@/components/area/AreaUpdate'

const { confirm } = Modal
const { Search } = Input
export default function AreaList() {
  // table操作
  const [dataSource, setDataSource] = useState([])
  useEffect(() => {
    http.post('/area/areaAll').then((res) => {
      setDataSource(res.data.data)
    })
  }, [])
  const columns = [
    {
      title: '场地名称',
      dataIndex: 'area_name',
      key: 'area_name',
      render: (key) => {
        return <b>{key}</b>
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (item) => {
        if (item === 0) {
          return <Tag color="error">禁用</Tag>
        } else if (item === 1) {
          return <Tag color="processing">未使用</Tag>
        } else {
          return <Tag color="success">使用中</Tag>
        }
      },
    },
    {
      title: '注册时间',
      dataIndex: 'regist_time',
      key: 'regist_time',
      render: (item) => {
        return dateFormat(item)
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
          <Button
            type="primary"
            shape="circle"
            icon={MyIcon('EditOutlined')}
            onClick={() => handleUpdate(item)}
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
    setDataSource(dataSource.filter((data) => data['area_id'] !== item['area_id']))
    http.post('/area/deleteArea', toHump(item))
  }
  // 添加场地弹出框
  const [addOpen, setAddOpen] = useState(false)
  const [addForm] = Form.useForm()

  const addFormOk = () => {
    addForm
      .validateFields()
      .then((values) => {
        http.post('/area/addArea', toHump(values)).then((res) => {
          setAddOpen(false)
          addForm.resetFields()
          alert(res.data.msg)
        })
      })
      .catch((info) => {
        console.log('Validate Failed:', info)
      })
  }

  // 更新场地弹出框
  const [updateOpen, setUpdateOpen] = useState(false)
  const [updateForm] = Form.useForm()

  // 弹出更新场地
  const handleUpdate = (item) => {
    setUpdateOpen(true)
    updateForm.setFieldsValue(item)
    updateForm.setFieldValue('regist_time', dateFormat(item['regist_time']))
  }
  const updateFormOk = () => {
    updateForm
      .validateFields()
      .then((values) => {
        http.post('/area/updateArea', toHump(values)).then((res) => {
          console.log(res.data)
          setUpdateOpen(false)
          updateForm.resetFields()
          if (res.data.code === 200) {
            setDataSource(
              dataSource.map((item) => {
                if (item['area_id'] === values['area_id']) {
                  return values
                }
                return item
              })
            )
          }
          alert(res.data.msg)
        })
      })
      .catch((info) => {
        console.log('Validate Failed:', info)
      })
  }
  // 模糊查询
  const onSearch = (value) => {
    let href = '/area/areaSearch'
    if (value === '') {
      href = '/area/areaAll'
    }
    http.post(href, { search: value }).then((res) => {
      setDataSource(res.data.data)
    })
  }
  return (
    <div>
      <div id="user_top">
        <Button type="primary" shape="round" onClick={() => setAddOpen(true)}>
          添加场地
        </Button>
        <Search
          className="user_search"
          placeholder="名称 备注"
          allowClear
          enterButton="Search"
          size="large"
          onSearch={onSearch}
        />
      </div>
      <Table
        id="table-antn-menu"
        columns={columns}
        rowKey="area_id"
        pagination={{
          position: ['bottomCenter'],
          showQuickJumper: true,
          hideOnSinglePage: true,
          showSizeChanger: true,
          defaultPageSize: 5,
          total: dataSource.length,
          showTotal: (total) => `总共：${total}个`,
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
        <AreaUpdate form={addForm} flag={true} />
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
        <AreaUpdate form={updateForm} flag={false} />
      </Modal>
    </div>
  )
}
