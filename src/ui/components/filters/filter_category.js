import FCStyles from './filter_category.module.css'

export default function FilterCategory({ data, label, id }) {

    let defaultOption = <option value="" key={ id + '_default'}>Select</option>
    let categoryList = [defaultOption];

    for(let i = 0; i < data.values.length; i++) {
        let option = <option value={data.values[i].val} key={id + '_' + data.values[i].val}>
            {data.values[i].name}
        </option>
        if(data.values[i].val !== null && data.values[i].val != '' && data.values[i].val != 0) {
            categoryList.push(option);
        }
    }

    return <div className={FCStyles.filter}>
        <label>{label === 'Date' || label === 'Location' ? 'By ' : ''}{label}</label>
        <select name={"select_"+id}
                id={"select-"+id}
                data-param={id}
                defaultValue={data.selected}
                className={FCStyles.filterSelect}
        >
            {categoryList}
        </select>
    </div>
}
