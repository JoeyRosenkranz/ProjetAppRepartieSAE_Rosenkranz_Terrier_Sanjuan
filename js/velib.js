


export async function listerStation(map) {
  try {
    // feztch
    const [infoRes, statusRes] = await Promise.all([
      fetch('https://api.cyclocity.fr/contracts/nancy/gbfs/v2/station_information.json'),
      fetch('https://api.cyclocity.fr/contracts/nancy/gbfs/v2/station_status.json')
    ]);
    if (!infoRes.ok || !statusRes.ok) {
      throw new Error(`Fetch error : ${infoRes.status} / ${statusRes.status}`);
    }

    const infos    = (await infoRes.json()).data.stations;
    const statuses = (await statusRes.json()).data.stations;

    
    const stations = infos.map(info => {
      const st = statuses.find(s => s.station_id === info.station_id) || {};
      return {
        id:      info.station_id,
        name:    info.name,
        address: info.address,
        lat:     info.lat,
        lng:     info.lon,
        num_bikes_available: st.num_bikes_available ?? 0,
        num_docks_available: st.num_docks_available ?? 0
      };
    });

    
    const tplSrc = document.getElementById('tpl-station').innerHTML;
    const tpl    = Handlebars.compile(tplSrc);
    document.getElementById('stationList').innerHTML = tpl({ stations });

    
    return stations;
  } catch (err) {
    console.error('Erreur Vélib’ :', err);
    return [];
  }
}
