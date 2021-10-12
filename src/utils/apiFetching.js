import axios from '../axiosInstance';

const ApiFetching = () => {
  // -------------------------
  // FACES
  // -------------------------

  const getFaces = (callback) => {
    axios.get('/auth/faces').then((res) => {
      if (res.data && res.data.data && res.data.data.list) {
        callback(res.data.data);
      }
    });
  };

  // -------------------------
  // PERSONS
  // -------------------------

  const getPersons = (callback) => {
    axios
      .get('/auth/persons')
      .then((res) => {
        callback(res.data.data);
      })
      .catch((e) => {
        console.log(e.response);
      });
  };

  const createPersons = (data, callback) => {
    axios.post('/auth/persons', data).then((res) => {
      callback(res.data.data);
    });
  };

  const deletePersons = (id, callback) => {
    axios.delete('/auth/persons/' + id).then(() => {
      callback();
    });
  };

  const registerFace = (data, uid, callback) => {
    axios
      .post('/auth/persons/' + uid + '/face', data)
      .then((res) => {
        console.log(res.data);
        callback();
      })
      .catch((e) => {
        console.log(e.response);
      });
  };
  return {
    getFaces,
    getPersons,
    createPersons,
    deletePersons,
    registerFace
  };
};

export default ApiFetching;
