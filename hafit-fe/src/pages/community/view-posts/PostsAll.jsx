import { CommentOutlined } from "@ant-design/icons";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import {
  theme,
  Avatar,
  List,
  Divider,
  Button,
  message,
  Empty,
  Menu,
  Dropdown,
  Modal,
} from "antd";
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

import { useSelector } from "react-redux";
// import jwt_decode from "jwt-decode";

import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation, Pagination } from "swiper";

// Import Swiper styles
import "swiper/swiper-bundle.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import "../../../styles/pages/community/viewPostsAll.css";

import PostUpdateModal from "../modal/PostUpdateModal";
import LikeButton from "../../../components/buttons/LikeBtn";

SwiperCore.use([Navigation, Pagination]);

const ContainerHeight = 1200;

const PostsAll = () => {
  const accessToken = useSelector((state) => state.authToken.accessToken);

  const [modalVisible, setModalVisible] = useState(false); // 모달 표시 여부 상태값
  const [selectedPostId, setSelectedPostId] = useState(null); // 선택한 게시글 id

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([
    // {
    //   category_name: "오운완",
    //   comment_count: 2,
    //   createdAt: "2023-06-18 16:43:18.269857",
    //   files: [
    //     {
    //       file_name:
    //         "https://feedback-file-bucket.s3.ap-northeast-2.amazonaws.com/static/posts/d2b359aa-4a8e-483d-aaf8-2e146abc4d2d.9fe11359-2e4f-4b24-8d27-d972509a1a62",
    //     },
    //   ],
    //   modifiedAt: "2023-06-18 16:43:18.269857",
    //   postId: 0,
    //   post_content:
    //     "동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리 나라 만세~~~",
    //   post_totalLikes: 7,
    //   user_name: "해핏",
    // },
  ]);
  const [fileType, setFileType] = useState("");
  const [lastPostId, setLastPostId] = useState(999999);
  const size = 10; // 한 번에 불러올 게시글 개수

  const [reachedEnd, setReachedEnd] = useState(false); // 게시글 끝까지 불러왔는지 여부

  // 게시글 삭제
  const handleDelete = () => {
    Modal.confirm({
      title: "게시글을 삭제하시겠어요?",
      onOk: () => {
        axios
          .delete(`/api/posts/${selectedPostId}`, {
            headers: {
              "Content-Type": "application/json", // 요청 헤더에 Content-Type 설정
              authorization: `Bearer ${accessToken}`,
            },
            timeout: 5000, // 요청 제한 시간 설정
          })
          .then(() => {
            message.success("게시글이 삭제되었습니다", 1);
            window.location.reload();
          })
          .catch((error) => {
            console.error(error);
          });
      },
      onCancel: () => {
        console.log("게시글 삭제를 취소하셨습니다! ˙ᵕ˙");
      },
    });
  };

  const menu = (
    <Menu>
      <Menu.Item
        key="post-update"
        onClick={() => {
          setModalVisible(true);
        }}
      >
        수정
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item
        key="post-delete"
        onClick={handleDelete}
        style={{ color: "red" }}
      >
        삭제
      </Menu.Item>
    </Menu>
  );

  // --------- START : 게시글 정보 관련 ---------- //
  const getPosts = useCallback(() => {
    if (loading || reachedEnd) {
      return;
    }
    setLoading(true);

    axios
      .get("/api/posts", {
        params: {
          lastPostId: lastPostId,
          size: size,
        },
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${accessToken}`,
        },
        timeout: 10000,
      })
      .then((response) => {
        setData((prevData) => prevData.concat(response.data));

        // for (let i = 0; i < response.data.length; i++) {
        //   for (let j = 0; j < response.data[i].files.length; j++) {
        //     const fileUrl = response.data[i].files[j].file_name;

        //     // 파일명에서 마지막 점(.)의 인덱스 찾기.
        //     const lastDotIndex = fileUrl.lastIndexOf(".");
        //     // 파일명에서 마지막 점(.) 다음부터 끝까지의 부분 문자열을 추출
        //     const fileExtension = fileUrl.substring(lastDotIndex + 1);
        //     console.log(fileExtension);
        //     setFileType(fileExtension);
        //   }
        // }

        // 마지막 게시글 postId 업데이트
        if (response.data.length > 0) {
          setLastPostId(response.data[response.data.length - 1].postId);
        } else {
          setReachedEnd(true); // 마지막 게시글에 도달
        }
      })
      .catch((error) => {
        console.log(error);
        message.error("게시글을 불러오지 못했습니다", 1);
        // 네트워크 오류로 인해 게시글을 불러오지 못했을 때, 임시 렌더링
        setData([
          {
            category_name: "오운완",
            comment_count: 2,
            createdAt: "2023-06-18 16:43:18.269857",
            files: [
              // {
              //   file_name:
              //     "https://images.unsplash.com/photo-1684695414418-b76c47bfb731?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
              // },
              {
                file_name:
                  "https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png",
              },
              {
                file_name:
                  "https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png",
              },
              // {
              //   file_name: "https://images.unsplash.com/photo-1684695414418-b76c47bfb731?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
              // },
              // {
              //   file_name:
              //     "https://images.unsplash.com/photo-1684695414418-b76c47bfb731?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
              // },
            ],
            modifiedAt: "2023-06-18 16:43:18.269857",
            postId: 0,
            post_content:
              "네트워크 오류로 인해 게시글을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.",
            post_totalLikes: 7,
            user_name: "해핏",
          },
        ]);
      })
      .finally(() => {
        setLoading(false);
        console.log("마지막 포스트 id " + lastPostId);
      });
  }, [accessToken, lastPostId, loading, reachedEnd, size]);

  useEffect(() => {
    getPosts();
  }, []);

  const renderImagesByPost = (post) => {
    if (!post?.files || post.files.length === 0) {
      return null;
    }

    const filesInfo = post.files.map((file) => {
      const extension = file.file_name.split(".").pop().toLowerCase(); // 파일 확장자 추출
      const isImage = /^jpe?g|png|gif$/.test(extension); // 이미지 파일인지 확인
      return { url: file.file_name, extension, isImage };
    });

    if (filesInfo.length === 1) {
      const { url, extension, isImage } = filesInfo[0];

      if (isImage) {
        return (
          <img className="post-image-only" width={272} alt="logo" src={url} />
        );
      } else {
        return (
          <video className="post-image-only" width={272} controls>
            <source src={url} type={`video/${extension}`} />
          </video>
        );
      }
    } else if (filesInfo.length === 2) {
      const fileInfo1 = filesInfo[0];
      const fileInfo2 = filesInfo[1];

      if (fileInfo1.isImage && fileInfo2.isImage) {
        // 이미지, 이미지
        return (
          <>
            <img
              className="post-image"
              width={272}
              alt="logo"
              src={fileInfo1.url}
            />
            <img
              className="post-image"
              width={272}
              alt="logo"
              src={fileInfo2.url}
            />
          </>
        );
      } else if (fileInfo1.isImage && !fileInfo2.isImage) {
        // 이미지, 비디오
        return (
          <>
            <img
              className="post-image"
              width={272}
              alt="logo"
              src={fileInfo1.url}
            />
            <video className="post-image" width={272} controls>
              <source
                src={fileInfo2.url}
                type={`video/${fileInfo2.extension}`}
              />
            </video>
          </>
        );
      } else if (!fileInfo1.isImage && fileInfo2.isImage) {
        // 비디오, 이미지
        return (
          <>
            <video className="post-image" width={272} controls>
              <source
                src={fileInfo1.url}
                type={`video/${fileInfo1.extension}`}
              />
            </video>
            <img
              className="post-image"
              width={272}
              alt="logo"
              src={fileInfo2.url}
            />
          </>
        );
      } else {
        // 비디오, 비디오
        return (
          <>
            <video className="post-image" width={272} controls>
              <source
                src={fileInfo1.url}
                type={`video/${fileInfo1.extension}`}
              />
            </video>
            <video className="post-image" width={272} controls>
              <source
                src={fileInfo2.url}
                type={`video/${fileInfo2.extension}`}
              />
            </video>
          </>
        );
      }
    } else {
      // 3개 이상의 파일이 있는 경우
      return (
        <Swiper
          slidesPerView={2}
          spaceBetween={30}
          navigation={{ clickable: true }}
          pagination={{ clickable: true }}
          className="mySwiper"
        >
          {filesInfo.map((fileInfo, index) => (
            <SwiperSlide key={index}>
              {fileInfo.isImage ? (
                // 이미지인 경우
                <img width={272} alt="slide" src={fileInfo.url} />
              ) : (
                // 비디오인 경우
                <video className="post-image" width={272} controls>
                  <source
                    src={fileInfo.url}
                    type={`video/${fileInfo.extension}`}
                  />
                </video>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      );
    }
  };

  // --------- END : 게시글 정보 관련 ---------- //

  //   --------- START : 게시글 무한 스크롤 ---------- //

  // 이전 방식 : 요소의 높이를 고정값으로 설정 -> 해당 요소가 스크롤 가능한 경우에만 동작
  // const onScroll = (e) => {
  //   if (
  //     e.currentTarget.scrollHeight - e.currentTarget.scrollTop ===
  //     ContainerHeight
  //   ) {
  //     getPosts();
  //   }
  // };

  // scrollableDiv의 바닥에 닿았을 때 동작
  // const onScroll = useCallback(() => {
  //   const element = document.getElementById("scrollableDiv");
  //   if (element) {
  //     const isScrolledToBottom =
  //       element.scrollHeight - element.scrollTop === element.clientHeight;
  //     if (isScrolledToBottom) {
  //       getPosts();
  //     }
  //   }
  // }, [getPosts]);

  // 현재 방식 : 문서 전체를 대상으로 동작하도록 유연하게 변경
  const onScroll = useCallback(() => {
    const SCROLLED_HEIGHT = window.scrollY;
    const WINDOW_HEIGHT = window.innerHeight;
    const DOC_TOTAL_HEIGHT = document.body.offsetHeight;
    const IS_BOTTOM = WINDOW_HEIGHT + SCROLLED_HEIGHT === DOC_TOTAL_HEIGHT;

    if (IS_BOTTOM) {
      getPosts();
    }
  }, [getPosts]);

  useEffect(() => {
    const element = document.getElementById("scrollableDiv");
    if (element) {
      element.addEventListener("scroll", onScroll);
    }
    return () => {
      if (element) {
        element.removeEventListener("scroll", onScroll);
      }
    };
  }, [onScroll]);
  //   --------- END : 게시글 무한 스크롤 ---------- //

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <div
      id="scrollableDiv"
      style={{
        padding: 24,
        textAlign: "center",
        background: "#e7e7e7",
        borderRadius: "12px",
        maxHeight: "100vh",
        minHeight: "280px",
        overflow: "auto",
      }}
    >
      {/* 게시글 무한 스크롤 */}
      {data.length ? (
        <List
          dataSource={data}
          height={ContainerHeight}
          itemHeight={47}
          itemKey="data.post"
          onScroll={onScroll}
        >
          {data.map((post) => (
            <div
              style={{
                background: colorBgContainer,
                marginBottom: "8px",
                borderRadius: "8px",
                padding: "8px 8px 24px 8px",
                minHeight: "12rem",
              }}
              key={post.postId} // 게시글 고유 id를 key로 사용
            >
              <div style={{ display: "block", margin: "0 24px" }}>
                <div>
                  <List.Item key={post.postId} style={{ paddingBottom: "4px" }}>
                    <div style={{ display: "flex" }}>
                      <Avatar
                        size={56}
                        src="#"
                        // style={{ width: "48px", height: "48px" }}
                        style={{
                          display: "flex",
                          textAlign: "left",
                          marginRight: "8px",
                        }}
                      />
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-evenly",
                        }}
                      >
                        <span
                          style={{
                            display: "flex",
                            fontSize: "15px",
                            fontWeight: "650",
                          }}
                        >
                          {post.user_name}
                        </span>
                        <span
                          style={{
                            display: "flex",
                            fontSize: "14px",
                            color: "rgba(0, 0, 0, 0.45)",
                          }}
                        >
                          {post.modifiedAt}
                        </span>
                      </div>
                    </div>
                    <Menu>
                      <Menu.Item>
                        <Dropdown
                          overlay={menu}
                          trigger={["click"]}
                          onVisibleChange={(visible) => {
                            if (visible) {
                              setSelectedPostId(post.postId); // 선택한 게시글 id 업데이트
                            }
                          }}
                        >
                          <HiOutlineDotsHorizontal
                            style={{
                              fontSize: "28px",
                              color: "#999999",
                              alignSelf: "self-start",
                            }}
                          />
                        </Dropdown>
                      </Menu.Item>
                    </Menu>
                  </List.Item>
                </div>
                <Divider style={{ margin: "0 0 16px 0" }} />
                <p className="post-content-p">
                  <span className="post-content-text">{post.post_content}</span>
                </p>

                <div>
                  <article className="image-container">
                    {renderImagesByPost(post)}
                  </article>
                </div>

                <div
                  style={{
                    display: "flex",
                    textAlign: "left",
                    marginTop: "12px",
                  }}
                >
                  <div style={{ marginRight: "16px" }}>
                    <LikeButton
                      postId={post.postId}
                      likes={post.comment_count}
                      isLike={post.post_likedByUser}
                    />
                  </div>

                  <Button
                    shape="round"
                    style={{
                      height: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: "4px 12px",
                    }}
                    icon={
                      <CommentOutlined
                        style={{
                          fontSize: "1.8em",
                          color: "#999999",
                        }}
                      />
                    }
                  >
                    <span
                      style={{
                        fontSize: "16px",
                        fontWeight: "500",
                        color: "#999999",
                      }}
                    >
                      2
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {/* 게시글 수정 모달 */}
          <PostUpdateModal
            visible={modalVisible}
            setModalVisible={setModalVisible}
            postId={selectedPostId}
          />
        </List>
      ) : (
        <Empty description="첫 게시글의 주인공이 되어보세요!" />
      )}
      {reachedEnd && (
        <Divider plain style={{ fontSize: "15px" }}>
          게시글의 끝에 도달하셨습니다 🎉
        </Divider>
      )}
    </div>
  );
};

export default PostsAll;
