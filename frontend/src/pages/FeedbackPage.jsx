import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { feedbackAPI } from '../services/api'
import { toast } from 'react-toastify'

const FeedbackPage = () => {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    electionId: '',
    feedbackType: 'usability',
    subject: '',
    message: ''
  })
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.subject || !formData.message) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      setSubmitting(true)
      await feedbackAPI.submit({
        voterId: user?.VoterID || user?.voterid,
        electionId: formData.electionId || null,
        feedbackType: formData.feedbackType,
        subject: formData.subject,
        message: formData.message
      })
      
      toast.success('Feedback submitted successfully!')
      setFormData({
        electionId: '',
        feedbackType: 'usability',
        subject: '',
        message: ''
      })
    } catch (error) {
      toast.error('Failed to submit feedback')
      console.error(error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Submit Feedback</h1>

        <div className="bg-white rounded-lg shadow-md p-8">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Feedback Type
              </label>
              <select
                name="feedbackType"
                value={formData.feedbackType}
                onChange={handleChange}
                className="w-full p-3 border rounded-md"
                required
              >
                <option value="usability">Usability Issue</option>
                <option value="security">Security Concern</option>
                <option value="integrity">Election Integrity</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Brief description of your feedback"
                className="w-full p-3 border rounded-md"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Please provide detailed feedback..."
                rows={6}
                className="w-full p-3 border rounded-md"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Election ID (Optional)
              </label>
              <input
                type="number"
                name="electionId"
                value={formData.electionId}
                onChange={handleChange}
                placeholder="If feedback is about a specific election"
                className="w-full p-3 border rounded-md"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-md font-medium disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </form>
        </div>

        <div className="mt-6 bg-primary-50 border-l-4 border-primary-400 p-4">
          <p className="text-sm text-primary-700">
            Your feedback helps us improve the voting system. We take all feedback seriously and review it regularly.
          </p>
        </div>
      </div>
    </div>
  )
}

export default FeedbackPage

