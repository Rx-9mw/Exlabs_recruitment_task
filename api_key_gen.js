const { default: generateApiKey } = require("generate-api-key");

let k = generateApiKey({ method: "base32", prefix: "Exlabs_app" });

console.log(k);
