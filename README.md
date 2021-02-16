# Deprem API

Kandilli Rasathanesine ait güncel deprem verilerini JSON formatında sunan ve üzerinde çeşitli filtrelemeler yapılmasını sağlayan API servisidir.

Deprem verileri Boğaziçi Üniversitesine bağlı Kandilli Rasathanesi'nden getirilmektedir. Bu nedenle **ticari** amaçlı kullanım için Boğaziçi Üniversitesi Rektörlüğü’nün yazılı izni ve onayı alınması gerekmektedir.

>Projeyi çalıştırabilmek için makinenizde ElasticSearch kurulu olmalıdır. ElasticSearch portu varsayılan port olan 9200'dür. ElasticSearch sizin makinenizde farklı bir portta çalışıyorsa kod içerisinden değişiklik yapabilirsiniz


## Kurulum

Aşşağıdaki komutları sırasıyla çalıştırarak projeyi kurabilirsiniz.
```bash
git clone https://github.com/Tahatosun/deprem-api.git
cd deprem-api
npm install 
```
## Çalıştırma
Aşşağıdaki komut ile projeyi ayağa kaldırabilirsiniz.
```bash
npm start
```

## Routes
| Route|Parameters |Description                    |
| ------------- |---------| ------------------------------ |
| `/api/`      || Son 500 depremi getirir.       |
| `/api/limit/:limit`  | |  Son depremler içerisinden belirtilen limit kadarını getirir.  |
| `/api/filterByMag`    | `mag`,`size` |   Magnitude yani deprem büyüklüğüne göre filtrelemeyi sağlar. Büyüklüğü, verilen `mag` değerinden yüksek olan depremleri listeler.   |
| `/api/filterByLocation`  | `radius` ,`lon` ,`lat` ,`size`    | Verilen konumu orta nokta olarak belirler. Daha sonra belirtilen `radius `değeri kadar yarıçapı olan bir çember çizer ve bu alan içerisinde kalan depremleri listeler.       |
| `/api/filterByDate`     | `start`,`end`,`size` | Belirtilen başlangıç ve bitiş tarihi arasında kalan depremleri listeler.   |

## Paramaters
Parameters |Description                    |
---------| ------------------------------ |
| `size`  |  Listelenecek veri sayısını belirtir. Varsayılan değeri 10'dur. | 
| `lat`  | Verilen konumun Latitude değerini belirtir.|
| `lon`    |Verilen konumun Longitude değerini belirtir | 
| `radius`  |Yarıçapı belirtir.  Varsayılan değeri 50'dir. | 
| `mag`     |Deprem büyüklüğünü belirtmek için kullanılır.|
| `start`     | Tarihe göre filtreleme yaparken tarihin üst sınırını belirtir. |
| `end`     | Tarihe göre filtreleme yaparken tarihin alt sınırını belirtir. |
## Usage Examples
### Son 500 Depremi Listele
#### Request

    GET /api/ HTTP/1.1


#### Response

    HTTP/1.1 200 OK
    Date: Tue, 16 Feb 2021 10:48:46 GMT
    Status: 200 OK
    Connection: keep-alive
    Content-Type: application/json; charset=utf-8
    Content-Length: 67712

    []

### İstenilen sayıda Depremi Listele
#### Request

    GET /api/limit/200 HTTP/1.1



#### Response

    HTTP/1.1 200 OK
    Date: Tue, 16 Feb 2021 10:48:46 GMT
    Status: 200 OK
    Connection: keep-alive
    Content-Type: application/json; charset=utf-8
    Content-Length: 2305

    []

### Lokasyona göre filtreleme
#### Request

    GET /api/filterByLocation?lat=36.2817&lon=25.4402&radius=100&size=100 HTTP/1.1


#### Response

    HTTP/1.1 200 OK
    Date: Tue, 16 Feb 2021 10:48:46 GMT
    Status: 200 OK
    Connection: keep-alive
    Content-Type: application/json; charset=utf-8
    Content-Length: 979

    []
### Tarihe göre filtreleme
#### Request

    GET /api/filterByDate?start=2021.02.15&end=2021.02.13&size=10 HTTP/1.1


#### Response

    HTTP/1.1 200 OK
    Date: Tue, 16 Feb 2021 10:48:46 GMT
    Status: 200 OK
    Connection: keep-alive
    Content-Type: application/json; charset=utf-8
    Content-Length: 1305

    []
## License
[MIT](https://choosealicense.com/licenses/mit/)
