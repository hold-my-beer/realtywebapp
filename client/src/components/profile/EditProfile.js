import React, { Fragment, useState, useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  getProfile,
  uploadProfilePhoto,
  updateProfile
} from '../../actions/profile';
import PropTypes from 'prop-types';

import NumberFormat from 'react-number-format';
import Spinner from '../layout/Spinner';
import defaultAvatar from '../../img/defaultAvatar.png';

const EditProfile = ({
  getProfile,
  uploadProfilePhoto,
  updateProfile,
  profile: { profile, loading },
  history
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    secondName: '',
    dateOfBirth: '',
    phoneNumber: '',
    userPhoto: null
  });

  useEffect(() => {
    getProfile();

    setFormData({
      firstName: loading || !profile.firstName ? '' : profile.firstName,
      secondName: loading || !profile.secondName ? '' : profile.secondName,
      dateOfBirth:
        loading || !profile.dateOfBirth
          ? ''
          : profile.dateOfBirth.substr(0, 10),
      phoneNumber: loading || !profile.phoneNumber ? '' : profile.phoneNumber,
      userPhoto: loading || !profile.userPhoto ? null : profile.userPhoto
    });
  }, [
    getProfile,
    profile.firstName,
    profile.secondName,
    profile.dateOfBirth,
    profile.phoneNumber
    // profile.userPhoto
  ]);

  const {
    firstName,
    secondName,
    dateOfBirth,
    phoneNumber,
    userPhoto
  } = formData;

  const onUploadChange = async e => {
    const file = e.target.files[0];
    uploadProfilePhoto(file);
  };

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();

    updateProfile(formData, history);
  };

  return (
    <Fragment>
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <h1 className="text-primary my-1">Редактирование профиля</h1>
          <p className="lead">
            Обновите ваш профиль, чтобы контрагенты могли просмотреть информацию
            о вас
          </p>
          <div className="edit-profile-content">
            <div className="edit-profile-photo-group">
              <div className="edit-profile-photo my-1">
                <img src={userPhoto ? userPhoto.url : defaultAvatar} alt="" />
              </div>
              <div className="edit-profile-actions">
                <label htmlFor="profile-photo-upload" className="btn btn-light">
                  Загрузить фото
                </label>
                <button className="btn btn-danger">Удалить фото</button>
              </div>
              <input
                id="profile-photo-upload"
                type="file"
                onChange={e => onUploadChange(e)}
              />
            </div>
            <div className="edit-profile-form">
              <form onSubmit={e => onSubmit(e)}>
                <div className="form-group">
                  <label htmlFor="firstName">Имя *</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={firstName}
                    placeholder="Введите ваше имя..."
                    onChange={e => onChange(e)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="secondName">Фамилия</label>
                  <input
                    type="text"
                    id="secondName"
                    name="secondName"
                    value={secondName}
                    placeholder="Введите вашу фамилию..."
                    onChange={e => onChange(e)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="dateOfBirth">Дата рождения</label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={dateOfBirth}
                    placeholder="Введите дату вашего рождения..."
                    onChange={e => onChange(e)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phoneNumber">Номер телефона</label>
                  <NumberFormat
                    format="+7 (###) ###-####"
                    allowEmptyFormatting
                    mask="_"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={phoneNumber}
                    placeholder="Укажите номер вашего телефона..."
                    onChange={e => onChange(e)}
                  />
                </div>
                <small>* - поля, обязательные для заполнения</small>
                <div className="form-actions my-1">
                  <input
                    type="submit"
                    className="btn btn-primary"
                    value="Сохранить"
                  />
                  <Link to="/profile" className="btn btn-dark">
                    Назад
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

EditProfile.propTypes = {
  getProfile: PropTypes.func.isRequired,
  uploadProfilePhoto: PropTypes.func.isRequired,
  updateProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile
});

export default connect(mapStateToProps, {
  getProfile,
  uploadProfilePhoto,
  updateProfile
})(withRouter(EditProfile));
