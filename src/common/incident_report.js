const crypto = require('crypto');
const UsStates = require('us-state-codes');

// Standardised article structure. All incoing data will be restructured into this format
// then added to the database. Data loaded form the database will be loaded into this
// object (e.g. for hash verification etc.)
class IncidentReport {

    constructor() {
        this.title = '';
        this.content = '';
        this.source = '';
        this.sourceId = '';
        this.sourceDatetime = 0;
        this.sourceUrl = '';
        this.sourceRawData = '';
        this.sourceRawDataFormat = '';
        this.sourceAdditionalData = [];
        this.locationCountry = '';
        this.locationState = '';
        this.locationStateCode = '';
        this.locationCity = '';
        this.locationLat = 0.0;
        this.locationLong = 0.0;
        this.locationHasGeo = false;
        this.evidenceLinks = [];
        this.evidenceAdditional = {};
        this.victimName = '';
        this.victimRace = '';
        this.victimAge = 0;
        this.victimGender = '';
        this.victimArmed = '';
        this.updateHistory = [];

        // these values are not hashed.
        this.evidenceIpfsArchive = [];
        this.dbInsertDatetime = 0; // NOT TO BE INCLUDED IN HASH FUNCTION
        this.crossReferences = []; // an array of potential cross references with other sources.
                                    // e.g. if the entry is found in both Washington Post and Felon Encounters
                                    // NOT TO BE INCLUDED IN HASH FUNCTION
        this.hasCrossReferences = false;
        this.beaconHash = ''; // NOT TO BE INCLUDED IN HASH FUNCTION
        this.beaconHashAlgo = 'sha256';
        this.mainchainTxHash = ''; // NOT TO BE INCLUDED IN HASH FUNCTION
        this.mainchainBlockHeight = 0; // NOT TO BE INCLUDED IN HASH FUNCTION
        this.beaconTimestampId = 0; // NOT TO BE INCLUDED IN HASH FUNCTION
        this.beaconTimestamp = 0; // NOT TO BE INCLUDED IN HASH FUNCTION
        this.addedToMerkleTree = false; // NOT TO BE INCLUDED IN HASH FUNCTION
    }

    genderCategory(_gender) {
        let gender = '';

        switch(_gender) {
            case 'M':
            case 'Male':
                gender = 'Male';
                break;
            case 'F':
            case 'Female':
                gender = 'Female';
                break;
            default:
                gender = _gender;
                break
        }

        return gender;
    }

    armedCategory(_armed) {
        let armed = '';

        switch(_armed) {
            case 'Allegedly Armed':
            case 'claimed to be armed':
                armed = 'Allegedly';
                break;
            case 'No':
            case 'Unarmed':
            case 'unarmed':
                armed = 'Unarmed';
                break;
            case 'Unclear':
            case 'undetermined':
                armed = 'Unclear';
                break;
            default:
                armed = _armed.replace(/(^\w{1})|(\s{1}\w{1})/g, match => match.toUpperCase());
                break
        }
        return armed;
    }

    // Most APIs and data sources have their own widely varying categories for race.
    // This function attempts to determine common categories in a respectful way.
    raceCategory(_race) {
        let race = '';

        switch(_race) {
            case 'A':
            case 'African-American/Black':
            case 'B':
            case 'Black':
            case 'Black or African American':
                race = 'Black/African American'
                break;
            case 'American Indian or Alaska Native':
            case 'N':
            case 'NA':
            case 'Native American':
            case 'Native American/Alaskan':
                race = 'Native American/Native Alaskan';
                break;
            case 'Arab-American':
            case 'Middle Eastern':
                race = 'Arab American/Middle Eastern';
                break;
            case 'Asian':
            case 'Pacific Islander':
            case 'Asian/Pacific Islander':
            case 'Native Hawaiian or Other Pacific Islander':
                race = 'Asian/Pacific Islander';
                break;
            case 'European-American/White':
            case 'W':
            case 'White':
                race = 'White/European American';
                break;
            case 'H':
            case 'HIspanic/Latino':
            case 'Hispanic':
            case 'Hispanic/Latino':
                race = 'Hispanic/Latino';
                break;
            case 'O':
            case 'Other':
                race = 'Other';
                break;
            case 'Race unspecified':
            case 'Unknown':
            case 'Unknown Race':
            case 'Unknown race':
            case '':
            case null:
            case undefined:
                race = 'Unknown';
                break;
            default:
                race = _race.replace(/(^\w{1})|(\s{1}\w{1})/g, match => match.toUpperCase());
                break;
        }
        return race;
    }

    setTitle(_title) {
        this.title = _title;
    }

    setContent(_content) {
        this.content = _content;
    }

    setVictimName(_victimName) {
        this.victimName = _victimName;
    }

    setDbInsertDatetime(_dbInsertDatetime = 0) {
        if(_dbInsertDatetime === 0) {
            const now = new Date();
            const timestamp = Math.round(now.getTime() / 1000);
            this.dbInsertDatetime = timestamp;
        } else {
            this.dbInsertDatetime = _dbInsertDatetime;
        }
    }

    setSource(_source, _sourceId, _sourceUrl, _sourceDatetime, _sourceRawData, _sourceRawDataFormat) {
        this.source = _source;
        this.sourceId = _sourceId;
        this.sourceUrl = _sourceUrl;
        this.sourceDatetime = _sourceDatetime;
        this.sourceRawData = _sourceRawData;
        this.sourceRawDataFormat = _sourceRawDataFormat
    }

    addAdditionalSourceData(_sourceAdditionalData) {
        this.sourceAdditionalData.push(_sourceAdditionalData);
    }

    addCrossReference(_source, _sourceId, _collectionId, _beaconHash) {
        let cr = {
            source: _source,
            sourceId: _sourceId,
            collectionId: _collectionId,
            beaconHash: _beaconHash
        }
        this.crossReferences.push(cr);
        this.hasCrossReferences = true;
    }

    setLocation(_locationCountry = '', _locationState = '', _locationCity = '', _locationLat = 0.0, _locationLong = 0.0) {
        this.locationCountry = _locationCountry;

        if(_locationState === 'Washington DC') {
            _locationState = 'Washington';
        }
        if(_locationState === undefined || _locationState === null) {
            _locationState = '';
        }

        if(_locationCountry === 'US') {
            let stateCode = '';
            let stateName = '';
            if(_locationState.length === 2) {
                stateCode = UsStates.sanitizeStateCode(_locationState);
                stateName = UsStates.getStateNameByStateCode(stateCode);
            } else {
                stateName = UsStates.sanitizeStateName(_locationState);
                stateCode = UsStates.getStateCodeByStateName(stateName);
            }
            this.locationStateCode = stateCode;
            this.locationState = stateName;
        } else {
            this.locationState = _locationState;
            this.locationStateCode = 'XX';
        }

        this.locationCity = _locationCity;

        this.setGeoLocation(_locationLat, _locationLong);
    }

    setGeoLocation(_lat = 0.0, _long = 0.0) {
        this.locationLat = 0.0;
        this.locationLong = 0.0;
        this.locationHasGeo = false;
        if((_lat > 0.0 || _lat < 0.0) && (_long > 0.0 || _long < 0.0)) {
            this.locationLat = parseFloat(_lat);
            this.locationLong = parseFloat(_long);
            this.locationHasGeo = true;
        }
    }

    addEvidenceLink(_link = '') {
        if(_link !== null && _link.length > 0) {
            this.evidenceLinks.push(_link);
        }
    }

    addEvidenceIpfsArchiveLink(_link) {
        if(_link !== null && _link.length > 0) {
            this.evidenceIpfsArchive.push(_link);
        }
    }

    setEvidenceAdditional(_evidenceAdditional) {
        this.evidenceAdditional = _evidenceAdditional;
    }

    setBeacon(_beaconTimestamp, _beaconTimestampId, _mainchainTxHash, _mainchainBlockHeight) {
        this.beaconHash = this.hash();
        this.beaconTimestamp = _beaconTimestamp;
        this.beaconTimestampId = _beaconTimestampId;
        this.mainchainTxHash = _mainchainTxHash;
        this.mainchainBlockHeight = _mainchainBlockHeight;
    }

    addUpdateEvent(_updateId, _field, _oldValue, _newValue, _updateTime, _oldBeaconHash) {
        let updateObj = {
            updateId: _updateId,
            field: _field,
            oldValue: _oldValue,
            newValue: _newValue,
            updateTime: _updateTime,
            oldBeaconHash: _oldBeaconHash
        };

        this.updateHistory.push(updateObj);
    }

    setAddedToMerkleTree(_addedToMerkleTree) {
        this.addedToMerkleTree = _addedToMerkleTree;
    }

    setVictimRace(_race) {
        this.victimRace = this.raceCategory(_race)
    }

    setVictimAge(_age) {
        if(_age === '' || _age === null) {
            _age = 0;
        }
        this.victimAge = parseInt(_age);
    }

    setVictimGender(_gender) {
        if(_gender === '' || _gender === null) {
            _gender = 'Unknown';
        }
        this.victimGender = this.genderCategory(_gender);
    }

    setVictimArmed(_armed) {
        if(_armed === '' || _armed === null) {
            _armed = 'N/A';
        }
        this.victimArmed = this.armedCategory(_armed);
    }

    // create an Incident Report object from a database row.
    // This extends the DB data to allow functions such as the hash and data subset etc.
    loadFromDb(_dbObj) {

        this.setTitle(_dbObj.title);
        this.setContent(_dbObj.content);
        this.setSource(_dbObj.source, _dbObj.sourceId, _dbObj.sourceUrl, _dbObj.sourceDatetime, _dbObj.sourceRawData, _dbObj.sourceRawDataFormat);
        for(let i = 0; i < _dbObj.sourceAdditionalData.length; i++) {
            this.addAdditionalSourceData(_dbObj.sourceAdditionalData[i]);
        }
        this.setLocation(_dbObj.locationCountry, _dbObj.locationState, _dbObj.locationCity, parseFloat(_dbObj.locationLat), parseFloat(_dbObj.locationLong));

        for(let j = 0; j < _dbObj.evidenceLinks.length; j++) {
            this.addEvidenceLink(_dbObj.evidenceLinks[j]);
        }

        for(let k = 0; k < _dbObj.evidenceIpfsArchive.length; k++) {
            this.addEvidenceIpfsArchiveLink(_dbObj.evidenceIpfsArchive[k]);
        }

        this.setEvidenceAdditional(_dbObj.evidenceAdditional);

        this.setVictimName(_dbObj.victimName);

        this.setDbInsertDatetime(_dbObj.dbInsertDatetime);

        this.setBeacon(_dbObj.beaconTimestamp, _dbObj.beaconTimestampId, _dbObj.mainchainTxHash, _dbObj.mainchainBlockHeight);

        for(let l = 0; l < _dbObj.crossReferences.length; l++) {
            let cr = _dbObj.crossReferences[l];
            this.addCrossReference(cr.source, cr.sourceId, cr.collectionId, cr.beaconHash);
        }

        this.setVictimRace(_dbObj.victimRace);
        this.setVictimAge(_dbObj.victimAge);
        this.setVictimGender(_dbObj.victimGender);
        this.setVictimArmed(_dbObj.victimArmed);

        this.setAddedToMerkleTree(_dbObj.addedToMerkleTree);
    }

    // getDataToHash creates an internal object for hashing
    // and for the initial DB entry.
    getDataToHash(stringifyForHash = false) {
        let baseDbObj = {
            title: this.title,
            content: this.content,
            source: this.source,
            sourceId: this.sourceId,
            sourceDatetime: this.sourceDatetime,
            sourceUrl: this.sourceUrl,
            sourceRawData: this.sourceRawData,
            sourceRawDataFormat: this.sourceRawDataFormat,
            sourceAdditionalData: this.sourceAdditionalData.sort(),
            locationCountry: this.locationCountry,
            locationState: this.locationState,
            locationStateCode: this.locationStateCode,
            locationCity: this.locationCity,
            locationLat: this.locationLat,
            locationLong: this.locationLong,
            locationHasGeo: this.locationHasGeo,
            evidenceLinks: this.evidenceLinks.sort(),
            evidenceAdditional: this.evidenceAdditional,
            victimName: this.victimName,
            victimRace: this.victimRace,
            victimAge: this.victimAge,
            victimGender: this.victimGender,
            victimArmed: this.victimArmed,
            updateHistory: this.updateHistory.sort()
        }

        let baseDbObjSorted = Object.keys(baseDbObj)

            // Sort and calling a method on
            // keys on sorted fashion.
            .sort().reduce(function(Obj, key) {

                // Adding the key-value pair to the
                // new object in sorted keys manner
                Obj[key] = baseDbObj[key];
                return Obj;
            }, {});

        if(stringifyForHash === true) {
            return JSON.stringify(baseDbObjSorted);
        } else {
            return baseDbObjSorted;
        }
    }

    // getFullDbObject returns the full object to be inserted into the DB
    getFullDbObject() {
        let dbObj = this.getDataToHash();

        dbObj.dbInsertDatetime = this.dbInsertDatetime;
        dbObj.evidenceIpfsArchive = this.evidenceIpfsArchive,
        dbObj.beaconHash = this.beaconHash;
        dbObj.beaconHashAlgo = this.beaconHashAlgo;
        dbObj.beaconTimestampId = this.beaconTimestampId;
        dbObj.beaconTimestamp = this.beaconTimestamp;
        dbObj.crossReferences = this.crossReferences;
        dbObj.hasCrossReferences = this.hasCrossReferences;
        dbObj.addedToMerkleTree = this.addedToMerkleTree;
        dbObj.mainchainTxHash = this.mainchainTxHash;
        dbObj.mainchainBlockHeight = this.mainchainBlockHeight;

        return dbObj;
    }

    // generates a BEACON hash of the main incident report content
    hash() {
        const hash = crypto.createHash(this.beaconHashAlgo)
            .update(this.getDataToHash(true))
            .digest('hex')
        return hash;
    }
}

module.exports = IncidentReport;
