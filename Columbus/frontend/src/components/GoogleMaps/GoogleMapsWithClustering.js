import React from 'react'
import { GoogleMap, InfoWindow, Marker, MarkerClusterer,useGoogleMap } from '@react-google-maps/api';


const containerStyle = {
    width: '90%',
    height: '40vh',
    margin: "5%",
};

  

const options = {
  //imagePath:
  //  'https://columbus-test.s3.eu-central-1.amazonaws.com/markers/story', // so you must have m1.png, m2.png, m3.png, m4.png, m5.png and m6.png in that folder
  //imageExtension: "png"
}

function createKey(story, location) {
  return story.story_id.toString() + story.createDateTime + location.location + location.latitude + location.longitude
}
  
// function handleClusterClick(cluster : Cluster){
//   console.logcluster.markers
// } 

let markerStoryDict = {};

const IstanbulGeolocation = {
  lat: 41.008,
  lng: 28.935,
}


export default function GoogleMapsWithClustering({center, stories, setStories, setGeolocation}){
    const [activeMarker, setActiveMarker] = React.useState(null);
  
    const openInfoWindow = (key) => {
      setActiveMarker(key);
    }

    return (
        
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center.lat && center.lng ? center : IstanbulGeolocation }
            onClick={e => setGeolocation({lat: e.latLng.lat(), lng: e.latLng.lng()})}
            zoom={10}
          >
              <MarkerClusterer options={options} onClick={(cluster) => {
                setStories(cluster.getMarkers().map(marker => markerStoryDict[marker.getTitle()]))
              }}>
              {(clusterer) =>
                  stories.map((story) => 
                      story.locations.filter(location => location.type !== "Virtual").map(location => {
                       
                        const key = createKey(story, location);
                        var marker = <Marker key={key} position={{lat:location.latitude%180-90, lng:location.longitude%180-90}} clusterer={clusterer} title={key} onClick={(e) => {
                          openInfoWindow(key)
                          setStories([story])
                          }}>
                            {activeMarker === key ? <InfoWindow onCloseClick={() => setActiveMarker(null)}>
                                <div>{location.location}</div>
                              </InfoWindow>
                              : null
                              }
                            
                        </Marker>;
                         
                        if(!markerStoryDict[marker.key]){
                          markerStoryDict[marker.key] = story;
                        }
                        return marker;
                      })
                  )
              }
               
              </MarkerClusterer>
             
          
          </GoogleMap>
      )
}

