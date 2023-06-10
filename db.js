const oracledb = require('oracledb');

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

try {
    oracledb.initOracleClient({libDir: 'C:\\Users\\himanshu.patel\\Downloads\\instantclient_21_9'});

} catch (err) {console.error('Whoops!'); console.error(err); process.exit(1); }

const mypw = "SA2_2320"// set password

async function run() {

let connection;

try { connection = await

oracledb.getConnection( { user: "SA2_2320", password : mypw,

connectString : "slodb01.slo.bingo.ptec/slodev1" });

 const result = await connection.execute( `SELECT

 TABLE_NAME

FROM

 user_tables

 ` );

 console.log(result.rows);
 } catch (err) { console.error(err); } finally { if (connection) { 

 try { await connection.close(); } catch (err) { console.error(err); } } }}

run();