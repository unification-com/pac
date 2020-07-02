import utilStyles from '../../styles/utils.module.css'

export default function EvidenceLinks({ links }) {
    if(links.length === 0) {
        return <div></div>
    } else {
        let evidenceLinks = [];
        for(let i = 0; i < links.length; i++) {
            let link = <li key={links[i]}>
                <a href={links[i]} className={utilStyles.link} target="_blank">
                    {links[i]}
                </a>
            </li>
            evidenceLinks.push(link)
        }
        return <div className={[utilStyles.section, utilStyles.innerSection].join(' ')}>
            <h4 className={utilStyles.headingXs}>Primary Evidence Links</h4>
            <ul className={utilStyles.nbPadding}>
                {evidenceLinks}
            </ul>
        </div>
    }
}
