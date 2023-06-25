import React, { useState, useEffect } from 'react';
import { Layout, Typography, Radio, Space, Select, Button } from 'antd';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';


const { Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

const StatsPage = () => {
  const [timeRange, setTimeRange] = useState('monthly');
  const [selectedContent, setSelectedContent] = useState('time');
  const [startDate, setStartDate] = useState(new Date());
  const [chartWidth, setChartWidth] = useState(500);
  const [data, setData] = useState([]);

  const handleTimeRangeChange = (e) => {
    setTimeRange(e.target.value);
    const currentDate = new Date(startDate);
    if (e.target.value === 'monthly') {
      currentDate.setDate(1);
    }
    setStartDate(currentDate);
  };

  const handleContentChange = (value) => {
    setSelectedContent(value);
  };

  const handlePrevDate = () => {
    const prevDate = new Date(startDate);
    if (timeRange === 'monthly') {
      prevDate.setMonth(startDate.getMonth() - 1);
    } else if (timeRange === 'weekly') {
      prevDate.setDate(startDate.getDate() - 7);
    }
    setStartDate(prevDate);
  };

  const handleNextDate = () => {
    const nextDate = new Date(startDate);
    if (timeRange === 'monthly') {
      nextDate.setMonth(startDate.getMonth() + 1);
    } else if (timeRange === 'weekly') {
      nextDate.setDate(startDate.getDate() + 7);
    }
    setStartDate(nextDate);
  };

  const handleResize = () => {
    setChartWidth(window.innerWidth * 0.9);
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const generateRandomData = () => {
      const newData = [];
      let current = new Date(startDate.getTime()); // startDate 복제
      let currentDate = new Date(current);
      if (timeRange === 'monthly') { // 월간으로 보는 경우
        currentDate = new Date(current.setDate(1)); // 날짜를 1일로 고정
      }
      const numDays = timeRange === 'monthly' ? new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate() : 7;
      const dateIncrement = timeRange === 'monthly' ? 1 : 1;
      for (let i = 0; i < numDays; i++) {
        const dateString = currentDate.toISOString().split('T')[0];
        const time = Math.floor(Math.random() * 60) + 30; // Random number between 30 and 90
        const count = Math.floor(Math.random() * 10) + 1; // Random number between 1 and 10
        const sets = Math.floor(Math.random() * 5) + 1; // Random number between 1 and 5
        newData.push({ date: dateString, time, count, sets });
        currentDate.setDate(currentDate.getDate() + dateIncrement);
      }
      return newData;
    };

    const newData = generateRandomData();
    setData(newData);
  }, [timeRange, startDate]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get('/api/data'); // API 엔드포인트에 맞게 수정해야 함
  //       const newData = response.data;
  //       setData(newData);
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   };

  //   fetchData();
  // }, []);     이 부분은 실제 스프링에서 데이터를 받아와서 사용할 수 있는 코드

  const getLastDayOfMonth = (year, month) => {
    return new Date(year, month, 0).getDate();
  };

  const getFormattedDate = (date) => {
    if (timeRange === 'monthly') {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const lastDay = getLastDayOfMonth(year, month);
      return `${year}년 ${month}월 1일 ~ ${year}년 ${month}월 ${lastDay}일`;
    } else {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const startDay = date.getDate();
      const endDate = new Date(date);
      endDate.setDate(date.getDate() + 6);
      const endMonth = endDate.getMonth() + 1;
      const endDay = endDate.getDate();
      return `${year}년 ${month}월 ${startDay}일 ~ ${year}년 ${endMonth}월 ${endDay}일`;
    }
  };

  return (
    <Layout>
      <Content style={{ padding: '24px' }}>
        <Title level={2}>운동 통계</Title>
        <Radio.Group value={timeRange} onChange={handleTimeRangeChange}>
          <Space direction="horizontal" style={{ display: 'flex' }}>
            <Radio.Button value="monthly">월간</Radio.Button>
            <Radio.Button value="weekly">주간</Radio.Button>
          </Space>
        </Radio.Group>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', marginTop: '16px' }}>
          <Button onClick={handlePrevDate} shape="circle" icon={<LeftOutlined />} />
          <div style={{ margin: '0 8px', fontSize: '18px', fontWeight: 'bold' }}>{getFormattedDate(startDate)}</div>
          <Button onClick={handleNextDate} shape="circle" icon={<RightOutlined />} />
        </div>
        <Select value={selectedContent} onChange={handleContentChange} style={{ width: 200, marginBottom: '16px' }}>
          <Option value="time">운동 시간</Option>
          <Option value="count">횟수</Option>
          <Option value="sets">세트 수</Option>
        </Select>
        <ResponsiveContainer width="100%" height={400} >
          <BarChart data={data} barSize={20} className="recharts-wrapper" style={{ height: '430px' }}>
            <XAxis dataKey="date" interval={0} tick={<CustomizedXAxisTick />} />
            <YAxis />
            <Tooltip />
            <Legend>
              wrapperStyle={{ marginTop: '20px', bottom: '5px' }}
            </Legend>
            <Bar
              dataKey={selectedContent}
              fill="#8884d8"
              name={selectedContent}
              shape={<RoundedRectangle />}
            />
          </BarChart>
        </ResponsiveContainer>
      </Content>
    </Layout>

  );

};

const CustomizedXAxisTick = ({ x, y, payload }) => {
  const date = new Date(payload.value);
  const day = date.getDate();
  const options = { weekday: 'short' };
  const dayOfWeek = date.toLocaleDateString('ko-KR', options);

  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={16} textAnchor="middle" fill="#666">
        {day}
      </text>
      <text x={0} y={20} dy={16} textAnchor="middle" fill="#666" fontSize={12}>
        {dayOfWeek}
      </text>
    </g>
  );
};

const RoundedRectangle = (props) => {
  const { x, y, width, height, fill } = props;

  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      rx={10}
      ry={10}
      fill={fill}
      onMouseOver={props.onMouseOver}
      onMouseOut={props.onMouseOut}
    />
  );
};

export default StatsPage;
