import React, { Fragment, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getSearches } from '../../actions/search';

import Spinner from '../layout/Spinner';
import SearchItem from './SearchItem';

const MySearches = ({
  getSearches,
  search: { searches, loading },
  history
}) => {
  useEffect(() => {
    getSearches();
  }, [getSearches]);

  return (
    <Fragment>
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>
          {/* <p className="lead">Ваши поиски</p>
          <div className="proposal-cards">
            {searches.map(search => (
              <h1 key={search._id}>{search.name}</h1>
              //   <SearchItem key={search._id} search={search} />
            ))}
          </div> */}
          <button className="btn btn-light" onClick={history.goBack}>
            Назад
          </button>
          <h1 className="text-primary my-1">Мои поиски</h1>
          {searches.length === 0 ? (
            <p className="lead">У вас нет сохраненных поисков</p>
          ) : (
            <Fragment>
              <p className="lead">Ваши сохраненные поиски</p>
              <div className="search-cards">
                {searches.map(search => (
                  //   <h1 key={search._id}>{search.name}</h1>
                  <SearchItem key={search._id} search={search} />
                ))}
              </div>
            </Fragment>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

MySearches.propTypes = {
  getSearches: PropTypes.func.isRequired,
  search: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  search: state.search
});

export default connect(mapStateToProps, { getSearches })(
  withRouter(MySearches)
);
