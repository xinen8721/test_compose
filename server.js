const express = require('express')
const redis = require('redis')
const axios = require('axios');
const res = require('express/lib/response');
const app = express()
const client = redis.createClient({
    host: 'redis-server',
    port: 6379
})

app.use(express.urlencoded({extended: true}))
app.use(express.json())
//Set initial visits
client.set('visits', 0);

//defining the root endpoint
app.get('/', (req, res) => {
    client.get('visits', (err, visits) => {
        client.set('visits', parseInt(visits) + 2)
        res.send('Number of visits is: ' + visits)
    })
})

app.get('/users', (req, resp) => {
    // const https = require('https');

    /**
     * Axios
     * 
     * */
    axios.get('https://jsonplaceholder.typicode.com/users')
    .then((_res) => {
        const headerDate = _res.headers && _res.headers.date ? _res.headers.date : 'no response date';
        console.log('Status Code:', res.status);
        console.log('Date in Response header:', headerDate);

        const users = _res.data;

        for(user of users) {
            console.log(`Got user with id: ${user.id}, name: ${user.name}`);
        }
        return resp.send('Done with Axios')
    })
    .catch(err => {
        resp.send(err.message)
    })
    //Https
    // https.get('https://jsonplaceholder.typicode.com/users', res => {
    //   let data = [];
    //   const headerDate = res.headers && res.headers.date ? res.headers.date : 'no response date';
    //   console.log('Status Code:', res.statusCode);
    //   console.log('Date in Response header:', headerDate);
    
    //   res.on('data', chunk => {
    //     data.push(chunk);
    //   });
    
    //   res.on('end', () => {
    //     console.log('Response ended: ');
    //     const users = JSON.parse(Buffer.concat(data).toString());
    
    //     for(user of users) {
    //       console.log(`Got user with id: ${user.id}, name: ${user.name}`);
    //     }
    //     return resp.send(users);
    //   });
    // }).on('error', err => {
    //   console.log('Error: ', err.message);
    // });
})


app.post('/comment', (req, res) => {
    var resetCounter  = req.body['init-counter'];
    client.set('visits', parseInt(resetCounter), () => {
        res.send('Done')
    });
})
//specifying the listening port
app.listen(8081, ()=>{
    console.log('Listening on port 8081')
})
