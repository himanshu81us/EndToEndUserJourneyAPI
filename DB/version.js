const oracledb = require('oracledb');

var user;

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

try {
    oracledb.initOracleClient({libDir: 'C:\\Users\\himanshu.patel\\Downloads\\instantclient_21_9'});

} catch (err) {console.error('Whoops!'); console.error(err); process.exit(1); }

const mypw = "AUTO_2320"// set password


async function run() {

let connection;

try { connection = await
oracledb.getConnection( { user: "AUTO_2320", password : mypw,

connectString : "slodb02.slo.bingo.ptec/slodev2" });
 const result = await connection.execute( `SELECT REGISTRATION_SITE FROM GL_USER_REGISTRATIONS WHERE EXTERNAL_USER_NAME = '${user}' ` );

 console.log(result.rows);
 } catch (err) { console.error(err); } finally { if (connection) { 

 try { await connection.close(); } catch (err) { console.error(err); } } }}

run();



