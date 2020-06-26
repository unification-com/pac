import FilterCategory from './filters/filter_category'
import filterStyles from './filters.module.css'

export default function Filters({ categories, selectedPage }) {

    return <div>
        <form id="report-filters" className={filterStyles.filters}>
            <h2 className={filterStyles.filtersHeading}>Filters</h2>
            <FilterCategory data={categories.years} label="Date" id="year" />
            <FilterCategory data={categories.states} label="Location" id="state" />
            <FilterCategory data={categories.genders} label="Gender" id="gender" />
            <FilterCategory data={categories.ages} label="Age" id="age" />
            <FilterCategory data={categories.races} label="Race" id="race" />
            <div className={filterStyles.filter}>
                <label>Mainchain Tx</label>
                <select className={filterStyles.filterSelect}>
                    <option value="">Select</option>
                </select>
            </div>
            <input type="hidden" value={selectedPage} id="filter-current-page" name="filter_current_page" />
            <span className={filterStyles.sorting}>Sort by Area <img src="/assets/img/a-z.svg" alt="Sort alphabetically" className={filterStyles.sortingIcon} /></span>
            <span className={filterStyles.sorting}>Sort by Date <img src="/assets/img/0-9-active.svg" alt="Sort numerically" className={filterStyles.sortingIcon} /></span>
            <span className={filterStyles.sorting}>Sort by Video Source <img src="/assets/img/a-z.svg" alt="Sort alphabetically" className={filterStyles.sortingIcon} /></span>
        </form>
    </div>
}