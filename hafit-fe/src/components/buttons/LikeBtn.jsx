import { useState } from "react";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { Button } from "antd";
import { useSelector } from "react-redux";
import axios from "axios";

function LikeButton({ postId, likes, isLike }) {
  const accessToken = useSelector((state) => state.authToken.accessToken);

  const [totalLikes, setTotalLikes] = useState(likes);

  // const [likes, setLikes] = useState(10);
  const [isLiked, setIsLiked] = useState(isLike);

  const handleLike = () => {
    if (!isLiked) {
      console.log("좋아요 postId: ", postId);
      axios
        .post(`/api/posts/like/${postId}`, null, {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
          timeout: 5000,
        })
        .then((response) => {
          setTotalLikes(totalLikes + 1);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      axios
        .delete(`/api/posts/like/${postId}`, {
          headers: {
            authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          timeout: 5000,
        })
        .then((response) => {
          console.log(response);
          setTotalLikes(totalLikes - 1);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    setIsLiked(!isLiked);
  };

  // const handleLikeClick = () => {
  //   if (!isLiked) {
  //     setLikes(likes + 1);
  //   } else {
  //     setLikes(likes - 1);
  //   }
  //   setIsLiked(!isLiked);
  // };

  return (
    <Button
      shape="round"
      onClick={handleLike}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "4px 12px",
      }}
      icon={
        isLiked ? (
          <HeartFilled style={{ fontSize: "1.8em", color: "#EB4649" }} />
        ) : (
          <HeartOutlined style={{ fontSize: "1.8em", color: "#999999" }} />
        )
      }
    >
      <span style={{ fontSize: "16px", fontWeight: "500", color: "#999999" }}>
        {totalLikes}
      </span>
    </Button>
  );
}

export default LikeButton;
