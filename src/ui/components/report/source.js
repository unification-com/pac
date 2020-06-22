import {formatSource} from '../../lib/source'

export default function Source({ source, sourceAdditionalData, sourceId, sourceUrl }) {

    let sourceAdditionalLinksArray = [];
    let sourceAdditionalLinks = '';
    if(sourceAdditionalData.length > 0) {
        for(let i = 0; i < sourceAdditionalData.length; i++) {
            let link = <li key={sourceAdditionalData[i]}>
                <a href={sourceAdditionalData[i]} target="_blank">
                    {sourceAdditionalData[i]}
                </a>
            </li>
            sourceAdditionalLinksArray.push(link)
        }
        sourceAdditionalLinks = <div><strong>Additional Source Links: </strong>
            <ul>
                {sourceAdditionalLinksArray}
            </ul>
        </div>
    }

    let sourceName = formatSource(source);

    return <div className="source-container">
        <h4>Source</h4>
        <p>
            <a href={sourceUrl} target="_blank">{sourceName}</a> - <strong>Source ID: </strong> {sourceId}
        </p>
        {sourceAdditionalLinks}
    </div>
}