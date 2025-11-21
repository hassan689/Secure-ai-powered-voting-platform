import { useState, useEffect, useRef } from 'react'
import { pollingStationAPI } from '../services/api'
import { toast } from 'react-toastify'
import { HiLocationMarker } from 'react-icons/hi'

const PollingStations = () => {
  const [stations, setStations] = useState([])
  const [loading, setLoading] = useState(true)
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [useLocation, setUseLocation] = useState(false)
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersRef = useRef([])

  useEffect(() => {
    console.log('🚀 PollingStations component mounted, fetching stations...')
    fetchStations()
    
    // Get user's location if permission granted
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude.toString())
          setLongitude(position.coords.longitude.toString())
          setUseLocation(true)
        },
        (error) => {
          console.log('Location access denied:', error)
        }
      )
    }

    // Initialize map when component mounts
    if (window.google && window.google.maps) {
      initializeMap()
    } else {
      // Wait for Google Maps to load
      const checkGoogleMaps = setInterval(() => {
        if (window.google && window.google.maps) {
          clearInterval(checkGoogleMaps)
          initializeMap()
        }
      }, 100)
      
      return () => clearInterval(checkGoogleMaps)
    }
  }, [])

  useEffect(() => {
    console.log('📍 Stations changed, current count:', stations.length)
    if (stations.length > 0 && mapInstanceRef.current) {
      console.log('🗺️ Updating map markers...')
      updateMapMarkers()
    }
  }, [stations])

  const initializeMap = () => {
    if (!mapRef.current || !window.google) return

    const defaultCenter = latitude && longitude 
      ? { lat: parseFloat(latitude), lng: parseFloat(longitude) }
      : { lat: 24.8607, lng: 67.0011 } // Default to Karachi, Pakistan

    mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
      center: defaultCenter,
      zoom: 12,
      mapTypeControl: true,
      streetViewControl: true,
      fullscreenControl: true,
    })
  }

  const updateMapMarkers = () => {
    if (!mapInstanceRef.current || !window.google) return

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null))
    markersRef.current = []

    // Add markers for each station
    stations.forEach(station => {
      if (station.latitude && station.longitude) {
        const marker = new window.google.maps.Marker({
          position: { lat: parseFloat(station.latitude), lng: parseFloat(station.longitude) },
          map: mapInstanceRef.current,
          title: station.stationname,
          animation: window.google.maps.Animation.DROP,
        })

        // Add info window
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 10px;">
              <h3 style="margin: 0 0 8px 0; font-weight: bold;">${station.stationname}</h3>
              <p style="margin: 4px 0;">${station.address}</p>
              <p style="margin: 4px 0;">${station.city}, ${station.state}</p>
              ${station.contactphone ? `<p style="margin: 4px 0;">Phone: ${station.contactphone}</p>` : ''}
              ${station.openingtime && station.closingtime ? `<p style="margin: 4px 0;">Hours: ${station.openingtime} - ${station.closingtime}</p>` : ''}
            </div>
          `,
        })

        marker.addListener('click', () => {
          infoWindow.open(mapInstanceRef.current, marker)
        })

        markersRef.current.push(marker)
      }
    })

    // Fit map to show all markers
    if (markersRef.current.length > 0) {
      const bounds = new window.google.maps.LatLngBounds()
      markersRef.current.forEach(marker => bounds.extend(marker.getPosition()))
      mapInstanceRef.current.fitBounds(bounds)
    }
  }

  const fetchStations = async () => {
    try {
      setLoading(true)
      console.log('🔍 Fetching polling stations...')
      const data = await pollingStationAPI.getAll()
      console.log('✅ Fetched polling stations:', data)
      console.log('📊 Data type:', Array.isArray(data) ? 'Array' : typeof data)
      console.log('📊 Data length:', data?.length)
      
      if (Array.isArray(data)) {
        setStations(data)
        console.log('✅ Stations state updated with', data.length, 'stations')
        if (data.length === 0) {
          toast.info('No polling stations found')
        } else {
          toast.success(`Loaded ${data.length} polling station(s)`)
        }
      } else {
        console.warn('⚠️ Data is not an array:', data)
        setStations([])
        toast.error('Invalid data format received')
      }
    } catch (error) {
      toast.error('Failed to load polling stations')
      console.error('❌ Polling stations fetch error:', error)
      console.error('❌ Error response:', error.response)
      console.error('❌ Error details:', error.response?.data || error.message)
      setStations([]) // Ensure stations is an array even on error
    } finally {
      setLoading(false)
      console.log('🏁 Fetch completed, loading set to false')
    }
  }

  const handleFindNearby = async () => {
    if (!latitude || !longitude) {
      toast.error('Please provide latitude and longitude')
      return
    }

    try {
      setLoading(true)
      const data = await pollingStationAPI.findNearby(latitude, longitude, 10)
      setStations(data)
      
      // Update map center
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setCenter({
          lat: parseFloat(latitude),
          lng: parseFloat(longitude)
        })
        mapInstanceRef.current.setZoom(13)
      }
    } catch (error) {
      toast.error('Failed to find nearby stations')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude.toString())
          setLongitude(position.coords.longitude.toString())
          setUseLocation(true)
          toast.success('Location detected!')
        },
        (error) => {
          toast.error('Failed to get your location')
          console.error('Location error:', error)
        }
      )
    } else {
      toast.error('Geolocation is not supported by your browser')
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
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Polling Stations</h1>

      {/* Google Map */}
      <div className="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
        <div 
          ref={mapRef} 
          style={{ width: '100%', height: '500px' }}
          className="w-full"
        />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Find Nearby Stations</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
            <input
              type="number"
              step="any"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              placeholder="24.8607"
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
            <input
              type="number"
              step="any"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              placeholder="67.0011"
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleUseCurrentLocation}
              className="w-full bg-secondary-600 hover:bg-secondary-700 text-white px-4 py-2 rounded-md text-sm"
            >
              <HiLocationMarker className="inline mr-1" /> Use My Location
            </button>
          </div>
          <div className="flex items-end">
            <button
              onClick={handleFindNearby}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md"
            >
              Find Nearby
            </button>
          </div>
        </div>
      </div>

      {/* Debug info - remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-4 p-2 bg-yellow-100 text-xs rounded">
          Debug: Stations count = {stations.length}, Loading = {loading ? 'true' : 'false'}
        </div>
      )}

      {stations.length === 0 && !loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">There is nothing to show</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stations.map((station) => (
          <div key={station.stationid} className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">{station.stationname}</h3>
            <p className="text-gray-600 mb-4">{station.address}</p>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-gray-600">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {station.city}, {station.province}
              </div>
              
              {station.contactphone && (
                <div className="flex items-center text-gray-600">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {station.contactphone}
                </div>
              )}
              
              {station.openinghours && (
                <div className="flex items-center text-gray-600">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {station.openinghours}
                </div>
              )}
              
              {station.latitude && station.longitude && (
                <div className="flex space-x-2 mt-3">
                  <a
                    href={`https://www.google.com/maps?q=${station.latitude},${station.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-primary-600 hover:text-primary-700 text-sm"
                  >
                    View on Google Maps →
                  </a>
                  <button
                    onClick={() => {
                      if (mapInstanceRef.current) {
                        mapInstanceRef.current.setCenter({
                          lat: parseFloat(station.latitude),
                          lng: parseFloat(station.longitude)
                        })
                        mapInstanceRef.current.setZoom(15)
                        // Open info window for this marker
                        const marker = markersRef.current.find(m => 
                          m.getPosition().lat() === parseFloat(station.latitude) &&
                          m.getPosition().lng() === parseFloat(station.longitude)
                        )
                        if (marker) {
                          marker.getTitle() && new window.google.maps.InfoWindow({
                            content: `
                              <div style="padding: 10px;">
                                <h3 style="margin: 0 0 8px 0; font-weight: bold;">${station.stationname}</h3>
                                <p style="margin: 4px 0;">${station.address}</p>
                                <p style="margin: 4px 0;">${station.city}, ${station.state}</p>
                              </div>
                            `
                          }).open(mapInstanceRef.current, marker)
                        }
                      }
                    }}
                    className="inline-flex items-center text-secondary-600 hover:text-secondary-700 text-sm"
                  >
                    Show on Map
                  </button>
                </div>
              )}
            </div>
          </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default PollingStations

