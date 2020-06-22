export default function Location({ locationCity, locationCountry, locationState, locationStateCode }) {

    return <div>

        {( locationCity !== '')? locationCity + ', ': ''}

        {locationState}, {locationCountry}
    </div>
}
