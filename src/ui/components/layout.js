import Head from 'next/head'
import styles from './layout.module.css'
import utilStyles from '../styles/utils.module.css'
import Link from 'next/link'

export const siteTitle = 'Public Accountability Chain'

export default function Layout({ children, home, total }) {

    return (
        <div className={styles.container}>
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
                    <img src="/assets/img/logo.png" alt="Public Accountability Chain Logo" className={styles.headerImage} />
                    <div className={styles.headingContainer}>
                        {home ? (
                            <>
                                <h1 className={utilStyles.heading2Xl}>{siteTitle}</h1>
                            </>
                        ) : (
                            <>
                                <h2 className={utilStyles.headingLg}>
                                    <Link href="/">
                                        <a className={utilStyles.colorInherit}>{siteTitle}</a>
                                    </Link>
                                </h2>
                            </>
                        )}
                        <p className={styles.headerText}>Powered by Unification</p>
                    </div>
                    <form className={styles.search}>
                        <input type="text" className={styles.searchField} placeholder="Search Incident or Unification Mainchain Tx" />
                        <input type="submit" className={styles.searchButton} value="Search" />
                    </form>
                    <input type="button" className={styles.create} value="Create News" />
                </div>
                <div className={styles.totalContainer}>
                    <div className={styles.total}>
                        Total incidents <span className={styles.totalNumber}>{total.toLocaleString('fr-FR')}</span>
                    </div>
                </div>
            </header>
            {!home && (
                <div className={styles.backToHome}>
                    <Link href="/">
                        <a>← Back to home</a>
                    </Link>
                </div>
            )}
            <main className={styles.main}>{children}</main>
            {!home && (
                <div className={styles.backToHome}>
                    <Link href="/">
                        <a>← Back to home</a>
                    </Link>
                </div>
            )}
        </div>
    )
}