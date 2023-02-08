const { Country, Activity } = require("../db");
const { Op } = require("sequelize");

const getCountryById = async id => {
    const country = await Country.findByPk(id, { include: [Activity] });
    return country;
};

const findAllCountriesByName = async name => {
    const countries = await Country.findAll({ where: { name: { [Op.iLike]: '%' + name + '%' } } });
    return countries;
}

const findAllCountries = async () => {
    const countries = await Country.findAll({
        attributes: ["id", "name", "imgFlag", "continent", "capital", "subRegion", "area", "poblacion"],
        include: [
            {
                model: Activity,
                attributes: ["name", "difficulty", "duration", "season"],
                through: {
                    attributes: []
                }
            }
        ]
    });
    return countries;
}

module.exports = {
    getCountryById,
    findAllCountriesByName,
    findAllCountries
};