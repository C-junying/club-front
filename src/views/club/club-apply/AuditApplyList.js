import React, { useEffect, useState } from 'react'
import { Button, Modal, Table, Form, Tag, message, Input } from 'antd'
import { http } from '@/utils/http'
import { toHump } from '@/utils/toHump'
import { dateFormat } from '@/utils/time'
import { NavLink } from 'react-router-dom'

import AuditApplyComponent from '../../../components/club/AuditApplyComponent'

// 审核社团的操作
export default function AuditApplyList() {
  // 通知
  const [messageApi, contextHolder] = message.useMessage()
  // table
  const [dataSource, setDataSource] = useState([])
  useEffect(() => {
    http.post('/club/applyClubAll').then((res) => {
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
            <>
              <Button type="primary" onClick={() => handleState(item, 1)}>
                通过
              </Button>
              <Button danger onClick={() => handleState(item, 2)}>
                驳回
              </Button>
            </>
          )}
        </div>
      ),
    },
  ]
  // 处理状态
  const handleState = (item, state) => {
    setApplyState(state)
    setAuditOpen(true)
    auditForm.setFieldsValue(item)
  }
  // 审核状态
  const [applyState, setApplyState] = useState(0)
  const [auditForm] = Form.useForm()
  // 回复内容弹出框
  const [auditOpen, setAuditOpen] = useState(false)

  // 审核社团
  const handleAudit = () => {
    auditForm
      .validateFields()
      .then((values) => {
        values['apply_state'] = applyState
        http.post('/club/auditApplyClub', toHump(values)).then((res) => {
          setApplyState(0)
          setDataSource(
            dataSource.map((item) => {
              if (item['apply_id'] === values['apply_id']) {
                item['apply_state'] = values['apply_state']
              }
              return item
            })
          )
          setAuditOpen(false)
          auditForm.resetFields()
          if (res.data.code === 200) {
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
  // 搜索
  const onSearch = (value) => {
    let href = '/club/searchApplyClub'
    if (value === '') {
      href = '/club/applyClubAll'
    }
    http.post(href, { keywords: value }).then((res) => {
      setDataSource(res.data.data)
    })
  }
  return (
    <div>
      {contextHolder}
      <div id="user_top">
        <div></div>
        <Input.Search
          className="user_search"
          placeholder="社团名称 申请者 电话"
          allowClear
          enterButton="查询"
          size="large"
          onSearch={onSearch}
        />
      </div>
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
      <Modal
        open={auditOpen}
        title="审核申请社团"
        okText="确认"
        cancelText="取消"
        onCancel={() => {
          setAuditOpen(false)
          setApplyState(0)
          auditForm.resetFields()
        }}
        onOk={() => handleAudit()}>
        <AuditApplyComponent form={auditForm} />
      </Modal>
    </div>
  )
}
