import { useState, useEffect } from 'react'

function Header() {
    const [isScrolled, setIsScrolled] = useState(false)
    
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
        <header style={headerStyle}>
            <h1 style={{ 
                color: 'white', 
                margin: 0,
                textAlign: 'left',
                fontSize: '1.5rem'
            }}>Hash & Cipher</h1>
            <p style={{
                color: 'white',
                margin: '0.5rem 0 0 0',
                textAlign: 'left',
                fontSize: '0.9rem',
                transition: 'opacity 0.3s ease',
                opacity: isScrolled ? 0 : 0.9,
                visibility: isScrolled ? 'hidden' : 'visible'
            }}>Simple Hash & Cipher Generation</p>
        </header>
    )
}

export default Header;