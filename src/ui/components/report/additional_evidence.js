import utilStyles from '../../styles/utils.module.css'
import RenderImage from '../utils/render_image'

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
                            let url = (data.media.length > 0) ? data.media[0].url : data.url
                            let mediaType = (data.media.length > 0) ? data.media[0].type : ''
                            m = <li key={url}>
                                <a href={url} target="_blank">{data.title}</a><br/>
                                {data.description}<br/>
                                Type: {data.sourceSite} {mediaType}<br/>
                                {(data.thumbnail && data.sourceSite !== 'tiktok')?
                                <a href={url} target="_blank">
                                    {RenderImage(data.thumbnail.replace('?name=orig', ''), '', false)}
                                </a>
                                : <></>}
                            </li>
                        }
                        break;
                    case 'link':
                        if(checkURLIsImage(data.url)) {
                            m = <li key={data.url}>
                                <a href={data.url} target="_blank">
                                    {RenderImage(data.url, '', false)}
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
            content = (mediaArray.length >0) ? <ul className={utilStyles.nb}>{mediaArray}</ul> : ''
            break;
        case 'text':
            let contentList = [];
            for (let [key, value] of Object.entries(additionalEvidence.data)) {
                let keyName = key.replace(/_/g, ' ').replace(/(^\w{1})|(\s{1}\w{1})/g, match => match.toUpperCase());
                let item = <li className={utilStyles.liFloat} key={key}>
                    <label className={utilStyles.label}>{keyName}</label>
                    <span className={[utilStyles.input, utilStyles.spanField].join(' ')}>{value}</span>
                </li>
                contentList.push(item);
            }
            content = (contentList.length > 0) ? <ul className={utilStyles.nb}>
                {contentList}
                <li className={utilStyles.clearLeft}></li>
            </ul> : ''
            break;
        default:
            content = <pre>JSON.stringify(additionalEvidence, null, 1)}</pre>
            break;
    }

    return content ? <div className={[utilStyles.section, utilStyles.innerSection].join(' ')}>
        <h4 className={utilStyles.headingXs}>Additional Evidence</h4>
        <div>
            {content}
        </div>
    </div> : <></>
}