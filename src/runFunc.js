//Turret: https://stellar-turrets-testnet.sdf-ecosystem.workers.dev
//Public Key: GB4OYM7TQTJSROWXHOJLKAX2IJ2QN4I6S6GCJH4MGWVTAO5Q5DPNADXX
//Max Fee: 10

const axios = require('axios');

const funcHash = '7b90ea95f099235bfbb847d741f297fdf0da3a144a229df3bf48289e65c0ffc6'

options = {
    turretKey: 'GB4OYM7TQTJSROWXHOJLKAX2IJ2QN4I6S6GCJH4MGWVTAO5Q5DPNADXX',
    turretURL: 'https://stellar-turrets-testnet.sdf-ecosystem.workers.dev/',
    fee: '2',
    network: 'https://horizon-testnet.stellar.org'
}

const runFunc = async() => {

    const body = {
        source:"GA3BZK5UKJATSBH43NAQUE6ZEVXBW7WPJ5RF62MUIMIM74AAYB6QZEWU"
    }

    const headers = {
        "Authorization": "Bearer AAAAAgAAAACreAo/gKwxQ9PeuMNcd4qaFp9C5QxeCWoaIEDI+l448AAAAGQAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAABhzeUrAAAAAAAAAAEAAAAAAAAACgAAAA50eEZ1bmN0aW9uSGFzaAAAAAAAAQAAAEA3YjkwZWE5NWYwOTkyMzViZmJiODQ3ZDc0MWYyOTdmZGYwZGEzYTE0NGEyMjlkZjNiZjQ4Mjg5ZTY1YzBmZmM2AAAAAAAAAAH6XjjwAAAAQG75KO+jEUZbF+ZBOduYour/qGoLDbPTDVMsBanoEM8cvIP/LsFz68rMyp7JmvaDfBCf+X19mgUJbzmJAuzzTgI="
    }

    const response = await axios.post(options.turretURL + 'tx-functions/' + funcHash, body, {headers: headers})
    console.log(response.data)
}

runFunc().then(console.log).catch(console.error)
