import { Modal } from "antd";
import React, { useState } from "react";

import {
  Typography,
  Input,
  Upload,
  message,
  Row,
  Col,
  Button,
  Divider,
  Space,
  Avatar,
  Carousel,
  Select,
} from "antd";
import {
  PlusOutlined,
  PictureOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { IoArrowBack } from "react-icons/io5";

import "../../../styles/pages/community/viewPostsAll.css";

const { Title } = Typography;
const { TextArea } = Input;
const { Dragger } = Upload;

// 파일 업로드 시, base64로 변환하는 함수
const getBase64 = (file) => {
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (err) => reject(err);
  });
  console.log(file);
};

// 파일 업로드 시, 드래그 앤 드롭 기능을 위한 props
// const props = {
//   name: "file",
//   multiple: true,
//   action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
//   onChange(info) {
//     const { status } = info.file;
//     if (status !== "uploading") {
//       console.log(info.file, info.fileList);
//     }
//     if (status === "done") {
//       message.success(`${info.file.name} file uploaded successfully.`);
//     } else if (status === "error") {
//       message.error(`${info.file.name} file upload failed.`);
//     }
//   },
//   onDrop(e) {
//     console.log("Dropped files", e.dataTransfer.files);
//   },
// };

const PostModal = (props) => {
  // --------- START : 파일 업로드 관련 ---------- //
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState([
    {
      uid: "-1",
      name: "image.png",
      status: "done",
      url: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
    },
    {
      uid: "-2",
      name: "image.png",
      status: "done",
      url: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
    },
  ]);

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };
  const onUploadChange = ({ fileList: newFileList }) =>
    setFileList(newFileList);
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );
  // --------- END : 파일 업로드 관련 ---------- //

  // --------- START : 캐러셀 prev, next 관련 ---------- //
  const [carouselRef, setCarouselRef] = useState(null);

  const next = () => {
    carouselRef.next();
  };

  const previous = () => {
    carouselRef.prev();
  };
  // --------- END : 캐러셀 prev, next 관련 ---------- //

  return (
    <Modal
      visible={props.visible}
      footer={null}
      closable={false} // 모달 오른쪽 상단 'X' 버튼 삭제
      maskClosable={false} // 모달 바깥 영역 클릭 시 모달 닫히지 않도록 설정
      width="68vw"
      style={{ top: "10vh" }}
    >
      <Row>
        <Col className="post-modal-header" span={24}>
          <Button
            className="modal-back-btn"
            icon={<IoArrowBack style={{ fontSize: "1.4em" }} />}
            onClick={() => props.setModalVisible(false)}
          ></Button>
          <Title
            level={5}
            style={{
              display: "flex",
              margin: 0,
              marginLeft: "auto",
              marginRight: "auto",
              paddingLeft: "40px",
            }}
          >
            새 게시물 작성하기
          </Title>
          <Button className="post-submit-btn">
            <span>완료</span>
          </Button>
        </Col>
      </Row>
      <Divider className="divider" />
      <Row>
        <Col span={13} style={{ minHeight: "480px" }}>
          {fileList.length === 0 ? (
            <Dragger
              {...props}
              multiple={true}
              maxCount={6}
              style={{ width: "96%" }}
              accept=".jpg, .jpeg, .png, .gif, .mp4, .avi"
              showUploadList={false}
              onChange={onUploadChange}
              beforeUpload={(file) => {
                const isLt20Mb = file.size / 1024 / 1024 < 20;
                if (!isLt20Mb) {
                  message.error("파일 크기는 10MB 미만이어야 합니다.");
                }
                return isLt20Mb;
              }}
            >
              <p className="ant-upload-drag-icon">
                <PictureOutlined />
              </p>
              <p className="ant-upload-text">
                이곳에 사진을 드래그하거나 클릭해서 첨부할 수 있습니다 :&#41;
              </p>
              <p className="ant-upload-hint">
                최대 6장까지 업로드 가능합니다! <br />
                사진 업로드 시, 다음의 주의사항을 숙지해주세요: <br />
                <br />
                1. 각 사진 파일 크기는 20MB 이하로 제한됩니다.
                <br />
                <br />
                2. 지원되는 파일 형식은 JPG, PNG, GIF, MP4, AVI 입니다.
                <br />
                <br />
                3. 저작권이 있는 사진은 업로드를 피해주세요.
              </p>
            </Dragger>
          ) : (
            <div className="carousel-wrapper">
              <Button
                className="carousel-button carousel-prev-button"
                type="circle"
                onClick={previous}
                icon={
                  <LeftOutlined style={{ color: "white", fontSize: "32px" }} />
                }
              />
              <Carousel
                ref={setCarouselRef}
                slidesToShow={1} // Use slidesToShow instead of slidesPerView
                dots // Enable pagination dots
                infinite={true}
                slidesToScroll={1}
              >
                {fileList.map((file, index) => (
                  <div key={index}>
                    <img
                      width={272}
                      alt="slide"
                      src={file.url}
                      style={{
                        width: "100%",
                        minHeight: "504px",
                        maxHeight: "504px",
                        borderRadius: "12px",
                      }}
                    />
                  </div>
                ))}
                {/* <RightOutlined /> */}
              </Carousel>
              <Button
                className="carousel-button carousel-next-button"
                type="circle"
                onClick={next}
                icon={
                  <RightOutlined style={{ color: "white", fontSize: "32px" }} />
                }
              />
            </div>
          )}
        </Col>
        <Col span={11}>
          <Row style={{ marginLeft: "16px" }}>
            <Col span={24} className="content-header">
              <Space className="writer-info">
                <Avatar
                  style={{
                    width: "48px",
                    height: "48px",
                    marginRight: "2px",
                  }}
                />
                <Space direction="vertical" size={0}>
                  <span
                    style={{
                      fontSize: "15px",
                      fontWeight: "600",
                    }}
                  >
                    김해핏
                  </span>
                  <span style={{ color: "#999999" }}>2023. 04. 27</span>
                </Space>
              </Space>
              <Space className="select-category">
                <Select
                  defaultValue="게시판 선택"
                  style={{
                    width: 120,
                  }}
                  // onChange={handleChange}
                  options={[
                    {
                      value: "오운완",
                      label: "오운완",
                    },
                    {
                      value: "자세 피드백",
                      label: "자세 피드백",
                    },
                    {
                      value: "운동 Q&A",
                      label: "운동 Q&A",
                    },
                  ]}
                />
              </Space>
            </Col>
            <Col span={24} className="content-body">
              <TextArea
                showCount
                maxLength={500}
                bordered={false}
                style={{
                  height: 160,
                  resize: "none",
                  fontSize: "16px",
                  marginBottom: "8px",
                }}
                placeholder="내용 입력 ..."
              />
              <Divider />
            </Col>
            <Col span={24} className="content-files">
              <Title
                level={5}
                style={{
                  margin: 0,
                  marginBottom: "8px",
                }}
              >
                사진/동영상
              </Title>
              <Upload
                className="upload-lists"
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={onUploadChange}
                maxCount={6}
                style={{ display: "flex", width: "100%" }}
                accept=".jpg, .jpeg, .png, .gif, .mp4, .avi"
                beforeUpload={(file) => {
                  const isLt20Mb = file.size / 1024 / 1024 < 20;
                  if (!isLt20Mb) {
                    message.error("파일 크기는 20MB 미만이어야 합니다.");
                  }
                  return isLt20Mb;
                }}
              >
                {fileList.length >= 6 ? null : uploadButton}
              </Upload>
              <Modal
                open={previewOpen}
                title={previewTitle}
                footer={null}
                onCancel={handleCancel}
              >
                <img
                  alt="example"
                  style={{
                    width: "100%",
                  }}
                  src={previewImage}
                />
              </Modal>
            </Col>
          </Row>
        </Col>
      </Row>
    </Modal>
  );
};

export default PostModal;
