import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import {
  GET_PROPOSAL,
  GET_PROPOSALS,
  UPLOAD_PROPOSAL_PHOTOS,
  PROPOSAL_ERROR,
  SET_PROPOSAL_LOADING,
  REMOVE_PROPOSAL_PHOTOS,
  DELETE_PROPOSAL
} from './types';
import { setAlert } from './alert';

// Get current user proposals
export const getCurrentUserProposals = () => async dispatch => {
  dispatch(setProposalLoading());

  try {
    const res = await axios.get('/api/proposals/mine');

    dispatch({
      type: GET_PROPOSALS,
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

// Get proposal by id
export const getProposalById = id => async dispatch => {
  dispatch(setProposalLoading());

  try {
    const res = await axios.get(`/api/proposals/${id}`);

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

// Create proposal
export const createProposal = (formData, files, history) => async dispatch => {
  dispatch(setProposalLoading());

  try {
    let proposalPhotos = await uploadProposalPhotos(files);

    let dataToPost = formData;
    dataToPost.proposalPhotos = proposalPhotos;

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const res = await axios.post('/api/proposals', dataToPost, config);

    dispatch({
      type: GET_PROPOSAL,
      payload: res.data
    });

    history.push('/my-proposals');
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
export const uploadProposalPhotos = async files => {
  let proposalPhotos = [];

  const url = 'https://api.cloudinary.com/v1_1/dax1o7jk6/image/upload';
  const preset = 'yxjpaicn';

  try {
    // need "for" loop for async, "forEach" won't work - it's sync
    for (const file of files) {
      // default x-auth-token header not allowed by cloudinary
      const instance = axios.create();
      delete instance.defaults.headers.common['x-auth-token'];

      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', preset);

      let res = await instance.post(url, formData);
      const { public_id, secure_url } = res.data;

      const proposalPhoto = {
        photoID: public_id,
        photoURL: secure_url
      };

      proposalPhotos.push(proposalPhoto);
    }
  } catch (err) {
    console.error(err);
  }

  return proposalPhotos;
};

// Add proposal photos
export const addProposalPhotos = files => dispatch => {
  if (files.length > 10) {
    dispatch(setAlert('Возможно загрузить не более 10 фотографий', 'danger'));
  }

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

// Update proposal
export const updateProposal = (
  id,
  formData,
  files,
  photosToDestroy,
  history
) => async dispatch => {
  dispatch(setProposalLoading());

  try {
    let photosToAdd = await uploadProposalPhotos(files);

    let dataToPost = formData;
    dataToPost.photosToAdd = photosToAdd;
    dataToPost.photosToDestroy = photosToDestroy;

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const res = await axios.put(`/api/proposals/${id}`, dataToPost, config);

    dispatch({
      type: GET_PROPOSAL,
      payload: res.data
    });

    history.push('/my-proposals');
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

// Delete proposal
export const deleteProposal = (id, history) => async dispatch => {
  dispatch(setProposalLoading());

  try {
    await axios.delete(`/api/proposals/${id}`);

    dispatch({
      type: DELETE_PROPOSAL
    });

    dispatch(setAlert('Ваше предложение было удалено'));

    history.push('/my-proposals');
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

// Set proposal loading
export const setProposalLoading = () => dispatch => {
  dispatch({
    type: SET_PROPOSAL_LOADING
  });
};
