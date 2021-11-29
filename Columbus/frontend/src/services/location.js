import { API_INSTANCE } from "../config/api";

const LOCATION_SERVICE = {
  CREATE_LOCATION: (locationData) => API_INSTANCE.post("/locations/", locationData),
  GET_LOCATION: (locationId) => API_INSTANCE.get(`/locations/${locationId}`),
  GET_LOCATIONS: () => API_INSTANCE.get("/locations"),
};

export default LOCATION_SERVICE;
