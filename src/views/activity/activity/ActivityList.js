import React, { useEffect, useState } from 'react'
import { Table, Input, Tag } from 'antd'
import { http } from '@/utils/http'
import { NavLink } from 'react-router-dom'
import HeanderTitle from '@/components/other/HeanderTitle'

const { Search } = Input
// 活动列表
export default function ActivityList() {
  // 表格数据
  const [dataSource, setDataSource] = useState([])
  useEffect(() => {
    http.post('/activity/getManageActivityAll').then((res) => {
      setDataSource(res.data.data)
    })
  }, [])
  const columns = [
    {
      title: '活动名称',
      dataIndex: 'activity_title',
      key: 'activity_title',
      render: (key, item) => {
        return (
          <NavLink to={`/activity/list/${item['activity_id']}/intro`}>
            <b>{key}</b>
          </NavLink>
        )
      },
    },
    {
      title: '举办方',
      dataIndex: 'club_name',
      key: 'club_name',
      render: (key) => {
        return <b>{key}</b>
      },
    },
    {
      title: '活动类型',
      dataIndex: 'type_name',
      key: 'type_name',
    },
    {
      title: '活动场地',
      dataIndex: 'area_name',
      key: 'area_name',
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
      title: '活动状态',
      dataIndex: 'activity_state',
      key: 'activity_state',
      render: (state) => {
        return state === 1 ? <Tag color="success">正在进行中</Tag> : <Tag color="default">已结束</Tag>
      },
    },
  ]
  // 搜索
  const onSearch = (value) => {
    let href = '/activity/searchActivity'
    if (value === '') {
      href = '/activity/getManageActivityAll'
    }
    http.post(href, { keywords: value }).then((res) => {
      setDataSource(res.data.data)
    })
  }
  return (
    <>
      <div id="user_top" style={{ justifyContent: 'space-between' }}>
        <HeanderTitle title="活动列表" />
        <div></div>
        <Search
          className="user_search"
          placeholder="活动名称 活动类型 社团名称"
          allowClear
          enterButton="Search"
          size="large"
          onSearch={onSearch}
        />
      </div>
      <Table
        id="table-antn-menu"
        columns={columns}
        rowKey="activity_id"
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
    </>
  )
}
