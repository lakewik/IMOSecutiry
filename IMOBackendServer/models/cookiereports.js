module.exports = (sequelize, type) => {
    return sequelize.define('cookiereports', {
        id: {
          type: type.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        name: type.STRING,
        value: type.STRING,
        newValue: type.STRING,
        sourceUrl: type.STRING,
        date: type.STRING,
        cookieUrl: type.STRING,
    })
}