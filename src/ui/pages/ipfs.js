import Layout, {siteTitle} from "../components/layout";
import Head from "next/head";
import Link from "next/link";
import utilStyles from "../styles/utils.module.css";
import styles from "../components/layout.module.css";
import fetch from "isomorphic-unfetch";
import Date from "../components/date";

export async function getServerSideProps(context) {
    const res = await fetch('http://localhost:3000/api/ipfs')
    const ipfsBackups = await res.json()

    const total = await fetch('http://localhost:3000/api/total');

    return {
        props: {
            ipfsBackups,
            total: await total.json()
        }
    }
}

export default function Ipfs({ipfsBackups, total}) {
    return (
        <Layout home total={total}>
            <Head>
                <title>{siteTitle}: IPFS Backup Archive</title>
                <script type="text/javascript" src="https://code.jquery.com/jquery-3.5.1.slim.min.js"/>
                <script type="text/javascript" src="/assets/js/search.js"/>
            </Head>
            <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
                <h2 className={utilStyles.headingLg}>IPFS Database Backups</h2>

                <p>
                    The PAC database is backed up daily, <em>in its entirety</em>, and saved to an IPFS node. This
                    puts the database in the public domain, and means that it is always available
                    anywhere, to anyone. It also means that anyone with an IPFS node can copy, host and serve the
                    database themselves. The data will always exist as long as at least one IPFS node is hosting it.
                </p>

                <h3>Latest IPFS Backup: <Date timestamp={ipfsBackups[0].timestamp} withTime='true' gmt='true'/></h3>

                <p>
                    <a href={'https://ipfs.io/ipfs/' + ipfsBackups[0].cid} className={utilStyles.link} target="_blank">
                        ipfs/{ipfsBackups[0].cid}/{ipfsBackups[0].filename}
                    </a>
                </p>

                <h3>Recent backup history</h3>

                <ul className={utilStyles.nbPadding}>
                {ipfsBackups.map((ipfs) => (
                    <li key={'cid-' + ipfs.cid}>
                        <div>
                            <strong>
                                <Date timestamp={ipfs.timestamp} withTime='true' gmt='true'/>
                            </strong>
                            :&nbsp;
                            <a href={'https://ipfs.io/ipfs/' + ipfs.cid} className={utilStyles.link} target="_blank">
                                ipfs/{ipfs.cid}/{ipfs.filename}
                            </a>
                        </div>
                    </li>
                ))}
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
