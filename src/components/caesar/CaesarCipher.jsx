import { useState } from 'react'
import './CaesarCipher.css'

function CaesarCipher() {
    const [inputText, setInputText] = useState('')
    const [shift, setShift] = useState(3)
    const [mode, setMode] = useState('encrypt') // 'encrypt' or 'decrypt'
    const [result, setResult] = useState('')

    const caesarCipher = (text, shiftValue, encryptMode) => {
        if (!text) return ''

        const actualShift = encryptMode === 'encrypt' ? shiftValue : -shiftValue
        const normalizedShift = ((actualShift % 26) + 26) % 26

        return text
            .split('')
            .map(char => {
                if (char.match(/[a-z]/)) {
                    return String.fromCharCode(
                        ((char.charCodeAt(0) - 97 + normalizedShift) % 26) + 97
                    )
                } else if (char.match(/[A-Z]/)) {
                    return String.fromCharCode(
                        ((char.charCodeAt(0) - 65 + normalizedShift) % 26) + 65
                    )
                } else {
                    return char
                }
            })
            .join('')
    }

    const handleProcess = () => {
        if (!inputText.trim()) {
            setResult('')
            return
        }
        const processed = caesarCipher(inputText, shift, mode)
        setResult(processed)
    }

    const handleClear = () => {
        setInputText('')
        setResult('')
    }

    return (
        <div className="caesar-cipher__card">
            <h3 className="caesar-cipher__title">Caesar Cipher Tool</h3>
            
            <div className="caesar-cipher__form">
                <div className="caesar-cipher__field">
                    <label htmlFor="mode-select" className="caesar-cipher__label">
                        Mode
                    </label>
                    <div className="caesar-cipher__mode-toggle">
                        <button
                            type="button"
                            className={`caesar-cipher__mode-button ${mode === 'encrypt' ? 'active' : ''}`}
                            onClick={() => {
                                setMode('encrypt')
                                setResult('')
                            }}
                        >
                            🔒 Encrypt
                        </button>
                        <button
                            type="button"
                            className={`caesar-cipher__mode-button ${mode === 'decrypt' ? 'active' : ''}`}
                            onClick={() => {
                                setMode('decrypt')
                                setResult('')
                            }}
                        >
                            🔓 Decrypt
                        </button>
                    </div>
                </div>

                <div className="caesar-cipher__field">
                    <label htmlFor="text-input" className="caesar-cipher__label">
                        Text
                    </label>
                    <textarea
                        id="text-input"
                        className="caesar-cipher__input"
                        placeholder={`Enter text to ${mode}...`}
                        value={inputText}
                        onChange={(e) => {
                            setInputText(e.target.value)
                            setResult('')
                        }}
                        rows="4"
                        required
                    />
                </div>

                <div className="caesar-cipher__field">
                    <label htmlFor="shift-input" className="caesar-cipher__label">
                        Shift (0-25)
                    </label>
                    <input
                        id="shift-input"
                        type="number"
                        className="caesar-cipher__input"
                        placeholder="3"
                        value={shift}
                        onChange={(e) => {
                            const value = Number(e.target.value)
                            if (value >= 0 && value <= 25) {
                                setShift(value)
                                setResult('')
                            }
                        }}
                        min="0"
                        max="25"
                        step="1"
                        required
                    />
                    <div className="caesar-cipher__shift-info">
                        <span>Classic Caesar cipher uses shift of 3</span>
                    </div>
                </div>

                <div className="caesar-cipher__actions">
                    <button 
                        className="caesar-cipher__button"
                        onClick={handleProcess}
                        disabled={!inputText.trim()}
                    >
                        {mode === 'encrypt' ? '🔒 Encrypt' : '🔓 Decrypt'}
                    </button>
                    <button 
                        className="caesar-cipher__button caesar-cipher__button--secondary"
                        onClick={handleClear}
                        disabled={!inputText && !result}
                    >
                        🗑️ Clear
                    </button>
                </div>
            </div>

            {result && (
                <div className="caesar-cipher__result">
                    <label className="caesar-cipher__result-label">
                        {mode === 'encrypt' ? 'Encrypted Text:' : 'Decrypted Text:'}
                    </label>
                    <div className="caesar-cipher__result-container">
                        <textarea
                            className="caesar-cipher__result-text"
                            value={result}
                            readOnly
                            rows="4"
                            placeholder="Result will appear here..."
                        />
                        <div className="caesar-cipher__result-actions">
                            <button 
                                className="caesar-cipher__copy-button"
                                onClick={() => navigator.clipboard.writeText(result)}
                                title="Copy result to clipboard"
                            >
                                📋 Copy Result
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CaesarCipher;

