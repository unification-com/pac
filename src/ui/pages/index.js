import Head from 'next/head'
import Layout, {siteTitle} from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import Link from "next/link";
import Date from "../components/date";
import Pagination from "../components/pagination"
import fetch from 'isomorphic-unfetch'

import {formatSource} from '../lib/source'

export async function getServerSideProps(context) {
    let page = 1;
    if('page' in context.query) {
        page = parseInt(context.query.page)
    }
    const res = await fetch('http://localhost:3000/api/latest?page='+page)
    const allPostsData = await res.json()
    return {
        props: {
            allPostsData
        }
    }
}

export default function Home({allPostsData}) {
    return (
        <Layout home>
            <Head>
                <title>{siteTitle}</title>
            </Head>
            <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
                <h2 className={utilStyles.headingLg}>Latest Reports ({allPostsData.pages.total}) UPDATIFY</h2>
                <ul className={utilStyles.list}>
                    {allPostsData.data.map(({title, sourceDatetime, beaconHash, source}) => (
                        <li className={utilStyles.listItem} key={beaconHash}>
                            <Link href="/reports/[beaconHash]" as={`/reports/${beaconHash}`}>
                                <a>{title}</a>
                            </Link> (<Date timestamp={sourceDatetime}/>, {formatSource(source)})
                        </li>
                    ))}
                </ul>
            </section>
            <section>
                <Pagination pageData={allPostsData.pages} path='/' />
            </section>
        </Layout>
    )
}
