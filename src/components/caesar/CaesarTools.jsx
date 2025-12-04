import './CaesarTools.css'
import CaesarCipher from './CaesarCipher'

function CaesarTools() {
    return (
        <div id="caesar-tools" className='caesar-tools'>
            <h1 className='caesar-tools__title'>Caesar Cipher</h1>
            <p className='caesar-tools__subtitle'>Encrypt and decrypt text using the classic Caesar cipher algorithm</p>
            <div className='caesar-tools__card-wrapper'>
                <CaesarCipher />
            </div>
        </div>
    )
}

export default CaesarTools

