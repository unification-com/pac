import Head from 'next/head'
import Layout, {siteTitle} from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import Pagination from "../components/pagination"
import Filters from "../components/filters"
import PreviewBlock from "../components/preview_block"
import fetch from 'isomorphic-unfetch'

export async function getServerSideProps(context) {
    let page = 1;
    let age = 0;
    let year = 0;
    let month = 0;
    let country = '';
    let state = '';
    let race = '';
    let gender = '';
    let armed = '';
    let source = '';
    let sort = -1; // default to descending

    if ('page' in context.query) {
        page = parseInt(context.query.page);
    }

    let pageQuery = '?page=' + page;
    let filterParams = '';

    if ('sort' in context.query) {
        if(parseInt(context.query.sort) === 1) {
            sort = 1;
        }
    }

    if ('age' in context.query) {
        age = parseInt(context.query.age);
        filterParams = filterParams + '&age=' + age;
    }

    if ('year' in context.query) {
        year = parseInt(context.query.year);
        filterParams = filterParams + '&year=' + year;
    }

    if ('month' in context.query) {
        month = parseInt(context.query.month);
        filterParams = filterParams + '&month=' + month;
    }

    if ('country' in context.query) {
        country = context.query.country;
        filterParams = filterParams + '&country=' + country;
    }

    if ('state' in context.query) {
        state = context.query.state;
        filterParams = filterParams + '&state=' + state;
    }

    if ('race' in context.query) {
        race = context.query.race;
        filterParams = filterParams + '&race=' + race;
    }

    if ('gender' in context.query) {
        gender = context.query.gender;
        filterParams = filterParams + '&gender=' + gender;
    }

    if ('armed' in context.query) {
        armed = context.query.armed;
        filterParams = filterParams + '&armed=' + armed;
    }

    if('source' in context.query) {
        source = context.query.source;
        filterParams = filterParams + '&source=' + source;
    }

    const res = await fetch('http://localhost:3000/api/latest' + pageQuery + filterParams + '&sort=' + sort)
    const allPostsData = await res.json()

    const catsRes = await fetch('http://localhost:3000/api/categories?cat=all');
    const catsData = await catsRes.json();

    let categories = {
        races: { selected: race, values: catsData.race },
        ages: { selected: age, values: catsData.age },
        genders: { selected: gender, values: catsData.gender },
        states: { selected: state, values: catsData.state },
        months: { selected: month, values: catsData.month },
        years: { selected: year, values: catsData.year },
        armed: { selected: armed, values: catsData.armed },
        sources: { selected: source, values: catsData.source },
    }

    return {
        props: {
            allPostsData,
            selectedPage: page,
            categories: categories,
            filterParams: filterParams,
            sort: sort,
        }
    }
}

export default function Home({ allPostsData, selectedPage, categories, filterParams, sort }) {

    return (
        <Layout home total={allPostsData.pages.total}>
            <Head>
                <title>{siteTitle}</title>
                <script type="text/javascript" src="https://code.jquery.com/jquery-3.5.1.slim.min.js" />
                <script type="text/javascript" src="/assets/js/search.js" />
                <script type="text/javascript" src="/assets/js/filter.js" />
            </Head>
            <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
                <Filters categories={categories} selectedPage={selectedPage} filterParams={filterParams} sort={sort}/>

                {allPostsData.data.map(({ }, i) => {
                    let j = i ? i + 1 : i;
                    if (!(j % 4) && i < 19) {
                        return <ul className={utilStyles.list} key={'pbul-' + i}>
                            {allPostsData.data.slice(j, j + 4).map(({ title, sourceDatetime, beaconHash, source, content, evidenceAdditional, locationState, locationCity, victimRace, victimGender, victimAge, victimName, locationLat, locationLong }) => (
                                <li className={utilStyles.listItem} key={beaconHash}>
                                    <PreviewBlock title={title}
                                        sourceDatetime={sourceDatetime}
                                        beaconHash={beaconHash}
                                        source={source}
                                        content={content}
                                        evidenceAdditional={evidenceAdditional}
                                        locationState={locationState}
                                        locationCity={locationCity}
                                        race={victimRace}
                                        gender={victimGender}
                                        age={victimAge}
                                        name={victimName}
                                        lat={locationLat}
                                        long={locationLong}
                                    />
                                </li>
                            ))}
                        </ul>
                    }
                })}
            </section>
            <section className={utilStyles.paginationContainer}>
                <Pagination pageData={allPostsData.pages} filterParams={filterParams} sort={sort} path='/' />
            </section>
        </Layout>
    )
}