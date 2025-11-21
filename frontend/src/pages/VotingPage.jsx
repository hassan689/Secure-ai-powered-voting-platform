import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { electionAPI, candidateAPI, voteAPI } from '../services/api'
import { toast } from 'react-toastify'

const VotingPage = () => {
  const { electionId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [election, setElection] = useState(null)
  const [candidates, setCandidates] = useState([])
  const [selectedCandidates, setSelectedCandidates] = useState([])
  const [hasVoted, setHasVoted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    fetchData()
  }, [electionId])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [electionData, candidatesData, voteStatus] = await Promise.all([
        electionAPI.getById(electionId),
        candidateAPI.getByElection(electionId),
        voteAPI.hasVoted(user?.VoterID || user?.voterid, electionId)
      ])
      
      setElection(electionData)
      setCandidates(candidatesData)
      setHasVoted(voteStatus.hasVoted)
    } catch (error) {
      toast.error('Failed to load election data')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleCandidateSelect = (candidateId) => {
    if (election?.electiontype === 'single-choice') {
      setSelectedCandidates([candidateId])
    } else {
      setSelectedCandidates(prev => {
        if (prev.includes(candidateId)) {
          return prev.filter(id => id !== candidateId)
        } else {
          return [...prev, candidateId]
        }
      })
    }
  }

  const handleSubmitVote = async () => {
    if (selectedCandidates.length === 0) {
      toast.error('Please select at least one candidate')
      return
    }

    if (election?.electiontype === 'single-choice' && selectedCandidates.length !== 1) {
      toast.error('Please select exactly one candidate')
      return
    }

    try {
      setSubmitting(true)
      setProgress(0)
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90))
      }, 200)

      const result = await voteAPI.cast({
        voterId: user?.VoterID || user?.voterid,
        electionId: parseInt(electionId),
        candidateIds: selectedCandidates
      })

      clearInterval(progressInterval)
      setProgress(100)

      toast.success('Vote cast successfully!')
      
      setTimeout(() => {
        navigate(`/vote-receipt/${result.confirmationId}`)
      }, 1000)
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to cast vote')
      console.error(error)
    } finally {
      setSubmitting(false)
      setProgress(0)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (hasVoted) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                You have already voted in this election. You can view your vote receipt or check the results.
              </p>
            </div>
          </div>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => navigate('/vote-history')}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-md"
          >
            View Vote History
          </button>
          <button
            onClick={() => navigate(`/results/${electionId}`)}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-md"
          >
            View Results
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{election?.title}</h1>
        <p className="text-gray-600">{election?.description}</p>
        <div className="mt-4">
          <p className="text-sm text-gray-500">
            Election Type: <span className="font-medium capitalize">{election?.electiontype}</span>
          </p>
          {election?.electiontype === 'single-choice' && (
            <p className="text-sm text-primary-600 mt-1">Please select one candidate</p>
          )}
          {election?.electiontype === 'multi-choice' && (
            <p className="text-sm text-primary-600 mt-1">You can select multiple candidates</p>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {submitting && (
        <div className="mb-6">
          <div className="bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-primary-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">Submitting your vote... {progress}%</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {candidates.map((candidate) => (
          <div
            key={candidate.candidateid}
            onClick={() => !submitting && handleCandidateSelect(candidate.candidateid)}
            className={`bg-white rounded-lg shadow-md p-6 cursor-pointer transition-all ${
              selectedCandidates.includes(candidate.candidateid)
                ? 'ring-4 ring-primary-500 border-2 border-primary-500'
                : 'hover:shadow-lg'
            } ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="flex items-center mb-4">
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 ${
                selectedCandidates.includes(candidate.candidateid)
                  ? 'bg-primary-500 border-primary-500'
                  : 'border-gray-300'
              }`}>
                {selectedCandidates.includes(candidate.candidateid) && (
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{candidate.fullname}</h3>
                <p className="text-sm text-gray-600">{candidate.partyname}</p>
              </div>
            </div>
            
            {candidate.biography && (
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{candidate.biography}</p>
            )}
            
            {candidate.rating > 0 && (
              <div className="flex items-center mt-2">
                <span className="text-yellow-500">★</span>
                <span className="text-sm text-gray-600 ml-1">
                  {candidate.rating.toFixed(1)} ({candidate.totalratings} ratings)
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">
              Selected: <span className="font-medium">{selectedCandidates.length}</span> candidate(s)
            </p>
          </div>
          <button
            onClick={handleSubmitVote}
            disabled={submitting || selectedCandidates.length === 0}
            className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? 'Submitting...' : 'Cast Vote'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default VotingPage

