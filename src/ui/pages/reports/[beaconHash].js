import fetch from 'isomorphic-unfetch'
import Head from 'next/head'
import Layout from '../../components/layout'
import utilStyles from '../../styles/utils.module.css'
import Date from '../../components/date'
import Victim from '../../components/report/victim'
import EvidenceLinks from '../../components/report/evidence_links'
import Location from '../../components/report/location'
import IPFSArchive from '../../components/report/ipfs_archive'
import Source from '../../components/report/source'
import AdditionalEvidence from '../../components/report/additional_evidence'
import Beacon from '../../components/report/beacon'
import CrossReferences from '../../components/report/cross_references'
import Map from '../../components/report/map';
import IncidentReport from '../../../common/incident_report'

export async function getServerSideProps(context) {
    const res = await fetch('http://localhost:3000/api/report?beaconHash=' + context.params.beaconHash)
    let incidentReportResult = await res.json()
    let incidentReport = {
        status: incidentReportResult.status,
        error: incidentReportResult.error,
    };
    if (incidentReportResult.status) {
        incidentReport = incidentReportResult.result;
        incidentReport.status = incidentReportResult.status;
        incidentReport.error = '';
        let beaconTx = {}
        let crossReferences = []
        for (let i = 0; i < incidentReport.crossReferences.length; i++) {
            let cr = incidentReport.crossReferences[i];
            const crRes = await fetch('http://localhost:3000/api/report?beaconHash=' + cr.beaconHash)
            let crResJson = await crRes.json()
            cr.title = ''
            if(crResJson.status) {
                cr.title = crResJson.result.title
            }
            crossReferences.push(cr)
        }
        incidentReport.crossReferences = crossReferences

        if (incidentReport.mainchainTxHash !== '') {
            const mcRes = await fetch(process.env.MAINCHAIN_REST + '/txs/' + incidentReport.mainchainTxHash)
            beaconTx = await mcRes.json()
        }
        incidentReport.beaconTx = beaconTx

        let ir = new IncidentReport()
        ir.loadFromDb(incidentReport);
        incidentReport.dataHashed = ir.getDataToHash(true)
        incidentReport.generatedHash = ir.hash()
    }
    const total = await fetch('http://localhost:3000/api/total');
    return {
        props: {
            incidentReport,
            total: await total.json()
        }
    }
}

export default function Report({ incidentReport, total }) {
    if (!incidentReport.status) {
        return <Layout>
            <Head>
                <title>{incidentReport.error}</title>
            </Head>
            <article>
                <h1>{incidentReport.error}</h1>
            </article>
        </Layout>
    }

    let map = '';
    if (incidentReport.locationHasGeo) {
        map = <Map lat={incidentReport.locationLat} long={incidentReport.locationLong}/>
    }

    return <Layout total={total}>
        <Head>
            <title>{incidentReport.title}</title>
            <script type="text/javascript" src="https://code.jquery.com/jquery-3.5.1.slim.min.js" />
            <script type="text/javascript" src="/assets/js/search.js" />
        </Head>
        <article className={utilStyles.section}>
            <div className={utilStyles.lightText}>
                <Date timestamp={incidentReport.sourceDatetime} />
                <Location locationCity={incidentReport.locationCity}
                          locationState={incidentReport.locationState}
                />
            </div>
            <h2 className={utilStyles.headingXl}>{incidentReport.title}</h2>

            <h3 className={utilStyles.headingSm}>Details</h3>
            {incidentReport.content}

            <EvidenceLinks links={incidentReport.evidenceLinks}/>

            <AdditionalEvidence additionalEvidence={incidentReport.evidenceAdditional} />

            <IPFSArchive links={incidentReport.evidenceIpfsArchive}/>

            <Source source={incidentReport.source}
                    sourceAdditionalData={incidentReport.sourceAdditionalData}
                    sourceId={incidentReport.sourceId}
                    sourceUrl={incidentReport.sourceUrl}/>
            
            <CrossReferences hasCrossReferences={incidentReport.hasCrossReferences}
                             crossReferences={incidentReport.crossReferences}/>

            {map}

            <Beacon beaconHash={incidentReport.beaconHash}
                    beaconTimestamp={incidentReport.beaconTimestamp}
                    beaconTimestampId={incidentReport.beaconTimestampId}
                    mainchainTxHash={incidentReport.mainchainTxHash}
                    mainchainBlockHeight={incidentReport.mainchainBlockHeight}
                    beaconTx={incidentReport.beaconTx}
                    dataHashed={incidentReport.dataHashed}
                    generatedHash={incidentReport.generatedHash}/>

        </article>
    </Layout>
}