import React, { useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getProfile } from '../../actions/profile';
import PropTypes from 'prop-types';

import Spinner from '../layout/Spinner';
import defaultAvatar from '../../img/defaultAvatar.png';

import Moment from 'react-moment';
import 'moment/locale/ru';

const Profile = ({ getProfile, profile: { profile, loading }, auth }) => {
  useEffect(() => {
    getProfile();
  }, [getProfile]);

  return (
    <Fragment>
      {profile === null || loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <h1 className="text-primary text-center my-1">Мой профиль</h1>
          <div className="profile">
            <div className="profile-top">
              <div className="profile-photo">
                <img
                  src={
                    profile.userPhoto.photoURL
                      ? profile.userPhoto.photoURL
                      : defaultAvatar
                  }
                  alt=""
                />
              </div>
              <div className="profile-personal">
                <h2 className="text-primary">
                  {profile.firstName} {profile.secondName}
                </h2>
                {profile.dateOfBirth ? (
                  <h3>
                    <Moment fromNow ago locale="ru">
                      {profile.dateOfBirth}
                    </Moment>
                  </h3>
                ) : (
                  ''
                )}
              </div>
              <div className="profile-contacts">
                <p>
                  <strong>Email: </strong>{' '}
                  {auth.user !== null && auth.user.email}
                </p>
                {profile.phoneNumber ? (
                  <p>
                    <strong>Телефон: </strong> {profile.phoneNumber}
                  </p>
                ) : (
                  ''
                )}
              </div>
            </div>

            {/* <div className="profile-content"> */}
            <div className="profile-actions">
              <Link to="/edit-profile" className="btn btn-light btn-block">
                Редактировать профиль
              </Link>
              <Link to="/create-proposal" className="btn btn-primary btn-block">
                Создать предложение
              </Link>
              <Link to="/my-proposals" className="btn btn-dark btn-block">
                Мои предложения
              </Link>
              <Link to="/my-searches" className="btn btn-dark btn-block">
                Мои поиски
              </Link>
              <Link to="#" className="btn btn-danger btn-block">
                Удалить аккаунт
              </Link>
            </div>
            {/* </div> */}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

Profile.propTypes = {
  getProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  auth: state.auth
});

export default connect(mapStateToProps, { getProfile })(Profile);
