import Link from 'next/link';
import FilterCategory from './filters/filter_category'
import filterStyles from './filters.module.css'
import utilStyles from '../styles/utils.module.css'
import { useState } from 'react'

export default function Filters({categories, selectedPage, filterParams, sort}) {

    const [expand, setDisplay] = useState(false);

    function dropdown() {
        setDisplay(!expand);
    }

    let newSort = 0 - sort
    let sortImg = '/assets/img/0-9.png';
    if(newSort > 0) {
        sortImg = '/assets/img/0-9-active.svg';
    }
    let q = '';
    if(filterParams) {
        q = '?page=1' + filterParams + '&sort=' + newSort
    } else {
        q = '?sort=' + newSort
    }

    return <div className={filterStyles.filtersContainer}>
        <h2 className={[utilStyles.headingLg, filterStyles.mobilePointer].join(' ')} onClick={dropdown}>Filters <span className={expand ? [filterStyles.arrow, filterStyles.up].join(' ') : filterStyles.arrow}>&#9207;</span></h2>
        <form id="report-filters" className={expand ? filterStyles.filters : [filterStyles.filters, filterStyles.filtersCollapsed].join(' ')}>
            <div className={filterStyles.filterCategories}>
                <FilterCategory data={categories.years} label="Date" id="year"/>
                <FilterCategory data={categories.states} label="Location" id="state"/>
                <FilterCategory data={categories.genders} label="Gender" id="gender"/>
                <FilterCategory data={categories.ages} label="Age" id="age"/>
                <FilterCategory data={categories.races} label="Race" id="race"/>
                <FilterCategory data={categories.armed} label="Armed" id="armed"/>
                <FilterCategory data={categories.sources} label="By Source" id="source"/>
                <input type="hidden" value={selectedPage} id="filter-current-page" name="filter_current_page" />
            </div>

            <a href="/">
                <span className={filterStyles.sorting}>
                    Clear Filters
                </span>
            </a>

            <span className={filterStyles.sorting}>Sort by Date
                <Link href={'/' + q}>
                    <img src={sortImg}
                         alt="Sort numerically"
                         className={filterStyles.sortingIcon}/>
                </Link>
            </span>
            {/*
            <span className={filterStyles.sorting}>Sort by Area <img src="/assets/img/a-z.svg" alt="Sort alphabetically" className={filterStyles.sortingIcon} /></span>
            <span className={filterStyles.sorting}>Sort by Video Source <img src="/assets/img/a-z.svg" alt="Sort alphabetically" className={filterStyles.sortingIcon} /></span>
            */}
        </form>
    </div>
}