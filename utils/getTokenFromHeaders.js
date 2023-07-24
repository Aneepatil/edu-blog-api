export const getTokenFromHeaders = (req) => {
  //  Get token from headers

  const headerObject = req.headers;
  const token = headerObject.authorization.split(" ")[1];
  if(token !== undefined){
    return token
  }else{
    return{
        status:'failed',
        message:'There is no token attached to headers'
    }
  }
};
