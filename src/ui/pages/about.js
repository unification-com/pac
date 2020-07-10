import Layout, {siteTitle} from "../components/layout";
import Head from "next/head";
import utilStyles from "../styles/utils.module.css";
import styles from "../components/layout.module.css";
import Link from "next/link";
import fetch from "isomorphic-unfetch";

export async function getServerSideProps(context) {
    const total = await fetch('http://localhost:3000/api/total');

    return {
        props: {
            total: await total.json()
        }
    }
}

export default function About({total}) {
    return (
        <Layout home total={total}>
            <Head>
                <title>{siteTitle}: About</title>
                <script type="text/javascript" src="https://code.jquery.com/jquery-3.5.1.slim.min.js"/>
                <script type="text/javascript" src="/assets/js/search.js"/>
            </Head>
            <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
                <h2 className={utilStyles.headingLg}>About</h2>

                <p>
                Public Accountability Chain (PAC) at <a href="https://pac.foundation">pac.foundation</a> serves its constituents by
                </p>

                <ol>
                    <li>Searching publicly available databases & info sources of police misconduct</li>
                    <li>Standardising the data into the same format (so it can be indexed and searched)</li>
                    <li>backs up the full database to <a href="/ipfs">IPFS</a> which is a distributed, decentralised storage network -  so it is not in a single source of failure  (to keep a non-destructible, reconcilable record of the data)</li>
                    <li>Provides a sortable, sharable front-end to share this information easily & publicly</li>
                    <li>Submits a BEACON timestamp hash to the Unification Mainchain for each new entry added & stamps the intermittent feed regularly to the Unification mainnet (to keep immutable verifiable hash link of the data)</li>
                    <li>Provides a public data access API to query the data and puts up a frontend for a non-technical user to be able to search and access the data  (to allow full sovereignty of the data)</li>
                </ol>

                <p>
                The next steps for the PAC foundation are to
                </p>

                <ol>
                    <li>Allows citizens to submit new stories and new sources into PAC. New additions will be cross-verified in a staging server before being added to PAC.  This will make new source additions such as the government proposed database</li>
                    <li>add new sources and APIs</li>
                </ol>

                <p>
                    We encourage those interested to review, and contribute to the project technically <a href="https://github.com/unification-com/pac" target="_blank">https://github.com/unification-com/pac</a>.
                </p>

                <h3>Current Data Sources</h3>

                <ul>
                    <li>Police Brutality: <a href="https://github.com/2020PB/police-brutality"
                                             target="_blank">https://github.com/2020PB/police-brutality</a></li>
                    <li>fatalencounters.org: <a href="https://fatalencounters.org"
                                                target="_blank">https://fatalencounters.org</a></li>
                    <li>The Guardian: <a
                        href="https://www.theguardian.com/us-news/ng-interactive/2015/jun/01/about-the-counted"
                        target="_blank">https://www.theguardian.com/us-news/ng-interactive/2015/jun/01/about-the-counted</a>
                    </li>
                    <li>Killed By Police: <a href="https://killedbypolice.net"
                                             target="_blank">https://killedbypolice.net</a></li>
                    <li>Mapping Police Violence: <a href="https://mappingpoliceviolence.org"
                                                    target="_blank">https://mappingpoliceviolence.org</a></li>
                    <li>US Police Shootings: <a
                        href="https://docs.google.com/spreadsheets/d/1cEGQ3eAFKpFBVq1k2mZIy5mBPxC6nBTJHzuSWtZQSVw"
                        target="_blank">https://docs.google.com/spreadsheets/d/1cEGQ3eAFKpFBVq1k2mZIy5mBPxC6nBTJHzuSWtZQSVw</a>
                    </li>
                    <li>Washington Post: <a
                        href="https://raw.githubusercontent.com/washingtonpost/data-police-shootings/master/fatal-police-shootings-data.csv"
                        target="_blank">https://raw.githubusercontent.com/washingtonpost/data-police-shootings/master/fatal-police-shootings-data.csv</a>
                    </li>
                </ul>

                <div className={styles.backToHome}>
                    <Link href="/">
                        <a>← Back to home</a>
                    </Link>
                </div>
            </section>
        </Layout>
    )
}
