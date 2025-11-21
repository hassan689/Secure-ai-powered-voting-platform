import { useLanguage } from '../context/LanguageContext'
import { useState } from 'react'
import { HiChevronDown, HiCheck } from 'react-icons/hi'
import { FaGlobe } from 'react-icons/fa'

const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'ur', name: 'اردو', flag: '🇵🇰' },
  ]

  const currentLang = languages.find(lang => lang.code === language) || languages[0]

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1"
      >
        <FaGlobe className="w-4 h-4 text-gray-600" />
        <span className="text-lg">{currentLang.flag}</span>
        <span className="hidden sm:inline text-sm font-medium text-gray-700">{currentLang.name}</span>
        <HiChevronDown className="w-4 h-4 text-gray-400" />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="absolute right-0 mt-2 w-40 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20 animate-fade-in">
            <div className="py-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code)
                    setIsOpen(false)
                  }}
                  className={`
                    w-full flex items-center px-4 py-2 text-sm transition-colors
                    ${language === lang.code
                      ? 'bg-primary-50 text-primary-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  <span className="mr-3 text-lg">{lang.flag}</span>
                  {lang.name}
                  {language === lang.code && (
                    <HiCheck className="ml-auto w-4 h-4 text-primary-600" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default LanguageSelector

