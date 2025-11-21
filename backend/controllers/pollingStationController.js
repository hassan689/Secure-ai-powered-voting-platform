const db = require("../config/db");

// Get all polling stations
exports.getAllStations = async (req, res) => {
  try {
    // PostgreSQL converts unquoted identifiers to lowercase
    // Schema: StationID, StationName, Address, City, State, ZipCode, Latitude, Longitude, OpeningTime, ClosingTime, Accessibility, Capacity, ContactPhone, AdditionalNotes, DateCreated, LastUpdated
    const query = `
      SELECT 
        stationid,
        stationname,
        address,
        city,
        state,
        zipcode,
        latitude,
        longitude,
        openingtime,
        closingtime,
        accessibility,
        capacity,
        contactphone,
        additionalnotes,
        datecreated,
        lastupdated
      FROM pollingstations 
      ORDER BY stationname
    `;
    const result = await db.query(query);
    
    // Map to camelCase for frontend
    const stations = result.rows.map(row => ({
      stationid: row.stationid,
      stationname: row.stationname,
      address: row.address,
      city: row.city,
      state: row.state,
      province: row.state, // Map state to province for frontend compatibility
      zipcode: row.zipcode,
      latitude: parseFloat(row.latitude),
      longitude: parseFloat(row.longitude),
      openingtime: row.openingtime,
      closingtime: row.closingtime,
      openinghours: `${row.openingtime} - ${row.closingtime}`, // Format for display
      accessibility: row.accessibility,
      capacity: row.capacity,
      contactphone: row.contactphone,
      additionalnotes: row.additionalnotes || ''
    }));
    
    res.json(stations);
  } catch (error) {
    console.error("Get stations error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Find nearby polling stations
exports.findNearbyStations = async (req, res) => {
  try {
    const { latitude, longitude, radius = 10 } = req.query; // radius in km
    
    if (!latitude || !longitude) {
      return res.status(400).json({ error: "Latitude and longitude are required" });
    }
    
    // Using Haversine formula for distance calculation
    // PostgreSQL converts unquoted identifiers to lowercase
    const query = `
      SELECT 
        stationid,
        stationname,
        address,
        city,
        state,
        zipcode,
        latitude,
        longitude,
        openingtime,
        closingtime,
        accessibility,
        capacity,
        contactphone,
        (
          6371 * acos(
            cos(radians($1)) * 
            cos(radians(latitude)) * 
            cos(radians(longitude) - radians($2)) + 
            sin(radians($1)) * 
            sin(radians(latitude))
          )
        ) AS distance_km
      FROM pollingstations
      WHERE (
        6371 * acos(
          cos(radians($1)) * 
          cos(radians(latitude)) * 
          cos(radians(longitude) - radians($2)) + 
          sin(radians($1)) * 
          sin(radians(latitude))
        )
      ) <= $3
      ORDER BY distance_km
      LIMIT 10
    `;
    
    const result = await db.query(query, [latitude, longitude, radius]);
    
    // Map to camelCase for frontend
    const stations = result.rows.map(row => ({
      stationid: row.stationid,
      stationname: row.stationname,
      address: row.address,
      city: row.city,
      state: row.state,
      province: row.state,
      zipcode: row.zipcode,
      latitude: parseFloat(row.latitude),
      longitude: parseFloat(row.longitude),
      openingtime: row.openingtime,
      closingtime: row.closingtime,
      openinghours: `${row.openingtime} - ${row.closingtime}`,
      accessibility: row.accessibility,
      capacity: row.capacity,
      contactphone: row.contactphone,
      distance_km: parseFloat(row.distance_km) || 0
    }));
    
    res.json(stations);
  } catch (error) {
    console.error("Find nearby stations error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get station by ID
exports.getStationById = async (req, res) => {
  try {
    const { id } = req.params;
    // PostgreSQL converts unquoted identifiers to lowercase
    const query = 'SELECT * FROM pollingstations WHERE stationid = $1';
    const result = await db.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Station not found" });
    }
    
    const station = result.rows[0];
    res.json({
      stationid: station.stationid,
      stationname: station.stationname,
      address: station.address,
      city: station.city,
      state: station.state,
      province: station.state,
      zipcode: station.zipcode,
      latitude: parseFloat(station.latitude),
      longitude: parseFloat(station.longitude),
      openingtime: station.openingtime,
      closingtime: station.closingtime,
      openinghours: `${station.openingtime} - ${station.closingtime}`,
      accessibility: station.accessibility,
      capacity: station.capacity,
      contactphone: station.contactphone,
      additionalnotes: station.additionalnotes || ''
    });
  } catch (error) {
    console.error("Get station error:", error);
    res.status(500).json({ error: error.message });
  }
};

