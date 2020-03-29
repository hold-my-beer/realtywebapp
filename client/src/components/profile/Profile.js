import React, { useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getProfile } from '../../actions/profile';
import PropTypes from 'prop-types';

import Spinner from '../layout/Spinner';
import profilePhoto from '../../img/profilePhoto.jpg';

const Profile = ({ getProfile, profile: { profile, loading } }) => {
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
            <div className="profile-photo">
              <img src={profilePhoto} alt="" />
            </div>
            <div className="profile-content">
              <div className="profile-personal">
                <h2 className="text-primary">Иван Иванов</h2>
                <h3>35 лет</h3>
              </div>
              <div className="profile-contacts">
                <p>
                  <strong>Email: </strong> ivan.ivanov@gmail.com
                </p>
                <p>
                  <strong>Телефон: </strong> +7-999-999-99-99
                </p>
              </div>
              <div className="profile-actions">
                <Link to="/edit-profile" className="btn btn-light btn-block">
                  Редактировать профиль
                </Link>
                <Link
                  to="/create-proposal"
                  className="btn btn-primary btn-block"
                >
                  Создать предложение
                </Link>
                <Link to="/proposals" className="btn btn-dark btn-block">
                  Мои предложения
                </Link>
                <Link to="#" className="btn btn-dark btn-block">
                  Мои поиски
                </Link>
                <Link to="#" className="btn btn-danger btn-block">
                  Удалить аккаунт
                </Link>
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

Profile.propTypes = {
  getProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile
});

export default connect(mapStateToProps, { getProfile })(Profile);
