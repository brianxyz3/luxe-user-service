const jwt = require("jsonwebtoken");


module.exports = (id, email, userRole, ) => {
    if (userRole.toLowerCase() !== "customer") return jwt.sign({ id, email, userRole,  }, "9bf09c09c3a4bc165510fb3788a65de30d78126c7bc1c74974414a2ebabe87811cc0e42c3a29d8a7c0e586f67db4d59cc4c1c462eb26d1f41045c4b57277d46e", {expiresIn: "2h"});
    jwt.sign({ id, email, userRole }, "9bf09c09c3a4bc165510fb3788a65de30d78126c7bc1c74974414a2ebabe87811cc0e42c3a29d8a7c0e586f67db4d59cc4c1c462eb26d1f41045c4b57277d46e", { expiresIn: "10d" });
}