import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Menu, Search, MapPin, X, Loader2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useLazySearchLocationsQuery } from '../../store/api/aqiApi';
import { setLocation } from '../../store/slices/locationSlice';

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const location = useLocation();

    const [triggerSearch, { data: searchResults, isFetching }] = useLazySearchLocationsQuery();
    const dispatch = useDispatch();

    // Close menu when route changes
    useEffect(() => {
        setIsMenuOpen(false);
    }, [location]);

    // Prevent scrolling when mobile menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMenuOpen]);

    // Debounce search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchTerm.length >= 3) {
                triggerSearch(searchTerm);
            }
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [searchTerm, triggerSearch]);

    const handleSelectCity = (city) => {
        dispatch(setLocation({
            lat: city.latitude,
            lon: city.longitude,
            name: city.name
        }));
        setSearchTerm('');
        setIsSearchExpanded(false);
    };

    const isActive = (path) => location.pathname === path;

    const navLinks = [
        { name: 'Overview', path: '/' },
        { name: 'Map', path: '/map' },
        { name: 'Rankings', path: '/rankings' },
        { name: 'News', path: '/news' },
    ];

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        if (isSearchExpanded) setIsSearchExpanded(false);
    };

    const toggleSearch = () => {
        setIsSearchExpanded(!isSearchExpanded);
        if (isMenuOpen) setIsMenuOpen(false);
        // Focus input logic could be added here
    };

    return (
        <header className="sticky top-0 z-[1000] h-header bg-bg-deep/80 backdrop-blur-xl border-b border-white/5 flex items-center">
            <div className="w-full max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8 flex items-center justify-between h-full relative">

                {/* Logo Section */}
                <Link
                    to="/"
                    className={`flex items-center gap-3 text-neon-cyan font-bold text-xl group transition-opacity duration-300 ${isSearchExpanded ? 'opacity-0 pointer-events-none sm:opacity-100 sm:pointer-events-auto' : 'opacity-100'}`}
                >
                    <div className="w-8 h-8 bg-gradient-to-br from-[#00f0ff] to-[#39ff14] rounded-lg flex items-center justify-center group-hover:shadow-[0_0_15px_rgba(0,240,255,0.5)] transition-shadow duration-300">
                        <div className="w-3 h-3 bg-white rounded-full" />
                    </div>
                    <span className="text-text-primary tracking-tighter hidden sm:inline group-hover:text-neon-cyan transition-colors">AQI Tracker</span>
                </Link>

                {/* Search Section */}
                <div className={`flex-1 flex justify-center px-4 transition-all duration-300 ${isSearchExpanded ? 'absolute inset-0 z-[1001] bg-bg-deep px-4' : 'relative'}`}>
                    <div className={`
                        flex flex-col relative transition-all duration-300 w-full max-w-[480px]
                        ${isSearchExpanded ? 'h-auto my-2' : ''}
                    `}>
                        <div className={`
                            flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-2 transition-all duration-300 w-full
                            focus-within:border-neon-cyan/50 focus-within:bg-white/10 focus-within:ring-4 focus-within:ring-neon-cyan/10
                            ${isSearchExpanded ? 'flex' : 'hidden sm:flex'}
                        `}>
                            <MapPin size={18} className="text-text-secondary mr-2" />
                            <input
                                type="text"
                                placeholder="Search city (min 3 chars)..."
                                className="bg-transparent border-none text-text-primary w-full text-[0.95rem] outline-none placeholder:text-text-tertiary"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {isFetching && <Loader2 size={16} className="animate-spin text-neon-cyan mr-2" />}
                            {isSearchExpanded && (
                                <button
                                    className="text-text-secondary hover:text-text-primary p-1 ml-2 transition-colors"
                                    onClick={() => { setIsSearchExpanded(false); setSearchTerm(''); }}
                                >
                                    <X size={20} />
                                </button>
                            )}
                        </div>

                        {/* Search Results Dropdown */}
                        {searchTerm.length >= 3 && isSearchExpanded && (
                            <div className="absolute top-full left-0 right-0 mt-4 bg-[#0b0f19] border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-[300px] overflow-y-auto backdrop-blur-xl z-[1005]">
                                {isFetching ? (
                                    <div className="p-6 text-center text-text-secondary flex flex-col items-center gap-2">
                                        <Loader2 className="animate-spin text-neon-cyan" />
                                        <span>Searching places...</span>
                                    </div>
                                ) : searchResults && searchResults.length > 0 ? (
                                    searchResults.map((city) => (
                                        <button
                                            key={city.id}
                                            onClick={() => handleSelectCity(city)}
                                            className="w-full text-left px-5 py-4 hover:bg-white/5 transition-colors flex items-center justify-between group border-b border-white/5 last:border-0"
                                        >
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-text-primary font-semibold text-sm sm:text-base group-hover:text-neon-cyan transition-colors">{city.name}</span>
                                                <span className="text-text-tertiary text-xs">{[city.admin1, city.country].filter(Boolean).join(', ')}</span>
                                            </div>
                                            <MapPin size={16} className="text-neon-cyan opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                        </button>
                                    ))
                                ) : (
                                    <div className="p-6 text-center text-text-secondary">No locations found</div>
                                )}
                            </div>
                        )}

                        {/* Desktop Dropdown (redundant check for simple display logic reuse or distinct desktop behavior) */}
                        {searchTerm.length >= 3 && !isSearchExpanded && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-[#0b0f19] border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-[300px] overflow-y-auto backdrop-blur-xl z-[1005] hidden sm:block">
                                {isFetching ? (
                                    <div className="p-6 text-center text-text-secondary flex flex-col items-center gap-2">
                                        <Loader2 className="animate-spin text-neon-cyan" />
                                        <span>Searching places...</span>
                                    </div>
                                ) : searchResults && searchResults.length > 0 ? (
                                    searchResults.map((city) => (
                                        <button
                                            key={city.id}
                                            onClick={() => handleSelectCity(city)}
                                            className="w-full text-left px-5 py-4 hover:bg-white/5 transition-colors flex items-center justify-between group border-b border-white/5 last:border-0"
                                        >
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-text-primary font-semibold text-sm sm:text-base group-hover:text-neon-cyan transition-colors">{city.name}</span>
                                                <span className="text-text-tertiary text-xs">{[city.admin1, city.country].filter(Boolean).join(', ')}</span>
                                            </div>
                                            <MapPin size={16} className="text-neon-cyan opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                        </button>
                                    ))
                                ) : (
                                    <div className="p-6 text-center text-text-secondary">No locations found</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Actions Section */}
                <div className="flex items-center gap-2 sm:gap-6">
                    {/* Mobile Search Trigger */}
                    {!isSearchExpanded && (
                        <button
                            className="p-2 text-text-primary hover:bg-white/10 rounded-xl transition-all sm:hidden"
                            onClick={toggleSearch}
                            aria-label="Open search"
                        >
                            <Search size={22} />
                        </button>
                    )}

                    {/* Desktop Nav */}
                    <nav className="hidden lg:flex items-center h-full gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`text-[0.95rem] font-medium transition-all duration-300 relative py-1
                                    ${isActive(link.path)
                                        ? 'text-text-primary after:content-[""] after:absolute after:bottom-[-22px] after:left-0 after:w-full after:h-[2px] after:bg-neon-cyan'
                                        : 'text-text-secondary hover:text-text-primary'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Hamburger Button Improved */}
                    <button
                        className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 lg:hidden relative z-[1003]
                            ${isMenuOpen ? 'bg-white/15 text-text-primary shadow-[0_0_20px_rgba(255,255,255,0.2)] border border-white/30' : 'text-text-primary hover:bg-white/10 active:scale-90 border border-transparent'}`}
                        onClick={toggleMenu}
                        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    >
                        <div className="relative w-6 h-6 flex items-center justify-center">
                            <span className={`absolute block h-0.5 w-6 bg-current transform transition duration-300 ease-in-out top-1/2 ${isMenuOpen ? 'rotate-45 -translate-y-1/2' : '-translate-y-[6px]'}`} />
                            <span className={`absolute block h-0.5 w-6 bg-current transform transition duration-300 ease-in-out top-1/2 -translate-y-1/2 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`} />
                            <span className={`absolute block h-0.5 w-6 bg-current transform transition duration-300 ease-in-out top-1/2 ${isMenuOpen ? '-rotate-45 -translate-y-1/2' : 'translate-y-[6px]'}`} />
                        </div>
                    </button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMenuOpen && (
                <div className="absolute top-full left-0 right-0 bg-bg-deep z-[1002] lg:hidden max-h-[calc(100vh-64px)] overflow-y-auto border-t border-white/10 shadow-2xl">
                    <div className="flex flex-col p-6 gap-2">
                        {navLinks.map((link, index) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`flex items-center justify-between py-4 px-6 rounded-2xl text-xl font-semibold transition-all duration-300
                                    ${isActive(link.path)
                                        ? 'bg-gradient-to-r from-white/20 to-transparent text-text-primary border-l-4 border-white'
                                        : 'text-text-primary hover:bg-white/5 active:bg-white/10'}`}
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                {link.name}
                                {isActive(link.path) && <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" />}
                            </Link>
                        ))}
                    </div>

                    {/* Decorative element in menu */}
                    <div className="w-full px-6 opacity-20 pointer-events-none mb-4">
                        <div className="h-[1px] bg-gradient-to-r from-transparent via-text-secondary to-transparent mb-4" />
                        <p className="text-center text-sm text-text-secondary italic">Stay Informed, Breathe Better.</p>
                    </div>
                </div>
            )}
        </header>
    );
}
