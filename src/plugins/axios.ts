import Axios from "axios";

const axios = Axios.create({
  timeout: 10000,
});

export default axios;
