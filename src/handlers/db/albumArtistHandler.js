const logger = require('../../utils/logger');
const db = require('../../database/index');
const generalHandler = require('./generalHandler');
const tables = require('../../database/tableNames');


const insertAssociations = (albumId, artistsIds) => {
  logger.info(`Creating associations for album ${albumId} and artists ${artistsIds}`);
  const rowValues = artistsIds.map(id => ({ album_id: albumId, artist_id: id }));
  return generalHandler.createNewEntry(tables.albums_artists, rowValues);
};

const deleteAssociations = (albumId) => {
  logger.info(`Deleting album ${albumId} associations`);
  return db(tables.albums_artists).where('album_id', albumId).del();
};

const updateAssociations = (albumId, artistsIds) => deleteAssociations(albumId)
    .then(() => insertAssociations(albumId, artistsIds));

const findArtistsIdsFromAlbum = albumId => db(tables.albums_artists).where('album_id', albumId).select('artist_id');

module.exports = {
  insertAssociations,
  updateAssociations,
  deleteAssociations,
  findArtistsIdsFromAlbum,
};
