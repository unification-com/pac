import previewStyles from './preview_block.module.css'
import utilStyles from '../styles/utils.module.css'

import Link from 'next/link';
import Map from './report/map';
import Date from './date';
import RenderImage from './utils/render_image'

export default function PreviewBlock({title, sourceDatetime, beaconHash, source, content, evidenceAdditional, locationState, locationCity, race, gender, age, name, lat, long}) {

    let image = '',
        empty = '';
    if (evidenceAdditional.type === 'media' && evidenceAdditional.data !== null) {
        if (evidenceAdditional.data.length > 0) {
            if (evidenceAdditional.data[0].status === 'ok') {
                image = (evidenceAdditional.data[0].thumbnail && evidenceAdditional.data[0].sourceSite !== 'tiktok') ?
                    RenderImage(evidenceAdditional.data[0].thumbnail.replace('?name=orig', ''))
              :
                    <></>
            }
        }
    }
    if (!(image || content)) {
        if (evidenceAdditional.type === 'text') {
            empty = (
                <ul className={utilStyles.nb}>
                    <li>
                        <label className={utilStyles.label}>Race</label>
                        <span className={[utilStyles.input, utilStyles.spanField].join(' ')}>{race}</span>
                    </li>
                    <li>
                        <label className={utilStyles.label}>Gender</label>
                        <span className={[utilStyles.input, utilStyles.spanField].join(' ')}>{gender}</span>
                    </li>
                    {age ? (
                        <li>
                            <label className={utilStyles.label}>Age</label>
                            <span className={[utilStyles.input, utilStyles.spanField].join(' ')}>{age}</span>
                        </li>
                    ) : (
                        <li>
                            <label className={utilStyles.label}>Name</label>
                            <span className={[utilStyles.input, utilStyles.spanField].join(' ')}>{name}</span>
                        </li>
                    )}
                </ul>
            )
        } else if (evidenceAdditional.type === 'media' && lat && long ) {
            empty = <Map lat={lat} long={long} height="340" />
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
            {empty}

            <div className={utilStyles.overlay}>
                <span className={utilStyles.overlayText}>Read Source &rarr;</span>
            </div>
       </a>
    </Link>
}