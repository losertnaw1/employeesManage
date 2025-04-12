import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import LanguageSwitcher from './LanguageSwitcher';
import UserMenu from './UserMenu';
import '../styles/Header.css';

interface HeaderProps {
    drawerOpen: boolean;
    toggleSidebar: () => void;
}

const Header: FC<HeaderProps> = ({ drawerOpen, toggleSidebar }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    return (
        <header className="header">
            <div className="header-left">
                {!drawerOpen && (
                    <button
                        onClick={toggleSidebar}
                        className="toggle-button"
                    >
                        &#9776;
                    </button>
                )}
                <h1 className="header-title">{t('appTitle')}</h1>
            </div>
            <div className="header-actions">
                <button className="header-icon-button" onClick={() => navigate('/search')}>
                    <i className="search-icon">&#128269;</i>
                </button>
                <LanguageSwitcher />
                <UserMenu />
            </div>
        </header>
    );
};

export default Header;
