const axios = require('axios');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const esService = require('../elasticsearch/es-service');
const Earthquake = require('../models/earthquake-model');
var _ = require('lodash');

class EarthquakeService {
    static allEarthquakes = [];
 
    static getEarthquakes = async () => {
        let earthquakes = [];

        const URL = "http://www.koeri.boun.edu.tr/scripts/lst0.asp";

        let result = await axios.get(URL);
        const dom = new JSDOM(result.data);
        let earthquakesStringList = dom.window.document.querySelector('pre').textContent.split("\n");

        earthquakesStringList.splice(0, 6); // Deprem verileri 6. satırda başladığı için ilk 6 satır siliniyor

        earthquakesStringList.forEach((item, index) => {
            if (index > 499) {
                return;
            }

            let earthquakeDetailList = item.split(" ");

            let details = earthquakeDetailList.filter((value) => value != '' && value != "-.-");

            const tarih = details[0];
            const saat = details[1];
            const latitude = parseFloat(details[2]);
            const longitude = parseFloat(details[3]);
            const derinlik = parseFloat(details[4]);
            const buyukluk = parseFloat(details[5]);
            let yer = "";

            for (let i = 6; i < details.length; i++) {
                if (details[i].includes("lksel") || details[i].includes("REVIZE")) {
                    break;
                }
                else {
                    yer += details[i] + " ";

                }
            }


            earthquakes.push(new Earthquake(
                tarih,
                saat,
                latitude,
                longitude,
                derinlik,
                buyukluk,
                yer
            ));

        });


        let differentItems = _.differenceWith(earthquakes, this.allEarthquakes, _.isEqual);// Yeni eklenen depremleri ayıklıyoruz

        if (differentItems.length > 0) {
          await esService.addData(differentItems);//Yeni deprem datalarını Elasticsearch'e ekliyoruz
        }

        this.allEarthquakes.unshift(...differentItems);


        return this.allEarthquakes;
    };

}
module.exports = EarthquakeService;