export default function EvidenceLinks({ links }) {
    if(links.length === 0) {
        return <div></div>
    } else {
        let evidenceLinks = [];
        for(let i = 0; i < links.length; i++) {
            let link = <li key={links[i]}>
                <a href={links[i]} target="_blank">
                    {links[i]}
                </a>
            </li>
            evidenceLinks.push(link)
        }
        return <div>
            <h4>Primary Evidence Links</h4>
            <ul>
                {evidenceLinks}
            </ul>
        </div>
    }
}
