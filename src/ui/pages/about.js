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
                <script type="text/javascript" src="https://code.jquery.com/jquery-3.5.1.slim.min.js" />
                <script type="text/javascript" src="/assets/js/search.js" />
            </Head>
            <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
                <h2 className={utilStyles.headingLg}>About</h2>

                <div className={styles.backToHome}>
                    <Link href="/">
                        <a>← Back to home</a>
                    </Link>
                </div>
            </section>
        </Layout>
    )
}
