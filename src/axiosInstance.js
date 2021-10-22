import axios from 'axios';

const instance = axios.create({
  baseURL: `https://vdc-dev.gemiso.com/sface/v1`
});

export default instance;
