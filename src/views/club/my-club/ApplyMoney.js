import React, { useEffect, useState } from 'react'
import { Button, Modal, Table, Tag, message, Form, Input, InputNumber } from 'antd'
import { http } from '@/utils/http'
import { MyIcon } from '@/utils/MyIcon'
import { toHump } from '@/utils/toHump'
import { dateFormat } from '@/utils/time'
import { useParams } from 'react-router-dom'
const { confirm } = Modal

// 社团申请资金
export default function ApplyMoney() {
  // 通知
  const [messageApi, contextHolder] = message.useMessage()
  // table
  const [dataSource, setDataSource] = useState([])
  // 获取链接数据
  const params = useParams()

  useEffect(() => {
    http.post('/cost/getClubCostApply', params).then((res) => {
      setDataSource(res.data.data)
    })
  }, [params])
  const columns = [
    {
      title: '社团名称',
      dataIndex: 'club_name',
      key: 'club_name',
      render: (key) => {
        return <b>{key}</b>
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
      title: '申请资金',
      dataIndex: 'apply_cost',
      key: 'apply_cost',
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
        </div>
      ),
    },
  ]
  // 撤销社团的确认框
  const confirmMethod = (item) => {
    confirm({
      title: '你确认撤销吗?',
      icon: MyIcon('ExclamationCircleFilled'),
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
    http.post('/cost/deleteCostApply', toHump(item)).then((res) => {
      messageApi.success(res.data.msg)
      setDataSource(dataSource.filter((data) => data['apply_id'] !== item['apply_id']))
    })
  }
  // 添加申请
  const [costApplyOpen, setCostApplyOpen] = useState(false)
  const [costApplyForm] = Form.useForm()
  // 添加操作
  const addCostApplyFormOk = () => {
    costApplyForm
      .validateFields()
      .then((values) => {
        values.clubId = params.clubId
        http.post('/cost/addCostApply', toHump(values)).then((res) => {
          setCostApplyOpen(false)
          costApplyForm.resetFields()
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
  return (
    <div>
      {contextHolder}
      <div style={{ marginBottom: 5 }}>
        <Button type="primary" shape="round" onClick={() => setCostApplyOpen(true)}>
          添加申请
        </Button>
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
        open={costApplyOpen}
        title="添加申请"
        okText="添加"
        cancelText="取消"
        onCancel={() => {
          setCostApplyOpen(false)
          costApplyForm.resetFields()
        }}
        onOk={() => addCostApplyFormOk()}>
        <Form
          form={costApplyForm}
          layout="vertical"
          name="form_in_modal"
          validateTrigger={['onBlur', 'onChange']}>
          <Form.Item
            name="apply_content"
            label="申请理由"
            rules={[
              {
                required: true,
                message: '请输入理由!',
                validateTrigger: 'onBlur',
              },
            ]}>
            <Input.TextArea showCount maxLength={130} />
          </Form.Item>
          <Form.Item name="apply_cost" label="申请金额" initialValue={0}>
            <InputNumber min={0} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
