const { Activity } = require("../db");

const getActivities = async () => await Activity.findAll();

module.exports = {
    getActivities
};