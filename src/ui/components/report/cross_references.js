import {formatSource} from '../../utils/source'
import Link from 'next/link';
import utilStyles from '../../styles/utils.module.css'

export default function CrossReferences({hasCrossReferences, crossReferences}) {

    if (!hasCrossReferences) {
        return <div></div>
    }

    let crArray = [];

    for(let i = 0; i < crossReferences.length; i++) {
        let cr = <li key={crossReferences[i].beaconHash}>
            {formatSource(crossReferences[i].source)} -
            <Link href="/reports/[beaconHash]" as={`/reports/${crossReferences[i].beaconHash}`}>
                <a className={utilStyles.link}>{crossReferences[i].title}</a>
            </Link>

        </li>
        crArray.push(cr)
    }

    return <div className={[utilStyles.section, utilStyles.innerSection].join(' ')}>
        <h4 className={utilStyles.headingXs}>Cross References</h4>
        <p>This report has possible entries from multiple sources</p>
        <ul className={utilStyles.nbPadding}>
            {crArray}
        </ul>
    </div>
}
