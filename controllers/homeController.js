const BigPromise = require("../middlewares/bigPromise")

exports.home = BigPromise(async(req,res) => {
    // eg. const db = await something()
    res.status(200).json({
        success: true,
        greeting: "Hello from API"
    });
});


exports.homeDummy = (req,res) => {

    try {
        // eg. const db = await something()

        res.status(200).json({
            success: true,
            greeting: "Hello from Dummy API, this is another Dummy API"
        }); 
    } catch (error) {
        console.log(error);
    }
    
}