import axios from 'axios';

const instance = axios.create({
  baseURL: `http://167.172.71.75:5000/v1/`
});

export default instance;
