const Emmision = require('../models/ApplicanceEmmision')
const User = require("../models/Users")
const moment = require('moment');

exports.recordEmmision = async(req, res) => {
    try{
        const record =  new Emmision(req.body)
        await record.save()
        res.json({message: 'success', record})
    }
    catch(err){
        console.log(err)
        res.status(500).json({message: "error"})
    }
}

exports.fetchAllRecords = async(req, res) => {
    try{
        const result = await Emmision.find()
        res.json({message: "success", result: result})
    }
    catch(err){
        res.status(500)
    }
}

exports.fetchAllRecordsBasedOnUser = async(req, res) => {
    try{
        const result = await Emmision.find({email: req.body.email})
        res.json({message: "success", result:result})
    }
    catch(err){
        res.status(500)
    }
}

exports.fetchDynamicRecords = async(req, res) => {
    try{
        const result = await Emmision.find(req.body)
        res.json({message: "success", result: result})
    }
    catch(err){
        console.log(err)
    }
}

exports.fetchEmissionStatistics = async(req, res) => {
    try{
        let result = []
        if(req.body.email){
          result = await Emmision.find({email: req.body.email})
        }
        else{
          result = await Emmision.find({})
        }
        let avgUsage = 0
        let avgPrediction = 0
        let minUsage = 0
        let minPrediction = 0
        let maxUsage = 0
        let maxPrediction = 0
        let totalUsage = 0
        let totalPrediction = 0
        let usages = []
        let predictions = []
        if(result.length !== 0){
            result.forEach(({usage, prediction}) => {
              totalUsage += usage
              totalPrediction += prediction
              usages.push(usage)
              predictions.push(prediction)
            })
            avgUsage = totalUsage/result.length
            avgPrediction = totalPrediction/result.length
        }
        minUsage = Math.min(...usages)
        maxUsage = Math.max(...usages)
        minPrediction = Math.min(...predictions)
        maxPrediction = Math.max(...predictions)
        if(req.body.role){
            const userCount = await User.countDocuments()
            res.json({message: "success", result:{usage: {avg: avgUsage, min: minUsage, max: maxUsage}, 
            prediction: {avg: avgPrediction, min: minPrediction, max: maxPrediction}, totalUsage, totalPrediction, userCount}})
          }
        else{
          res.json({message: "success", result:{usage: {avg: avgUsage, min: minUsage, max: maxUsage}, 
          prediction: {avg: avgPrediction, min: minPrediction, max: maxPrediction}, totalUsage, totalPrediction}})
        }
    }
    catch(err){
        console.log(err)
        res.status(500).json({message: "failure", result:null})
    }
}


exports.getRecordsByYear = async (req, res) => {
  try {
    const year = req.body.year;

    if (!year) {
      return res.status(400).json({ error: 'Year is required' });
    }

    const monthlyStats = [];
    const fieldsToExclude = ['year', 'month'];

    // Create a new object by excluding the specified fields
    const modifiedBody = Object.keys(req.body)
      .filter(key => !fieldsToExclude.includes(key))
      .reduce((obj, key) => {
        obj[key] = req.body[key];
        return obj;
      }, {});

    for (let month = 1; month <= 12; month++) {
      let emissions = []
      if(req.body.email){
        emissions = await Emmision.find({
          ...modifiedBody,
          date: {
            $gte: `${year}-${month.toString().padStart(2, '0')}-01`,
            $lt: `${year}-${(month + 1).toString().padStart(2, '0')}-01`,
          },
        });
      }
      else{
        emissions = await Emmision.find({
          ...modifiedBody,
          date: {
            $gte: `${year}-${month.toString().padStart(2, '0')}-01`,
            $lt: `${year}-${(month + 1).toString().padStart(2, '0')}-01`,
          },
        });
      }

      if (emissions.length === 0) {
        monthlyStats.push({
          month,
          usage: { avg: 0, min: 0, max: 0 },
          prediction: { avg: 0, min: 0, max: 0 },
        });
        continue;
      }

      const usages = emissions.map(emission => emission.usage);
      const predictions = emissions.map(emission => emission.prediction);

      const averageUsage = usages.reduce((sum, value) => sum + value, 0) / usages.length;
      const minUsage = Math.min(...usages);
      const maxUsage = Math.max(...usages);

      const averagePrediction = predictions.reduce((sum, value) => sum + value, 0) / predictions.length;
      const minPrediction = Math.min(...predictions);
      const maxPrediction = Math.max(...predictions);

      monthlyStats.push({
        month,
        usage: { avg: averageUsage, min: minUsage, max: maxUsage },
        prediction: { avg: averagePrediction, min: minPrediction, max: maxPrediction },
      });
    }

    res.status(200).json(monthlyStats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getRecordsByMonth = async (req, res) => {
  try {
    const { year, month } = req.body;
    if (!year || !month) {
      return res.status(400).json({ error: 'Year and month are required' });
    }

    const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
    const endDate = `${year}-${(parseInt(month) + 1).toString().padStart(2, '0')}-01`;

    let emissions = []

    const fieldsToExclude = ['month', 'year'];

    // Create a new object by excluding the specified fields
    const modifiedBody = Object.keys(req.body)
      .filter(key => !fieldsToExclude.includes(key))
      .reduce((obj, key) => {
        obj[key] = req.body[key];
        return obj;
      }, {});


    if(req.body.email){
      emissions = await Emmision.find({
        ...modifiedBody,
        date: {
          $gte: startDate,
          $lte: endDate,
        },
      });
    }
    else{
      emissions = await Emmision.find({
        ...modifiedBody,
        date: {
          $gte: startDate,
          $lte: endDate,
        },
      });
    }


    const dailyStats = [];
    const daysInMonth = new Date(year, month, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const dayOfMonth = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

      const emissionsOfDay = emissions.filter(emission =>
        emission.date.startsWith(dayOfMonth)
      );

      if (emissionsOfDay.length === 0) {
        dailyStats.push({
          day,
          usage: 0,
          prediction: 0
        });
        continue;
      }

      const usageSum = emissionsOfDay.reduce((sum, emission) => sum + emission.usage, 0);
      const predictionSum = emissionsOfDay.reduce((sum, emission) => sum + emission.prediction, 0);

      dailyStats.push({
        day,
        usage: usageSum / emissionsOfDay.length,
        prediction: predictionSum / emissionsOfDay.length
      });
    }

    res.status(200).json(dailyStats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getStatsByFilterParams = async(req, res) => {
  try{
    const emissions = await Emmision.find(req.body)
    const uniqueProducts = Array.from(new Set(emissions.map(emission => emission.product)));
    const uniqueLocations = Array.from(new Set(emissions.map(emission => emission.location)));

    let stats = {
      locations: [],
      products: []
    }

    for(const product of uniqueProducts){
      const emissionsForProduct = emissions.filter(emission => emission.product === product);

      const usages = emissionsForProduct.map(emission => emission.usage);
      const predictions = emissionsForProduct.map(emission => emission.prediction);

      const averageUsage = usages.reduce((sum, value) => sum + value, 0) / usages.length;
      const minUsage = Math.min(...usages);
      const maxUsage = Math.max(...usages);

      const averagePrediction = predictions.reduce((sum, value) => sum + value, 0) / predictions.length;
      const minPrediction = Math.min(...predictions);
      const maxPrediction = Math.max(...predictions);

      stats.products.push({
        product,
        usage: {
          avg: averageUsage,
          min: minUsage,
          max: maxUsage,
        },
        prediction: {
          avg: averagePrediction,
          min: minPrediction,
          max: maxPrediction,
        },
      });
    }

    for(location of uniqueLocations){
      const emissionsForLocation = emissions.filter(emission => emission.location === location);

      const usages = emissionsForLocation.map(emission => emission.usage);
      const predictions = emissionsForLocation.map(emission => emission.prediction);

      const averageUsage = usages.reduce((sum, value) => sum + value, 0) / usages.length;
      const minUsage = Math.min(...usages);
      const maxUsage = Math.max(...usages);

      const averagePrediction = predictions.reduce((sum, value) => sum + value, 0) / predictions.length;
      const minPrediction = Math.min(...predictions);
      const maxPrediction = Math.max(...predictions);

      stats.locations.push({
        location,
        usage: {
          avg: averageUsage,
          min: minUsage,
          max: maxUsage,
        },
        prediction: {
          avg: averagePrediction,
          min: minPrediction,
          max: maxPrediction,
        },
      });
    }
    res.json(stats)
  }
  catch(err){
    res.status(500).json({ error: 'Internal server error' });
  }
}