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

  const getPersons = (page, perPage, callback) => {
    const params = new URLSearchParams({
      page: page + 1,
      per_page: perPage
    }).toString();

    axios
      .get('/auth/persons?' + params, )
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
        console.log();
        callback(res.data.data);
      })
      .catch((e) => {
        console.log(e.response);
      });
  };

  const recFaces = (data, callback) => {
    axios
      .post('/auth/models/recognize', data)
      .then((res) => {
        callback(res.data);
      })
      .catch((e) => {
        console.log(e.response);
      });
  }

  const deleteFaceById = (id, callback) => {
    axios.delete('/auth/faces/' + id)
    .then(() => {
      callback();
    })
    .catch((e) => {
      console.log(e.response);
    });
  }

  const reTrain = () => {
    axios.get('/auth/models/re-train');
  }

  const checkStatusTrain = async (callback) => {
    const res = await axios.get('/auth/models/status');
    return res.data.data;
  }
  return {
    getFaces,
    getPersons,
    createPersons,
    deletePersons,
    registerFace,
    recFaces,
    deleteFaceById,
    reTrain,
    checkStatusTrain
  };
};

export default ApiFetching;
