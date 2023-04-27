const chai = require('chai');
const {assert} = require ('chai');
const mocha = require('mocha');
const pactum = require('pactum');
const response = pactum.response;
const request = pactum.request;
const chaiHttp = require('chai-http');
const { use } = require('chai');
const expect = require ("chai").expect;
const express = require ('express');
chai.use(chaiHttp);
const { closeSync } = require('fs');
const { doesNotMatch, equal } = require('assert');
const { AsyncLocalStorage } = require('async_hooks');
const { inspect } = require('util');
var xml2js = require('xml2js');
const { notNull } = require('pactum-matchers');
const dotenv = require ('dotenv');
const start = require('start');
const { TIMEOUT } = require('dns');
//const {add, sub} = require ('../src/app.js');
const oracledb = require('oracledb');

//Global variables 
var Cookie;
var ses;
var userID;
var ChatName;
var CashBalance;
var GameID;
var DrawID;
var CardID;
var CashBalanceAfterStake;
var UpadatedCashBalance;
var TimeToStart;
var T;
var user;

//Generating Random User
var user = "Q";
 var n = 8 ;
 var possible = "abcdefghijklmnopqrstuvwxyz";
 for( var i=0; i < n; i++ )
 user += possible.charAt(Math.floor(Math.random() * possible.length));
 userName = user[0].toUpperCase() + user.substring(1);
 console.log(user);

 //Test SUITE 1
describe('LOGIN/SETPLATFROM/REG CHATNAME/GET BALANCE',  function(){
 it('setplatform-wh', async function(){
  
   var res =await pactum.spec()
    // .post (process.env.WH_SetPlatform_BaseUrl)
    .post ('https://auto-williamhill.virtuefusion.com/igames/unsec/mob/gamerequest?cid=')
     .withBody(`
            <Request>
                 
                  <SetPlatform type  = 'DESKTOP'/>
            </Request>
            `)
    .withHeaders('Content-Type' , 'application/xml')
    .withHeaders('accept', '*/*')
    //.expectBody()
    .expectStatus(200)
    .expectBodyContains('SetPlatform success=\"true\"/')
    Cookie = res.headers['set-cookie']
    console.log(Cookie)
    console.log(res.statusCode)
    console.log(res.body)
  });

    it('Login -WH', async function(){
      var response = await pactum.spec()
      .post('https://auto-williamhill.virtuefusion.com/igames/sec/mob/gamerequest?cid=')
     // .post(process.env.WH_BaseUrl)
      .withBody(`
      <Request>
      <Login> 
      <Username>${user}</Username> 
      <Password>userxvxcvx1</Password> 
      </Login>
      </Request>
      `)
      .withHeaders('Content-Type', 'text/xml')
      .withHeaders('Connection', 'keep-alive')
      .withHeaders('Accept', '*/*')
      .withHeaders('cookie', Cookie)
      .expectStatus(200)
      .expectBodyContains('Login success=\"true\"')

      let xml = response.body
      xml2js.parseString(xml,(err, result)=> {

        if (err){
            throw err
        }
        let userID = (result.Response.Login[0].UserID[0])
       // console.log(result.Response.Login[0]); //JSON BODY
        console.log(userID);
        console.log(response.statusCode)
        console.log(response.body) //XML BODY
})
});


it ('WH- SetChatName', async function(){
  var response = await pactum.spec()
 .post('https://auto-williamhill.virtuefusion.com/igames/sec/mob/gamerequest?cid=')
// .post(process.env.WH_BaseUrl)
 .withBody (`<Request>
        <SetDisplayName displayName="${user}"/>
        </Request>`)
  .withHeaders('Content-Type', 'text/xml')
  .withHeaders('Connection', 'keep-alive')
  .withHeaders('Accept', '*/*')
  .withHeaders('cookie', Cookie)
  .expectStatus(200)
  .expectBodyContains('SetDisplayName success=\"true\"')
  console.log(response.body) //XML BODY

  let xml = response.body
  xml2js.parseString(xml,(err, result)=> {
  if (err)
  {
        throw err
    }
    console.log(result.Response.SetDisplayName[0].$.success); //JSON BODY
})
});

it ('GetBalance', async function(){
  var response = await pactum.spec()
  .post('https://auto-williamhill.virtuefusion.com/igames/sec/mob/gamerequest?cid=')
  //.post(process.env.WH_BaseUrl)
  .withBody(`<Request>
  <GetBalance/>
  </Request>`)
  .withHeaders('Content-Type', 'text/xml')
  .withHeaders('Connection', 'keep-alive')
  .withHeaders('Accept', '*/*')
  .withHeaders('cookie', Cookie)
  .expectStatus(200)
  .expectBodyContains('GetBalance success="true"')
  console.log(response.body) //XML BODY

  let xml = response.body
  xml2js.parseString(xml,(err, result)=> {

    if (err){
        throw err
    }
     CashBalance = (result.Response.GetBalance[0].Balances[0].Balance[0].$.amount);
    console.log(result.Response.GetBalance[0].Balances[0].Balance[0].$.amount); //JSON BODY
})
})
});


//Test Suite2
describe('DATABASE CONNECTION AND UPDATE THE USER BALANCE' ,function(){
  it('Update user balance', function(){

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
    
result = await connection.execute (`UPDATE VF_INT_DUMMY_PLAYER SET CASH_BALANCE = 0 WHERE USER_NAME = '${user}'`)
await connection.commit();
console.log(result);
console.log( `UPDATE VF_INT_DUMMY_PLAYER SET CASH_BALANCE = 100 WHERE USER_NAME = '${user}'`);
//console.log(result.row);
   }

  catch (err) { console.error(err); } finally { if (connection) { 
  try { await connection.close(); } catch (err) { console.error(err); } } }}
  run();
})
});


//Test Suite 3
describe ('UPDATED USER BALANCE/ASSERT/LOGOUT', function(){

  it ('pause the test for 1 second', function(done){
    setTimeout(function(){
     done();
     }, 1000);
    });


  it('Updated Balance' , async function(){
   var response = await pactum.spec()
      .post('https://auto-williamhill.virtuefusion.com/igames/sec/mob/gamerequest?cid=')
      //.post(process.env.WH_BaseUrl)
      .withBody(`<Request>
      <GetBalance gameType="Bingo"/>
      </Request>
      `)
      .withHeaders('Content-Type', 'text/xml')
      .withHeaders('Connection', 'keep-alive')
      .withHeaders('Accept', '*/*')
      .withHeaders('cookie', Cookie)
      .expectStatus(200)
      console.log(response.body) //XML BODY
      let xml = response.body
      xml2js.parseString(xml,(err, result)=> {
            if (err){
            throw err}
        UpadatedCashBalance = (result.Response.GetBalance[0].Balances[0].Balance[0].$.amount);
        console.log(result.Response.GetBalance[0].Balances[0].Balance[0].$.amount); //JSON BODY
        assert.notEqual(CashBalance,UpadatedCashBalance);
        assert.equal(UpadatedCashBalance, 0);
    })
    });

    it ('LogOut', async function(){
      var response = await pactum.spec()
      .post('https://auto-williamhill.virtuefusion.com/igames/sec/mob/gamerequest?cid=')
      //.post(process.env.WH_BaseUrl)
      .withBody(`<Request>
      <Logout/>
      </Request>`)
      .withHeaders('Content-Type', 'text/xml')
      .withHeaders('Connection', 'keep-alive')
      .withHeaders('Accept', '*/*')
      //.withHeaders('cookie', Cookie)
      .expectStatus(200)
      
      .expectBodyContains('Logout success=\"true\"/')
      console.log(response.body) //XML BODY
    }) 
    });
    






  









