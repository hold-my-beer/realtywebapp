import React, { Fragment, useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  getProposalById,
  addProposalPhotos,
  removeProposalPhoto,
  updateProposal
} from '../../actions/proposal';

import Spinner from '../layout/Spinner';
import { YMaps, Map, GeoObject } from 'react-yandex-maps';

const EditProposal = ({
  getProposalById,
  addProposalPhotos,
  removeProposalPhoto,
  updateProposal,
  proposal: { proposal, loading },
  match,
  history
}) => {
  const [formData, setFormData] = useState({
    dealType: 'Продажа',
    address: '',
    houseYear: '',
    houseType: 'Панельный',
    floors: '',
    elevator: 'Нет',
    floor: '',
    roomsNumber: '',
    totalArea: '',
    livingArea: '',
    kitchenArea: '',
    balcony: 'Нет',
    windows: 'На улицу',
    cooker: 'Электрическая',
    bathroom: 'Совмещенный',
    price: ''
  });

  const [files, setFiles] = useState([]);

  const [photosToDestroy, setPhotosToDestroy] = useState([]);

  const [mapData, setMapData] = useState({
    coordinates: [55.75, 37.57],
    zoom: 9
  });

  useEffect(() => {
    getProposalById(match.params.id);

    setFormData({
      dealType: loading || !proposal.dealType ? '' : proposal.dealType,
      address: loading || !proposal.address ? '' : proposal.address,
      houseYear: loading || !proposal.houseYear ? '' : proposal.houseYear,
      houseType: loading || !proposal.houseType ? '' : proposal.houseType,
      floors: loading || !proposal.floors ? '' : proposal.floors,
      elevator: loading || !proposal.elevator ? '' : proposal.elevator,
      floor: loading || !proposal.floor ? '' : proposal.floor,
      roomsNumber: loading || !proposal.roomsNumber ? '' : proposal.roomsNumber,
      totalArea: loading || !proposal.totalArea ? '' : proposal.totalArea,
      livingArea: loading || !proposal.livingArea ? '' : proposal.livingArea,
      kitchenArea: loading || !proposal.kitchenArea ? '' : proposal.kitchenArea,
      balcony: loading || !proposal.balcony ? '' : proposal.balcony,
      windows: loading || !proposal.windows ? '' : proposal.windows,
      cooker: loading || !proposal.cooker ? '' : proposal.cooker,
      bathroom: loading || !proposal.bathroom ? '' : proposal.bathroom,
      price: loading || !proposal.price ? '' : proposal.price
    });
  }, [
    getProposalById,
    match.params.id,
    proposal.dealType,
    proposal.address,
    proposal.houseYear,
    proposal.houseType,
    proposal.floors,
    proposal.elevator,
    proposal.floor,
    proposal.roomsNumber,
    proposal.totalArea,
    proposal.livingArea,
    proposal.kitchenArea,
    proposal.balcony,
    proposal.windows,
    proposal.cooker,
    proposal.bathroom,
    proposal.price
  ]);

  useEffect(() => {
    addProposalPhotos(files);
  }, [addProposalPhotos, files]);

  const {
    dealType,
    address,
    houseYear,
    houseType,
    floors,
    elevator,
    floor,
    roomsNumber,
    totalArea,
    livingArea,
    kitchenArea,
    balcony,
    windows,
    cooker,
    bathroom,
    price
  } = formData;

  const { coordinates, zoom } = mapData;

  const onLoad = ymaps => {
    ymaps.geocode(proposal.address, { results: 1 }).then(res => {
      setMapData({
        ...mapData,
        coordinates: res.geoObjects.get(0).geometry._coordinates,
        zoom: 17
      });
    });

    const suggestView = new ymaps.SuggestView('address');

    suggestView.events.add('select', e => {
      const selectedAddress = e.get('item').value;
      setFormData({ ...formData, address: selectedAddress });

      ymaps.geocode(selectedAddress, { results: 1 }).then(res => {
        setMapData({
          ...mapData,
          coordinates: res.geoObjects.get(0).geometry._coordinates,
          zoom: 17
        });
      });
    });
  };

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onUploadChange = e => {
    const filesToAdd = Array.from(e.target.files).filter(fileItem => {
      for (let i = 0; i < files.length; i++) {
        if (files[i].name === fileItem.name) {
          return false;
        }
      }

      return true;
    });

    setFiles([...files, ...filesToAdd]);
  };

  const onImageLoad = photo => {
    if (photo.photoURL.startsWith('blob')) {
      URL.revokeObjectURL(photo.photoURL);
    }
  };

  const onDeletePhotoClick = photoToDelete => {
    if (photoToDelete.photoURL.startsWith('blob')) {
      const removeIndex = proposal.proposalPhotos
        .map(photo => photo.photoID)
        .indexOf(photoToDelete.photoID);
      files.splice(removeIndex, 1);
    } else {
      setPhotosToDestroy([...photosToDestroy, photoToDelete.photoID]);
    }

    removeProposalPhoto(photoToDelete.photoID);
  };

  const onSubmit = async e => {
    e.preventDefault();

    updateProposal(match.params.id, formData, files, photosToDestroy, history);
  };

  return (
    <Fragment>
      {loading || proposal === null ? (
        <Spinner />
      ) : (
        <Fragment>
          <button className="btn btn-light" onClick={history.goBack}>
            Назад
          </button>
          <h1 className="text-primary my-1">Редактирование предложения</h1>
          <p className="lead">Отредактируйте ваше предложение</p>
          <div>
            <div className="form-group deal-type">
              <label htmlFor="dealType">Продаю / Сдаю</label>
              <select
                className="select-css"
                name="dealType"
                id="dealType"
                value={dealType}
                onChange={e => onChange(e)}
              >
                <option value="Продажа">Продажа</option>
                <option value="Аренда">Аренда</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="address">Выберите адрес дома</label>
              <input
                type="text"
                id="address"
                name="address"
                value={address}
                placeholder="Начните набирать адрес..."
                onChange={e => onChange(e)}
              />
              <YMaps
                query={{
                  apikey: 'c5dd7fd1-79ed-417f-898a-81cf2b2a7bc0'
                }}
              >
                <Map
                  state={{
                    center: coordinates,
                    zoom: zoom
                  }}
                  className="map"
                  onLoad={ymaps => onLoad(ymaps)}
                  modules={['SuggestView', 'geocode']}
                >
                  <GeoObject
                    geometry={{
                      type: 'Point',
                      coordinates: coordinates
                    }}
                    options={{
                      preset: 'islands#blueHomeCircleIcon'
                    }}
                  />
                </Map>
              </YMaps>
            </div>
            <div className="appartment-parameters">
              <div className="house-year">
                <label htmlFor="houseYear">Год постройки дома</label>
                <input
                  type="number"
                  id="houseYear"
                  name="houseYear"
                  value={houseYear}
                  placeholder="Год постройки..."
                  min="1900"
                  onChange={e => onChange(e)}
                />
              </div>
              <div className="house-type">
                <label htmlFor="house-type">Тип дома</label>
                <select
                  className="select-css"
                  name="houseType"
                  id="houseType"
                  value={houseType}
                  onChange={e => onChange(e)}
                >
                  <option value="Панельный">Панельный</option>
                  <option value="Блочный">Блочный</option>
                  <option value="Кирпичный">Кирпичный</option>
                  <option value="Монолит">Монолит</option>
                </select>
              </div>
              <div className="floors">
                <label htmlFor="floors">Этажность дома</label>
                <input
                  type="number"
                  id="floors"
                  name="floors"
                  value={floors}
                  placeholder="Этажность дома..."
                  min="0"
                  onChange={e => onChange(e)}
                />
              </div>
              <div className="elevator">
                <label htmlFor="elevator">Лифт</label>
                <select
                  name="elevator"
                  id="elevator"
                  value={elevator}
                  onChange={e => onChange(e)}
                >
                  <option value="Нет">Нет</option>
                  <option value="Пассажирский">Пассажирский</option>
                  <option value="Пассажирский и грузовой">
                    Пассажирский и грузовой
                  </option>
                </select>
              </div>

              <div className="floor">
                <label htmlFor="floor">Этаж</label>
                <input
                  type="number"
                  id="floor"
                  name="floor"
                  value={floor}
                  placeholder="Введите этаж..."
                  min="0"
                  onChange={e => onChange(e)}
                />
              </div>
              <div className="rooms-number">
                <label htmlFor="roomsNumber">Количество комнат</label>
                <input
                  type="number"
                  id="roomsNumber"
                  name="roomsNumber"
                  value={roomsNumber}
                  placeholder="Количество комнат..."
                  min="0"
                  onChange={e => onChange(e)}
                />
              </div>

              <div className="total-area">
                <label htmlFor="totalArea">Общая площадь</label>
                <input
                  type="number"
                  id="totalArea"
                  name="totalArea"
                  value={totalArea}
                  placeholder="Общая площадь..."
                  min="0"
                  onChange={e => onChange(e)}
                />
              </div>
              <div className="living-area">
                <label htmlFor="livingArea">Жилая площадь</label>
                <input
                  type="number"
                  id="livingArea"
                  name="livingArea"
                  value={livingArea}
                  placeholder="Жилая площадь..."
                  min="0"
                  onChange={e => onChange(e)}
                />
              </div>
              <div className="kitchen-area">
                <label htmlFor="kitchenArea">Площадь кухни</label>
                <input
                  type="number"
                  id="kitchenArea"
                  name="kitchenArea"
                  value={kitchenArea}
                  placeholder="Площадь кухни..."
                  min="0"
                  onChange={e => onChange(e)}
                />
              </div>
              <div className="balcony">
                <label htmlFor="balcony">Балкон</label>
                <select
                  className="select-css"
                  name="balcony"
                  id="balcony"
                  value={balcony}
                  onChange={e => onChange(e)}
                >
                  <option value="Нет">Нет</option>
                  <option value="Один">Один</option>
                  <option value="Два и более">Два и более</option>
                </select>
              </div>
              <div className="windows">
                <label htmlFor="windows">Окна выходят</label>
                <select
                  className="select-css"
                  name="windows"
                  id="windows"
                  value={windows}
                  onChange={e => onChange(e)}
                >
                  <option value="На улицу">На улицу</option>
                  <option value="Во двор">Во двор</option>
                  <option value="На улицу и во двор">На улицу и во двор</option>
                </select>
              </div>
              <div className="cooker">
                <label htmlFor="cooker">Плита</label>
                <select
                  className="select-css"
                  name="cooker"
                  id="cooker"
                  value={cooker}
                  onChange={e => onChange(e)}
                >
                  <option value="Электрическая">Электрическая</option>
                  <option value="Газовая">Газовая</option>
                </select>
              </div>
              <div className="bathroom">
                <label htmlFor="bathroom">Санузел</label>
                <select
                  className="select-css"
                  name="bathroom"
                  id="bathroom"
                  value={bathroom}
                  onChange={e => onChange(e)}
                >
                  <option value="Совмещенный">Совмещенный</option>
                  <option value="Раздельный">Раздельный</option>
                  <option value="Два и более">Два и более</option>
                </select>
              </div>
              <div className="price">
                <label htmlFor="price">Стоимость, руб.</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={price}
                  placeholder="Укажите стоимость..."
                  min="0"
                  onChange={e => onChange(e)}
                />
              </div>
              <div className="empty"></div>
            </div>
            <div className="create-proposal-photos">
              {proposal &&
                proposal.proposalPhotos.map(photo => (
                  <div key={photo.photoID} className="create-proposal-photo">
                    <img
                      src={photo.photoURL}
                      alt=""
                      onLoad={() => onImageLoad(photo)}
                    />
                    <i
                      className="far fa-times-circle fa-2x"
                      // onClick={() => removeProposalPhoto(photo.photoID)}
                      onClick={() => onDeletePhotoClick(photo)}
                    ></i>
                  </div>
                ))}
            </div>
            <label
              htmlFor="proposal-photos-upload"
              className="btn btn-light btn-block"
            >
              Загрузить фото
            </label>
            <input
              id="proposal-photos-upload"
              type="file"
              onChange={e => onUploadChange(e)}
              multiple
            />
            <input
              type="submit"
              className="btn btn-primary btn-block"
              value="Сохранить изменения"
              onClick={e => onSubmit(e)}
            />
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

EditProposal.propTypes = {
  getProposalById: PropTypes.func.isRequired,
  addProposalPhotos: PropTypes.func.isRequired,
  removeProposalPhoto: PropTypes.func.isRequired,
  updateProposal: PropTypes.func.isRequired,
  proposal: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  proposal: state.proposal
});

export default connect(mapStateToProps, {
  getProposalById,
  addProposalPhotos,
  removeProposalPhoto,
  updateProposal
})(withRouter(EditProposal));
