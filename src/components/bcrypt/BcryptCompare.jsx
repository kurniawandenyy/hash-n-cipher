import { useState } from 'react'
import './BcryptGenerate.css'
import bcrypt from 'bcryptjs'

function BcryptCompare() {
    const [plaintext, setPlaintext] = useState('')
    const [hash, setHash] = useState('')
    const [isMatch, setIsMatch] = useState(null)
    const [isVerified, setIsVerified] = useState(false)
    const [isComparing, setIsComparing] = useState(false)

    const handleCompare = async () => {
        if (!plaintext || !hash) return
        
        setIsComparing(true)
        setIsVerified(false) // Clear previous result immediately
        setIsMatch(null)
        
        // Small delay to ensure UI updates, then run bcrypt
        await new Promise(resolve => setTimeout(resolve, 50))
        
        try {
            const match = bcrypt.compareSync(plaintext, hash)
            setIsMatch(match)
            setIsVerified(true)
            setIsComparing(false)
        } catch (error) {
            console.error('Error comparing hash:', error)
            setIsMatch(false)
            setIsVerified(true)
            setIsComparing(false)
        }
    }

    const handleClear = () => {
        setPlaintext('')
        setHash('')
        setIsMatch(null)
        setIsVerified(false)
    }

    return (
        <div className="bcrypt-tools__card">
            <h3 className="bcrypt-generate__title">Verify Hash</h3>
            
            <div className="bcrypt-generate__form">
                <div className="bcrypt-generate__field">
                    <label htmlFor="compare-plaintext-input" className="bcrypt-generate__label">
                        Plaintext
                    </label>
                    <input
                        id="compare-plaintext-input"
                        type="text"
                        className="bcrypt-generate__input"
                        placeholder="Enter your plaintext"
                        value={plaintext}
                        onChange={(e) => setPlaintext(e.target.value)}
                        required
                    />
                </div>

                <div className="bcrypt-generate__field">
                    <label htmlFor="compare-hash-input" className="bcrypt-generate__label">
                        Hash to Compare
                    </label>
                    <textarea
                        id="compare-hash-input"
                        className="bcrypt-generate__input"
                        placeholder="Enter the hash to compare"
                        value={hash}
                        onChange={(e) => setHash(e.target.value)}
                        rows="3"
                        required
                    />
                    {hash && (() => {
                        const roundsMatch = hash.match(/\$(\d+)\$/)
                        const rounds = roundsMatch ? parseInt(roundsMatch[1]) : null
                        return rounds && rounds > 15 ? (
                            <div style={{
                                marginTop: '0.5rem',
                                padding: '0.5rem',
                                backgroundColor: '#fef3c7',
                                border: '1px solid #f59e0b',
                                borderRadius: '4px',
                                fontSize: '0.875rem',
                                color: '#92400e'
                            }}>
                                ⚠️ This hash uses high rounds ({rounds}). Verification may take longer.
                            </div>
                        ) : null
                    })()}
                </div>

                <button 
                    className="bcrypt-generate__button"
                    onClick={handleCompare}
                    disabled={!plaintext || !hash || isComparing}
                    style={{
                        ...(isComparing && {
                            color: '#1f2937'
                        })
                    }}
                >
                    {isComparing ? '⏳ Verifying...' : 'Verify Hash'}
                </button>
            </div>

            {isVerified && (
                <div className="bcrypt-generate__result">
                    <label className="bcrypt-generate__result-label">
                        Verification Result:
                    </label>
                    <div className="bcrypt-generate__result-container">
                        <textarea
                            className="bcrypt-generate__result-text"
                            style={{
                                backgroundColor: isMatch ? '#d4edda' : '#f8d7da',
                                color: isMatch ? '#155724' : '#721c24',
                                borderRadius: '4px',
                                textAlign: 'center',
                                fontWeight: 'bold',
                                fontSize: '1.1rem',
                                border: 'none',
                                resize: 'none',
                                cursor: 'default',
                                minHeight: 'auto',
                                height: 'auto',
                                maxHeight: 'none',
                                padding: '1rem',
                                fontFamily: 'inherit',
                                wordBreak: 'normal',
                                userSelect: 'none',
                                width: 'auto',
                            }}
                            value={isMatch ? '✅ Hash Matches!' : '❌ Hash Does Not Match'}
                            readOnly
                            rows="2"
                        />
                        <div className="bcrypt-generate__result-actions">
                            <button 
                                className="bcrypt-generate__clear-button"
                                onClick={handleClear}
                                title="Clear verification result"
                            >
                                🗑️ Clear
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default BcryptCompare