function Footer() {
    return (
        <footer style={{
            backgroundColor: 'black',
            padding: '0.5rem',
            boxShadow: '0 -2px 4px rgba(0,0,0,0.1)',
            transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
            // position: 'sticky',
            bottom: 0,
            zIndex: 1000,
        }}>
            <p style={{
                color: 'white',
                margin: '0.5rem 0 0 0',
                textAlign: 'center',
                fontSize: '0.9rem',
                opacity: 0.9
            }}>
                &copy; {new Date().getFullYear()} Hash & Cipher. All rights reserved.
            </p>
        </footer>
    )
}

export default Footer