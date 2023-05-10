import React, { useEffect, useState } from 'react'
import { Button, Table, Tag, Modal } from 'antd'
import { http } from '@/utils/http'
import { MyIcon } from '@/utils/MyIcon'
import { dateFormat } from '@/utils/time'
import { toHump } from '@/utils/toHump'
import { useParams } from 'react-router-dom'

// 社团费用
export default function ClubCostList() {
  // table
  const [dataSource, setDataSource] = useState([])
  // 获取链接数据
  const params = useParams()
  useEffect(() => {
    http.post('/cost/getClubCost', toHump(params)).then((res) => {
      http.post('/cost/getPayName', res.data.data).then((temp) => {
        setDataSource(temp.data.data)
      })
    })
  }, [params])
  const columns = [
    {
      title: '账单名',
      dataIndex: 'bill_name',
      key: 'bill_name',
      render: (key) => {
        return <b>{key}</b>
      },
    },
    {
      title: '资金来源',
      dataIndex: 'source_name',
      key: 'source_name',
    },
    {
      title: '申请者',
      dataIndex: 'user_name',
      key: 'user_name',
    },
    {
      title: '资金去向',
      dataIndex: 'pay_name',
      key: 'pay_name',
    },
    {
      title: '资金',
      dataIndex: 'total',
      key: 'total',
    },
    {
      title: '支付状态',
      dataIndex: 'pay_state',
      key: 'pay_state',
      render: (state) => {
        if (state === 0) {
          return <Tag color="processing">支付中</Tag>
        } else if (state === 1) {
          return <Tag color="success">已支付</Tag>
        } else {
          return <Tag color="error">未支付</Tag>
        }
      },
    },
    {
      title: '类型',
      dataIndex: 'bill_type',
      key: 'bill_type',
      render: (key) => {
        if (key === '收入') {
          return <Tag color="success">{key}</Tag>
        } else {
          return <Tag color="error">{key}</Tag>
        }
      },
    },
    {
      title: '操作',
      dataIndex: '',
      key: 'x',
      render: (item) => (
        <div>
          <Button
            type="primary"
            shape="circle"
            icon={MyIcon('UnorderedListOutlined')}
            onClick={() => getBillInfo(item)}
          />
        </div>
      ),
    },
  ]
  //   账单信息
  const [costOpen, setCostOpen] = useState(false)
  const [billList, setBillList] = useState([])
  const getBillInfo = (item) => {
    http.post('/cost/getCostToProject', toHump(item)).then((res) => {
      setBillList(res.data.data)
      setCostOpen(true)
    })
  }
  return (
    <>
      <Table
        id="table-antn-menu"
        columns={columns}
        rowKey="bill_id"
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
          expandedRowRender: (cost) => (
            <div style={{ margin: 0 }}>
              <p>
                <b style={{ color: 'red' }}>申请时间：</b>
                {!!cost['date'] && dateFormat(cost['date'])}
              </p>
              <p>
                <b style={{ color: 'red' }}>备注：</b>
                {cost['remark']}
              </p>
            </div>
          ),
        }}
        dataSource={dataSource}
      />
      <Modal
        open={costOpen}
        title="账单信息"
        onCancel={() => {
          setBillList([])
          setCostOpen(false)
        }}
        footer={[
          <Button
            key="back"
            type="primary"
            onClick={() => {
              setBillList([])
              setCostOpen(false)
            }}>
            关闭
          </Button>,
        ]}>
        <Table
          id="table-antn-menu"
          columns={[
            {
              title: '账单名',
              dataIndex: 'project_name',
              key: 'project_name',
            },
            {
              title: '数量',
              dataIndex: 'project_num',
              key: 'project_num',
            },
            {
              title: '价格',
              dataIndex: 'price',
              key: 'price',
            },
          ]}
          rowKey="project_id"
          pagination={{
            position: ['bottomCenter'],
            showQuickJumper: true,
            hideOnSinglePage: true,
            showSizeChanger: true,
            defaultPageSize: 10,
            total: dataSource.length,
            showTotal: (total) => `总共：${total}个`,
          }}
          dataSource={billList}
        />
      </Modal>
    </>
  )
}
