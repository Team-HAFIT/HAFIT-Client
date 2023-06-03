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

  const data = [];

  for (let i = 1; i <= 100; i++) {
    const item = {
      key: `${i}`,
      title: `제목 ${i}`,
      date: `2023-05-${i%30+1}`,
      author: `작성자 ${i}`,
      views: Math.floor(Math.random() * 100) + 1,
    };
    data.push(item);
  }

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
