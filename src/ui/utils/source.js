export function formatSource(source) {
    let sourceName = '';
    switch(source) {
        case '2020PoliceBrutality':
            sourceName = '2020 Police Brutality';
            break;
        case 'FelonEncounters':
            sourceName = 'Felon Encounters';
            break;
        case 'GuardianTheCounted':
            sourceName = 'Guardian - The Counted';
            break;
        case 'KilledByPolice':
            sourceName = 'Killed By Police';
            break;
        case 'MappingPoliceViolence':
            sourceName = 'Mapping Police Violence';
            break;
        case 'USPoliceShootings':
            sourceName = 'US Police Shootings';
            break;
        case 'WashingtonPost':
            sourceName = 'Washington Post';
            break;
    }
    return sourceName;
}