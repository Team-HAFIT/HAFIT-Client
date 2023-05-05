import React, { useState, useEffect } from "react";
import { Form, Input } from "antd";

const PhoneNumberInput = () => {
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    // 전화번호 하이픈(-) 자동으로 찍기
    if (!phoneNumber) return;

    const addHyphen = (val) => {
      console.log(val, typeof val);
      if (!val) return val;

      val = val.replace(/[^0-9]/g, "");

      var res = "";
      if (val.length < 3) {
        res = val;
      } else {
        if (val.substr(0, 2) === "02") {
          if (val.length <= 5) {
            res = val.substr(0, 2) + "-" + val.substr(2, 3);
          } else if (val.length > 5 && val.length <= 9) {
            res =
              val.substr(0, 2) + "-" + val.substr(2, 3) + "-" + val.substr(5);
          } else if (val.length > 9) {
            res =
              val.substr(0, 2) + "-" + val.substr(2, 4) + "-" + val.substr(6);
          }
        } else {
          if (val.length < 8) {
            res = val;
          } else if (val.length === 8) {
            res = val.substr(0, 4) + "-" + val.substr(4);
          } else if (val.length === 9) {
            res =
              val.substr(0, 3) + "-" + val.substr(3, 3) + "-" + val.substr(6);
          } else if (val.length === 10) {
            res =
              val.substr(0, 3) + "-" + val.substr(3, 3) + "-" + val.substr(6);
          } else if (val.length > 10) {
            res =
              val.substr(0, 3) + "-" + val.substr(3, 4) + "-" + val.substr(7);
          }
        }
      }
      return res;
    };

    setPhoneNumber(addHyphen(phoneNumber));
  }, [phoneNumber]);

  return (
    <>
      <Form.Item
        label="전화번호"
        name="phoneNumber"
        valuePropName={phoneNumber}
        // initialValue
        rules={[
          {
            required: true,
            message: "전화번호를 입력해주세요",
          },
        ]}
      >
        <Input
          type="text"
          placeholder="숫자만 입력해주세요"
          maxLength={13}
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
      </Form.Item>
    </>
  );
};

export default PhoneNumberInput;
