import React, { useEffect, useState } from 'react'
import { Button, Modal, Table, Form, Input, message } from 'antd'
import { http } from '@/utils/http'
import { MyIcon } from '@/utils/MyIcon'
import { toHump } from '@/utils/toHump'
import { useParams } from 'react-router-dom'
import ClubMemberConponent from '../../../../components/club/ClubMemberConponent'

const { confirm } = Modal
const { Search } = Input

// 社团成员
export default function ClubMember() {
  // 通知
  const [messageApi, contextHolder] = message.useMessage()
  // table
  const [dataSource, setDataSource] = useState([])
  // 当前用户
  const [myUser, setMyUser] = useState({})
  //   获取链接数据
  const params = useParams()
  useEffect(() => {
    http.post('/club/getClubMember', toHump(params)).then((res) => {
      setDataSource(res.data.data)
    })
  }, [params])
  // 获取当前用户的信息
  useEffect(() => {
    http.post('/club/clubIdUserIdToBearName', toHump(params)).then((res) => {
      if (res.data.data.member.length > 0) {
        setMyUser(res.data.data.member[0])
      } else if (res.data.data.taecher.length > 0) {
        setMyUser(res.data.data.taecher[0])
      }
    })
  }, [params])
  const columns = [
    {
      title: '姓名',
      dataIndex: 'user_name',
      key: 'user_name',
      render: (key) => {
        return <b>{key}</b>
      },
    },
    {
      title: '性别',
      dataIndex: 'sex',
      key: 'sex',
    },
    {
      title: '电话',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '职位',
      dataIndex: 'bear_name',
      key: 'bear_name',
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
          <Button
            danger
            shape="circle"
            icon={MyIcon('DeleteOutlined')}
            onClick={() => confirmMethod(item)}
            hidden={
              (myUser['bear_name'] === '社长' ? false : true) ||
              (item['bear_name'] === '指导老师' ? true : false) ||
              (item['bear_name'] === '社长' ? true : false)
            }
          />
          <Button
            type="primary"
            shape="circle"
            icon={MyIcon('UnorderedListOutlined')}
            onClick={() => {
              setMemberBearOpen(true)
              memberBearForm.setFieldsValue(item)
            }}
            hidden={
              (myUser['bear_name'] === '社长' ? false : true) ||
              (item['bear_name'] === '指导老师' ? true : false) ||
              (item['bear_name'] === '社长' ? true : false)
            }
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
  // 删除用户操作
  const deleteMothed = (item) => {
    // 当前页面同步状态+后端同步
    setDataSource(dataSource.filter((data) => data['user_id'] !== item['user_id']))
    http.post('/club/deleteMember', toHump(item))
  }
  // 添加社团成员
  const [memberOpen, setMemberOpen] = useState(false)
  const [memberForm] = Form.useForm()
  // 添加操作
  const addMemberFormOk = () => {
    memberForm
      .validateFields()
      .then((values) => {
        values.clubId = params.clubId
        http.post('/club/addMember', toHump(values)).then((res) => {
          setMemberOpen(false)
          memberForm.resetFields()
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
  // 分配职位
  const [memberBear, setMemberBearOpen] = useState(false)
  const [memberBearForm] = Form.useForm()

  const memberBearFormOk = () => {
    memberBearForm
      .validateFields()
      .then((values) => {
        http.post('/club/updateMemberBear', toHump(values)).then((res) => {
          setMemberBearOpen(false)
          memberBearForm.resetFields()
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
  // 搜索
  const onSearch = (value) => {
    let href = '/club/searchClubMember'
    if (value === '') {
      href = '/club/getClubMember'
    }
    http.post(href, toHump({ ...params, keywords: value })).then((res) => {
      setDataSource(res.data.data)
    })
  }
  return (
    <>
      {contextHolder}
      <div id="user_top" style={{ justifyContent: 'space-between' }}>
        <div>
          <Button
            type="primary"
            shape="round"
            onClick={() => setMemberOpen(true)}
            hidden={myUser['bear_name'] === '社长' ? false : true}>
            添加成员
          </Button>
        </div>
        <Search
          className="user_search"
          placeholder="姓名 电话"
          allowClear
          enterButton="Search"
          size="large"
          onSearch={onSearch}
        />
      </div>
      <Table
        id="table-antn-menu"
        columns={columns}
        rowKey="user_id"
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
        open={memberOpen}
        title="添加社团成员"
        okText="添加"
        cancelText="取消"
        onCancel={() => {
          setMemberOpen(false)
          memberForm.resetFields()
        }}
        onOk={() => addMemberFormOk()}>
        <ClubMemberConponent form={memberForm} />
      </Modal>
      <Modal
        open={memberBear}
        title="分配职位"
        okText="分配"
        cancelText="取消"
        onCancel={() => {
          setMemberBearOpen(false)
          memberBearForm.resetFields()
        }}
        onOk={() => memberBearFormOk()}>
        <ClubMemberConponent form={memberBearForm} isDisabled={true} />
      </Modal>
    </>
  )
}
