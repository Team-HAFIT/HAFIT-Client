import axios from "axios";

const api = axios.create({
  // 기본적으로 호출되는 API URL을 지정합니다.
  baseURL: "http://localhost:3000",
  timeout: 10000,
  withCredentials: true,
});

export const loginUser = async (credentials) => {
  try {
    const res = await api.post("/login", credentials);

    if (parseInt(Number(res.status) / 100) === 2) {
      return {
        status: res.status,
        json: res.data,
      };
    } else {
      return {
        status: false,
        json: { error: ["로그인에 실패했습니다"] },
      };
    }
  } catch (err) {
    console.error(err);
    return {
      status: false,
      json: { error: ["서버와 연결이 끊겼습니다. 잠시 후 다시 시도해 주세요"] },
    };
  }
};

export const logoutUser = async (credentials, accessToken) => {
  try {
    const res = await api.post("/logout-url", credentials);

    if (parseInt(Number(res.status) / 100) === 2) {
      return {
        status: res.status,
        json: res.data,
      };
    } else {
      return {
        status: false,
        json: { error: ["로그아웃에 실패했습니다"] },
      };
    }
  } catch (err) {
    console.error(err);
    return {
      status: false,
      json: {
        error: ["서버와 연결이 끊겼습니다. 잠시 후 다시 시도해 주세요"],
      },
    };
  }
};

export const requestToken = async (refreshToken) => {
  try {
    const res = await api.post("/login", { refresh_token: refreshToken });

    if (parseInt(Number(res.status) / 100) === 2) {
      return {
        status: res.status,
        json: res.data,
      };
    } else {
      return {
        status: false,
        json: { error: ["토큰 갱신에 실패했습니다"] },
      };
    }
  } catch (err) {
    console.error(err);
    return {
      status: false,
      json: { error: ["서버와 연결이 끊겼습니다. 잠시 후 다시 시도해 주세요"] },
    };
  }
};

// const TIME_OUT = 300 * 1000;

// const statusError = {
//   status: false,
//   json: {
//     error: ["연결이 원활하지 않습니다. 잠시 후 다시 시도해 주세요"],
//   },
// };

// const requestPromise = (url, option) => {
//   return fetch(url, option);
// };

// const timeoutPromise = () => {
//   return new Promise((_, reject) =>
//     setTimeout(() => reject(new Error("timeout")), TIME_OUT)
//   );
// };

// const getPromise = async (url, option) => {
//   return await Promise.race([requestPromise(url, option), timeoutPromise()]);
// };

// export const loginUser = async (credentials) => {
//   const option = {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(credentials),
//   };

//   const data = await getPromise("/login", option).catch(() => {
//     return statusError;
//   });

//   if (parseInt(Number(data.status) / 100) === 2) {
//     const status = data.ok;
//     const code = data.status;
//     const text = await data.text();
//     const json = text.length ? JSON.parse(text) : "";

//     return {
//       status,
//       code,
//       json,
//     };
//   } else {
//     return statusError;
//   }
// };

// export const logoutUser = async (credentials, accessToken) => {
//   const option = {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(credentials),
//   };

//   const data = await getPromise("/logout-url", option).catch(() => {
//     return statusError;
//   });

//   if (parseInt(Number(data.status) / 100) === 2) {
//     const status = data.ok;
//     const code = data.status;
//     const text = await data.text();
//     const json = text.length ? JSON.parse(text) : "";

//     return {
//       status,
//       code,
//       json,
//     };
//   } else {
//     return statusError;
//   }
// };

// export const requestToken = async (refreshToken) => {
//   const option = {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ refresh_token: refreshToken }),
//   };

//   const data = await getPromise("/login", option).catch(() => {
//     return statusError;
//   });

//   if (parseInt(Number(data.status) / 100) === 2) {
//     const status = data.ok;
//     const code = data.status;
//     const text = await data.text();
//     const json = text.length ? JSON.parse(text) : "";

//     return {
//       status,
//       code,
//       json,
//     };
//   } else {
//     return statusError;
//   }
// };
