import React, { Fragment, useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getProposalById, deleteProposal } from '../../actions/proposal';

import Spinner from '../layout/Spinner';
import NumberFormat from 'react-number-format';

import ProposalMap from './ProposalMap';

const Proposal = ({
  getProposalById,
  deleteProposal,
  proposal: { proposal, loading },
  auth,
  match,
  history
}) => {
  useEffect(() => {
    getProposalById(match.params.id);
  }, [getProposalById, match.params.id]);

  return (
    <Fragment>
      {loading || proposal === null ? (
        <Spinner />
      ) : (
        <Fragment>
          <button className="btn btn-light" onClick={history.goBack}>
            Назад
          </button>
          <h1 className="text-primary my-1">
            {proposal.dealType === 'Продажа' ? (
              <span>Продается</span>
            ) : (
              <span>Сдается</span>
            )}{' '}
            <span>{proposal.roomsNumber}</span> комнатная квартира
          </h1>
          <h2 className="text-primary my">
            <NumberFormat
              value={proposal.price}
              displayType={'text'}
              thousandSeparator={' '}
            />{' '}
            рублей
          </h2>
          <p className="lead">{proposal.address.shortAddressLine}</p>
          <div className="proposal-photos">
            {proposal.proposalPhotos.map(photo => (
              <div key={photo.photoID} className="proposal-photo">
                <img src={photo.photoURL} alt="" />
              </div>
            ))}
          </div>

          <ProposalMap coords={proposal.address.coords} />

          <div className="parameters my-2">
            {proposal.address.metro !== '' && (
              <Fragment>
                <div className="parameter-name">
                  <strong>Время до метро</strong>
                </div>
                <div className="parameter-value">
                  <p>
                    {proposal.address.metroDuration.auto.text}{' '}
                    <i>на автомобиле</i>
                  </p>
                  <p>
                    {proposal.address.metroDuration.masstransit.text}{' '}
                    <i>на общественном транспорте</i>
                  </p>
                  <p>
                    {proposal.address.metroDuration.pedestrian.text}{' '}
                    <i>пешком</i>
                  </p>
                </div>
              </Fragment>
            )}

            <div className="parameter-name">
              <strong>Год постройки дома</strong>
            </div>
            <div className="parameter-value">{proposal.houseYear}</div>
            <div className="parameter-name">
              <strong>Тип дома</strong>
            </div>
            <div className="parameter-value">{proposal.houseType}</div>
            <div className="parameter-name">
              <strong>Этажность дома</strong>
            </div>
            <div className="parameter-value">{proposal.floors}</div>
            <div className="parameter-name">
              <strong>Лифт</strong>
            </div>
            <div className="parameter-value">{proposal.elevator}</div>
            <div className="parameter-name">
              <strong>Количество комнат</strong>
            </div>
            <div className="parameter-value">{proposal.roomsNumber}</div>
            <div className="parameter-name">
              <strong>Общая площадь</strong>
            </div>
            <div className="parameter-value">
              <span>{proposal.totalArea}</span> кв.м.
            </div>
            <div className="parameter-name">
              <strong>Жилая площадь</strong>
            </div>
            <div className="parameter-value">
              <span>{proposal.livingArea}</span> кв.м.
            </div>
            <div className="parameter-name">
              <strong>Площадь кухни</strong>
            </div>
            <div className="parameter-value">
              <span>{proposal.kitchenArea}</span> кв.м.
            </div>
            <div className="parameter-name">
              <strong>Этаж</strong>
            </div>
            <div className="parameter-value">{proposal.floor}</div>
            <div className="parameter-name">
              <strong>Балкон</strong>
            </div>
            <div className="parameter-value">{proposal.balcony}</div>
            <div className="parameter-name">
              <strong>Плита</strong>
            </div>
            <div className="parameter-value">{proposal.cooker}</div>
            <div className="parameter-name">
              <strong>Окна выходят</strong>
            </div>
            <div className="parameter-value">{proposal.windows}</div>
            <div className="parameter-name">
              <strong>Санузел</strong>
            </div>
            <div className="parameter-value">{proposal.bathroom}</div>
          </div>

          {auth !== null &&
          auth.isAuthenticated &&
          auth.user._id === proposal.user ? (
            <Fragment>
              <Link
                to={`/edit-proposal/${proposal._id}`}
                className="btn btn-primary btn-block"
              >
                Редактировать предложение
              </Link>
              <button
                className="btn btn-danger btn-block"
                onClick={() => deleteProposal(proposal._id, history)}
              >
                Удалить предложение
              </button>
            </Fragment>
          ) : (
            <Fragment>
              <input
                type="submit"
                className="btn btn-primary btn-block"
                value="Сохранить в понравившиеся"
              />
              <Link to="./profile.html" className="btn btn-dark btn-block">
                Контакты продавца
              </Link>
            </Fragment>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

Proposal.propTypes = {
  getProposalById: PropTypes.func.isRequired,
  deleteProposal: PropTypes.func.isRequired,
  proposal: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  proposal: state.proposal,
  auth: state.auth
});

export default connect(mapStateToProps, { getProposalById, deleteProposal })(
  withRouter(Proposal)
);
