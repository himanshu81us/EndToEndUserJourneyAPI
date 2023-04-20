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
const { url } = require('inspector');


var Cookie;
var userID;
var ChatName;
var CashBalance;
//var user;

var user = "Q";
var n = 8 ;
var possible = "abcdefghijklmnopqrstuvwxyz";
for( var i=0; i < n; i++ )
user += possible.charAt(Math.floor(Math.random() * possible.length));
user = user[0].toUpperCase() + user.substring(1);
console.log(user);




describe('EndToEnd Scenario Tests',  function(){
  let urls = [
    { 'url' : 'https://auto-williamhill.virtuefusion.com/igames/unsec/mob/gamerequest?cid=' ,
    'Loginurl' : 'https://auto-williamhill.virtuefusion.com/igames/sec/mob/gamerequest?cid=',
    'logOuturl' : 'https://auto-williamhill.virtuefusion.com/igames/sec/mob/gamerequest?cid='} ,  
   
    
    {'url' : 'https://online.auto.skybingo.com/igames/unsec/mob/gamerequest?cid=',
    'Loginurl' : 'https://online.auto.skybingo.com/igames/sec/mob/gamerequest?cid=',
    'logOuturl' : 'https://online.auto.skybingo.com/igames/sec/mob/gamerequest?cid=' },
    

    {'url' : 'https://auto-paddypower.virtuefusion.com/pigames/unsec/mob/gamerequest?cid=',
    'Loginurl' : 'https://auto-paddypower.virtuefusion.com/pigames/sec/mob/gamerequest?cid=',
    'logOuturl' : 'https://auto-paddypower.virtuefusion.com/pigames/sec/mob/gamerequest?cid='  }
    
    ]

    urls.forEach(({url, Loginurl, SetChatNameUrl, GetChatNameUrl, logOuturl}) =>{
                
 //Test 1 - SETPLATFORM
     it('setplatform-wh', async function() {

        var res = await pactum.spec()
         .post (url)
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
    //Test-2 Login
it('Login -WH', async function(){

 
  
           var response =  await pactum.spec()
           .post(Loginurl)
           .withBody(`
           <Request>
           <Login> 
           <Username>${user}</Username> 
           <Password>${user}</Password> 
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
          })
           console.log(response.statusCode)
           console.log(response.body) //XML BODY
         });













//Test-3 Logout
         it ('LogOut', async function(){
          var response = await pactum.spec()
          //.post('https://auto-williamhill.virtuefusion.com/igames/sec/mob/gamerequest?cid=')
          .post(logOuturl)
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
        ;})
        });});
  
  
      



      
    