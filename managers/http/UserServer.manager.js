const http              = require('http');
const express           = require('express');
const cors              = require('cors');
const app               = express();

module.exports = class UserServer {
    constructor({config, managers}){
        this.config        = config;
        this.userApi       = managers.userApi;
        this.authApi       = managers.authApi;
        this.schoolApi       = managers.schoolApi;
        this.classApi       = managers.classApi;
    }
    
    /** for injecting middlewares */
    use(args){
        app.use(args);
    }

    /** server configs */
    run(){
        app.use(cors({origin: '*'}));
        app.use(express.json());
        app.use(express.urlencoded({ extended: true}));
        app.use('/static', express.static('public'));

        /** an error handler */
        app.use((err, req, res, next) => {
            console.error(err.stack)
            res.status(500).send('Something broke!')
        });
        
        /** a single middleware to handle all */
        app.all('/api/auth/:moduleName/:fnName', this.authApi.mw);
        app.all('/api/users/:moduleName/:fnName', this.userApi.mw);
        app.all('/api/school/:moduleName/:fnName', this.schoolApi.mw);
        app.all('/api/class/:moduleName/:fnName', this.classApi.mw);

        let server = http.createServer(app);
        server.listen(this.config.dotEnv.USER_PORT, () => {
            console.log(`${(this.config.dotEnv.SERVICE_NAME).toUpperCase()} is running on port: ${this.config.dotEnv.USER_PORT}`);
        });
    }
}