import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { voteAPI } from '../services/api'
import { toast } from 'react-toastify'

const VoteReceipt = () => {
  const { confirmationId } = useParams()
  const [receipt, setReceipt] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReceipt()
  }, [confirmationId])

  const fetchReceipt = async () => {
    try {
      setLoading(true)
      const data = await voteAPI.getReceipt(confirmationId)
      setReceipt(data)
    } catch (error) {
      toast.error('Failed to load receipt')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (!receipt) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <p className="text-red-700">Receipt not found</p>
        </div>
      </div>
    )
  }

  const receiptData = typeof receipt.receiptdata === 'string' 
    ? JSON.parse(receipt.receiptdata) 
    : receipt.receiptdata

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 print:shadow-none">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Vote Confirmation Receipt</h1>
            <p className="text-sm text-gray-600">Your vote has been successfully recorded</p>
          </div>

          <div className="border-t border-b py-6 space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Confirmation ID:</span>
              <span className="font-mono font-bold text-gray-900">{receipt.confirmationid}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Election:</span>
              <span className="font-medium text-gray-900">{receipt.electiontitle}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Voter:</span>
              <span className="font-medium text-gray-900">{receipt.votername}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Date & Time:</span>
              <span className="font-medium text-gray-900">
                {new Date(receipt.createdat).toLocaleString()}
              </span>
            </div>
          </div>

          {receiptData.votes && (
            <div className="mt-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Votes Cast:</h2>
              <div className="space-y-2">
                {receiptData.votes.map((vote, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded">
                    <p className="text-sm text-gray-600">Vote #{index + 1}</p>
                    <p className="font-medium text-gray-900">Candidate ID: {vote.candidateId}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(vote.timestamp).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 p-4 bg-green-50 rounded-lg">
            <div className="flex items-center">
              <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-green-700">
                This receipt confirms that your vote has been securely recorded. 
                Please save this confirmation ID for your records.
              </p>
            </div>
          </div>

          <div className="mt-6 flex space-x-4">
            <button
              onClick={handlePrint}
              className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md"
            >
              Print Receipt
            </button>
            <button
              onClick={() => window.history.back()}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VoteReceipt

