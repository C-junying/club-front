import React, { useEffect, useState } from 'react'
import { Card, Col, Row, Avatar, Tag } from 'antd'
import { http } from '@/utils/http'

import { group } from '@/utils/myMethod'
import { useNavigate, useParams } from 'react-router-dom'
const { Meta } = Card
// 社团活动列表
export default function ClubActivityList() {
  const navigate = useNavigate()
  // 表格数据
  const [dataSource, setDataSource] = useState([])
  const params = useParams()
  useEffect(() => {
    http.post('/activity/getClubActivityAll', params).then((res) => {
      setDataSource(group(res.data.data, 3))
    })
  }, [params])
  const onClick = (item) => {
    navigate(`/activity/list/${item}/intro`)
  }
  return (
    <>
      {dataSource.map((row, idx) => {
        return (
          <Row gutter={32} key={idx} style={{ marginBottom: 20, marginLeft: 25 }}>
            {row.map((activity) => {
              return (
                <Col span={7} key={activity['activity_id']} onClick={() => onClick(activity['activity_id'])}>
                  <Card
                    hoverable
                    style={{ background: '#FAFAFAD0' }}
                    cover={<img alt="example" src={activity['picture']} style={{ height: 150 }} />}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Meta
                        avatar={<Avatar src={activity['type_picture']} />}
                        title={activity['activity_title']}
                        description={activity['activity_intro']}
                      />
                      <div>
                        {activity['activity_state'] === 1 ? (
                          <Tag color="success">正在进行中</Tag>
                        ) : (
                          <Tag color="default">已结束</Tag>
                        )}
                      </div>
                    </div>
                  </Card>
                </Col>
              )
            })}
          </Row>
        )
      })}
    </>
  )
}
