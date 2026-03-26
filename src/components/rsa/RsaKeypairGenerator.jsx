import { useState } from 'react'
import './RsaKeypairGenerator.css'

const MODULUS_OPTIONS = [2048, 3072, 4096]
const PUBLIC_EXPONENT = new Uint8Array([1, 0, 1])

function toPem(buffer, label) {
    const bytes = new Uint8Array(buffer)
    let binary = ''
    const chunkSize = 0x8000

    for (let i = 0; i < bytes.length; i += chunkSize) {
        binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize))
    }

    const base64 = window.btoa(binary)
    const wrapped = base64.match(/.{1,64}/g)?.join('\n') || base64

    return `-----BEGIN ${label}-----\n${wrapped}\n-----END ${label}-----`
}

function RsaKeypairGenerator() {
    const [modulusLength, setModulusLength] = useState(2048)
    const [publicKeyPem, setPublicKeyPem] = useState('')
    const [privateKeyPem, setPrivateKeyPem] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [isGenerating, setIsGenerating] = useState(false)

    const handleGenerate = async () => {
        if (!window.crypto?.subtle) {
            setErrorMessage('Web Crypto API is not available in this browser context.')
            return
        }

        setIsGenerating(true)
        setErrorMessage('')
        setPublicKeyPem('')
        setPrivateKeyPem('')

        try {
            const keyPair = await window.crypto.subtle.generateKey(
                {
                    name: 'RSA-OAEP',
                    modulusLength,
                    publicExponent: PUBLIC_EXPONENT,
                    hash: 'SHA-256'
                },
                true,
                ['encrypt', 'decrypt']
            )

            const exportedPublicKey = await window.crypto.subtle.exportKey('spki', keyPair.publicKey)
            const exportedPrivateKey = await window.crypto.subtle.exportKey('pkcs8', keyPair.privateKey)

            setPublicKeyPem(toPem(exportedPublicKey, 'PUBLIC KEY'))
            setPrivateKeyPem(toPem(exportedPrivateKey, 'PRIVATE KEY'))
        } catch (error) {
            console.error('Failed to generate RSA key pair:', error)
            setErrorMessage('Failed to generate keys. Please try again.')
        } finally {
            setIsGenerating(false)
        }
    }

    const handleClear = () => {
        setPublicKeyPem('')
        setPrivateKeyPem('')
        setErrorMessage('')
    }

    return (
        <div className="rsa-keypair__card">
            <h3 className="rsa-keypair__title">Generate Key Pair</h3>

            <div className="rsa-keypair__form">
                <div className="rsa-keypair__field">
                    <label htmlFor="rsa-modulus" className="rsa-keypair__label">
                        Key Size (bits)
                    </label>
                    <select
                        id="rsa-modulus"
                        className="rsa-keypair__input"
                        value={modulusLength}
                        onChange={(e) => setModulusLength(Number(e.target.value))}
                        disabled={isGenerating}
                    >
                        {MODULUS_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                    <div className="rsa-keypair__hint">
                        Uses RSA-OAEP with SHA-256 and public exponent 65537.
                    </div>
                </div>

                <div className="rsa-keypair__actions">
                    <button
                        className="rsa-keypair__button"
                        onClick={handleGenerate}
                        disabled={isGenerating}
                    >
                        {isGenerating ? '⏳ Generating...' : 'Generate Keys'}
                    </button>
                    <button
                        className="rsa-keypair__button rsa-keypair__button--secondary"
                        onClick={handleClear}
                        disabled={!publicKeyPem && !privateKeyPem && !errorMessage}
                    >
                        🗑️ Clear
                    </button>
                </div>
            </div>

            {errorMessage && (
                <div className="rsa-keypair__error">
                    <strong>Error:</strong> {errorMessage}
                </div>
            )}

            {publicKeyPem && (
                <div className="rsa-keypair__result">
                    <label className="rsa-keypair__result-label">Public Key (PEM):</label>
                    <textarea
                        className="rsa-keypair__result-text"
                        value={publicKeyPem}
                        readOnly
                        rows="7"
                    />
                    <div className="rsa-keypair__result-actions">
                        <button
                            className="rsa-keypair__copy-button"
                            onClick={() => navigator.clipboard.writeText(publicKeyPem)}
                        >
                            📋 Copy Public Key
                        </button>
                    </div>
                </div>
            )}

            {privateKeyPem && (
                <div className="rsa-keypair__result rsa-keypair__result--private">
                    <label className="rsa-keypair__result-label">Private Key (PEM):</label>
                    <textarea
                        className="rsa-keypair__result-text"
                        value={privateKeyPem}
                        readOnly
                        rows="10"
                    />
                    <div className="rsa-keypair__result-actions">
                        <button
                            className="rsa-keypair__copy-button"
                            onClick={() => navigator.clipboard.writeText(privateKeyPem)}
                        >
                            📋 Copy Private Key
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default RsaKeypairGenerator
