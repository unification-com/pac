import Link from "next/link";
import Date from "./date";
import {formatSource} from "../lib/source";

export default function PreviewBlock({title, sourceDatetime, beaconHash, source, content, evidenceAdditional}) {

    let image = '';
    if(evidenceAdditional.type === 'media') {
        if(evidenceAdditional.data.length > 0) {
            if (evidenceAdditional.data[0].status === 'ok') {
                image = <Link href="/reports/[beaconHash]" as={`/reports/${beaconHash}`}>
                    <a>
                        <img src={evidenceAdditional.data[0].thumbnail.replace('?name=orig', '')}/>
                    </a>
                </Link>
            }
        }
    }

    return <div>
        <Link href="/reports/[beaconHash]" as={`/reports/${beaconHash}`}>
            <a>{title}</a>
        </Link>
        {image}
        <Date timestamp={sourceDatetime}/>, {formatSource(source)}
    </div>
}