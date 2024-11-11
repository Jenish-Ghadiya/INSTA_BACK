const validate = (shcema) => (req,res,next) => {
    Object.keys(shcema).forEach((key) => {
        const { error , value} = shcema[key].validate(req[key],{
            stripUnknown: true,
        });
        if (error) {
            return res.status(400).json({
                success :false,
                message :error.message
            })
        }
        req[key]= value
    }) 
    next();
}

export default validate