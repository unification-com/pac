import styles from './map.module.css'

export default function Map({ lat, long, height }) {

    let url = 'https://maps.google.com/maps?width=700&height=440&hl=en&q=' + lat+ ',' + long + '&ie=UTF8&t=k&z=18&iwloc=B&output=embed'
    return <div>
        <div className={styles.map_wrapper}>
            <iframe height={height} src={url}
                    frameBorder="0" scrolling="no" marginHeight="0" marginWidth="0" />
        </div>
        <br/>
    </div>
}