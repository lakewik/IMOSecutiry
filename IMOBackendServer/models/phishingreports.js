module.exports = (sequelize, type) => {
    return sequelize.define('phishingreports', {
        id: {
          type: type.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        siteUrl: type.STRING,
        votesUp: type.INTEGER,
        votesDown: type.INTEGER,
    })
}