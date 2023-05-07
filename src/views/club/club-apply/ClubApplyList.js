import React, { useEffect, useState } from 'react'
import { Button, Modal, Table, Tag, message } from 'antd'
import { http } from '@/utils/http'
import { MyIcon } from '@/utils/MyIcon'
import { toHump } from '@/utils/toHump'
import { dateFormat } from '@/utils/time'
import { NavLink } from 'react-router-dom'

const { confirm } = Modal
// 申请社团的列表
export default function ClubApplyList() {
  // 通知
  const [messageApi, contextHolder] = message.useMessage()
  // table
  const [dataSource, setDataSource] = useState([])
  useEffect(() => {
    http.post('/club/userApplyClubAll').then((res) => {
      setDataSource(res.data.data)
    })
  }, [])
  const columns = [
    {
      title: '社团名称',
      dataIndex: 'name',
      key: 'name',
      render: (key, item) => {
        return (
          <NavLink to={`preview/${item['apply_id']}`}>
            <b>{key}</b>
          </NavLink>
        )
      },
    },
    {
      title: '申请者',
      dataIndex: 'user_name',
      key: 'user_name',
      render: (key) => {
        return <b>{key}</b>
      },
    },
    {
      title: '电话',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '申请时间',
      dataIndex: 'apply_time',
      key: 'apply_time',
      render: (time) => {
        return dateFormat(time)
      },
    },
    {
      title: '申请状态',
      dataIndex: 'apply_state',
      key: 'apply_state',
      render: (state) => {
        if (state === 0) {
          return <Tag color="processing">审核中</Tag>
        } else if (state === 1) {
          return <Tag color="success">已通过</Tag>
        } else {
          return <Tag color="error">未通过</Tag>
        }
      },
    },
    {
      title: '操作',
      dataIndex: '',
      key: 'x',
      render: (item) => (
        <div>
          {item['apply_state'] === 0 && (
            <Button danger shape="round" onClick={() => confirmMethod(item)}>
              撤销
            </Button>
          )}
          {item['apply_state'] === 1 && item['state'] === 0 && (
            <Button danger shape="round" onClick={() => publishClub(item)}>
              发布
            </Button>
          )}
        </div>
      ),
    },
  ]
  // 撤销社团的确认框
  const confirmMethod = (item) => {
    confirm({
      title: '你确认撤销吗?',
      icon: MyIcon('ExclamationCircleFilled'),
      content: 'Some descriptions',
      okText: '撤销',
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
  // 撤销申请社团操作
  const deleteMothed = (item) => {
    // 当前页面同步状态+后端同步
    http.post('/club/deleteApplyClub', toHump(item)).then((res) => {
      messageApi.success(res.data.msg)
      setDataSource(dataSource.filter((data) => data['apply_id'] !== item['apply_id']))
    })
  }
  // 发布社团
  const publishClub = (item) => {
    confirm({
      title: '你确认发布吗?',
      icon: MyIcon('ExclamationCircleFilled'),
      content: 'Some descriptions',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        item.state = 1
        http.post('/club/releaseClub', toHump(item)).then((res) => {
          messageApi.success(res.data.msg)
          setDataSource(
            dataSource.map((data) => {
              if (data['apply_id'] === item['apply_id']) {
                data['state'] = 1
              }
              return data
            })
          )
        })
      },
      onCancel() {
        console.log('Cancel')
      },
    })
  }
  return (
    <div>
      {contextHolder}
      <Table
        id="table-antn-menu"
        columns={columns}
        rowKey="apply_id"
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
          expandedRowRender: (apply) => (
            <div style={{ margin: 0 }}>
              <p>
                <b style={{ color: 'red' }}>申请理由：</b>
                {apply['apply_content']}
              </p>
              <p>
                <b style={{ color: 'red' }}>回复时间：</b>
                {!!apply['reply_time'] && dateFormat(apply['reply_time'])}
              </p>
              <p>
                <b style={{ color: 'red' }}>回复内容：</b>
                {apply.reply}
              </p>
            </div>
          ),
        }}
        dataSource={dataSource}
      />
    </div>
  )
}
