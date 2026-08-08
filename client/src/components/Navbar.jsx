export default function Navbar({ currentRoute, navigate }){

    const navItems = [
        { id: 'home', label: 'Home' },
        { id: 'gallery', label: 'Gallery' },
        { id: 'contact', label: 'Contact' }
    ];

    const handleNavClick = (e, pageId) => {
        e.preventDefault();
        navigate(pageId);
    };

    return (
        <header className="navbar-header">
            <div className="navbar-container">
                <a
                    href="#home"
                    className="brand-logo"
                    onClick={(e) => handleNavClick(e, 'home')}
                >
                    <span className="logo-accent">Company</span> Name
                </a>

                <nav className="nav-menu">
                    {navItems.map((item) => (
                        <a
                            key={item.id}
                            href={`#${item.id}`}
                            className={`nav-link ${currentRoute === item.id ? 'active' : ''}`}
                            onClick={(e) => handleNavClick(e, item.id)}
                        >
                            {item.label}
                        </a>
                    ))}
                </nav>
            </div>
        </header>
    );
}