const { Router } = require("express");
const {
    getActivities
} = require("../controllers/activityController");
const { Country, Activity } = require("../db");
const activityRouter = Router();

activityRouter.post("/", async (req, res) => {
    const { countriesId, name, difficulty, duration, season } = req.body;

    try {
        console.log("estoy en /activities");
        if (![countriesId.length, name, difficulty, duration, season].every(Boolean)) {
            throw new Error("Datos incompletos.");
        }

        const touristActivity = await Activity.create({
            name: name,
            difficulty: difficulty,
            duration: duration,
            season: season
        });

        for(let countryId of countriesId) {
            let country = await Country.findByPk(countryId);
            await country.addActivity(touristActivity);
            await touristActivity.addCountry(country);
        }

        res.status(200).json({ activity: touristActivity });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

activityRouter.get("/getActivities", async (req, res) => {
    try {
        console.log("esoy en /getActivities");
        const touristActivities = await getActivities();
        res.status(200).json(touristActivities);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = activityRouter;