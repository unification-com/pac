import utilStyles from '../../styles/utils.module.css'
import Layout, {siteTitle} from "../../components/layout";
import Head from "next/head";
import PreviewBlock from "../../components/preview_block";
import Pagination from "../../components/pagination";
import fetch from "isomorphic-unfetch";

export async function getServerSideProps(context) {
    let page = 1;
    let term = '';

    if('page' in context.query) {
        page = parseInt(context.query.page);
    }

    if('term' in context.query) {
        term = context.query.term;
    }

    const res = await fetch('http://localhost:3000/api/search?term=' + context.params.term + '&page=' + page)
    const searchPostsData = await res.json()

    return {
        props: {
            searchPostsData,
            selectedPage: page,
            term: term
        }
    }
}

export default function SearchResults({searchPostsData, term}) {
    return (
        <Layout home>
            <Head>
                <title>{siteTitle}</title>
                <script type="text/javascript" src="https://code.jquery.com/jquery-3.5.1.slim.min.js" />
                <script type="text/javascript" src="/assets/js/search.js" />
            </Head>
            <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
                <h2 className={utilStyles.headingLg}>Search Results: {searchPostsData.pages.total} found</h2>
                <ul className={utilStyles.list}>
                    {searchPostsData.data.map(({title, sourceDatetime, beaconHash, source, content, evidenceAdditional}) => (
                        <li className={utilStyles.listItem} key={beaconHash}>
                            <PreviewBlock title={title}
                                          sourceDatetime={sourceDatetime}
                                          beaconHash={beaconHash}
                                          source={source}
                                          content={content}
                                          evidenceAdditional={evidenceAdditional}
                            />
                        </li>
                    ))}
                </ul>
            </section>
            <section>
                <Pagination pageData={searchPostsData.pages} path={'/search/' + term} filterParams='' />
            </section>
        </Layout>
    )
}