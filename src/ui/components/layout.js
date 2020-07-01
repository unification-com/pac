import Head from 'next/head'
import styles from './layout.module.css'
import utilStyles from '../styles/utils.module.css'
import Link from 'next/link'
import { useState } from 'react'


export const siteTitle = 'Public Accountability Chain'

export default function Layout({ children, home, total }) {

    const [show, setDisplay] = useState(false);

    function dropdown() {
        setDisplay(!show);
    }

    return (
        <>
            <Head>
                <link rel="icon" href="/favicon.ico"/>
                <meta
                    name="description"
                    content="Learn how to build a personal website using Next.js"
                />
                <meta
                    property="og:image"
                    content={`https://og-image.now.sh/${encodeURI(
                        siteTitle
                    )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
                />
                <meta name="og:title" content={siteTitle}/>
                <meta name="twitter:card" content="summary_large_image"/>
            </Head>
            <header className={styles.header}>
                <div className={styles.headerMain}>
                    <Link href="/">
                        <img src="/assets/img/logo.png" alt="Public Accountability Chain Logo" className={styles.headerImage} />
                    </Link>
                    <div className={styles.headingContainer}>
                        <Link href="/">
                            <h1 className={utilStyles.heading2Xl}>{siteTitle}</h1>
                        </Link>
                        <p className={styles.headerText}>Powered by Unification</p>
                    </div>
                    <form className={styles.search} id="site-search-form">
                        <input id="site-search-term" type="text" className={styles.searchField} placeholder="Search Incident or Unification Mainchain Tx" />
                        <input id="site-search-btn" type="submit" className={styles.searchButton} value="Search" />
                    </form>
                    <div className={styles.createContainer}>
                        {/*
                        <button type="button" className={styles.create} onClick={dropdown}>Create News</button>
                        <ul className={styles.dropdown} style={{display: show ? 'block' : 'none'}}>
                            <li>
                                <Link href="/new/[obj]" as="/new/incident">
                                    <a className={styles.dropdownLink}>Report new incident</a>
                                </Link>
                            </li>
                            <li>
                                <Link href="/new/[obj]" as="/new/source">
                                    <a className={styles.dropdownLink}>Report new source</a>
                                </Link>
                            </li>
                        </ul>
                        */}
                    </div>
                </div>
                <div className={styles.totalContainer}>
                    <div className={styles.total}>
                        {total ? (
                            <>
                                Total incidents <span className={styles.totalNumber}>{total.toLocaleString('fr-FR')}</span>
                            </>
                        ) : (
                            <></>
                        )}
                    </div>
                </div>
            </header>
            <main className={styles.main}>
                {!home && (
                    <div className={styles.backToHome}>
                        <Link href="/">
                            <a className={styles.link}>← Back to all Sources</a>
                        </Link>
                    </div>
                )}
                {children}
            </main>
            <footer className={styles.footer}>
                <p className={styles.footerLeft}>Powered by <a href="https://unification.com/" target="_blank"><img src="/assets/img/unification-logo.png" className={styles.footerLogo} alt="Unification" /></a></p>
                <a href="https://github.com/unification-com/pac" className={styles.link} target="_blank">Github</a> | <a href="#" className={styles.link}>Request to add sources</a>
            </footer>
        </>
    )
}