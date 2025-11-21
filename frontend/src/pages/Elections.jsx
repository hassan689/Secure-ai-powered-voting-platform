import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { electionAPI } from '../services/api'
import { toast } from 'react-toastify'

const Elections = () => {
  const [elections, setElections] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, active, upcoming, ended

  useEffect(() => {
    fetchElections()
  }, [])

  const fetchElections = async () => {
    try {
      setLoading(true)
      const data = await electionAPI.getAll()
      setElections(data)
    } catch (error) {
      toast.error('Failed to fetch elections')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'upcoming': return 'bg-primary-100 text-primary-800'
      case 'ended': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredElections = elections.filter(election => {
    if (filter === 'all') return true
    return election.status === filter
  })

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Elections</h1>
        
        <div className="flex space-x-2">
          {['all', 'upcoming', 'active', 'ended'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors capitalize ${
                filter === status
                  ? 'bg-primary-600 text-white hover:bg-primary-700'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredElections.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">No elections found</p>
          </div>
        ) : (
          filteredElections.map((election) => (
            <div key={election.electionid} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow min-h-[300px]">
              <div className="p-8">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-2xl font-bold text-gray-900">{election.title}</h2>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(election.status)}`}>
                    {election.status}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-5 text-base line-clamp-3">{election.description}</p>
                
                <div className="space-y-3 mb-5">
                  <div className="flex items-center text-base text-gray-500">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Start: {new Date(election.startdate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-base text-gray-500">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    End: {new Date(election.enddate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-base text-gray-500">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {election.candidate_count || 0} Candidates
                  </div>
                  <div className="flex items-center text-base text-gray-500">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    {election.vote_count || 0} Votes
                  </div>
                </div>
                
                <div className="flex space-x-2 mt-4">
                  {election.status === 'active' && (
                    <Link
                      to={`/vote/${election.electionid}`}
                      className="flex-1 bg-primary-600 hover:bg-primary-700 text-white text-center px-4 py-2 rounded-md transition-colors"
                    >
                      Vote Now
                    </Link>
                  )}
                  <Link
                    to={`/elections/${election.electionid}`}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 text-center px-4 py-2 rounded-md transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Elections

