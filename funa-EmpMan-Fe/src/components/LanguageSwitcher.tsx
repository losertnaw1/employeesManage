import { FC, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import '../styles/LanguageSwitcher.css';

const LanguageSwitcher: FC = () => {
    const { t } = useTranslation(); // Chỉ lấy hàm t() từ hook useTranslation
    const [showDropdown, setShowDropdown] = useState(false);
    const [currentLang, setCurrentLang] = useState(i18n.language);

    // Đồng bộ state với ngôn ngữ hiện tại của i18n
    useEffect(() => {
        // Cập nhật state khi component mount
        setCurrentLang(i18n.language);

        // Thêm event listener để lắng nghe sự thay đổi ngôn ngữ
        const handleLanguageChanged = () => {
            setCurrentLang(i18n.language);
        };

        i18n.on('languageChanged', handleLanguageChanged);

        // Cleanup khi component unmount
        return () => {
            i18n.off('languageChanged', handleLanguageChanged);
        };
    }, []);

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
        setCurrentLang(lng);
        setShowDropdown(false);
    };

    return (
        <div className="language-switcher">
            <button
                onClick={toggleDropdown}
                className="language-button"
            >
                {currentLang === 'vi' ? '🇻🇳 VI' : currentLang === 'en' ? '🇺🇸 EN' : '🇨🇳 ZH'}
            </button>

            {showDropdown && (
                <div className="language-dropdown">
                    <div
                        onClick={() => changeLanguage('vi')}
                        className={`language-option ${currentLang === 'vi' ? 'active' : ''}`}
                    >
                        🇻🇳 {t('languages.vietnamese') || 'Tiếng Việt'}
                    </div>
                    <div
                        onClick={() => changeLanguage('en')}
                        className={`language-option ${currentLang === 'en' ? 'active' : ''}`}
                    >
                        🇺🇸 {t('languages.english') || 'English'}
                    </div>
                    <div
                        onClick={() => changeLanguage('zh')}
                        className={`language-option ${currentLang === 'zh' ? 'active' : ''}`}
                    >
                        🇨🇳 {t('languages.chinese') || '中文'}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LanguageSwitcher;
