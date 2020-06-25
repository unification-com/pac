import FilterCategory from './filters/filter_category'

export default function Filters({categories, selectedPage}) {

    return <div>
        <form id="report-filters">
            <FilterCategory data={categories.races} label="Race" id="race" />
            <FilterCategory data={categories.ages} label="Age" id="age" />
            <FilterCategory data={categories.genders} label="Gender" id="gender" />
            <FilterCategory data={categories.states} label="State" id="state" />
            <FilterCategory data={categories.years} label="Year" id="year" />
            <FilterCategory data={categories.months} label="Month" id="month" />
            <FilterCategory data={categories.armed} label="Armed" id="armed" />
            <FilterCategory data={categories.sources} label="Data Source" id="source" />
            <input type="hidden" value={selectedPage} id="filter-current-page" name="filter_current_page" />
        </form>
        <a href='/' key='clear_filters'>Clear</a>
    </div>
}