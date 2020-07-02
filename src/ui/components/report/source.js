import { formatSource } from '../../utils/source'
import utilStyles from '../../styles/utils.module.css'

export default function Source({ source, sourceAdditionalData, sourceId, sourceUrl }) {

    let sourceAdditionalLinksArray = [];
    let sourceAdditionalLinks = '';
    if(sourceAdditionalData.length > 0) {
        for(let i = 0; i < sourceAdditionalData.length; i++) {
            let link = <li key={sourceAdditionalData[i]}>
                <a href={sourceAdditionalData[i]} className={utilStyles.link} target="_blank">
                    {sourceAdditionalData[i]}
                </a>
            </li>
            sourceAdditionalLinksArray.push(link)
        }
        sourceAdditionalLinks = <div><strong>Additional Source Links: </strong>
            <ul className={utilStyles.nbPadding}>
                {sourceAdditionalLinksArray}
            </ul>
        </div>
    }

    let sourceName = formatSource(source);

    return <div className={[utilStyles.section, utilStyles.innerSection].join(' ')}>
        <h4 className={utilStyles.headingXs}>Source</h4>
        <p>Source ID: <strong>{sourceId}</strong> - <a href={sourceUrl} className={utilStyles.link} target="_blank">{sourceName}</a></p>
        {sourceAdditionalLinks}
    </div>
}