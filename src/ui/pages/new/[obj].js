import Head from 'next/head'
import Layout from '../../components/layout'
import utilStyles from '../../styles/utils.module.css'

export async function getServerSideProps(context) {
    const res = await fetch('http://localhost:3000/api/total')
    return {
        props: {
            obj: context.query.obj,
            total: await res.json()
        }
    }
}

export default function Report({ obj, total }) {

    const title = 'Report new ' + obj.charAt(0).toUpperCase() + obj.slice(1);
    const Row = function () {
        return <p className={utilStyles.inputContainer}>
            <input type="text" className={utilStyles.input} /> <input type="button" className={utilStyles.addRemove} value="+" onClick={add} />
        </p>
    };

    function add() {}

    return <Layout total={total}>
        <Head>
            <title>{title}</title>
        </Head>
        <h2 className={utilStyles.headingLg}>{title}</h2>
        <section className={utilStyles.section}>
            <form>
                <h3>Instructions</h3>
                {obj === 'incident' ? (
                    <>
                        <p>Add the key information about the incident under the headings Location, Date, Description and Links below and then click the green "Submit new issue" button.</p>
                        <p>If you are unsure about any details then please write "Unknown" under that heading.</p>
                    </>
                ) : (
                    <>
                        <p>You can also add more than one link. After that, our moderators will approve your source and post on our website</p>
                    </>
                )}
                <fieldset>
                    <legend>Links</legend>
                    <Row />
                </fieldset>
                <p className={utilStyles.submitContainer}><input type="submit" className={utilStyles.submit} value={'Submit new ' + (obj === 'source' ? obj : 'issue')} /></p>
            </form>
       </section>
    </Layout>
}