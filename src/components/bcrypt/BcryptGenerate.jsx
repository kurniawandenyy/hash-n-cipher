import { useState } from 'react'
import './BcryptGenerate.css'
import bcrypt from 'bcryptjs'

function BcryptGenerate() {
    const [plaintext, setPlaintext] = useState('')
    const [rounds, setRounds] = useState(10)
    const [hashedPlaintext, setHashedPlaintext] = useState('')
    const [isGenerating, setIsGenerating] = useState(false)

    const handleGenerate = async () => {
        setIsGenerating(true)
        setHashedPlaintext('')
        
        try {
            // Small delay to ensure UI updates, then run bcrypt
            await new Promise(resolve => setTimeout(resolve, 50))
            const salt = bcrypt.genSaltSync(rounds)
            const hash = bcrypt.hashSync(plaintext, salt)
            setHashedPlaintext(hash)
            setIsGenerating(false)
        } catch (error) {
            console.error('Error generating hash:', error)
            setIsGenerating(false)
        }
    }

    const isHighRounds = rounds > 15

    return (
        <div className="bcrypt-tools__card">
            <h3 className="bcrypt-generate__title">Generate Hash</h3>
            
            <div className="bcrypt-generate__form">
                <div className="bcrypt-generate__field">
                    <label htmlFor="plaintext-input" className="bcrypt-generate__label">
                        Plaintext
                    </label>
                    <input
                        id="plaintext-input"
                        type="text"
                        className="bcrypt-generate__input"
                        placeholder="Enter your plaintext"
                        value={plaintext}
                        onChange={(e) => setPlaintext(e.target.value)}
                        required
                    />
                </div>

                <div className="bcrypt-generate__field">
                    <label htmlFor="rounds-input" className="bcrypt-generate__label">
                        Rounds (10-15 recommended)
                    </label>
                    <input
                        id="rounds-input"
                        type="number"
                        className="bcrypt-generate__input"
                        placeholder="10"
                        value={rounds}
                        onChange={(e) => setRounds(Number(e.target.value))}
                        min="4"
                        max="31"
                        step="1"
                        required
                    />
                    {isHighRounds && (
                        <div style={{
                            marginTop: '0.5rem',
                            padding: '0.5rem',
                            backgroundColor: '#fef3c7',
                            border: '1px solid #f59e0b',
                            borderRadius: '4px',
                            fontSize: '0.875rem',
                            color: '#92400e'
                        }}>
                            ⚠️ Warning: High rounds ({rounds}) will take longer to generate. 
                            Recommended: 10-12 rounds for production use.
                        </div>
                    )}
                </div>

                <button 
                    className="bcrypt-generate__button"
                    onClick={handleGenerate}
                    disabled={!plaintext || isGenerating}
                    style={{
                        ...(isGenerating && {
                            color: '#1f2937'
                        })
                    }}
                >
                    {isGenerating ? '⏳ Generating...' : 'Generate Hash'}
                </button>
            </div>

            {hashedPlaintext && (
                <div className="bcrypt-generate__result">
                    <label className="bcrypt-generate__result-label">
                        Generated Hash:
                    </label>
                    <div className="bcrypt-generate__result-container">
                        <textarea
                            className="bcrypt-generate__result-text"
                            value={hashedPlaintext}
                            readOnly
                            rows="2"
                            placeholder="Hash will appear here..."
                        />
                        <div className="bcrypt-generate__result-actions">
                            <button 
                                className="bcrypt-generate__copy-button"
                                onClick={() => navigator.clipboard.writeText(hashedPlaintext)}
                                title="Copy hash to clipboard"
                            >
                                📋 Copy Hash
                            </button>
                            <button 
                                className="bcrypt-generate__clear-button"
                                onClick={() => setHashedPlaintext('')}
                                title="Clear hash result"
                            >
                                🗑️ Clear
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BcryptGenerate;