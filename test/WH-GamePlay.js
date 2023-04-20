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
const {add, sub} = require ('../src/app.js')

//dotenv package load the evironment variables from .env to the process object. 
//process object has properties like .evn that loads all the environment variables 
dotenv.config({path: `./routes/.env.${process.env.NODE_ENV}`});

console.log(process.env.HTTP);
console.log(process.env.NODE);
console.log(process.env.Platform);
console.log(process.env.Platform2);
console.log(process.env.WH_SetPlatform_BaseUrl);
console.log(process.env.VB2_SetPlatform_BaseUrl);
console.log(process.env.WH_BaseUrl);
console.log(process.env.VB2_BaseUrl);

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
var TimeToStart;
var T;

//Generating Random User
var user = "Q";
 var n = 8 ;
 var possible = "abcdefghijklmnopqrstuvwxyz";
 for( var i=0; i < n; i++ )
 user += possible.charAt(Math.floor(Math.random() * possible.length));
 user = user[0].toUpperCase() + user.substring(1);
 console.log(user);

 //Test SUITE 1
describe('LOGIN AND SETPLATFROM',  function(){
 it('setplatform-wh', async function(){
  
   var res =await pactum.spec()
     .post (process.env.WH_SetPlatform_BaseUrl)
    //.post ('https://auto-williamhill.virtuefusion.com/igames/unsec/mob/gamerequest?cid=')
     .withBody(`
            <Request>
                  <SetPlatform type  = '${process.env.Platform}'/>
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
      //.post('https://auto-williamhill.virtuefusion.com/igames/sec/mob/gamerequest?cid=')
      .post(process.env.WH_BaseUrl)
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
        console.log(result.Response.Login[0]); //JSON BODY
        console.log(userID);
        console.log(response.statusCode)
        console.log(response.body) //XML BODY
      })
})
});

//TEST SUITE 2
describe('REG CHAT/BALANCE/JOINGAME/PLACEBET/SESSION/LOBBY INFO',  function(){
it ('WH- SetChatName', async function(){
      var response = await pactum.spec()
     //.post('https://auto-williamhill.virtuefusion.com/igames/sec/mob/gamerequest?cid=')
     .post(process.env.WH_BaseUrl)
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

it('Get ChatName', async function(){
      var response = await pactum.spec()
     // .post('https://auto-williamhill.virtuefusion.com/igames/sec/mob/gamerequest?cid=')
     .post(process.env.WH_BaseUrl)
      .withBody(`<Request><GetDisplayName/></Request>`)
      .withHeaders('Content-Type', 'text/xml')
      .withHeaders('Connection', 'keep-alive')
      .withHeaders('Accept', '*/*')
      .withHeaders('cookie', Cookie)
      .expectStatus(200)
      .expectBodyContains('GetDisplayName success=\"true\"')
      console.log(response.body) //XML BODY
      let xml = response.body
      xml2js.parseString(xml,(err, result)=> {

        if (err){
            throw err
        }
        console.log(result)
        let ChatName = (result.Response.GetDisplayName[0].$.displayName);
        console.log(result.Response.GetDisplayName[0].$.displayName); //JSON BODY
})
});

it ('GetBalance', async function(){
      var response = await pactum.spec()
      //.post('https://auto-williamhill.virtuefusion.com/igames/sec/mob/gamerequest?cid=')
      .post(process.env.WH_BaseUrl)
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
});

it ('Lobby Info', async function(){
    var response = await pactum.spec()
    //.post('https://auto-williamhill.virtuefusion.com/igames/sec/mob/gamerequest?cid=')
    .post(process.env.WH_BaseUrl)
    .withBody(`<Request>
    <UpdateLobby lobbyName="DesktopBingo"/>
    </Request>`)
    .withHeaders('Content-Type', 'text/xml')
    .withHeaders('Connection', 'keep-alive')
    .withHeaders('Accept', '*/*')
    .withHeaders('cookie', Cookie)
    .expectStatus(200)
    //console.log(response.body) //XML BODY
  
    let xml = response.body
    xml2js.parseString(xml,(err, result)=> {
  
      if (err){
          throw err
      }
      
      TimeLeft = (result.Response.UpdateLobby[0].Game[19].State[0].BingoGame[0].$.timeleft);
      console.log(TimeLeft);
  })
  });
  
  //Waiting at Lobby
  it ('Check sufficiant time available to purchase the ticket',  function(done) {
  var LobbyTimer = TimeLeft;
  console.log(LobbyTimer)
  Timer = LobbyTimer*1000;
  console.log(Timer);
  
  if (Timer >= 40000) {
       console.log(Boolean(T > 40000) );
       console.log('Sufficiant time to enter in the room and purchase the ticket');
       done();
      }
  else{
      console.log('Waiting for 80sec');
      setTimeout(function(){
          done();
      }, 80000);
  }
  });

it ('Join Game', async function(){
      var response = await pactum.spec()
      //.post('https://auto-williamhill.virtuefusion.com/igames/sec/mob/gamerequest?cid=')
      .post(process.env.WH_BaseUrl)
      .withBody(`<Request>
      <CreateGroupGame gameType="Bingo" gameName="Main" configID="Bingo-Main" forMoney="true" joinGame="true"/>
      </Request>`)
      .withHeaders('Content-Type', 'application/xml')
      .withHeaders('Connection', 'keep-alive')
      .withHeaders('Accept', '*/*')
      .withHeaders('cookie', Cookie)
      .expectStatus(200)
      .expectBodyContains('CreateGroupGame success="true"')
      console.log(response.body) //XML BODY

      let xml = response.body
      xml2js.parseString(xml,(err, result)=> {

        if (err){
            throw err
       }
       GameID = (result.Response.CreateGroupGame[0].GameInfo[0].$.gameID);
       ses = (result.Response.CreateGroupGame[0].GameInfo[0].$.gameSessionID);
       console.log(GameID); //JSON BODY
       console.log(ses); //JSON BODY
    })
    });

it ('Game Messages', async function(){
  var response = await pactum.spec()
  //.post('https://auto-williamhill.virtuefusion.com/igames/sec/mob/gamerequest?cid=')
  .post(process.env.WH_BaseUrl)
  .withBody(`<Request>
  <GameMessage>
  <BingoMessage gameSessionID = '${ses}'> <InitGame/></BingoMessage>
  </GameMessage>
  </Request>`)
  .withHeaders('Content-Type', 'text/xml')
  .withHeaders('Connection', 'keep-alive')
  .withHeaders('Accept', '*/*')
  .withHeaders('cookie', Cookie)
  .expectStatus(200)
  let xml = response.body
  xml2js.parseString(xml,(err, result)=> {

    if (err){
        throw err
   }
    DrawID = (result.Response.GameMessage[0].BingoMessage[0].InitGame[0].$.drawId);
    CardID = (result.Response.GameMessage[0].BingoMessage[0].InitGame[0].AllocatedCards[0].Card[0].$.id);
    TimeToStart = (result.Response.GameMessage[0].BingoMessage[0].InitGame[0].BingoGame[0].$.timeleft);
    console.log(DrawID);
    console.log(CardID);
    console.log(TimeToStart);
})
});

it ('Place Bet', async function(){
  var response = await pactum.spec()
  //.post('https://auto-williamhill.virtuefusion.com/igames/sec/mob/gamerequest?cid=')
  .post(process.env.WH_BaseUrl)
  .withBody(`<Request>
  <GameMessage>
      <BingoMessage gameSessionID='${ses}'> <PlaceBet drawId='${DrawID}'> <Cards purchasedPriceIndex="0"> <Card id='${CardID}'/></Cards>
         </PlaceBet>
      </BingoMessage>
 </GameMessage>
</Request>`)
  .withHeaders('Content-Type', 'application/xml')
  .withHeaders('Connection', 'keep-alive')
  .withHeaders('Accept', '*/*')
  .withHeaders('cookie', Cookie)
  .expectStatus(200)
  .expectBodyContains('PlaceBet success="true"')
  .expectBodyContains('purchased="true"')
  console.log(response.body) //XML BODY
let xml = response.body
  xml2js.parseString(xml,(err, result)=> {
   if (err){
    throw err }
})
});

it ('Time To start the game', async function(){
  var response = await pactum.spec()
  //.post('https://auto-williamhill.virtuefusion.com/igames/sec/mob/gamerequest?cid=')
  .post(process.env.WH_BaseUrl)
  .withBody(`<Request>
  <GameMessage>
  <BingoMessage gameSessionID = '${ses}'> <InitGame/></BingoMessage>
  </GameMessage>
  </Request>`)
  .withHeaders('Content-Type', 'text/xml')
  .withHeaders('Connection', 'keep-alive')
  .withHeaders('Accept', '*/*')
  .withHeaders('cookie', Cookie)
  .expectStatus(200)
  let xml = response.body
  xml2js.parseString(xml,(err, result)=> {

    if (err){
        throw err
   }
      TimeToStart = (result.Response.GameMessage[0].BingoMessage[0].InitGame[0].BingoGame[0].$.timeleft);
      console.log(TimeToStart);
})
});

it ('GetBalance', async function(){
  var response = await pactum.spec()
  //.post('https://auto-williamhill.virtuefusion.com/igames/sec/mob/gamerequest?cid=')
  .post(process.env.WH_BaseUrl)
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
    CashBalanceAfterStake = (result.Response.GetBalance[0].Balances[0].Balance[0].$.amount);
    console.log(result.Response.GetBalance[0].Balances[0].Balance[0].$.amount); //JSON BODY
    assert.notEqual(CashBalance,CashBalanceAfterStake)
})
})
});

//TEST SUITE 3
describe('PAUSE THE TEST TO KEEP THE SESSION ALIVE',  function(){

    it ('Time To start the game -Wait',  function(done) {
    var T1 = TimeToStart;
    console.log(T1)
    T =T1*1000;
    console.log(T);

    if (T >= 270000) {
         console.log(Boolean(T > 270000) );
         console.log('Pausing the test for 2 mins if the wait time is more then 270 seconds')
        setTimeout(function(){
            done();
           }, 120000);
        }
    else{
        console.log('Puse the test untill the game starts');
        setTimeout(function(){
            done();
        }, T);
 }
 });

 it ('Capture the Time To start the game', async function(){
    var response = await pactum.spec()
    //.post('https://auto-williamhill.virtuefusion.com/igames/sec/mob/gamerequest?cid=')
    .post(process.env.WH_BaseUrl)
    .withBody(`<Request>
    <GameMessage>
    <BingoMessage gameSessionID = '${ses}'> <InitGame/></BingoMessage>
    </GameMessage>
    </Request>`)
    .withHeaders('Content-Type', 'text/xml')
    .withHeaders('Connection', 'keep-alive')
    .withHeaders('Accept', '*/*')
    .withHeaders('cookie', Cookie)
    .expectStatus(200)
    let xml = response.body
    xml2js.parseString(xml,(err, result)=> {
  
      if (err){
          throw err
     }
        TimeToStart = (result.Response.GameMessage[0].BingoMessage[0].InitGame[0].BingoGame[0].$.timeleft);
        console.log(TimeToStart);
  })
  });
 
  it ('Time To start the game -Wait',  function(done) {
    var T1 = TimeToStart;
    console.log(T1)
    T =T1*1000;
    console.log(T);

     if (T >= 270000) {
         console.log(Boolean(T > 270000) );
         console.log('Pausing the test for 2 mins if the wait time is more then 270 seconds')
        setTimeout(function(){
            done();
           }, 120000);
        }
    else{

        console.log('Puse the test untill the game starts');
        setTimeout(function(){
            done();
        }, T);
       }
})
});

//Test Suite 4
describe('Winner Info',  function(){
    it ('Game Result', async function(){
          var response = await pactum.spec()
         //.post('https://auto-williamhill.virtuefusion.com/igames/sec/mob/gamerequest?cid=')
         .post(process.env.WH_BaseUrl)
    
         .withBody (`<Request><GameMessage><BingoMessage gameSessionID='${ses}'><GameResult drawId='${DrawID}'/>
              </BingoMessage> </GameMessage> </Request> `)
          .withHeaders('Content-Type', 'text/xml')
          .withHeaders('Connection', 'keep-alive')
          .withHeaders('Accept', '*/*')
          .withHeaders('cookie', Cookie)
          .expectStatus(200)
          .expectBodyContains('GameResult success=\"true\"')
          .expectBodyContains('name', ChatName)
          console.log(response.body) //XML BODY
})
});

//Test Suite 5
describe('Logout',  function(){
it ('LogOut', async function(){
  var response = await pactum.spec()
  //.post('https://auto-williamhill.virtuefusion.com/igames/sec/mob/gamerequest?cid=')
  .post(process.env.WH_BaseUrl)
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






    









































    


