import React from "react";
import { Input } from "antd";

const PhoneNumberInput = (props) => {
  const getPhoneMask = (phoneNumber) => {
    if (!phoneNumber) return phoneNumber;

    phoneNumber = phoneNumber.replace(/[^0-9]/g, "");
    let res = ""; 

    if (phoneNumber.length < 3) {
      res = phoneNumber;
    } else {
      if (phoneNumber.substr(0, 2) === "02") {
        if (phoneNumber.length <= 5) {
          res = `${phoneNumber.substr(0, 2)}-${phoneNumber.substr(2, 3)}`;
        } else if (phoneNumber.length > 5 && phoneNumber.length <= 9) {
          res = `${phoneNumber.substr(0, 2)}-${phoneNumber.substr(
            2,
            3
          )}-${phoneNumber.substr(5)}`;
        } else if (phoneNumber.length > 9) {
          res = `${phoneNumber.substr(0, 2)}-${phoneNumber.substr(
            2,
            4
          )}-${phoneNumber.substr(6)}`;
        }
      } else {
        if (phoneNumber.length < 8) {
          res = phoneNumber;
        } else if (phoneNumber.length === 8) {
          res = `${phoneNumber.substr(0, 4)}-${phoneNumber.substr(4)}`;
        } else if (phoneNumber.length === 9) {
          res = `${phoneNumber.substr(0, 3)}-${phoneNumber.substr(
            3,
            3
          )}-${phoneNumber.substr(6)}`;
        } else if (phoneNumber.length === 10) {
          res = `${phoneNumber.substr(0, 3)}-${phoneNumber.substr(
            3,
            3
          )}-${phoneNumber.substr(6)}`;
        } else if (phoneNumber.length > 10) {
          res = `${phoneNumber.substr(0, 3)}-${phoneNumber.substr(
            3,
            4
          )}-${phoneNumber.substr(7)}`;
        }
      }
    }
    return res;
  };

  const handlePhoneChange = (e) => {
    const maskedPhone = getPhoneMask(e.target.value);
    props.onChange(maskedPhone);
  };

  return (
    <Input
      type="text"
      value={getPhoneMask(props.value)}
      onChange={handlePhoneChange}
      maxLength={13}
      placeholder="휴대폰 번호를 입력해주세요"
    />
  );
};

export default PhoneNumberInput; 
