const checkURLIsImage = (url) => {
    return (url.match(/\.(jpeg|jpg|gif|png)$/) != null);
};

export default function AdditionalEvidence({additionalEvidence}) {

    let content = '';

    switch(additionalEvidence.type) {
        case 'media':
            if(additionalEvidence.data === null) {
                break;
            }
            let mediaArray = [];
            for(let i = 0; i < additionalEvidence.data.length; i++) {
                let data = additionalEvidence.data[i];
                let m = '';

                switch(data.mediaType) {
                    case 'video':
                        if(data.status === 'ok') {
                            m = <li key={data.media[0].url}>
                                <a href={data.media[0].url} target="_blank">{data.title}</a><br/>
                                {data.description}<br/>
                                Type: {data.sourceSite} {data.media[0].type}<br/>
                                {(data.thumbnail && data.sourceSite !== 'tiktok')?
                                <a href={data.media[0].url} target="_blank">
                                    <img src={data.thumbnail.replace('?name=orig', '')}/>
                                </a>
                                : <></>}
                            </li>
                        }
                        break;
                    case 'link':
                        if(checkURLIsImage(data.url)) {
                            m = <li key={data.url}>
                                <a href={data.url} target="_blank">
                                    <img src={data.url}/>
                                </a>
                            </li>
                        } else {
                            m = <li key={data.url}>
                                <a href={data.url} target="_blank">{(data.title !== '')?data.title:data.url}</a>
                                { (data.sourceSite)? ' (' + data.sourceSite + ')': '' }
                            </li>
                        }
                        break;
                }

                mediaArray.push(m)
            }
            content = (mediaArray.length >0) ? <ul>{mediaArray}</ul> : ''
            break;
        case 'text':
            let contentList = [];
            for (let [key, value] of Object.entries(additionalEvidence.data)) {
                let keyName = key.replace(/_/g, ' ').replace(/(^\w{1})|(\s{1}\w{1})/g, match => match.toUpperCase());
                let item = <li key={key}>
                    {keyName}: {value}
                </li>
                contentList.push(item);
            }
            content = (contentList.length >0) ? <ul>{contentList}</ul> : ''
            break;
        default:
            content = <pre>JSON.stringify(additionalEvidence, null, 1)}</pre>
            break;
    }

    return (content !== '')? <div>
        <h4>Additional Evidence</h4>
        <div>
            {content}
        </div>
    </div> : <></>
}