import { Modal } from "antd";

function PostModal(props) {
  return (
    <Modal
      visible={props.visible}
      onCancel={props.onCancel}
      footer={null}
      closable={false} // 모달 오른쪽 상단 'X' 버튼 삭제
      maskClosable={false} // 모달 바깥 영역 클릭 시 모달 닫히지 않도록 설정
      width="68vw"
      style={{ top: "10vh" }}
    >
      {props.children}
    </Modal>
  );
}

export default PostModal;
