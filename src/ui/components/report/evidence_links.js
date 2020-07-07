import utilStyles from '../../styles/utils.module.css'
import RenderImage from "../utils/render_image";

const checkURLIsImage = (url) => {
    return (url.match(/\.(jpeg|jpg|gif|png)$/) != null);
};

export default function EvidenceLinks({ links }) {
    if(links.length === 0) {
        return <div></div>
    } else {
        let evidenceLinks = [];
        for(let i = 0; i < links.length; i++) {
            let linkContent = ''
            if(checkURLIsImage(links[i])) {
                linkContent = <a href={links[i]} className={utilStyles.link} target="_blank">
                    {RenderImage(links[i], '/assets/img/logo.png', false)}
                    {links[i]}
                </a>
            } else {
                linkContent = <a href={links[i]} className={utilStyles.link} target="_blank">
                    {links[i]}
                </a>
            }
            let link = <li key={links[i]}>
                {linkContent}
            </li>
            evidenceLinks.push(link)
        }
        return <div className={[utilStyles.section, utilStyles.innerSection].join(' ')}>
            <h4 className={utilStyles.headingXs}>Primary Evidence &amp; Links</h4>
            <ul className={utilStyles.nbPadding}>
                {evidenceLinks}
            </ul>
        </div>
    }
}
