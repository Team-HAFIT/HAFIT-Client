import { useState } from "react";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { Button } from "antd";

function LikeButton() {
  const [likes, setLikes] = useState(10);
  const [isLiked, setIsLiked] = useState(false);

  const handleLikeClick = () => {
    if (!isLiked) {
      setLikes(likes + 1);
    } else {
      setLikes(likes - 1);
    }
    setIsLiked(!isLiked);
  };

  return (
    <Button
      shape="round"
      onClick={handleLikeClick}
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
          <HeartFilled style={{ fontSize: "1.8em", color: "#6C00F0" }} />
        ) : (
          <HeartOutlined style={{ fontSize: "1.8em", color: "#999999" }} />
        )
      }
    >
      <span style={{ fontSize: "16px", fontWeight: "500", color: "#999999" }}>{likes}</span>
    </Button>
  );
}

export default LikeButton;
