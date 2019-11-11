import React     from 'react';
import DeckGL, {PathLayer,IconLayer} from 'deck.gl';
import InteractiveMap from 'react-map-gl';

const TOKEN = 'pk.eyJ1Ijoic2llZ2R1cHJlZXoiLCJhIjoiY2syMjNncDhuMWw5MDNocWd3dWQ2NWxueSJ9.ue5CbN-YmH4WHbEC_2aE5A'; // Set your mapbox token here

const ICON_ATLAS = '/icon-atlas.png';
const ICON_MAPPING = {
  mark: {x: 0, y: 0, width: 128, height: 128, mask: true}
};

const POO_ICON_ATLAS = '/poop.png';
const POO_ICON_MAPPING = {
  mark: {x: 0, y: 0, width: 256, height: 256, mask: false}
};

const COOKIE_ICON_ATLAS = '/bone.png';
const COOKIE_ICON_MAPPING = {
  mark: {x: 0, y: 0, width: 256, height: 256, mask: false}
};

const EARTH_RADIUS = 6378.137; // Radius of earth in KM

export default class Map extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
                  viewport: {},
                  poops: [],
                  cookies: [],
                  route:[{
                    path: []
                  }],
                  icon: []
                };

  this.isTracking = false;
  this.distanceWalked = 0;
  this.startTime = 0;
  this.endTime = 0;
  this.control = React.createRef(); 
    this.timer = null;
  }

  componentDidMount() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition( position => { 
        this.setState({
            viewport: {
              longitude: position.coords.longitude,
              latitude:  position.coords.latitude,
              zoom: 16,
              pitch: 0,
              bearing: 0,
              scrollZoom: false,
              dragPan: false,
              dragRotate: false,
              doubleClickZoom: false,
              touchZoom: false,
              touchRotate: false
            },
            icon: [
              {coordinates: [position.coords.longitude, position.coords.latitude]}
            ]            
        });
        this.timer = setInterval(() => this.updateRoute(), 2000 );
        this.displayMessage("Let's go!");
    }, (err) => {
        this.setState({message: "Geolocation not enabled. "});
      });
    } else {
      this.setState({message: "Sorry, Geolocation not available"});
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  toggleTracking = ()  => {
    const {viewport} = this.state;

    if (this.isTracking) {
        this.displayMessage("Tracking stopped");
        this.isTracking = false;
        this.endTime = new Date().getTime();
        this.setState({
            viewport: viewport,
        });
        this.calculateDistanceWalked();
        this.props.onStop({ distanceWalked: this.distanceWalked, 
                            timeWalked: (this.endTime-this.startTime),
                            poops: this.state.poops,
                            cookies: this.state.cookies,
                            path: this.state.route[0].path});
    } else {
      console.log('Start clicked.');

      navigator.geolocation.getCurrentPosition( p => {
        this.displayMessage("Tracking started");
        viewport.longitude = p.coords.longitude;
        viewport.latitude =  p.coords.latitude;

        this.setState({
            viewport: viewport,
            icon: [ {coordinates: [p.coords.longitude, p.coords.latitude]}]
        });
        
        if (!this.startTime) {
            this.startTime = new Date().getTime();
        }
        this.isTracking = true;
        this.props.onStart();
      });
    }
  }

  updateRoute = () => {
    if (this.isTracking) {
      navigator.geolocation.getCurrentPosition( position => { 
        this.updateRoute(position);
        const {viewport} = this.state;
        viewport.longitude = position.coords.longitude;
        viewport.latitude =  position.coords.latitude;
        this.setState({viewport: viewport});
      });

    }
  }

  updatePosition = (position) => {
    let route = [...this.state.route];
    let lastPosition = route[0].path[route[0].path.length-1];
    if (!lastPosition || 
        Math.abs(lastPosition[0] - position.coords.longitude) > 0.00001 ||
        Math.abs(lastPosition[1] - position.coords.latitude) > 0.00001) {
      route[0].path.push([position.coords.longitude, position.coords.latitude]);
      this.setState({route: route, 
                     icon: [{coordinates: [position.coords.longitude, position.coords.latitude]}]
                    });
    }
  }

  onPoop = (event) => {
    this.displayMessage("Oops!");
    this.setState({poops: [...this.state.poops, { poop: {coordinates: this.state.icon[0].coordinates, time: new Date().getTime()} }]});
    this.props.onPoop();
  }

  onCookie = (event) => {
    this.displayMessage("Yam yam!");
    this.setState({cookies: [...this.state.cookies, { cookie: {coordinates: this.state.icon[0].coordinates, time: new Date().getTime()} }]});
    this.props.onCookie();
  }

  displayMessage = (message) => {
    this.setState({message: message});
    setTimeout(() => this.setState({message: ""}), 3000);

  }

  drawWalk = (event) => {
    if (this.isTracking) {
       this.updatePosition({coords: {longitude: event.lngLat[0], latitude: event.lngLat[1]}});
    }
  }

  calculateDistanceWalked = () => {
      let distance = 0;
      for (let i = 0; i < this.state.route[0].path.length; i++) {
          let pos1 = this.state.route[0].path[i];
          let pos2 = this.state.route[0].path[i+1];
          if (pos1 && pos2) {
            distance += this.measure(pos1[0], pos1[1], pos2[0], pos2[1]);
          }
      }
      this.distanceWalked = distance;
  }

   
  measure = (lat1, lon1, lat2, lon2) => {
    var dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
    var dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = EARTH_RADIUS * c;
    return d * 1000; // meters
  }

  createTripLayer = () => {
      return new PathLayer({
          id: 'path-layer',
          data: this.state.route,
          pickable: false,
          widthScale: 1,
          widthMinPixels: 2,
          widthMaxPixels: 2,
          miterLimit: 10,
          rounded: true,
          dashJustified: true,
          //getDashArray: [3,6],
          getPath: d => d.path,
          getColor: x => [0, 255, 0],
          getWidth: d => 2
        });
  }

  
  createIconLayer = () => {
    return new IconLayer({
        id: 'icon-layer',
        data: this.state.icon,
        pickable: false,
        iconAtlas: ICON_ATLAS,
        iconMapping: ICON_MAPPING,
        getIcon: d => 'mark',
        sizeMaxPixels: 200,
        sizeMinPixels: 50,
        sizeScale: 2,
        getPosition: d => [d.coordinates[0], (d.coordinates[1]+0.00015)],
        getSize: d => 3,
        getColor: d => this.isTracking ? [0, 255, 0] : [255, 0, 0],
    });
  }

  createPoopLayer = () => {
    return new IconLayer({
        id: 'poop-icon-layer',
        data: this.state.poops,
        pickable: false,
        iconAtlas: POO_ICON_ATLAS,
        iconMapping: POO_ICON_MAPPING,
        getIcon: d => 'mark',
        sizeMaxPixels: 50,
        sizeMinPixels: 1,
        sizeScale: 6,
        getPosition: d => d.poop.coordinates,
        getSize: d => 3
    });
  }

  createCookieLayer = () => {
    return new IconLayer({
        id: 'cookie-icon-layer',
        data: this.state.cookies,
        pickable: false,
        iconAtlas: COOKIE_ICON_ATLAS,
        iconMapping: COOKIE_ICON_MAPPING,
        getIcon: d => 'mark',
        sizeMaxPixels: 50,
        sizeMinPixels: 1,
        sizeScale: 6,
        getPosition: d => d.cookie.coordinates,
        getSize: d => 3
    });
  }

  renderLayers() {
    return [ this.createTripLayer(), this.createPoopLayer(), this.createCookieLayer(), this.createIconLayer()];
  }

  render() {
    const {viewport} = this.state;
    
    return (
      <>
        <div id="mapLayer"> 
          <InteractiveMap
                {...viewport}
                width="100%"
                height="100%"
                mapboxApiAccessToken={TOKEN}
                onViewportChange={navigator.geolocation ? this.updateViewport : null} 
                onMouseMove={this.drawWalk}
                onTouchMove={this.drawWalk}
                mapStyle="mapbox://styles/mapbox/streets-v11"
        >
              <DeckGL
                  viewState={viewport}
                  layers={this.renderLayers()}
                  controler={false}
              />
              
          </InteractiveMap>
        </div>
        <div id="buttonLayer"> 
            <div className='map-top'>
                <div onClick={this.toggleTracking} className='start-icon' hidden={this.isTracking}></div>
                <div onClick={this.toggleTracking}  className='start-icon stop-icon' hidden={!this.isTracking}></div>
                <div onClick={this.onPoop} className='poop-icon'></div>
            </div>
            <div className='map-middle'>
                <div onClick={this.onCookie} className='cookie-icon'></div>
                <div onClick={this.props.onShowICE} className='ice-icon'></div>
                <div id="message">{this.state.message}</div>
            </div>
            <div className='map-bottom'>
                <div onClick={this.props.onShowCommands} className='dictionary-icon'></div>
            </div>
          </div>
      </>
    );
  }
}