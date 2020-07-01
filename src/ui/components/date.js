import { parseISO, format, fromUnixTime } from 'date-fns'

export default function Date({ timestamp, withTime=false }) {
    const date = fromUnixTime(timestamp)
    if(timestamp > 0) {
        if (withTime) {
            return <time dateTime={timestamp}>{format(date, 'LLLL d, yyyy, hh:mm:ss')}</time>
        } else {
            return <time dateTime={timestamp}>{format(date, 'LLLL d, yyyy')}</time>
        }
    } else {
        return <></>
    }
}