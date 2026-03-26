import './AesTools.css'
import AesGcmCipher from './AesGcmCipher'

function AesTools() {
    return (
        <div id="aes-tools" className="aes-tools">
            <h1 className="aes-tools__title">AES-GCM</h1>
            <p className="aes-tools__subtitle">Encrypt and decrypt text using modern authenticated encryption</p>
            <div className="aes-tools__card-wrapper">
                <AesGcmCipher />
            </div>
        </div>
    )
}

export default AesTools
