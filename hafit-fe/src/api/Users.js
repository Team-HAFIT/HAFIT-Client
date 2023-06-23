const TIME_OUT = 300 * 1000;

const statusError = {
  status: false,
  json: {
    error: ["연결이 원활하지 않습니다. 잠시 후 다시 시도해 주세요"],
  },
};

const requestPromise = (url, option) => {
  return fetch(url, option);
};

const timeoutPromise = () => {
  return new Promise((_, reject) =>
    setTimeout(() => reject(new Error("timeout")), TIME_OUT)
  );
};

const getPromise = async (url, option) => {
  return await Promise.race([requestPromise(url, option), timeoutPromise()]);
};

export const loginUser = async (credentials) => {
  const option = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  };

  const data = await getPromise("/api/login", option).catch(() => {
    return statusError;
  });

  if (parseInt(Number(data.status) / 100) === 2) {
    const status = data.ok;
    const code = data.status;
    const text = await data.text();
    const json = text.length ? JSON.parse(text) : "";

    // 서버에서 받은 accessToken, refreshToken을 추출
    const accessToken = data.headers.get("authorization");
    // const refreshToken = data.headers.get("authorization-refresh");

    // ::TEST:: data.headers가 갖고있는 모든 값 출력
    // for (const [key, value] of data.headers.entries()) {
    //   console.log(key + ': ' + value);
    // }
    // alert("");

    return {
      status,
      code,
      json,
      accessToken,
      // refreshToken,
    };
  } else {
    return statusError;
  }
};

export const logoutUser = async (refreshToken, accessToken) => {
  const option = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "authorization": `Bearer ${accessToken}`,
      "authorization-refresh": `Bearer ${refreshToken}`,
    },
    // body: JSON.stringify(credentials),
  };

  const data = await getPromise("/api/logout", option).catch(() => {
    return statusError;
  });

  if (parseInt(Number(data.status) / 100) === 2) {
    const status = data.ok;
    const code = data.status;
    const text = await data.text();
    const json = text.length ? JSON.parse(text) : "";

    return {
      status,
      code,
      json,
    };
  } else {
    return statusError;
  }
};

export const requestToken = async (refreshToken) => {
  const option = {
    method: "POST",
    headers: {
      "Content-Type": "text/plain",
      // "Authorization-refresh": `Bearer ${refreshToken}`,
    },
    body: `Bearer ${refreshToken}`,
  };

  const data = await getPromise("/api/auth/refresh", option).catch(() => {
    return statusError;
  });

  if (parseInt(Number(data.status) / 100) === 2) {
    const status = data.ok;
    const code = data.status;
    const text = await data.text();
    const json = text.length ? JSON.parse(text) : "";
    
    // console.log("requestToken", data.json());

    // 서버에서 받은 accessToken, refreshToken을 추출
    const accessToken = data.headers.get("authorization");
    // const refreshToken = data.headers.get("authorization-refresh");

    // const accessToken = data.json.authorization;
    // const refreshToken = data.json['authorization-refresh'];

    return {
      status,
      code,
      json,
      accessToken,
      // refreshToken,
    };
  } else {
    return statusError;
  }
};
