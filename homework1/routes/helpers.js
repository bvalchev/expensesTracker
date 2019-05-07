//The idea for the following code is taken from the course-node-express-react repository of Trayan Iliev
//and is used for convenience
error = function(req, res, statusCode, message, err) {
    console.log(req.app.get('env'));
    if(req.app.get('env') === 'development') {
        res
            .status(statusCode || 500)
            .json({
                message: message || err.message,
                error: err || {}
            });
    } else {
        res
        .status(statusCode || 500)
        .json({
            message: message || err.message,
            error: {}
        });
    }
}

replaceId = function(entity) {
    if(entity) {
        entity.id = entity._id;
        delete (entity._id);
    }
    return entity;
}

module.exports = {error, replaceId};