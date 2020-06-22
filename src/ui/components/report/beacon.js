import Date from "../date";
import Alert from "../alert";
import {hashesAreEqual} from '../../lib/utils'

export default function Beacon({beaconHash, beaconTimestampId, beaconTimestamp, mainchainTxHash, mainchainBlockHeight, beaconTx, dataHashed, generatedHash}) {

    let hashesMatch;
    let mainchainTxInfo = ''
    let hasMainchain = false;
    if(mainchainTxHash === '' || mainchainTxHash === null  || mainchainTxHash === undefined) {
        hashesMatch = (hashesAreEqual(beaconHash, generatedHash))?<Alert type='success' children='YES'/>:<Alert type='error' children='NO'/>
        mainchainTxInfo = <div>
            <h5>Mainchain details</h5>
            <p>
                Hash {beaconHash} not yet submitted to Mainchain
            </p>
        </div>
    } else {
        hasMainchain = true
        hashesMatch = (hashesAreEqual(beaconHash, generatedHash, beaconTx.logs[0].events[1].attributes[2].value))?<Alert type='success' children='YES'/>:<Alert type='error' children='NO'/>
        mainchainTxInfo = <div>
            <h5>Mainchain details</h5>
            <p>
                Database row was hashed and submitted to Mainchain on <Date timestamp={beaconTimestamp} withTime='true'/>.
                The Timestamp ID is <a href={process.env.MAINCHAIN_REST + '/beacon/' + process.env.BEACON_ID + '/timestamp/' + beaconTimestampId} target="_blank">{beaconTimestampId}</a>.
                Submitted in Mainchain Tx <a href={process.env.MAINCHAIN_EXPLORER + '/txs/' + mainchainTxHash} target="_blank">{mainchainTxHash}</a>, at block
                height <a href={process.env.MAINCHAIN_EXPLORER + '/blocks/' + mainchainBlockHeight} target="_blank">{mainchainBlockHeight}</a>
            </p>

            <h5>Transaction details</h5>
            <p>
                Tx <a href={process.env.MAINCHAIN_EXPLORER + '/txs/' + mainchainTxHash} target="_blank">{mainchainTxHash}</a><br />
                Sent from: <a href={process.env.MAINCHAIN_EXPLORER + '/account/' + beaconTx.logs[0].events[0].attributes[1].value} target="_blank">{beaconTx.logs[0].events[0].attributes[1].value}</a><br />
                Public Key Type: {beaconTx.tx.value.signatures[0].pub_key.type}<br />
                Public Key: {beaconTx.tx.value.signatures[0].pub_key.value}<br />
                Signature: {beaconTx.tx.value.signatures[0].signature} <br/>
                Signed data: <textarea defaultValue={beaconTx.raw_log}/>
            </p>
        </div>
    }

    return <div>
        <h4>BEACON Data</h4>
        {mainchainTxInfo}
        <h5>Hash Comparison</h5>
        <strong>Hash stored in database: </strong>{beaconHash} <br/>

        { hasMainchain ? (
            <>
                <strong>Hash from&nbsp;
                <a href={process.env.MAINCHAIN_EXPLORER + '/txs/' + mainchainTxHash} target="_blank">
                    Mainchain Tx
                </a>: </strong>{beaconTx.logs[0].events[1].attributes[2].value}<br />
            </>
            ) : (
            <></>
            )}

        <strong>Dynamically generated hash: </strong>{generatedHash} <br/>
        <strong>Hashes Match? </strong> {hashesMatch} <br />

        <h5>How is the comparison calculated?</h5>
        <p>The hash stored in the database is used as the identifier for this report, and can be seen in the URL. The hash
        from the Mainchain Tx is the hash sent to and stored on Mainchain. Finally, the "generated hash" is generated each
        time this page is loaded, using the same data used for the hash submitted to Mainchain.
        </p>

        <p>
            <strong>Raw data used to generate the hash, using the Node.js crypto.createHash('sha256') algorithm: </strong>
            <textarea defaultValue={dataHashed} />
        </p>
    </div>
}