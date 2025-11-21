import { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext(null)

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'en'
  })

  useEffect(() => {
    localStorage.setItem('language', language)
  }, [language])

  const translations = {
    en: {
      // Navigation
      'nav.dashboard': 'Dashboard',
      'nav.elections': 'Elections',
      'nav.voteHistory': 'Vote History',
      'nav.notifications': 'Notifications',
      'nav.logout': 'Logout',
      
      // Common
      'common.loading': 'Loading...',
      'common.error': 'Error',
      'common.success': 'Success',
      'common.save': 'Save',
      'common.cancel': 'Cancel',
      'common.submit': 'Submit',
      'common.back': 'Back',
      
      // Elections
      'elections.title': 'Elections',
      'elections.active': 'Active',
      'elections.upcoming': 'Upcoming',
      'elections.ended': 'Ended',
      'elections.voteNow': 'Vote Now',
      'elections.viewDetails': 'View Details',
      
      // Results
      'results.title': 'Election Results',
      'results.totalVotes': 'Total Votes',
      'results.turnout': 'Turnout',
      
      // Auth
      'auth.signIn': 'Sign In',
      'auth.signUp': 'Sign Up',
      'auth.email': 'Email',
      'auth.password': 'Password',
      'auth.confirmPassword': 'Confirm Password',
      'auth.fullName': 'Full Name',
      'auth.cnic': 'CNIC',
      'auth.forgotPassword': 'Forgot your password?',
      'auth.welcomeBack': 'Welcome Back!',
      'auth.helloFriend': 'Hello, Friend!',
      'auth.createAccount': 'Create Account',
      'auth.verifyEmail': 'Verify Email',
      'auth.enterOTP': 'Enter the 6-digit OTP sent to',
      'auth.resendOTP': 'Resend OTP',
      
      // Dashboard
      'dashboard.welcome': 'Welcome back',
      'dashboard.accountStatus': 'Account Status',
      'dashboard.pendingVerification': 'Pending Verification',
      'dashboard.verified': 'Verified',
      
      // Voting
      'voting.selectCandidate': 'Select Candidate',
      'voting.castVote': 'Cast Vote',
      'voting.alreadyVoted': 'You have already voted',
      'voting.confirmation': 'Vote Confirmation',
      'voting.selectOne': 'Please select one candidate',
      'voting.selectMultiple': 'You can select multiple candidates',
      'voting.selected': 'Selected',
      'voting.candidates': 'candidate(s)',
      'voting.submitting': 'Submitting...',
      
      // Notifications
      'notifications.title': 'Notifications',
      'notifications.noNotifications': 'No notifications',
      'notifications.markAllRead': 'Mark all as read',
      
      // Polling Stations
      'stations.title': 'Polling Stations',
      'stations.findNearby': 'Find Nearby Stations',
      'stations.address': 'Address',
      'stations.hours': 'Hours',
      
      // Feedback
      'feedback.title': 'Feedback',
      'feedback.submit': 'Submit Feedback',
      'feedback.type': 'Feedback Type',
      'feedback.message': 'Message',
      
      // Education
      'education.title': 'Education Resources',
      'education.articles': 'Articles',
      'education.videos': 'Videos',
      'education.faqs': 'FAQs',
    },
    ur: {
      // Navigation
      'nav.dashboard': 'ڈیش بورڈ',
      'nav.elections': 'انتخابات',
      'nav.voteHistory': 'ووٹ کی تاریخ',
      'nav.notifications': 'اطلاعات',
      'nav.logout': 'لاگ آؤٹ',
      
      // Common
      'common.loading': 'لوڈ ہو رہا ہے...',
      'common.error': 'خرابی',
      'common.success': 'کامیابی',
      'common.save': 'محفوظ کریں',
      'common.cancel': 'منسوخ کریں',
      'common.submit': 'جمع کروائیں',
      'common.back': 'واپس',
      
      // Elections
      'elections.title': 'انتخابات',
      'elections.active': 'فعال',
      'elections.upcoming': 'آنے والے',
      'elections.ended': 'ختم',
      'elections.voteNow': 'ابھی ووٹ دیں',
      'elections.viewDetails': 'تفصیلات دیکھیں',
      
      // Results
      'results.title': 'انتخابی نتائج',
      'results.totalVotes': 'کل ووٹ',
      'results.turnout': 'شرکت',
      
      // Auth
      'auth.signIn': 'سائن ان',
      'auth.signUp': 'سائن اپ',
      'auth.email': 'ای میل',
      'auth.password': 'پاس ورڈ',
      'auth.confirmPassword': 'پاس ورڈ کی تصدیق',
      'auth.fullName': 'مکمل نام',
      'auth.cnic': 'قومی شناختی کارڈ',
      'auth.forgotPassword': 'پاس ورڈ بھول گئے؟',
      'auth.welcomeBack': 'خوش آمدید!',
      'auth.helloFriend': 'ہیلو، دوست!',
      'auth.createAccount': 'اکاؤنٹ بنائیں',
      'auth.verifyEmail': 'ای میل کی تصدیق',
      'auth.enterOTP': '6 ہندسوں کا OTP درج کریں',
      'auth.resendOTP': 'OTP دوبارہ بھیجیں',
      
      // Dashboard
      'dashboard.welcome': 'خوش آمدید',
      'dashboard.accountStatus': 'اکاؤنٹ کی حیثیت',
      'dashboard.pendingVerification': 'تصدیق زیر التواء',
      'dashboard.verified': 'تصدیق شدہ',
      
      // Voting
      'voting.selectCandidate': 'امیدوار منتخب کریں',
      'voting.castVote': 'ووٹ ڈالیں',
      'voting.alreadyVoted': 'آپ پہلے ہی ووٹ دے چکے ہیں',
      'voting.confirmation': 'ووٹ کی تصدیق',
      'voting.selectOne': 'براہ کرم ایک امیدوار منتخب کریں',
      'voting.selectMultiple': 'آپ متعدد امیدوار منتخب کر سکتے ہیں',
      'voting.selected': 'منتخب',
      'voting.candidates': 'امیدوار',
      'voting.submitting': 'جمع کرایا جا رہا ہے...',
      
      // Notifications
      'notifications.title': 'اطلاعات',
      'notifications.noNotifications': 'کوئی اطلاع نہیں',
      'notifications.markAllRead': 'سب کو پڑھا ہوا نشان لگائیں',
      
      // Polling Stations
      'stations.title': 'پولنگ اسٹیشن',
      'stations.findNearby': 'قریبی اسٹیشن تلاش کریں',
      'stations.address': 'پتہ',
      'stations.hours': 'اوقات',
      
      // Feedback
      'feedback.title': 'رائے',
      'feedback.submit': 'رائے جمع کروائیں',
      'feedback.type': 'رائے کی قسم',
      'feedback.message': 'پیغام',
      
      // Education
      'education.title': 'تعلیمی وسائل',
      'education.articles': 'مضامین',
      'education.videos': 'ویڈیوز',
      'education.faqs': 'سوالات',
    }
  }

  const t = (key) => {
    return translations[language]?.[key] || translations.en[key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}

