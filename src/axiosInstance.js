import axios from 'axios';

const instance = axios.create({
  baseURL: `https://vdc-dev.gemiso.com/sface/v1`,
  // baseURL: `http://127.0.0.1:5000/v1`
});

export default instance;
