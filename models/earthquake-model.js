class Earthquake {
    constructor(date, hour, latitude, longitude, depth, mag, place) {
        this.date = date;
        this.hour = hour;
        this.depth = depth;
        this.mag = mag;
        this.place = place;
        this.location = {
            "lat": latitude,
            "lon": longitude
        }
    }
}
module.exports = Earthquake;