import utilStyles from "../../styles/utils.module.css";
import RenderImage from '../utils/render_image'

export default function Victim({ name, race, gender, age, image = '' }) {
    if(name === '') {
        return <div></div>
    } else {
        return <div className={[utilStyles.section, utilStyles.innerSection].join(' ')}>
            <h4 className={utilStyles.headingXs}>Victim Info</h4>

            <div>
            {
                (image !== '') ?
                    RenderImage(image, '', false)
                    :
                    <></>
            }
            <ul className={utilStyles.nb}>
                <li className={utilStyles.liFloat} key='victim_name'>
                    <label className={utilStyles.label}>Name</label>
                    <span className={[utilStyles.input, utilStyles.spanField].join(' ')}>{name}</span>
                </li>
                <li className={utilStyles.liFloat} key='victim_race'>
                    <label className={utilStyles.label}>Race</label>
                    <span className={[utilStyles.input, utilStyles.spanField].join(' ')}>{race}</span>
                </li>
                {
                    (parseInt(age) > 0) ?
                        <li className={utilStyles.liFloat} key='victim_age'>
                            <label className={utilStyles.label}>Age</label>
                            <span className={[utilStyles.input, utilStyles.spanField].join(' ')}>{age}</span>
                        </li> :
                        <></>
                }
                <li className={utilStyles.liFloat} key='victim_gender'>
                    <label className={utilStyles.label}>Gender</label>
                    <span className={[utilStyles.input, utilStyles.spanField].join(' ')}>{gender}</span>
                </li>
                <li className={utilStyles.clearLeft}></li>
            </ul>
            </div>
        </div>
    }
}
