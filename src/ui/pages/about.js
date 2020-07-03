import Layout, {siteTitle} from "../components/layout";
import Head from "next/head";
import utilStyles from "../styles/utils.module.css";
import styles from "../components/layout.module.css";
import Link from "next/link";

export default function Home() {
    return (
        <Layout home>
            <Head>
                <title>{siteTitle}: About</title>
                <script type="text/javascript" src="https://code.jquery.com/jquery-3.5.1.slim.min.js"/>
                <script type="text/javascript" src="/assets/js/search.js"/>
            </Head>
            <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
                <h2 className={utilStyles.headingLg}>About</h2>

                <h3>Data Sources</h3>

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
