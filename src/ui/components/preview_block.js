import previewStyles from './preview_block.module.css'
import Link from "next/link";
import Date from "./date";
import {formatSource} from "../utils/source";

export default function PreviewBlock({title, sourceDatetime, beaconHash, source, content, evidenceAdditional}) {

    let image = '',
        data = evidenceAdditional.data;
    if(evidenceAdditional.type === 'media' && evidenceAdditional.data !== null) {
        if(data.length > 0) {
            if (data[0].status === 'ok') {
                image = (data[0].thumbnail !== null) ? <img src={data[0].thumbnail.replace('?name=orig', '')}/> : <></>
            }
        }
    }

    return <Link href="/reports/[beaconHash]" as={`/reports/${beaconHash}`}>
        <a className={previewStyles.block}>
            <p className={previewStyles.timeLocation}>
                <Date timestamp={sourceDatetime} />{(data.city ? ' | ' + data.city : '') + (data.city && data.state ? ', ' : '') + (data.state || '')}
            </p>
            <h3 className={previewStyles.reportHeading}>{title}</h3>
            {image}
        </a>
    </Link>
}