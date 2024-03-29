import Date from '../date';
import Alert from '../alert';
import {hashesAreEqual} from '../../utils/utils'
import utilStyles from '../../styles/utils.module.css'

export default function Beacon({beaconHash, beaconTimestampId, beaconTimestamp, mainchainTxHash, mainchainBlockHeight, beaconTx, dataHashed, generatedHash, mainchainRest, mainchainExplorer, beaconId}) {

    let hashesMatch;
    let mainchainTxInfo = ''
    let hasMainchain = false;
    if(mainchainTxHash === '' || mainchainTxHash === null  || mainchainTxHash === undefined) {
        hashesMatch = (hashesAreEqual(beaconHash, generatedHash))?<Alert type='success' children='YES'/>:<Alert type='error' children='NO'/>
        mainchainTxInfo = <div className={[utilStyles.section, utilStyles.innerSection, utilStyles.breakWord].join(' ')}>
            <h4 className={utilStyles.headingXs}>Mainchain details</h4>
            <p>
                Hash {beaconHash} not yet submitted to Mainchain
            </p>
        </div>
    } else {
        hasMainchain = true
        hashesMatch = (hashesAreEqual(beaconHash, generatedHash, beaconTx.tx_response.logs[0].events[1].attributes[2].value))?<Alert type='success' children='YES'/>:<Alert type='error' children='NO'/>
        mainchainTxInfo = <>
            <div className={[utilStyles.section, utilStyles.innerSection, utilStyles.breakWord].join(' ')}>
                <h4 className={utilStyles.headingXs}>Mainchain details</h4>
                <p>
                    The BEACON hash was timestamped at <Date timestamp={beaconTimestamp} withTime='true' gmt='true' /> and successfully submitted to Mainchain.
                    The BEACON Timestamp ID is <a href={mainchainRest + '/mainchain/beacon/v1/beacon/' + beaconId + '/timestamp/' + beaconTimestampId} target="_blank">{beaconTimestampId}</a>.
                    Submitted in Mainchain Tx <a href={mainchainExplorer + '/transactions/' + mainchainTxHash} target="_blank">{mainchainTxHash}</a>, at block
                    height <a href={mainchainExplorer + '/blocks/' + mainchainBlockHeight} target="_blank">{mainchainBlockHeight}</a>
                </p>
            </div>

            <div className={[utilStyles.section, utilStyles.innerSection, utilStyles.breakWord].join(' ')}>
                <h4 className={utilStyles.headingXs}>Transaction details</h4>
                <p>
                    Tx <a href={mainchainExplorer + '/transactions/' + mainchainTxHash} target="_blank">{mainchainTxHash}</a><br />
                    Sent from: <a href={mainchainExplorer + '/accounts/' + beaconTx.tx.body.messages[0].owner} target="_blank">{beaconTx.tx.body.messages[0].owner}</a><br />
                    Public Key Type: {beaconTx.tx.auth_info.signer_infos[0].public_key['@type']}<br />
                    Public Key: {beaconTx.tx.auth_info.signer_infos[0].public_key.key}<br />
                    Signature: {beaconTx.tx.signatures[0]} <br/>
                    Raw Tx data: <textarea defaultValue={JSON.stringify(beaconTx)}/>
                </p>
            </div>
        </>
    }

    return <>
        <h3 className={utilStyles.headingSm}>BEACON Data</h3>
        {mainchainTxInfo}
        <div className={[utilStyles.section, utilStyles.innerSection, utilStyles.breakWord].join(' ')}>
            <h4 className={utilStyles.headingXs}>Hash Comparison</h4>
            <p><strong>Hash stored in database: </strong>{beaconHash}</p>

            { hasMainchain ? (
                <>
                    <p>
                        <strong>Hash from&nbsp;
                        <a href={mainchainExplorer + '/transactions/' + mainchainTxHash} target="_blank">
                                    Mainchain Tx
                        </a>: </strong>{beaconTx.tx_response.logs[0].events[1].attributes[2].value}
                    </p>
                </>
                ) : (
                <></>
                )}

            <p><strong>Dynamically generated hash: </strong>{generatedHash}</p>
            <strong>Hashes Match? </strong> {hashesMatch}
        </div>

        <div className={[utilStyles.section, utilStyles.innerSection].join(' ')}>
            <h4 className={utilStyles.headingXs}>How is the comparison calculated?</h4>
            <p>The hash stored in the database is used as the identifier for this report, and can be seen in the URL. The hash
            from the Mainchain Tx is the hash sent to and stored on Mainchain. Finally, the "generated hash" is generated each
            time this page is loaded, using the same data used for the hash submitted to Mainchain.</p>

            <p>
                <strong>Raw data used to generate the hash, using the Node.js crypto.createHash('sha256') algorithm: </strong>
                <textarea defaultValue={dataHashed} />
            </p>
        </div>
    </>
}
