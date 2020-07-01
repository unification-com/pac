class Media {
    constructor() {
        this.url = '';
        this.mediaType = 'unknown';
        this.status = '';
        this.title = '';
        this.description = '';
        this.sourceSite = '';
        this.tags = [];
        this.thumbnail = '';
        this.media = [];
    }

    setType(_type) {
        this.mediaType = _type;
    }

    setUrl(_url) {
        this.url = _url;
    }

    setStatus(_status) {
        this.status = _status;
    }

    setTitle(_title) {
        this.title = _title;
    }

    setDescription(_description) {
        this.description = _description;
    }

    setSourceSite(_site) {
        this.sourceSite = _site;
    }

    setThumbnail(_thumbnail) {
        this.thumbnail = _thumbnail;
    }

    addTag(_tag) {
        this.tags.push(_tag);
    }

    addMedia(_url, _format, _type) {
        let stream = {
            url: _url,
            format: _format,
            type: _type
        }
        this.media.push(stream);
    }

    getMediaObj() {
        let media = {
            mediaType: this.mediaType,
            url: this.url,
            status: this.status,
            title: this.title,
            description: this.description,
            sourceSite: this.sourceSite,
            tags: this.tags,
            thumbnail: this.thumbnail,
            media: this.media
        }
        return media;
    }

}

module.exports = Media;
