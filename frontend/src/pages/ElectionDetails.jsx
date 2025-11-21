import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { electionAPI, candidateAPI, voteAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'

const ElectionDetails = () => {
  const { electionId } = useParams()
  const { user } = useAuth()
  const [election, setElection] = useState(null)
  const [candidates, setCandidates] = useState([])
  const [hasVoted, setHasVoted] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [electionId])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [electionData, candidatesData] = await Promise.all([
        electionAPI.getById(electionId),
        candidateAPI.getByElection(electionId)
      ])
      
      setElection(electionData)
      setCandidates(candidatesData)
      
      if (user?.VoterID || user?.voterid) {
        const voteStatus = await voteAPI.hasVoted(user?.VoterID || user?.voterid, electionId)
        setHasVoted(voteStatus.hasVoted)
      }
    } catch (error) {
      toast.error('Failed to load election details')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (!election) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <p className="text-red-700">Election not found</p>
        </div>
      </div>
    )
  }

  const isActive = election.status === 'active'
  const isEnded = election.status === 'ended'
  const canVote = isActive && !hasVoted

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{election.title}</h1>
        <p className="text-gray-600 mb-4">{election.description}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">Start Date</p>
            <p className="text-lg font-bold text-gray-900">
              {new Date(election.startdate).toLocaleDateString()}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">End Date</p>
            <p className="text-lg font-bold text-gray-900">
              {new Date(election.enddate).toLocaleDateString()}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">Type</p>
            <p className="text-lg font-bold text-gray-900 capitalize">
              {election.electiontype}
            </p>
          </div>
        </div>

        <div className="flex space-x-4">
          {canVote && (
            <Link
              to={`/vote/${electionId}`}
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-md font-medium"
            >
              Vote Now
            </Link>
          )}
          {hasVoted && (
            <Link
              to="/vote-history"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-medium"
            >
              View Your Vote
            </Link>
          )}
          {isEnded && (
            <Link
              to={`/results/${electionId}`}
              className="bg-secondary-500 hover:bg-secondary-600 text-white px-6 py-3 rounded-md font-medium"
            >
              View Results
            </Link>
          )}
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Candidates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {candidates.map((candidate) => (
            <Link
              key={candidate.candidateid}
              to={`/candidates/${candidate.candidateid}`}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-2">{candidate.fullname}</h3>
              <p className="text-gray-600 mb-2">{candidate.partyname}</p>
              {candidate.biography && (
                <p className="text-sm text-gray-600 line-clamp-2">{candidate.biography}</p>
              )}
              {candidate.rating > 0 && (
                <div className="flex items-center mt-2">
                  <span className="text-yellow-500">★</span>
                  <span className="text-sm text-gray-600 ml-1">
                    {candidate.rating.toFixed(1)} ({candidate.totalratings})
                  </span>
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ElectionDetails

