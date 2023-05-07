import React from 'react';
import { Layout, Input, Card, Row, Col } from 'antd';
import "../../styles/pages/ExecStats.css";

const { Header, Content } = Layout;
const { Search } = Input;
const { Meta } = Card;

const data = [
  {
    title: 'Card Title 1',
    description: 'Card Description 1',
    image: 'https://via.placeholder.com/150',
  },
  {
    title: 'Card Title 2',
    description: 'Card Description 2',
    image: 'https://via.placeholder.com/150',
  },
  // Add more card data here...
];

function ExecStatsPage() {
  return (
    <Layout>
      <Header style={{ backgroundColor: '#fff', textAlign: 'center' }}>
        <h2>Your App Name</h2>
      </Header>
      <Content style={{ padding: '0 50px', marginTop: 64 }}>
        <div style={{ padding: '24px 0' }}>
          <Search
            placeholder="Search..."
            enterButton
            size="large"
            style={{ maxWidth: 600, margin: '0 auto' }}
          />
        </div>
        <Row gutter={[16, 16]} style={{ margin: '0 auto' }}>
          {data.map((item, index) => (
            <Col xs={24} sm={12} md={8} lg={6} key={index}>
              <Card
                hoverable
                cover={<img alt={item.title} src={item.image} />}
              >
                <Meta title={item.title} description={item.description} />
              </Card>
            </Col>
          ))}
        </Row>
      </Content>
    </Layout>
  );
}

export default ExecStatsPage;
