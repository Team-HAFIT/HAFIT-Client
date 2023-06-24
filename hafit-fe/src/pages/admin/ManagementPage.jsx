import React, { useEffect, useState, useCallback } from "react";
import {
  message,
  Modal,
} from "antd";
import axios from "axios";
import { useSelector } from "react-redux";
import { Table, Input, Typography, Select } from "antd";
import "../../styles/pages/noticePage.css";

const { Title } = Typography;
const { Option } = Select;

const ManagementPage = () => {
  const accessToken = useSelector((state) => state.authToken.accessToken);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);
  // const [modalVisible, setModalVisible] = useState(false);

  const fetchUsers = useCallback(async () => {

    axios
      .get("/api/admin/users", {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${accessToken}`,
        },
        timeout: 10000,
      })
      .then((response) => {
        setData((prevData) => prevData.concat(response.data));

      })
      .catch((error) => {
        console.log(error);
        message.error("회원 정보를 불러오지 못했습니다", 1);       
      })
      .finally(() => {
        
      });
  }, [accessToken]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleChangePage = (page, pageSize) => {
    setCurrentPage(page);
  };

  const handleChangePageSize = (current, size) => {
    setCurrentPage(1);
    setPageSize(size);
  };

  const handleRoleChange = (record) => {
    Modal.confirm({
      title: "관리자로 변경하시겠습니까?",
      onOk: () => {
        axios
          .put(`/api/admin/${record.userId}`,
          {},
            {
              headers: {
                "Content-Type": "application/json", // 요청 헤더에 Content-Type 설정
                authorization: `Bearer ${accessToken}`,
              },
              timeout: 5000,
            })
          .then(() => {
            message.success("수정되었습니다", 1);
            window.location.reload();
          })
          .catch((error) => {
            console.log(record.userId);
            console.error(error);
          });
      },
      onCancel: () => {
        console.log("권한 변경을 취소하셨습니다! ˙ᵕ˙");
      },
    });
  };  

  const columns = [
    {
      title: "아이디",
      dataIndex: "userId",
      key: "userId",
      width: "10%",
    },
    {
      title: "아이디",
      dataIndex: "email",
      key: "email",
      width: "10%",
    },
    {
      title: "통신사",
      dataIndex: "carrier",
      key: "carrier",
      width: "10%",
    },
    {
      title: "전화번호",
      dataIndex: "phone",
      key: "phone",
      width: "10%",
    },
    {
      title: "성별",
      dataIndex: "sex",
      key: "sex",
      width: "10%",
    },
    {
      title: "이름",
      dataIndex: "name",
      key: "name",
      width: "10%",
    },
    {
      title: "생일",
      dataIndex: "birthday",
      key: "birthday",
      width: "10%",
    },
    {
      title: "키",
      dataIndex: "height",
      key: "height",
      width: "10%",
    },
    {
      title: "몸무게",
      dataIndex: "weight",
      key: "weight",
      width: "10%",
    },
    {
      title: "생성일",
      dataIndex: "createdAt",
      key: "createdAt",
      width: "10%",
    },
    {
      title: "소셜로그인",
      dataIndex: "socialType",
      key: "socialType",
      width: "10%",
    },
    {
      title: "권한",
      dataIndex: "role",
      key: "role",
      width: "10%",
      render: (text, record) => (
        <Select
          defaultValue={text}
          style={{ width: "100%" }}
          onChange={(value) => handleRoleChange(record, value)} // Pass record and value
          disabled={record.role === "ADMIN"} // Use record.role to disable the select if already ADMIN
        >
          <Option value="ADMIN">관리자</Option>
          <Option value="USER">일반 회원</Option>
        </Select>
      ),
    },
  ];

  return (
    <div>
      <div className="admin-page">
        <div className="notice-board-header">
          <Title level={2}>회원 목록</Title>
          <Input.Search
            className="search"
            placeholder="아이디, 이름 검색"
            enterButton
            onSearch={(value) => console.log(value)}
            style={{ float: "right", marginRight: "100px" }}
          />
        </div>
        <Table 
          dataSource={data} 
          columns={columns} 
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: data.length,
            onChange: handleChangePage,
            showSizeChanger: true,
            onShowSizeChange: handleChangePageSize,
            pageSizeOptions: ["10", "20", "30", "40"],
            style: {
              display: "flex",
              justifyContent: "center",
              marginLeft: "124px",
            },
          }}
          className="notice-board-table admin-page-table"
          tableLayout="fixed"
        />
      </div>
    </div>
  );
};

export default ManagementPage;