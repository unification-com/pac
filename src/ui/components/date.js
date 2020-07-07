import { parseISO, format, fromUnixTime } from 'date-fns'

export default function Date({ timestamp, withTime=false, gmt=false }) {
    const date = fromUnixTime(timestamp)
    if(timestamp > 0) {
        if (withTime || gmt) {
            if(gmt) {
                return <time dateTime={timestamp}>{date.toUTCString()}</time>
            } else {
                return <time dateTime={timestamp}>{format(date, 'LLLL d, yyyy, hh:mm:ss')}</time>
            }
        } else {
            return <time dateTime={timestamp}>{format(date, 'LLLL d, yyyy')}</time>
        }
    } else {
        return <></>
    }
}