import './BcryptTools.css'
import BcryptGenerate from './BcryptGenerate'
import BcryptCompare from './BcryptCompare'

function BcryptTools() {
    return (
        <div className='bcrypt-tools'>
            <h1 className='bcrypt-tools__title'>Bcrypt Hash Generator</h1>
            <p className='bcrypt-tools__subtitle'>Create and compare bcrypt hashes with ease</p>
            <div className='bcrypt-tools__card-wrapper'>
                <BcryptGenerate />
                <BcryptCompare />
            </div>
        </div>
    )
}

export default BcryptTools