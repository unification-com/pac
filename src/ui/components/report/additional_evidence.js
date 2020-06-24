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
                if(data.status === 'ok') {
                    m = <li key={data.media[0].url}>
                            <a href={data.media[0].url} target="_blank">{data.title}</a><br/>
                                {data.description}<br/>
                                Type: {data.sourceSite} {data.media[0].type}<br/>
                                (data.thumbnail !== null)?
                            <a href={data.media[0].url} target="_blank">
                                <img src={data.thumbnail.replace('?name=orig', '')}/>
                            </a>
                        : <></>
                        </li>
                } else {
                    m = <li>
                            <pre>{JSON.stringify(additionalEvidence.data[i], null, 1)}</pre>
                        </li>
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