import './RsaTools.css'
import RsaKeypairGenerator from './RsaKeypairGenerator'

function RsaTools() {
    return (
        <div id="rsa-tools" className="rsa-tools">
            <h1 className="rsa-tools__title">RSA Key Pair Generator</h1>
            <p className="rsa-tools__subtitle">Generate exportable public and private RSA keys in PEM format</p>
            <div className="rsa-tools__card-wrapper">
                <RsaKeypairGenerator />
            </div>
        </div>
    )
}

export default RsaTools
