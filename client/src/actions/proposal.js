import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import {
  GET_PROPOSAL,
  UPLOAD_PROPOSAL_PHOTOS,
  PROPOSAL_ERROR,
  SET_PROPOSAL_LOADING,
  REMOVE_PROPOSAL_PHOTOS
} from './types';
import { setAlert } from './alert';

// Get proposal

// Create proposal
export const createProposal = formData => async dispatch => {
  dispatch(setProposalLoading());

  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  try {
    const res = await axios.post('/api/proposals', formData, config);

    dispatch({
      type: GET_PROPOSAL,
      payload: res.data
    });
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: PROPOSAL_ERROR
    });
  }
};

// Upload proposal photos
// export const uploadProposalPhotos = files => async dispatch => {
//   if (files.length > 10) {
//     dispatch(setAlert('Возможно загрузить не более 10 фотографий', 'danger'));
//   }

//   dispatch(setProposalLoading());

//   let proposalPhotos = [];

//   const url = 'https://api.cloudinary.com/v1_1/dax1o7jk6/image/upload';
//   const preset = 'yxjpaicn';

//   try {
//     files.forEach(file => {
//       // default x-auth-token header not allowed by cloudinary
//       const instance = axios.create();
//       delete instance.defaults.headers.common['x-auth-token'];

//       const formData = new FormData();
//       formData.append('file', file);
//       formData.append('upload_preset', preset);

//       const res = instance.post(url, formData);
//       const { public_id, secure_url } = res.data;

//       const proposalPhoto = {
//         photoID: public_id,
//         photoURL: secure_url
//       };

//       proposalPhotos.push(proposalPhoto);
//     });

//     const config = {
//       headers: {
//         'Content-Type': 'application/json'
//       }
//     };

//     const body = JSON.stringify({ proposalPhotos });

//     const res = await axios.post('/api/proposals', body, config);

//     dispatch({
//       type: GET_PROPOSAL,
//       payload: res.data
//     });
//   } catch (err) {
//     const errors = err.response.data.errors;

//     if (errors) {
//       errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
//     }

//     dispatch({
//       type: PROPOSAL_ERROR
//     });
//   }
// };

// Add proposal photos
export const addProposalPhotos = files => dispatch => {
  const proposalPhotos = [];

  files.forEach(file => {
    const id = uuidv4();
    const url = URL.createObjectURL(file);

    const proposalPhoto = {
      photoID: id,
      photoURL: url
    };

    proposalPhotos.push(proposalPhoto);
  });

  dispatch({
    type: UPLOAD_PROPOSAL_PHOTOS,
    payload: proposalPhotos
  });
};

// Remove proposal photo
export const removeProposalPhoto = id => dispatch => {
  dispatch(setProposalLoading());

  dispatch({
    type: REMOVE_PROPOSAL_PHOTOS,
    payload: id
  });
};

// Set proposal loading
export const setProposalLoading = () => dispatch => {
  dispatch({
    type: SET_PROPOSAL_LOADING
  });
};
