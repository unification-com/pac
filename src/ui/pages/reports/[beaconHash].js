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
    return {
        props: {
            incidentReport
        }
    }
}

export default function Report({incidentReport}) {
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

    return <Layout total={incidentReport.totalPages}>
        <Head>
            <title>{incidentReport.title}</title>
        </Head>
        <article className={utilStyles.section}>
            <div className={utilStyles.lightText}>
                <Date timestamp={incidentReport.sourceDatetime} />
            </div>
            <h2 className={utilStyles.headingXl}>{incidentReport.title}</h2>

            <Location locationCity={incidentReport.locationCity}
                      locationCountry={incidentReport.locationCountry}
                      locationState={incidentReport.locationState}
                      locationStateCode={incidentReport.locationStateCode}
            />

            <div>
                <h2>Details</h2>
                <div dangerouslySetInnerHTML={{__html: incidentReport.content}}/>

                <Victim name={incidentReport.victimName}
                        race={incidentReport.victimRace}
                        age={incidentReport.victimAge}
                        gender={incidentReport.victimGender}
                        image={
                            (incidentReport.source === 'FelonEncounters' || incidentReport.source === 'MappingPoliceViolence')?
                                incidentReport.evidenceAdditional.image_of_victim : ''
                        }/>

                <EvidenceLinks links={incidentReport.evidenceLinks}/>

                {map}

                <AdditionalEvidence additionalEvidence={incidentReport.evidenceAdditional}/>

                <IPFSArchive links={incidentReport.evidenceIpfsArchive}/>

            </div>


            <div>
                <Source source={incidentReport.source}
                        sourceAdditionalData={incidentReport.sourceAdditionalData}
                        sourceId={incidentReport.sourceId}
                        sourceUrl={incidentReport.sourceUrl}/>
            </div>
            
            <CrossReferences hasCrossReferences={incidentReport.hasCrossReferences}
                             crossReferences={incidentReport.crossReferences}/>

            <div>
                <Beacon beaconHash={incidentReport.beaconHash}
                        beaconTimestamp={incidentReport.beaconTimestamp}
                        beaconTimestampId={incidentReport.beaconTimestampId}
                        mainchainTxHash={incidentReport.mainchainTxHash}
                        mainchainBlockHeight={incidentReport.mainchainBlockHeight}
                        beaconTx={incidentReport.beaconTx}
                        dataHashed={incidentReport.dataHashed}
                        generatedHash={incidentReport.generatedHash}/>
            </div>

        </article>
    </Layout>
}