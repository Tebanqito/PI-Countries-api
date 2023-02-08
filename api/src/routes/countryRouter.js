const { Router } = require("express");
const {
    getCountryById,
    findAllCountriesByName,
    findAllCountries
} = require("../controllers/countryController");
const { Country } = require("../db");
const countryRouter = Router();
const axios = require("axios");

countryRouter.get("/", async (req, res) => {
    const { name } = req.query;

    try {
        console.log("estoy en /countries");
        if (name) {
            const countries = await findAllCountriesByName(name);
            if (countries) return res.status(200).json(countries);
            throw new Error(`No se ah encontrado el pais ${name} en la base de datos.`);
        }
        const countries = await findAllCountries();

        if (!countries.length) {
            await axios.get("https://restcountries.com/v3/all")
                .then(res => {
                    const countries = res.data;

                    countries.forEach(async element => {
                        await Country.create({
                            id: element.cca3,
                            name: element.name.official ? element.name.official : element.name.common,
                            imgFlag: element.flags ? element.flags[0] : element.flag,
                            continent: element.region ? element.region : element.continents[0],
                            capital: element.capital ? element.capital[0] : "No posee capital",
                            subRegion: element.subregion,
                            area: element.area,
                            poblacion: element.population
                        });
                    });
                });

            return res.status(200).json({ status: "Paises cargados en la BDD." });
        }

        return res.status(200).json(countries);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

countryRouter.get("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const country = await getCountryById(id);
        res.status(200).json(country);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = countryRouter;