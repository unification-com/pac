import previewStyles from './preview_block.module.css'
import Link from "next/link";
import Date from "./date";

export default function PreviewBlock({title, sourceDatetime, beaconHash, source, content, evidenceAdditional, locationState, locationCity}) {

    let image = '';
    if(evidenceAdditional.type === 'media' && evidenceAdditional.data !== null) {
        if(evidenceAdditional.data.length > 0) {
            if (evidenceAdditional.data[0].status === 'ok') {
                image = (evidenceAdditional.data[0].thumbnail && evidenceAdditional.data[0].sourceSite !== 'tiktok') ? <Link href="/reports/[beaconHash]" as={`/reports/${beaconHash}`}>
                        <img src={evidenceAdditional.data[0].thumbnail.replace('?name=orig', '')}/>
                </Link> :
                    <></>
            }
        }
    }

    return <Link href="/reports/[beaconHash]" as={`/reports/${beaconHash}`}>
        <a className={previewStyles.previewBlock}>
            <p className={previewStyles.timeLocation}>
                <Date timestamp={sourceDatetime} />{(locationCity ? ' | ' + locationCity : ' | ') + (locationCity && locationState ? ', ' : ' ') + (locationState || ' | ')}
            </p>
            <h3 className={previewStyles.reportHeading}>{title}</h3>
            {image}
            <div className={previewStyles.content}>
                {content}
            </div>
            <div className={previewStyles.overlay}></div>
       </a>
    </Link>
}