import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { candidateAPI } from '../services/api'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'

const CandidateProfile = () => {
  const { candidateId } = useParams()
  const { user } = useAuth()
  const [candidate, setCandidate] = useState(null)
  const [ratings, setRatings] = useState([])
  const [loading, setLoading] = useState(true)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchCandidate()
    fetchRatings()
  }, [candidateId])

  const fetchCandidate = async () => {
    try {
      setLoading(true)
      const data = await candidateAPI.getById(candidateId)
      setCandidate(data)
    } catch (error) {
      toast.error('Failed to load candidate')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRatings = async () => {
    try {
      const data = await candidateAPI.getRatings(candidateId)
      setRatings(data)
    } catch (error) {
      console.error('Failed to load ratings:', error)
    }
  }

  const handleSubmitRating = async () => {
    if (rating === 0) {
      toast.error('Please select a rating')
      return
    }

    try {
      setSubmitting(true)
      await candidateAPI.rate(candidateId, {
        voterId: user?.VoterID || user?.voterid,
        rating: rating,
        comment: comment
      })
      toast.success('Rating submitted successfully')
      setRating(0)
      setComment('')
      fetchCandidate()
      fetchRatings()
    } catch (error) {
      toast.error('Failed to submit rating')
      console.error(error)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (!candidate) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <p className="text-red-700">Candidate not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-8">
            <div className="flex items-start mb-6">
              {candidate.photourl && (
                <img
                  src={candidate.photourl}
                  alt={candidate.fullname}
                  className="w-32 h-32 rounded-full object-cover mr-6"
                />
              )}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{candidate.fullname}</h1>
                <p className="text-xl text-gray-600 mb-4">{candidate.partyname}</p>
                {candidate.partysymbol && (
                  <p className="text-sm text-gray-500">Symbol: {candidate.partysymbol}</p>
                )}
                {candidate.rating > 0 && (
                  <div className="flex items-center mt-2">
                    <span className="text-yellow-500 text-2xl">★</span>
                    <span className="text-lg font-bold text-gray-900 ml-2">
                      {candidate.rating.toFixed(1)}
                    </span>
                    <span className="text-sm text-gray-600 ml-2">
                      ({candidate.totalratings} ratings)
                    </span>
                  </div>
                )}
              </div>
            </div>

            {candidate.biography && (
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Biography</h2>
                <p className="text-gray-700">{candidate.biography}</p>
              </div>
            )}

            {candidate.manifesto && (
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Manifesto</h2>
                <p className="text-gray-700 whitespace-pre-line">{candidate.manifesto}</p>
              </div>
            )}

            <div className="border-t pt-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Rate This Candidate</h2>
              <div className="mb-4">
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className={`text-3xl ${
                        star <= rating ? 'text-yellow-500' : 'text-gray-300'
                      } hover:text-yellow-400 transition-colors`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment (optional)"
                className="w-full p-3 border rounded-md mb-4"
                rows={3}
              />
              <button
                onClick={handleSubmitRating}
                disabled={submitting || rating === 0}
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-md disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Rating'}
              </button>
            </div>

            {ratings.length > 0 && (
              <div className="border-t mt-8 pt-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Public Ratings</h2>
                <div className="space-y-4">
                  {ratings.map((ratingItem) => (
                    <div key={ratingItem.ratingid} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{ratingItem.votername}</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={i < ratingItem.rating ? 'text-yellow-500' : 'text-gray-300'}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                      {ratingItem.comment && (
                        <p className="text-gray-700">{ratingItem.comment}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(ratingItem.createdat).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CandidateProfile

