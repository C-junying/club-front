import React, { useEffect, useState } from 'react'
import { Button, Modal, Table, Form, Input } from 'antd'
import { http } from '@/utils/http'
import { MyIcon } from '@/utils/MyIcon'
import { toHump } from '@/utils/toHump'
import ClubTypeComponent from '@/components/club/ClubTypeComponent'

const { confirm } = Modal
const { Search } = Input
export default function ClubTypeList() {
  // table操作
  const [dataSource, setDataSource] = useState([])

  //   图片地址
  const [imageUrl, setImageUrl] = useState('')
  //   const setImageNull = () => {
  //     setImageUrl('')
  //   }
  useEffect(() => {
    http.post('/club/clubTypeAll').then((res) => {
      setDataSource(res.data.data)
    })
  }, [])
  const columns = [
    {
      title: '社团类型名称',
      dataIndex: 'type_name',
      key: 'type_name',
      render: (key) => {
        return <b>{key}</b>
      },
    },

    {
      title: '类型介绍',
      dataIndex: 'type_content',
      key: 'type_content',
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
    setDataSource(dataSource.filter((data) => data['type_id'] !== item['type_id']))
    http.post('/club/deleteClubType', toHump(item))
  }
  // 添加社团类型弹出框
  const [addOpen, setAddOpen] = useState(false)
  const [addForm] = Form.useForm()

  const addFormOk = () => {
    addForm
      .validateFields()
      .then((values) => {
        values.picture = Array.isArray(values.picture) ? values.picture[0].response.data.img : values.picture
        http.post('/club/addClubType', toHump(values)).then((res) => {
          setAddOpen(false)
          addForm.resetFields()
          alert(res.data.msg)
        })
      })
      .catch((info) => {
        console.log('Validate Failed:', info)
      })
  }

  // 更新社团类型弹出框
  const [updateOpen, setUpdateOpen] = useState(false)
  const [updateForm] = Form.useForm()

  // 弹出更新社团类型
  const handleUpdate = (item) => {
    setUpdateOpen(true)
    setImageUrl(item.picture)
    console.log(imageUrl)
    updateForm.setFieldsValue(item)
  }
  const updateFormOk = () => {
    updateForm
      .validateFields()
      .then((values) => {
        values.picture = !!values.picture ? values.picture[0].response.data.img : null
        http.post('/club/updateClubType', toHump(values)).then((res) => {
          console.log(res.data)
          setUpdateOpen(false)
          updateForm.resetFields()
          if (res.data.code === 200) {
            setDataSource(
              dataSource.map((item) => {
                if (item['type_id'] === values['type_id']) {
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
    let href = '/club/clubTypeSearch'
    if (value === '') {
      href = '/club/clubTypeAll'
    }
    http.post(href, { search: value }).then((res) => {
      setDataSource(res.data.data)
    })
  }
  return (
    <div>
      <div id="user_top">
        <Button type="primary" shape="round" onClick={() => setAddOpen(true)}>
          添加社团类型
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
        rowKey="type_id"
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
        title="添加社团类型"
        okText="添加"
        cancelText="取消"
        onCancel={() => {
          setAddOpen(false)
          addForm.resetFields()
          setImageUrl('')
        }}
        onOk={() => addFormOk()}>
        <ClubTypeComponent form={addForm} imageUrl={imageUrl} />
      </Modal>
      <Modal
        open={updateOpen}
        title="更新社团类型"
        okText="更新"
        cancelText="取消"
        onCancel={() => {
          setUpdateOpen(false)
          updateForm.resetFields()
          setImageUrl('')
        }}
        onOk={() => updateFormOk()}>
        <ClubTypeComponent form={updateForm} imageUrl={imageUrl} />
      </Modal>
    </div>
  )
}
