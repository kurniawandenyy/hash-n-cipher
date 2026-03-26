import { useState } from 'react'
import './AesGcmCipher.css'

const KEY_SIZE_OPTIONS = [128, 192, 256]
const IV_LENGTH_BYTES = 12

function bytesToBase64(bytes) {
    let binary = ''
    const chunkSize = 0x8000

    for (let i = 0; i < bytes.length; i += chunkSize) {
        binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize))
    }

    return window.btoa(binary)
}

function base64ToBytes(value) {
    const cleanValue = value.trim()
    const binary = window.atob(cleanValue)
    const bytes = new Uint8Array(binary.length)

    for (let i = 0; i < binary.length; i += 1) {
        bytes[i] = binary.charCodeAt(i)
    }

    return bytes
}

function AesGcmCipher() {
    const [mode, setMode] = useState('encrypt')
    const [keySize, setKeySize] = useState(256)
    const [keyBase64, setKeyBase64] = useState('')
    const [ivBase64, setIvBase64] = useState('')
    const [inputText, setInputText] = useState('')
    const [resultText, setResultText] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [isProcessing, setIsProcessing] = useState(false)

    const handleGenerateKeyMaterial = () => {
        const keyBytes = new Uint8Array(keySize / 8)
        const ivBytes = new Uint8Array(IV_LENGTH_BYTES)

        window.crypto.getRandomValues(keyBytes)
        window.crypto.getRandomValues(ivBytes)

        setKeyBase64(bytesToBase64(keyBytes))
        setIvBase64(bytesToBase64(ivBytes))
        setErrorMessage('')
        setResultText('')
    }

    const handleProcess = async () => {
        if (!window.crypto?.subtle) {
            setErrorMessage('Web Crypto API is not available in this browser context.')
            return
        }

        if (!keyBase64.trim() || !ivBase64.trim() || !inputText.trim()) {
            setErrorMessage('Please fill key, IV, and input text before processing.')
            return
        }

        setIsProcessing(true)
        setErrorMessage('')
        setResultText('')

        try {
            const keyBytes = base64ToBytes(keyBase64)
            const ivBytes = base64ToBytes(ivBase64)

            if (![16, 24, 32].includes(keyBytes.length)) {
                setErrorMessage('Invalid key length. Use 128, 192, or 256-bit key material.')
                setIsProcessing(false)
                return
            }

            if (ivBytes.length !== IV_LENGTH_BYTES) {
                setErrorMessage('Invalid IV length. AES-GCM in this tool requires a 12-byte IV.')
                setIsProcessing(false)
                return
            }

            const cryptoKey = await window.crypto.subtle.importKey(
                'raw',
                keyBytes,
                { name: 'AES-GCM' },
                false,
                mode === 'encrypt' ? ['encrypt'] : ['decrypt']
            )

            if (mode === 'encrypt') {
                const plaintextBytes = new TextEncoder().encode(inputText)
                const encryptedBuffer = await window.crypto.subtle.encrypt(
                    {
                        name: 'AES-GCM',
                        iv: ivBytes
                    },
                    cryptoKey,
                    plaintextBytes
                )

                setResultText(bytesToBase64(new Uint8Array(encryptedBuffer)))
            } else {
                const ciphertextBytes = base64ToBytes(inputText)
                const decryptedBuffer = await window.crypto.subtle.decrypt(
                    {
                        name: 'AES-GCM',
                        iv: ivBytes
                    },
                    cryptoKey,
                    ciphertextBytes
                )

                const decryptedText = new TextDecoder().decode(decryptedBuffer)
                setResultText(decryptedText)
            }
        } catch (error) {
            console.error('AES-GCM processing failed:', error)
            setErrorMessage('Failed to process data. Verify key, IV, and input format.')
        } finally {
            setIsProcessing(false)
        }
    }

    const handleClear = () => {
        setInputText('')
        setResultText('')
        setErrorMessage('')
    }

    return (
        <div className="aes-gcm__card">
            <h3 className="aes-gcm__title">AES-GCM Tool</h3>

            <div className="aes-gcm__form">
                <div className="aes-gcm__field">
                    <label htmlFor="aes-mode" className="aes-gcm__label">Mode</label>
                    <div className="aes-gcm__mode-toggle">
                        <button
                            type="button"
                            className={`aes-gcm__mode-button ${mode === 'encrypt' ? 'active' : ''}`}
                            onClick={() => {
                                setMode('encrypt')
                                setResultText('')
                                setErrorMessage('')
                            }}
                        >
                            🔒 Encrypt
                        </button>
                        <button
                            type="button"
                            className={`aes-gcm__mode-button ${mode === 'decrypt' ? 'active' : ''}`}
                            onClick={() => {
                                setMode('decrypt')
                                setResultText('')
                                setErrorMessage('')
                            }}
                        >
                            🔓 Decrypt
                        </button>
                    </div>
                </div>

                <div className="aes-gcm__field">
                    <label htmlFor="aes-key-size" className="aes-gcm__label">Key Size</label>
                    <select
                        id="aes-key-size"
                        className="aes-gcm__input"
                        value={keySize}
                        onChange={(e) => setKeySize(Number(e.target.value))}
                        disabled={isProcessing}
                    >
                        {KEY_SIZE_OPTIONS.map((option) => (
                            <option key={option} value={option}>{option} bits</option>
                        ))}
                    </select>
                </div>

                <div className="aes-gcm__field">
                    <label htmlFor="aes-key" className="aes-gcm__label">Key (Base64)</label>
                    <textarea
                        id="aes-key"
                        className="aes-gcm__input"
                        value={keyBase64}
                        onChange={(e) => {
                            setKeyBase64(e.target.value)
                            setResultText('')
                            setErrorMessage('')
                        }}
                        rows="2"
                        placeholder="Generate or paste Base64 key..."
                    />
                </div>

                <div className="aes-gcm__field">
                    <label htmlFor="aes-iv" className="aes-gcm__label">IV (Base64, 12 bytes)</label>
                    <input
                        id="aes-iv"
                        type="text"
                        className="aes-gcm__input"
                        value={ivBase64}
                        onChange={(e) => {
                            setIvBase64(e.target.value)
                            setResultText('')
                            setErrorMessage('')
                        }}
                        placeholder="Generate or paste Base64 IV..."
                    />
                </div>

                <div className="aes-gcm__field">
                    <label htmlFor="aes-input" className="aes-gcm__label">
                        {mode === 'encrypt' ? 'Plaintext' : 'Ciphertext (Base64)'}
                    </label>
                    <textarea
                        id="aes-input"
                        className="aes-gcm__input"
                        value={inputText}
                        onChange={(e) => {
                            setInputText(e.target.value)
                            setResultText('')
                            setErrorMessage('')
                        }}
                        rows="4"
                        placeholder={mode === 'encrypt' ? 'Enter plaintext...' : 'Enter Base64 ciphertext...'}
                    />
                </div>

                <div className="aes-gcm__actions">
                    <button
                        className="aes-gcm__button aes-gcm__button--secondary"
                        onClick={handleGenerateKeyMaterial}
                        disabled={isProcessing}
                    >
                        🎲 Generate Key + IV
                    </button>
                    <button
                        className="aes-gcm__button"
                        onClick={handleProcess}
                        disabled={isProcessing}
                    >
                        {isProcessing
                            ? '⏳ Processing...'
                            : mode === 'encrypt'
                                ? '🔒 Encrypt'
                                : '🔓 Decrypt'}
                    </button>
                    <button
                        className="aes-gcm__button aes-gcm__button--danger"
                        onClick={handleClear}
                        disabled={!inputText && !resultText && !errorMessage}
                    >
                        🗑️ Clear
                    </button>
                </div>
            </div>

            {errorMessage && (
                <div className="aes-gcm__error">
                    <strong>Error:</strong> {errorMessage}
                </div>
            )}

            {resultText && (
                <div className="aes-gcm__result">
                    <label className="aes-gcm__result-label">
                        {mode === 'encrypt' ? 'Ciphertext (Base64):' : 'Decrypted Plaintext:'}
                    </label>
                    <textarea
                        className="aes-gcm__result-text"
                        value={resultText}
                        readOnly
                        rows="5"
                    />
                    <div className="aes-gcm__result-actions">
                        <button
                            className="aes-gcm__copy-button"
                            onClick={() => navigator.clipboard.writeText(resultText)}
                        >
                            📋 Copy Result
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AesGcmCipher
