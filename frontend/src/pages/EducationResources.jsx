import { useState, useEffect } from 'react'
import { educationAPI } from '../services/api'
import { toast } from 'react-toastify'

const EducationResources = () => {
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState({ language: '', type: '' })

  useEffect(() => {
    fetchResources()
  }, [filter])

  const fetchResources = async () => {
    try {
      setLoading(true)
      const data = await educationAPI.getResources(filter.language || undefined, filter.type || undefined)
      setResources(data)
    } catch (error) {
      toast.error('Failed to load resources')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'video': return '🎥'
      case 'article': return '📄'
      case 'faq': return '❓'
      case 'guide': return '📖'
      default: return '📚'
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
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Voter Education Resources</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
            <select
              value={filter.language}
              onChange={(e) => setFilter({ ...filter, language: e.target.value })}
              className="w-full p-2 border rounded-md"
            >
              <option value="">All Languages</option>
              <option value="en">English</option>
              <option value="ur">Urdu</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={filter.type}
              onChange={(e) => setFilter({ ...filter, type: e.target.value })}
              className="w-full p-2 border rounded-md"
            >
              <option value="">All Types</option>
              <option value="article">Article</option>
              <option value="video">Video</option>
              <option value="faq">FAQ</option>
              <option value="guide">Guide</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">No resources found</p>
          </div>
        ) : (
          resources.map((resource) => (
            <div key={resource.resourceid} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">{getTypeIcon(resource.resourcetype)}</span>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{resource.title}</h3>
                  <p className="text-xs text-gray-500 capitalize">{resource.resourcetype}</p>
                </div>
              </div>
              
              {resource.content && (
                <p className="text-gray-700 mb-4 line-clamp-3">{resource.content}</p>
              )}
              
              {resource.url && (
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  Read More →
                </a>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default EducationResources

