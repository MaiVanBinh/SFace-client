import * as actionsType from './actionTypes';

import axios from '../../axiosInstance';

export const fetchPersons = (token) => {
  return (dispatch) => {
    let config = {
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
    };
    axios
      .get('/auth/persons', config)
      .then((res) => {
        dispatch({
          payload: res.data.data,
          type: actionsType.GET_PERSONS
        });
      })
      .catch((e) => {
        console.log(e.response);
      });
  };
};

export const createPerson = (token, data) => {
  return (dispatch) => {
    let config = {
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
    };
    axios
      .post('/auth/persons', data, config)
      .then((res) => {
        // dispatch({
        //   payload: res.data,
        //   type: actionsType.CREATE_PERSON
        // });
        console.log(res.data);
      })
      .catch((e) => {
        console.log(e.response);
      });
  };
};

export const deletePerson = (token, data) => {
  return (dispatch) => {
    let config = {
      data: data,
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
    };
    axios
      .delete('/auth/persons', config)
      .then((res) => {
        console.log(res.data);
        // dispatch({
        //   payload: res.data,
        //   type: actionsType.CREATE_PERSON
        // });
      })
      .catch((e) => {
        console.log(e.response);
      });
  };
};

export const registerFace = (token, payload) => {
  return (dispatch) => {
    let config = {
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
    };
    axios
      .post('/auth/person/register-face', payload, config)
      .then((res) => {
        console.log(res.data);
      })
      .catch((e) => {
        console.log(e.response);
      });
  };
};
