import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { voteAPI } from '../services/api'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'

const VoteHistory = () => {
  const { user } = useAuth()
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.VoterID || user?.voterid) {
      fetchHistory()
    }
  }, [user])

  const fetchHistory = async () => {
    try {
      setLoading(true)
      const voterId = user?.VoterID || user?.voterid
      const data = await voteAPI.getHistory(voterId)
      setHistory(data)
    } catch (error) {
      toast.error('Failed to load vote history')
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

  return (
    <div className="px-4 py-6 sm:px-0">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Vote History</h1>

      {history.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Nothing to show</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((vote, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{vote.electiontitle}</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(vote.votetimestamp).toLocaleString()}
                  </p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  Voted
                </span>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-1">Candidate:</p>
                <p className="font-medium text-gray-900">{vote.candidatename}</p>
                {vote.partyname && (
                  <p className="text-sm text-gray-600">{vote.partyname}</p>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Confirmation ID</p>
                  <p className="text-sm font-mono text-gray-700">{vote.confirmationid}</p>
                </div>
                <Link
                  to={`/vote-receipt/${vote.confirmationid}`}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  View Receipt →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default VoteHistory

