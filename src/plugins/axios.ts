import Axios from "axios";

const axios = Axios.create({
  timeout: 10000,
});

axios.interceptors.response.use((response) => {
  const { data } = response;
  return data;
});

export default axios;
