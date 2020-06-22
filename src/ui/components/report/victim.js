export default function Victim({ name, race, gender, age, image = '' }) {
    if(name === '') {
        return <div></div>
    } else {
        return <div>
            <h5>Victim Info</h5>
            {
                (image !== '') ?
                    <img src={image} /> :
                    <></>
            }
            <ul>
                <li key='victim_name'>
                    <strong>Name:</strong> {name}
                </li>
                <li key='victim_race'>
                    <strong>Race:</strong> {race}
                </li>
                {
                    (parseInt(age) > 0) ?
                        <li key='victim_age'>
                            <strong>Age:</strong> {age}
                        </li> :
                        <></>
                }
                <li key='victim_gender'>
                    <strong>Gender:</strong> {gender}
                </li>
            </ul>
        </div>
    }
}
