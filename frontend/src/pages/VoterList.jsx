import { useState, useEffect } from 'react'
import { voterAPI } from '../services/api'
import { toast } from 'react-toastify'

const VoterList = () => {
  const [voters, setVoters] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, verified, unverified

  useEffect(() => {
    fetchVoters()
  }, [])

  const fetchVoters = async () => {
    try {
      setLoading(true)
      const data = await voterAPI.getAll()
      setVoters(data)
    } catch (error) {
      toast.error('Failed to fetch voters')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async (voterID) => {
    try {
      await voterAPI.verify(voterID)
      toast.success('Voter verified successfully!')
      fetchVoters()
    } catch (error) {
      toast.error('Failed to verify voter')
      console.error(error)
    }
  }

  const filteredVoters = voters.filter(voter => {
    if (filter === 'verified') return voter.IsVerified === 1
    if (filter === 'unverified') return voter.IsVerified === 0
    return true
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
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Voter Management</h1>
            <div className="flex space-x-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-primary-600 text-white hover:bg-primary-700'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('verified')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filter === 'verified'
                    ? 'bg-primary-600 text-white hover:bg-primary-700'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Verified
              </button>
              <button
                onClick={() => setFilter('unverified')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filter === 'unverified'
                    ? 'bg-primary-600 text-white hover:bg-primary-700'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Unverified
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Voter ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Full Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    CNIC
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredVoters.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      No voters found
                    </td>
                  </tr>
                ) : (
                  filteredVoters.map((voter) => (
                    <tr key={voter.VoterID} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {voter.VoterID}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {voter.FullName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {voter.CNIC}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {voter.Email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {voter.IsVerified === 1 ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Verified
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {voter.IsVerified === 0 && (
                          <button
                            onClick={() => handleVerify(voter.VoterID)}
                            className="text-white hover:text-white bg-secondary-500 hover:bg-secondary-600 px-3 py-1 rounded-md transition-colors font-medium"
                          >
                            Verify
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 text-sm text-gray-500">
            Showing {filteredVoters.length} of {voters.length} voters
          </div>
        </div>
      </div>
    </div>
  )
}

export default VoterList

