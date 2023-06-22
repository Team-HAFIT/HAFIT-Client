import { Modal } from "antd";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

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
  Form,
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
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (err) => reject(err);
  });
};

const PostUpdateModal = (props) => {
  const [loading, setLoading] = useState(false); // 요청 중 여부 상태 저장용 state
  const [isLoading, setIsLoading] = useState(true);
  const [form] = Form.useForm();

  const accessToken = useSelector((state) => state.authToken.accessToken);

  const [postInfo, setPostInfo] = useState({});

  // --------- START : 파일 업로드 관련 ---------- //
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState([]);
  const [fileIdList, setFileIdList] = useState([]); // 삭제할 파일 id 목록

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

  const handleRemove = (file) => {
    setFileIdList([...fileIdList, file.fileId]);
  };

  const onUploadChange = async ({ fileList: newFileList }) => {
    const promises = newFileList.map(async (file) => {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
        file.status = "done";
      }
      return file;
    });

    const updatedFileList = await Promise.all(promises);
    setFileList(updatedFileList);
  };

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

  // 게시글 정보 불러오기
  useEffect(() => {
    if (props.postId) {
      axios
        .get(`/api/posts/${props.postId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          timeout: 10000,
        })
        .then((response) => {
          setPostInfo(response.data);
          console.log(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [accessToken, props.postId]);

  // s3 파일 url -> 파일 정보로 변환
  useEffect(() => {
    if (postInfo && postInfo.files) {
      Promise.all(
        postInfo.files.map((file) => {
          return axios.get(`/api/posts/img/${file.fileId}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            responseType: "arraybuffer",
            timeout: 10000,
          });
        })
      )
        .then((responses) => {
          // const files = responses.map((res) => res.data);
          const files = responses.map((res, index) => {
            const file = new File([res.data], `file_${index}`, {
              type: res.headers["content-type"],
            });
            return {
              uid: `__AUTO__${Date.now()}${index}__`,
              name: file.name,
              status: "done",
              url: URL.createObjectURL(file),
              fileId: postInfo.files[index].fileId,
              originFileObj: file,
            };
          });
          setFileList(files);
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [postInfo, postInfo.files, accessToken]);

  const handleBack = () => {
    form.resetFields();
    props.setModalVisible(false);
  }

  const onFinish = async (values) => {
    setLoading(true); // 요청 시작 시, 로딩 중 상태로 설정

    try {
      const { categoryId, post_content } = values;

      const formData = new FormData();
      formData.append("categoryId", categoryId);
      formData.append("post_content", post_content);
      formData.append("deleteImageIds", fileIdList); // 삭제할 파일 id 목록

      for (let i = 0; i < fileList.length; i++) {
        formData.append("files", fileList[i].originFileObj);
        // console.log(`파일 [${i}]: ` + JSON.stringify(fileList[i]));
      }
      // console.log(formData.getAll("files"));

      const response = await axios({
        method: "put",
        url: `/api/posts/${props.postId}`,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`,
        },
        timeout: 5000,
      });

      console.log(response.data);

      // Reset form and close the modal
      form.resetFields();
      props.setModalVisible(false);
      window.location.reload();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // 요청 완료 시, 로딩 완료 상태로 설정
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      {isLoading ? (
        <></>
      ) : (
        <Modal
          visible={props.visible}
          footer={null}
          closable={false} // 모달 오른쪽 상단 'X' 버튼 삭제
          maskClosable={false} // 모달 바깥 영역 클릭 시 모달 닫히지 않도록 설정
          width="68vw"
          style={{ top: "10vh" }}
        >
          <Form
            form={form}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            style={{ maxWidth: "100%" }}
          >
            <Row>
              <Col className="post-modal-header" span={24}>
                <Button
                  className="modal-back-btn"
                  icon={<IoArrowBack style={{ fontSize: "1.4em" }} />}
                  onClick={handleBack}
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
                  게시물 수정하기
                </Title>
                <Button
                  className="post-submit-btn"
                  htmlType="submit"
                  loading={loading}
                >
                  <span>수정 완료</span>
                </Button>
              </Col>
            </Row>
            <Divider className="divider" />
            <Row>
              <Col span={13} style={{ minHeight: "520px" }}>
                {fileList.length === 0 ? (
                  <Dragger
                    {...props}
                    // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
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
                      이곳에 사진을 드래그하거나 클릭해서 첨부할 수 있습니다
                      :&#41;
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
                        <LeftOutlined
                          style={{ color: "white", fontSize: "32px" }}
                        />
                      }
                    />
                    <Carousel
                      ref={setCarouselRef}
                      slidesToShow={1} // Use slidesToShow instead of slidesPerView
                      dots // Enable pagination dots
                      infinite={true}
                      slidesToScroll={1}
                    >
                      {postInfo.files.map((file, index) => (
                        <div key={index}>
                          <img
                            width={272}
                            alt="slide"
                            src={file.file_name}
                            // crossOrigin="anonymous"
                            style={{
                              width: "100%",
                              minHeight: "504px",
                              maxHeight: "504px",
                              borderRadius: "12px",
                            }}
                          />
                        </div>
                      ))}
                    </Carousel>
                    <Button
                      className="carousel-button carousel-next-button"
                      type="circle"
                      onClick={next}
                      icon={
                        <RightOutlined
                          style={{ color: "white", fontSize: "32px" }}
                        />
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
                          {postInfo.user_name}
                        </span>
                        <span style={{ color: "#999999" }}>
                          {postInfo.modifiedAt}
                        </span>
                      </Space>
                    </Space>
                    <Space className="select-category">
                      <Form.Item
                        initialValue={postInfo.category_name}
                        name="categoryId"
                        rules={[
                          {
                            required: true,
                            message: "카테고리를 선택해주세요!",
                          },
                        ]}
                      >
                        <Select
                          initialValue="카테고리 선택"
                          style={{
                            width: 120,
                          }}
                          // onChange={handleChange}
                          options={[
                            {
                              value: "1",
                              label: "오운완",
                            },
                            {
                              value: "2",
                              label: "자세 피드백",
                            },
                            {
                              value: "3",
                              label: "운동 Q&A",
                            },
                          ]}
                        />
                      </Form.Item>
                    </Space>
                  </Col>
                  <Col span={24} className="content-body">
                    <Form.Item
                      name="post_content"
                      initialValue={postInfo.post_content}
                    >
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
                        value={postInfo.post_content}
                      />
                    </Form.Item>
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
                      // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                      listType="picture-card"
                      multiple={true}
                      fileList={fileList}
                      onPreview={handlePreview}
                      onChange={onUploadChange}
                      onRemove={handleRemove}
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
                        alt=""
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
          </Form>
        </Modal>
      )}
    </>
  );
};

export default PostUpdateModal;
