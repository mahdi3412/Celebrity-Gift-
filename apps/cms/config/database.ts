export default ({env}:any)=>({
  connection:{
    client:env("DATABASE_CLIENT","postgres"),
    connection:{
      connectionString:env("DATABASE_URL"),
      ssl:env.bool("DATABASE_SSL",false)?{rejectUnauthorized:false}:false
    },
    pool:{min:2,max:10}
  }
});
