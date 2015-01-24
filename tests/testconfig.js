module.exports = [
    {
        packagePath: "../",
        environments: {
            production: {
                data: {
                    provider: "mongodb",
                    host: "localhost:1337",
                    database: "test",
                    username: "test",
                    password: "test"
                },
                different_data: {
                    provider: "redis",
                    host: "localhost:7331",
                    database: "test",
                    username: "test",
                    password: "test"
                }
            },
            development: {
                data: {
                    provider: "mongodb",
                    host: "ds029821.mongolab.com:29821",
                    database: "test_public_junk",
                    username: "test",
                    password: "test"
                }
            },
            junk: {
                data: {
                    provider: "mongodb",
                    host: "localhost:1337",
                    database: "test",
                    username: "test",
                    password: "test"
                }
            }
        }
    },
    "../../acute-data-mongodb",
    "../../acute-express-app"
]