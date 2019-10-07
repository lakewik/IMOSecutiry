module.exports = (sequelize, type) => {
    return sequelize.define('unecryptedsites', {
        id: {
          type: type.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        siteUrl: type.STRING,
    })
}