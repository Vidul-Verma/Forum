var env = process.env.NODE_ENV || "development";

if(env === "development"){
    
    var config = require("./config.json");
    //GET THE JSON AND CONVERT IT TO JSOBJECT
    var envConfig = config[env];
    //GET ALL KEYS FROM ENVCOFIG OBJECT AND LOOP THROUGH THEM
    Object.keys(envConfig).forEach((key) =>{
       process.env[key] = envConfig[key]; 
    });
}