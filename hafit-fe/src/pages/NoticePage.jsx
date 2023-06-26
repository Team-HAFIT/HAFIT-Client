// 공지사항 페이지
import React, { useState } from "react";
import { Table, Input, Button, Typography } from "antd";
import "../styles/pages/noticePage.css";

// import Header from "../components/Navbar";

const { Title } = Typography;

const NoticePage = () => {
  const [setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const handleChangePage = (page, pageSize) => {
    setCurrentPage(page);
  };

  const handleChangePageSize = (current, size) => {
    setCurrentPage(1);
    setPageSize(size);
  };

  const getColumnSearchProps = (dataIndex, placeholder) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={placeholder}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Button
          type="primary"
          onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          검색
        </Button>
        <Button
          onClick={() => handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          초기화
        </Button>
      </div>
    ),
    filterIcon: (filtered) => (
      <i
        className={`${
          filtered ? "ant-table-filter-icon filtered" : "ant-table-filter-icon"
        }`}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => {
          document.getElementById(`${dataIndex}-search-input`).focus();
        }, 0);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <span className="highlight">{text}</span>
      ) : (
        text
      ),
  });

  const columns = [
    {
      title: "제목",
      dataIndex: "title",
      key: "title",
      width: "70%",
      ...getColumnSearchProps("title", "제목 검색"),
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: "작성일",
      dataIndex: "date",
      key: "date",
      width: "10%",
      sorter: (a, b) => a.date.localeCompare(b.date),
      align: "center",
    },
    {
      title: "작성자",
      dataIndex: "author",
      key: "author",
      width: "10%",
      sorter: (a, b) => a.author.localeCompare(b.author),
      align: "center",
    },
    {
      title: "조회수",
      dataIndex: "views",
      key: "views",
      width: "10%",
      sorter: (a, b) => a.views - b.views,
      align: "center",
    },
  ];

  const data = [
    {
      key: "1",
      title: "메인 페이지 이용",
      date: "2023-05-01",
      author: "관리자",
      views: 10,
    },
    {
      key: "2",
      title: "서비스 이용 안내",
      date: "2023-06-02",
      author: "운영팀",
      views: 20,
    },
    {
      key: "3",
      title: "신규 기능 업데이트",
      date: "2023-04-03",
      author: "운영팀",
      views: 15,
    },
    {
      key: "4",
      title: "주말 할인 이벤트",
      date: "2023-06-04",
      author: "마케터",
      views: 8,
    },
    {
      key: "5",
      title: "공지사항 업데이트 안내",
      date: "2023-06-05",
      author: "관리자",
      views: 12,
    },
    {
      key: "6",
      title: "정기 점검 안내",
      date: "2023-06-06",
      author: "운영팀",
      views: 25,
    },
    {
      key: "7",
      title: "이용 방법 안내",
      date: "2023-06-07",
      author: "운영팀",
      views: 18,
    },
    {
      key: "8",
      title: "서비스 이용 공지",
      date: "2023-03-08",
      author: "관리자",
      views: 5,
    },
    {
      key: "9",
      title: "이벤트 상품 소개",
      date: "2023-05-09",
      author: "마케터",
      views: 30,
    },
    {
      key: "10",
      title: "시스템 업데이트 안내",
      date: "2023-06-10",
      author: "운영팀",
      views: 14,
    },
    {
      key: "11",
      title: "공지사항 수정",
      date: "2023-04-11",
      author: "관리자",
      views: 7,
    },
    {
      key: "12",
      title: "신규 이용자 환영",
      date: "2023-01-12",
      author: "운영팀",
      views: 22,
    },
    {
      key: "13",
      title: "서비스 변경 사항",
      date: "2023-01-13",
      author: "운영팀",
      views: 11,
    },
    {
      key: "14",
      title: "공지사항 이용 방법",
      date: "2023-06-14",
      author: "관리자",
      views: 16,
    },
    {
      key: "15",
      title: "매주 이벤트 소식",
      date: "2023-06-15",
      author: "마케터",
      views: 9,
    },
    {
      key: "16",
      title: "주요 업데이트 안내",
      date: "2023-06-16",
      author: "운영팀",
      views: 13,
    },
    {
      key: "17",
      title: "공지사항 주의 사항",
      date: "2023-06-17",
      author: "관리자",
      views: 21,
    },
    {
      key: "18",
      title: "기능 개선 사항",
      date: "2023-06-18",
      author: "운영팀",
      views: 6,
    },
    {
      key: "19",
      title: "이용자 만족도 조사",
      date: "2023-06-19",
      author: "운영팀",
      views: 19,
    },
    {
      key: "20",
      title: "서비스 종료 안내",
      date: "2023-06-20",
      author: "관리자",
      views: 17,
    },
  ];

  // for (let i = 1; i <= 100; i++) {
  //   const item = {
  //     key: `${i}`,
  //     title: `제목 ${i}`,
  //     date: `2023-05-${i%30+1}`,
  //     author: `작성자 ${i}`,
  //     views: Math.floor(Math.random() * 100) + 1,
  //   };
  //   data.push(item);
  // }

  const paginatedData = data.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div>
      {/* <Header /> */}
      <div className="notice-board">
        <div className="notice-board-header">
          <Title level={2}>공지사항</Title>
          <Input.Search
            className="search"
            placeholder="제목 또는 내용 검색"
            enterButton
            onSearch={(value) => console.log(value)}
            style={{ float: "right", marginRight: "100px" }}
          />
        </div>
        <Table
          columns={columns}
          dataSource={paginatedData}
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
          className="notice-board-table"
          tableLayout="fixed"
        />
      </div>
    </div>
  );
};

export default NoticePage;
