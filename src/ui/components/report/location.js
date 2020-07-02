export default function Location({ locationCity, locationState }) {

    return locationCity || locationState ? ' | ' + (locationCity ? locationCity + ', ' : '') + locationState : ''
}
