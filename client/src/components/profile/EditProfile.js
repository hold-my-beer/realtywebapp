import React, { Fragment, useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { getProfile, updateProfile } from '../../actions/profile';
import PropTypes from 'prop-types';

const EditProfile = ({
  getProfile,
  updateProfile,
  profile: { profile, loading },
  history
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    secondName: '',
    dateOfBirth: '',
    phoneNumber: '',
    userPhoto: ''
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
      userPhoto: loading || !profile.userPhoto ? '' : profile.userPhoto
    });
  }, []);

  const {
    firstName,
    secondName,
    dateOfBirth,
    phoneNumber,
    userPhoto
  } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();

    updateProfile(formData, history);
  };

  return (
    <Fragment>
      <h1 className="text-primary my-1">Редактирование профиля</h1>
      <p className="lead">
        Обновите ваш профиль, чтобы контрагенты могли просмотреть информацию о
        вас
      </p>
      <div className="edit-profile-content">
        <div className="edit-profile-photo-group">
          <div className="edit-profile-photo">
            <img src={userPhoto} alt="" />
          </div>

          <form>
            <input
              type="submit"
              className="btn btn-light"
              value="Добавить фото"
            />
          </form>
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
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={phoneNumber}
                placeholder="Укажите номер вашего телефона..."
                onChange={e => onChange(e)}
              />
            </div>
            <small>* - поля, обязательные для заполнения</small>
            <input
              type="submit"
              className="btn btn-primary my-1"
              value="Сохранить"
            />
          </form>
        </div>
      </div>
    </Fragment>
  );
};

EditProfile.propTypes = {
  getProfile: PropTypes.func.isRequired,
  updateProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile
});

export default connect(mapStateToProps, { getProfile, updateProfile })(
  withRouter(EditProfile)
);
