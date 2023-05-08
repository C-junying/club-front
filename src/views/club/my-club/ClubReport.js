import React, { useEffect, useState } from 'react'
import { Button, Modal, Table, message } from 'antd'
import { http } from '@/utils/http'
import { toHump } from '@/utils/toHump'
import { dateFormat } from '@/utils/time'
import { MyIcon } from '@/utils/MyIcon'
import { NavLink, useLocation, useParams } from 'react-router-dom'

const { confirm } = Modal
// 学期报告
export default function ClubReport() {
  // 通知
  const [messageApi, contextHolder] = message.useMessage()
  const params = useParams()
  // 获取传来的数据
  // table
  const [dataSource, setDataSource] = useState([])
  // user
  const [myUser, setMyUser] = useState({})
  useEffect(() => {
    http.post('/club/clubIdReportAll', toHump(params)).then((res) => {
      setDataSource(res.data.data)
    })
  }, [params])
  const location = useLocation()
  useEffect(() => {
    // 获取当前用户的信息
    // 获取传来的数据
    setMyUser(location.state)
  }, [location])
  const columns = [
    {
      title: '总结主题',
      dataIndex: 'report_title',
      key: 'report_title',
      render: (key, item) => {
        return (
          <NavLink to={`preview/${item['report_id']}`}>
            <b>{key}</b>
          </NavLink>
        )
      },
    },
    {
      title: '发起者',
      dataIndex: 'user_name',
      key: 'user_name',
      render: (key) => {
        return <b>{key}</b>
      },
    },
    {
      title: '阶段名称',
      dataIndex: 'stage_name',
      key: 'stage_name',
    },
    {
      title: '上传时间',
      dataIndex: 'create_time',
      key: 'create_time',
      render: (key) => {
        return dateFormat(key)
      },
    },
    {
      title: '代表图',
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
        <Button
          danger
          shape="circle"
          icon={MyIcon('DeleteOutlined')}
          onClick={() => confirmMethod(item)}
          hidden={
            (myUser['bear_name'] === '社长' ? false : true) &&
            (myUser['bear_name'] === '副社长' ? false : true)
          }
        />
      ),
    },
  ]
  // 删除报告的确认框
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
  // 删除报告操作
  const deleteMothed = (item) => {
    // 当前页面同步状态+后端同步
    http.post('/club/deleteReport', toHump(item)).then((res) => {
      messageApi.success(res.data.msg)
      setDataSource(dataSource.filter((data) => data['report_id'] !== item['report_id']))
    })
  }
  return (
    <div>
      {contextHolder}

      <Button
        type="primary"
        shape="round"
        style={{ marginBottom: 5 }}
        hidden={
          (myUser['bear_name'] === '社长' ? false : true) && (myUser['bear_name'] === '副社长' ? false : true)
        }>
        <NavLink to={`${myUser.userId}`}>添加报告</NavLink>
      </Button>
      <Table
        id="table-antn-menu"
        columns={columns}
        rowKey="report_id"
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
    </div>
  )
}
