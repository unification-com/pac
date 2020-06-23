export default function FilterCategory({data, label, id}) {

    let defaultOption = <option value="" key={ id + '_default'}>Select</option>
    let categoryList = [defaultOption];

    for(let i = 0; i < data.values.length; i++) {
        let option = <option value={data.values[i]} key={id + '_' + data.values[i]}>
            {data.values[i]}
        </option>
        if(data.values[i] !== null && data.values[i] != '' && data.values[i] != 0) {
            categoryList.push(option);
        }
    }

    return <div>
        <label>Filter by {label}: </label>
        <select name={"select_"+id}
                id={"select-"+id}
                data-param={id}
                defaultValue={data.selected}
        >
            {categoryList}
        </select>
    </div>
}
