import { useState, useEffect, useRef } from 'react'
import './Header.css'

function Header() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const dropdownRef = useRef(null)
    
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY
            setIsScrolled(scrollTop > 50)
        }

        handleScroll()
        
        window.addEventListener('scroll', handleScroll, { passive: true })
        
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])

    useEffect(() => {
        const handleClickOutside = (event) => {
            // Don't close if clicking on dropdown items
            if (event.target.closest('.header__dropdown-item')) {
                return
            }
            
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false)
            }
        }

        if (isDropdownOpen) {
            // Use click instead of mousedown to avoid conflicts
            document.addEventListener('click', handleClickOutside)
        }

        return () => {
            document.removeEventListener('click', handleClickOutside)
        }
    }, [isDropdownOpen])

    const scrollToSection = (sectionId) => {
        setIsDropdownOpen(false)
        
        // Map sectionId to class selector
        const classMap = {
            'bcrypt-tools': '.bcrypt-tools',
            'caesar-tools': '.caesar-tools'
        }
        
        const selector = classMap[sectionId] || `#${sectionId}`
        
        // Function to attempt scrolling
        const attemptScroll = (retries = 10) => {
            // Try ID first, then class selector
            let element = document.getElementById(sectionId)
            if (!element && selector.startsWith('.')) {
                element = document.querySelector(selector)
            }
            
            if (element) {
                const header = document.querySelector('header')
                const headerHeight = header ? header.offsetHeight : 120
                
                // Calculate position
                const rect = element.getBoundingClientRect()
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop
                const elementTop = rect.top + scrollTop
                const targetPosition = elementTop - headerHeight - 20
                
                window.scrollTo({
                    top: Math.max(0, targetPosition),
                    behavior: 'smooth'
                })
                return true
            } else if (retries > 0) {
                // Retry after a short delay
                setTimeout(() => attemptScroll(retries - 1), 50)
                return false
            } else {
                console.error(`Element "${sectionId}" not found after multiple attempts`)
                return false
            }
        }
        
        // Start attempting to scroll after dropdown closes
        requestAnimationFrame(() => {
            setTimeout(() => {
                attemptScroll()
            }, 100)
        })
    }

    const headerStyle = {
        backgroundColor: isScrolled ? 'rgba(0,0,0,0.95)' : 'black',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        transition: 'padding 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease', 
        padding: isScrolled ? '0.5rem 3rem' : '1.5rem 3rem',
        boxShadow: isScrolled ? '0 4px 10px rgba(0,0,0,0.2)' : 'none',
    };

    return (
        <header style={headerStyle} className="header">
            <div className="header__title-section">
                <h1 className="header__title">Hash & Cipher</h1>
                <p className="header__subtitle" style={{
                    opacity: isScrolled ? 0 : 0.9,
                    visibility: isScrolled ? 'hidden' : 'visible'
                }}>Simple Hash & Cipher Generation</p>
            </div>
            <div className="header__dropdown-container" ref={dropdownRef}>
                <button
                    className="header__dropdown-button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    aria-label="Tools menu"
                >
                    <span>🔧 Tools</span>
                    <span style={{ 
                        transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease'
                    }}>▼</span>
                </button>
                <div className={`header__dropdown-menu ${isDropdownOpen ? 'open' : ''}`}>
                    <button
                        type="button"
                        className="header__dropdown-item"
                        onMouseDown={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                        }}
                        onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            scrollToSection('bcrypt-tools')
                        }}
                    >
                        Bcrypt
                    </button>
                    <button
                        type="button"
                        className="header__dropdown-item"
                        onMouseDown={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                        }}
                        onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            scrollToSection('caesar-tools')
                        }}
                    >
                        Caesar Cipher
                    </button>
                </div>
            </div>
        </header>
    )
}

export default Header;