import utilStyles from '../../styles/utils.module.css'

export default function IPFSArchive({ links }) {
    if(links.length === 0) {
        return <div></div>
    } else {
        let archiveLinks = [];
        for(let i = 0; i < links.length; i++) {
            let link = <li key={links[i]}>
                <a href={'https://gateway.temporal.cloud/' + links[i]} className={utilStyles.link} target="_blank">
                    {links[i]}
                </a>
            </li>
            archiveLinks.push(link)
        }
        return <div className={[utilStyles.section, utilStyles.innerSection].join(' ')}>
            <h4 className={utilStyles.headingXs}>Evidence IPFS Archive</h4>
            <p>The images and videos are available permanently via IPFS:</p>
            <ul className={utilStyles.nbPadding}>
                {archiveLinks}
            </ul>
        </div>
    }
}
