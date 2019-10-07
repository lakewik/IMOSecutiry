const express = require('express')
const Sequelize = require('sequelize')


const CookieReportsModel = require('./models/cookiereports')
const UnencryptedWebsitesModel = require('./models/unencryptedwebsites')
const PhishingReportsModel = require('./models/phishingreports')

const app = express()
const port = 3001

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

const sequelize = new Sequelize('ose', 'root', 'meow', {
    host: 'localhost',
    dialect: 'mysql',
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  })


  const CookieReports = CookieReportsModel(sequelize, Sequelize);
  const UnencryptedWebsites = UnencryptedWebsitesModel(sequelize, Sequelize);
  const PhishingReports = PhishingReportsModel(sequelize, Sequelize);

app.get('/reportCookie', (req, res) => {
    console.log(req.query);


    CookieReports.create({
        name: req.query.cookieName,
        value: req.query.cookieValue,
        cookieUrl: req.query.cookieURL,
        sourceUrl: req.query.sourceURL,
        newValue: req.query.cookieNewValue,
    })
    .then(report => {
            console.log(report);
    }).catch(err => {
        console.log(err);
})

    res.send('Hello World!')
});


app.get('/reportUnecryptedWebsite', (req, res) => {
    console.log(req.query);


    UnencryptedWebsites.create({
        siteUrl: req.query.siteUrl,
    })
    .then(report => {
            console.log(report);
    }).catch(err => {
        console.log(err);
})

    res.send('Hello World!')
});


app.get('/reportPhishing', (req, res) => {
    console.log(req.query);


    PhishingReports.create({
        siteUrl: req.query.siteUrl,
    })
    .then(report => {
            console.log(report);
    }).catch(err => {
        console.log(err);
})

    res.send('Hello World!')
});


app.get('/reportPhishing/voteUp', (req, res) => {
    console.log(req.query);


    PhishingReports.create({
        siteUrl: req.query.siteUrl,
    })
    .then(report => {
            console.log(report);
    }).catch(err => {
        console.log(err);
})

    res.send('Hello World!')
});


app.get('/reportPhishing/voteDown', (req, res) => {
    console.log(req.query);


    PhishingReports.create({
        siteUrl: req.query.siteUrl,
    })
    .then(report => {
            console.log(report);
    }).catch(err => {
        console.log(err);
})

    res.send('Hello World!')
});

app.post('/reportCookie', (req, res) => {
    console.log(req.query);
    res.send('Hello World!')
});

app.get('/commonCookiesChart', (req, res) => {
   
    CookieReports.findAll({
        attributes: ['sourceUrl',[sequelize.fn('COUNT', sequelize.col('sourceUrl')), 'total']] ,
        group : ['sourceUrl'],
        order: sequelize.literal('total DESC')
      }).then(result => {
        console.log(result);
        res.send(result)
}).catch(err => {
    console.log(err);
});

   
});


app.get('/commonUnencryptedWebsites', (req, res) => {
   
    UnencryptedWebsites.findAll({
        attributes: ['siteUrl',[sequelize.fn('COUNT', sequelize.col('siteUrl')), 'total']] ,
        group : ['siteUrl'],
        order: sequelize.literal('total DESC')
      }).then(result => {
        console.log(result);
        res.send(result)
}).catch(err => {
    console.log(err);
});

   
});

app.listen(port, () => console.log(`OSE app listening on port ${port}!`))