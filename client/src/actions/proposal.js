import axios from 'axios';
import {
  GET_PROPOSAL,
  GET_PROPOSALS,
  PROPOSAL_ERROR,
  SET_PROPOSAL_LOADING,
  DELETE_PROPOSAL
  // SEARCH_ERROR,
  // GET_SEARCH
} from './types';
import { setAlert } from './alert';
import { CLOUDINARY_URL, CLOUDINARY_PRESET } from './consts';

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

// Get proposals by parameters
export const getProposalsByParameters = (
  formData,
  address,
  history,
  needLogin = false
) => async dispatch => {
  // const {
  //   dealType,
  //   priceFrom,
  //   priceTo,
  //   houseYearFrom,
  //   houseYearTo,
  //   panel,
  //   block,
  //   brick,
  //   monolithic,
  //   floorsFrom,
  //   floorsTo,
  //   elevator,
  //   floorFrom,
  //   floorTo,
  //   exceptLast,
  //   roomsNumberFrom,
  //   roomsNumberTo,
  //   totalAreaFrom,
  //   totalAreaTo,
  //   livingAreaFrom,
  //   livingAreaTo,
  //   kitchenAreaFrom,
  //   kitchenAreaTo,
  //   balcony,
  //   windows,
  //   cooker,
  //   bathroom,
  //   searchName
  // } = formData;

  // const {
  //   province,
  //   locality,
  //   metroDuration,
  //   pedestrian,
  //   addressDistricts,
  //   addressRoutes,
  //   addressMetros
  // } = address;

  // console.log('in getByParameters');

  const params = new URLSearchParams();
  for (let item in formData) {
    params.set(item.toString(), formData[item]);
  }

  for (let item in address) {
    const key = item.toString();
    const val = address[item];

    if (Array.isArray(val)) {
      // console.log(val);
      if (val.length > 0) {
        // params.set(key, val[0]);
        for (let i = 0; i < val.length; i++) {
          params.append(key, val[i]);
        }
      } else {
        params.set(key, []);
      }
    } else {
      params.set(key, val);
    }
  }

  try {
    const res = await axios.get('/api/proposals/search', {
      params: params
    });

    dispatch({
      type: GET_PROPOSALS,
      payload: res.data
    });

    if (!needLogin) {
      history.push('/proposals');
    } else {
      history.push('/login');
    }
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
export const createProposal = (
  formData,
  address,
  files,
  history
) => async dispatch => {
  dispatch(setProposalLoading());

  try {
    let proposal = formData;
    proposal.address = address;

    let proposalPhotos = await uploadProposalPhotos(files);

    proposal.proposalPhotos = proposalPhotos;

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const res = await axios.post('/api/proposals', proposal, config);

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

// Update proposal
export const updateProposal = (
  id,
  formData,
  address,
  files,
  photosToDestroy,
  history
) => async dispatch => {
  dispatch(setProposalLoading());

  try {
    let photosToAdd = await uploadProposalPhotos(files);

    let dataToPost = formData;
    dataToPost.address = address;
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

// Upload proposal photos
export const uploadProposalPhotos = async files => {
  let proposalPhotos = [];

  try {
    // need "for" loop for async, "forEach" won't work - it's sync
    for (const file of files) {
      // default x-auth-token header not allowed by cloudinary
      const instance = axios.create();
      delete instance.defaults.headers.common['x-auth-token'];

      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_PRESET);

      let res = await instance.post(CLOUDINARY_URL, formData);
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
