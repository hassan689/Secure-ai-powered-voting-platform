import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { electionAPI, voteAPI } from '../services/api'
import { toast } from 'react-toastify'

const ResultsPage = () => {
  const { electionId } = useParams()
  const [results, setResults] = useState(null)
  const [statistics, setStatistics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isRealTime, setIsRealTime] = useState(false)

  useEffect(() => {
    fetchResults()
    fetchStatistics()
    
    // Set up real-time updates if election is active
    const election = results?.electionId
    if (election) {
      const interval = setInterval(() => {
        fetchRealTimeResults()
      }, 5000) // Update every 5 seconds
      
      return () => clearInterval(interval)
    }
  }, [electionId])

  const fetchResults = async () => {
    try {
      const data = await electionAPI.getById(electionId)
      if (data.status === 'active' || data.status === 'ended') {
        setIsRealTime(true)
      }
      
      const resultsData = await voteAPI.getResults(electionId)
      setResults(resultsData)
    } catch (error) {
      if (error.response?.status === 403) {
        toast.info('Results will be published after the election ends')
      } else {
        toast.error('Failed to load results')
      }
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRealTimeResults = async () => {
    try {
      const data = await voteAPI.getRealTime(electionId)
      setResults(data)
    } catch (error) {
      console.error('Real-time update error:', error)
    }
  }

  const fetchStatistics = async () => {
    try {
      const data = await voteAPI.getStatistics(electionId)
      setStatistics(data)
    } catch (error) {
      console.error('Statistics error:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (!results) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <p className="text-yellow-700">Results are not yet available for this election.</p>
        </div>
      </div>
    )
  }

  const maxVotes = Math.max(...results.candidates.map(c => c.votecount || 0), 1)

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Election Results</h1>
          {isRealTime && (
            <span className="flex items-center text-sm text-green-600">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              Live Updates
            </span>
          )}
        </div>
        
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-sm text-gray-600">Total Votes</p>
              <p className="text-2xl font-bold text-gray-900">{results.totalVotes}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-sm text-gray-600">Eligible Voters</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.total_eligible_voters}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-sm text-gray-600">Turnout</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.turnout_percentage}%</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-sm text-gray-600">Candidates</p>
              <p className="text-2xl font-bold text-gray-900">{results.candidates.length}</p>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Candidate Results</h2>
          
          <div className="space-y-4">
            {results.candidates
              .sort((a, b) => (b.votecount || 0) - (a.votecount || 0))
              .map((candidate, index) => {
                const voteCount = candidate.votecount || 0
                const percentage = results.totalVotes > 0 
                  ? ((voteCount / results.totalVotes) * 100).toFixed(2)
                  : 0
                const barWidth = (voteCount / maxVotes) * 100

                return (
                  <div key={candidate.candidateid} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <span className={`text-2xl font-bold mr-4 ${
                          index === 0 ? 'text-yellow-500' : 'text-gray-400'
                        }`}>
                          #{index + 1}
                        </span>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{candidate.candidatename}</h3>
                          <p className="text-sm text-gray-600">{candidate.partyname}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary-600">{voteCount}</p>
                        <p className="text-sm text-gray-600">{percentage}%</p>
                      </div>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div
                        className={`h-4 rounded-full transition-all duration-500 ${
                          index === 0 ? 'bg-yellow-500' : 'bg-primary-500'
                        }`}
                        style={{ width: `${barWidth}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResultsPage

